import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import XLSX from 'xlsx';
import { schemaSql } from '../src/lib/db/schema';
import { questionContentSchema, storedQuestionContentSchema, type AnswerLetter } from '../src/lib/db/question-content';

const workbookPath = process.argv[2] || path.join(process.cwd(), 'exams', 'Exam_Data_Entry_Template.xlsx');
const dbPath = process.env.NT_EXAMS_DB_PATH || path.join(process.cwd(), 'nt-exams.db');
const passageDir = path.join(process.cwd(), 'assets', 'passages');

type Row = Record<string, string | number | null>;

const sheets = {
  exams: '⚙️ EXAM INFO',
  sections: '📑 SECTIONS',
  passages: '📖 PASSAGES',
  media: '🖼️ MEDIA',
  questions: '❓ QUESTIONS',
  answers: '✅ ANSWER KEY',
};

const reviewRows: string[] = [];
const warnings: string[] = [];

function normalizeHeader(value: unknown) {
  return String(value ?? '')
    .split(/\r?\n/)[0]
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function cell(value: unknown) {
  if (value === undefined || value === null) return null;
  const stringValue = String(value).trim();
  return stringValue === '' ? null : stringValue;
}

function text(row: Row, key: string) {
  const value = row[key];
  if (value === undefined || value === null) return null;
  const stringValue = String(value).trim();
  return stringValue === '' ? null : stringValue;
}

function requiredText(row: Row, key: string) {
  return text(row, key) ?? '';
}

function intValue(row: Row, key: string, fallback = 0) {
  const value = row[key];
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function yesNo(value: unknown) {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'yes' || normalized === 'y' || normalized === 'true' || normalized === '1' ? 1 : 0;
}

function csv(value: string | null) {
  return (value ?? '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function sheetRows(workbook: XLSX.WorkBook, sheetName: string, requiredHeaders: string[]) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Missing required sheet: ${sheetName}`);

  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: null });
  const headerIndex = rows.findIndex(row => {
    const headers = row.map(normalizeHeader);
    return requiredHeaders.every(header => headers.includes(header));
  });

  if (headerIndex === -1) {
    throw new Error(`Could not detect header row for sheet ${sheetName}`);
  }

  const headers = rows[headerIndex].map(normalizeHeader);
  return rows.slice(headerIndex + 1).map(row => {
    const mapped: Row = {};
    headers.forEach((header, index) => {
      if (header) mapped[header] = cell(row[index]);
    });
    return mapped;
  }).filter(row => {
    const firstRequired = requiredHeaders[0];
    const firstValue = text(row, firstRequired);
    return firstValue && !firstValue.includes('←') && !firstValue.toLowerCase().startsWith('e.g.');
  });
}

function optionMediaFromRow(row: Row) {
  const optionMedia: Record<string, string> = {};
  const directA = text(row, 'option_a_media_id');
  if (directA) optionMedia.a = directA;

  const imageIds = csv(text(row, 'option_image_ids'));
  const imageLetters = ['a', 'b', 'c', 'd', 'e'];
  imageIds.forEach((mediaId, index) => {
    const letter = imageLetters[index];
    if (letter) optionMedia[letter] = mediaId;
  });

  return Object.keys(optionMedia).length > 0 ? optionMedia : undefined;
}

function answerLetter(value: string | null, questionId: string): AnswerLetter | null {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'a' || normalized === 'b' || normalized === 'c' || normalized === 'd' || normalized === 'e') {
    return normalized;
  }

  warnings.push(`${questionId}: missing/invalid correct_answer; leaving it blank and marking review`);
  return null;
}

function readPassageContent(fileName: string | null, passageId: string) {
  if (!fileName) {
    warnings.push(`${passageId}: passage file_name is blank; inserted empty passage content`);
    return '';
  }

  const filePath = path.join(passageDir, fileName);
  if (!fs.existsSync(filePath)) {
    warnings.push(`${passageId}: passage file not found at ${filePath}; inserted empty passage content`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function insertMany<T extends Row>(db: Database.Database, sql: string, rows: T[], mapper: (row: T) => unknown[]) {
  const statement = db.prepare(sql);
  for (const row of rows) statement.run(...mapper(row));
}

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const workbook = XLSX.readFile(workbookPath, { cellDates: false });
const db = new Database(dbPath);
db.exec(schemaSql);

const examRows = sheetRows(workbook, sheets.exams, ['exam_id', 'grade', 'year_ec']);
const sectionRows = sheetRows(workbook, sheets.sections, ['section_id', 'exam_id', 'section_number']);
const passageRows = sheetRows(workbook, sheets.passages, ['passage_id', 'section_id', 'exam_id']);
const mediaRows = sheetRows(workbook, sheets.media, ['media_id', 'exam_id', 'media_type']);
const questionRows = sheetRows(workbook, sheets.questions, ['question_id', 'exam_id', 'q_number']);
const answerRows = sheetRows(workbook, sheets.answers, ['question_id', 'exam_id', 'q_number']);
const answerMap = new Map(answerRows.map(row => [requiredText(row, 'question_id'), row]));

db.pragma('foreign_keys = OFF');

const importTransaction = db.transaction(() => {
  insertMany(db, `
    INSERT OR REPLACE INTO exams (
      exam_id, grade, year_ec, subject, subject_display, total_questions, total_sections,
      has_passages, has_images, has_tables, source_file, entry_date, entered_by, verified, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, examRows, row => [
    requiredText(row, 'exam_id'),
    intValue(row, 'grade'),
    intValue(row, 'year_ec'),
    requiredText(row, 'subject'),
    requiredText(row, 'subject_display'),
    intValue(row, 'total_questions'),
    intValue(row, 'total_sections'),
    yesNo(row.has_passages),
    yesNo(row.has_images),
    yesNo(row.has_tables),
    text(row, 'source_file'),
    text(row, 'entry_date'),
    text(row, 'entered_by'),
    yesNo(row.verified),
    text(row, 'notes'),
  ]);

  insertMany(db, `
    INSERT OR REPLACE INTO sections (
      section_id, exam_id, section_number, section_title, instruction, question_from,
      question_to, has_passage, passage_id, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, sectionRows, row => [
    requiredText(row, 'section_id'),
    requiredText(row, 'exam_id'),
    intValue(row, 'section_number'),
    requiredText(row, 'section_title'),
    text(row, 'instruction'),
    intValue(row, 'question_from'),
    intValue(row, 'question_to'),
    yesNo(row.has_passage),
    text(row, 'passage_id'),
    text(row, 'notes'),
  ]);

  insertMany(db, `
    INSERT OR REPLACE INTO passages (
      passage_id, section_id, exam_id, passage_type, passage_title, content,
      applies_to_questions, media_ids, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, passageRows, row => {
    const passageId = requiredText(row, 'passage_id');
    const mediaIds = csv(text(row, 'media_ids'));
    return [
      passageId,
      text(row, 'section_id'),
      requiredText(row, 'exam_id'),
      requiredText(row, 'passage_type') || 'text',
      text(row, 'passage_title'),
      readPassageContent(text(row, 'file_name'), passageId),
      text(row, 'applies_to_questions'),
      mediaIds.length > 0 ? JSON.stringify(mediaIds) : null,
      text(row, 'notes'),
    ];
  });

  insertMany(db, `
    INSERT OR REPLACE INTO media (
      media_id, exam_id, media_type, appears_in, question_number, passage_id,
      caption, alt_text, file_name, folder, table_content, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, mediaRows, row => [
    requiredText(row, 'media_id'),
    requiredText(row, 'exam_id'),
    requiredText(row, 'media_type'),
    requiredText(row, 'appears_in'),
    text(row, 'question_number') ? intValue(row, 'question_number') : null,
    text(row, 'passage_id'),
    text(row, 'caption'),
    text(row, 'alt_text'),
    text(row, 'file_name'),
    text(row, 'folder'),
    text(row, 'table_content'),
    text(row, 'notes'),
  ]);

  const questionStatement = db.prepare(`
    INSERT OR REPLACE INTO questions (
      question_id, exam_id, section_id, q_number, question_text, question_language,
      topic, difficulty, needs_review, content
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const row of questionRows) {
    const questionId = requiredText(row, 'question_id');
    const answerRow = answerMap.get(questionId);
    const optionE = text(row, 'option_e');
    const mediaIds = csv(text(row, 'media_ids'));
    const questionNeedsReview = yesNo(row.needs_review);
    const answerNeedsReview = yesNo(answerRow?.needs_review);
    const correctAnswer = answerLetter(text(answerRow ?? {}, 'correct_answer'), questionId);
    const needsReview = questionNeedsReview || answerNeedsReview || !text(answerRow ?? {}, 'correct_answer') ? 1 : 0;

    if (needsReview) reviewRows.push(`question:${questionId}`);

    const content = {
      options: {
        a: requiredText(row, 'option_a'),
        b: requiredText(row, 'option_b'),
        c: requiredText(row, 'option_c'),
        d: requiredText(row, 'option_d'),
        ...(optionE ? { e: optionE } : {}),
      },
      ...(optionMediaFromRow(row) ? { option_media: optionMediaFromRow(row) } : {}),
      ...(mediaIds.length > 0 ? { media_ids: mediaIds } : {}),
      image_position: text(row, 'image_position'),
      passage_ref: text(row, 'passage_ref'),
      passage_question_number: text(row, 'passage_question_number') ? intValue(row, 'passage_question_number') : null,
      answer: {
        correct_answer: correctAnswer,
        explanation: text(answerRow ?? {}, 'explanation'),
        hint: text(answerRow ?? {}, 'hint'),
        source_reference: text(answerRow ?? {}, 'source_reference'),
      },
    };

    const strictValidation = questionContentSchema.safeParse(content);
    const validated = strictValidation.success
      ? strictValidation.data
      : storedQuestionContentSchema.parse(content);
    questionStatement.run(
      questionId,
      requiredText(row, 'exam_id'),
      requiredText(row, 'section_id'),
      intValue(row, 'q_number'),
      requiredText(row, 'question_text'),
      text(row, 'question_language') ?? 'amharic',
      text(row, 'topic'),
      text(row, 'difficulty'),
      needsReview,
      JSON.stringify(validated)
    );
  }
});

importTransaction();
db.pragma('foreign_keys = ON');

const summary = {
  exams: db.prepare('SELECT COUNT(*) AS count FROM exams').get() as { count: number },
  sections: db.prepare('SELECT COUNT(*) AS count FROM sections').get() as { count: number },
  passages: db.prepare('SELECT COUNT(*) AS count FROM passages').get() as { count: number },
  media: db.prepare('SELECT COUNT(*) AS count FROM media').get() as { count: number },
  questions: db.prepare('SELECT COUNT(*) AS count FROM questions').get() as { count: number },
};

console.log('Import complete');
console.log(`Database: ${dbPath}`);
console.log(`Exams: ${summary.exams.count}`);
console.log(`Sections: ${summary.sections.count}`);
console.log(`Passages: ${summary.passages.count}`);
console.log(`Media: ${summary.media.count}`);
console.log(`Questions: ${summary.questions.count}`);
console.log(`Needs review: ${reviewRows.length}`);
if (reviewRows.length > 0) console.log(reviewRows.slice(0, 80).join('\n'));
if (reviewRows.length > 80) console.log(`...and ${reviewRows.length - 80} more`);
if (warnings.length > 0) {
  console.warn(`Warnings: ${warnings.length}`);
  console.warn(warnings.slice(0, 80).join('\n'));
  if (warnings.length > 80) console.warn(`...and ${warnings.length - 80} more`);
}

db.close();
