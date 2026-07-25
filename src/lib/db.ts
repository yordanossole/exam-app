import Database from 'better-sqlite3';
import path from 'node:path';
import { schemaSql } from './db/schema';
import { storedQuestionContentSchema, type AnswerLetter, type StoredQuestionContent } from './db/question-content';

export type ExamRow = {
  exam_id: string;
  grade: number;
  year_ec: number;
  subject: string;
  subject_display: string;
  total_questions: number;
  total_sections: number;
  has_passages: number;
  has_images: number;
  has_tables: number;
  source_file: string | null;
  entry_date: string | null;
  entered_by: string | null;
  verified: number;
  notes: string | null;
};

export type SectionRow = {
  section_id: string;
  exam_id: string;
  section_number: number;
  section_title: string;
  instruction: string | null;
  question_from: number;
  question_to: number;
  has_passage: number;
  passage_id: string | null;
  notes: string | null;
};

export type PassageRow = {
  passage_id: string;
  section_id: string | null;
  exam_id: string;
  passage_type: string;
  passage_title: string | null;
  content: string;
  applies_to_questions: string | null;
  media_ids: string | null;
  notes: string | null;
};

export type MediaRow = {
  media_id: string;
  exam_id: string;
  media_type: string;
  appears_in: string;
  question_number: number | null;
  passage_id: string | null;
  caption: string | null;
  alt_text: string | null;
  file_name: string | null;
  folder: string | null;
  table_content: string | null;
  notes: string | null;
};

type QuestionRow = {
  question_id: string;
  exam_id: string;
  section_id: string;
  q_number: number;
  question_text: string;
  question_language: string;
  topic: string | null;
  difficulty: string | null;
  needs_review: number;
  content: string;
};

export type HydratedQuestion = Omit<QuestionRow, 'content'> & {
  content: StoredQuestionContent;
  passage: PassageRow | null;
  media: MediaRow[];
  option_media: Record<string, MediaRow>;
};

const dbPath = process.env.NT_EXAMS_DB_PATH || path.join(process.cwd(), 'nt-exams.db');

declare global {
  // eslint-disable-next-line no-var
  var __ntExamsDb: Database.Database | undefined;
}

export function getDb() {
  if (!globalThis.__ntExamsDb) {
    const db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    db.exec(schemaSql);
    globalThis.__ntExamsDb = db;
  }

  return globalThis.__ntExamsDb;
}

function parseJsonArray(value: string | null | undefined) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [];
  } catch {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
}

function parseQuestion(row: QuestionRow) {
  return {
    ...row,
    content: storedQuestionContentSchema.parse(JSON.parse(row.content)),
  };
}

export function getGrades() {
  return getDb()
    .prepare('SELECT grade, COUNT(*) AS exam_count FROM exams GROUP BY grade ORDER BY grade')
    .all() as Array<{ grade: number; exam_count: number }>;
}

export function getSubjectsByGrade(grade: number) {
  return getDb()
    .prepare(`
      SELECT subject, subject_display, COUNT(*) AS exam_count
      FROM exams
      WHERE grade = ?
      GROUP BY subject, subject_display
      ORDER BY subject_display
    `)
    .all(grade) as Array<{ subject: string; subject_display: string; exam_count: number }>;
}

export function getExamsByGrade(grade: number) {
  return getDb()
    .prepare(`
      SELECT exam_id, grade, year_ec, subject, subject_display, total_questions, total_sections
      FROM exams
      WHERE grade = ?
      ORDER BY subject_display, year_ec DESC
    `)
    .all(grade) as Array<Pick<ExamRow, 'exam_id' | 'grade' | 'year_ec' | 'subject' | 'subject_display' | 'total_questions' | 'total_sections'>>;
}

export function getExamLibrarySummary(grade: number) {
  const db = getDb();
  const exams = db.prepare(`
    SELECT exam_id, grade, year_ec, subject, subject_display, total_questions, total_sections
    FROM exams
    WHERE grade = ?
    ORDER BY year_ec DESC, subject_display
  `).all(grade) as Array<Pick<ExamRow, 'exam_id' | 'grade' | 'year_ec' | 'subject' | 'subject_display' | 'total_questions' | 'total_sections'>>;

  return {
    grade,
    exam_count: exams.length,
    question_count: exams.reduce((total, exam) => total + exam.total_questions, 0),
    subject_count: new Set(exams.map(exam => exam.subject)).size,
    subjects: getSubjectsByGrade(grade),
    latest_exams: exams.slice(0, 4),
  };
}

export function getExamsByGradeAndSubject(grade: number, subject: string) {
  return getDb()
    .prepare(`
      SELECT exam_id, grade, year_ec, subject, subject_display, total_questions, total_sections, verified
      FROM exams
      WHERE grade = ? AND subject = ?
      ORDER BY year_ec DESC
    `)
    .all(grade, subject) as Array<Pick<ExamRow, 'exam_id' | 'grade' | 'year_ec' | 'subject' | 'subject_display' | 'total_questions' | 'total_sections' | 'verified'>>;
}

export function getExamById(examId: string) {
  const db = getDb();
  const exam = db.prepare('SELECT * FROM exams WHERE exam_id = ?').get(examId) as ExamRow | undefined;
  if (!exam) return null;

  const sections = db.prepare('SELECT * FROM sections WHERE exam_id = ? ORDER BY section_number').all(examId) as SectionRow[];
  return { ...exam, sections };
}

export function getPassage(passageId: string) {
  return getDb().prepare('SELECT * FROM passages WHERE passage_id = ?').get(passageId) as PassageRow | undefined;
}

export function getMedia(mediaId: string) {
  return getDb().prepare('SELECT * FROM media WHERE media_id = ?').get(mediaId) as MediaRow | undefined;
}

export function getQuestionsForExam(examId: string) {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM questions WHERE exam_id = ? ORDER BY q_number').all(examId) as QuestionRow[];
  const questions = rows.map(parseQuestion);

  const passageIds = Array.from(new Set(questions.map(q => q.content.passage_ref).filter(Boolean))) as string[];
  const mediaIds = Array.from(new Set(questions.flatMap(q => [
    ...(q.content.media_ids ?? []),
    ...Object.values(q.content.option_media ?? {}),
    ...parseJsonArray(q.content.passage_ref ? getPassage(q.content.passage_ref)?.media_ids : null),
  ])));

  const passageMap = new Map<string, PassageRow>();
  for (const passageId of passageIds) {
    const passage = getPassage(passageId);
    if (passage) passageMap.set(passageId, passage);
  }

  const mediaMap = new Map<string, MediaRow>();
  for (const mediaId of mediaIds) {
    const media = getMedia(mediaId);
    if (media) mediaMap.set(mediaId, media);
  }

  return questions.map(question => {
    const questionMediaIds = question.content.media_ids ?? [];
    const optionMediaEntries = Object.entries(question.content.option_media ?? {});
    const optionMedia = Object.fromEntries(
      optionMediaEntries
        .map(([letter, mediaId]) => [letter, mediaMap.get(mediaId)])
        .filter((entry): entry is [string, MediaRow] => Boolean(entry[1]))
    );

    return {
      ...question,
      passage: question.content.passage_ref ? passageMap.get(question.content.passage_ref) ?? null : null,
      media: questionMediaIds.map(mediaId => mediaMap.get(mediaId)).filter(Boolean) as MediaRow[],
      option_media: optionMedia,
    };
  }) satisfies HydratedQuestion[];
}

export function gradeSubmission(examId: string, answers: Record<string, AnswerLetter | undefined>) {
  const questions = getQuestionsForExam(examId);
  let correct = 0;
  let graded = 0;
  const topicMap = new Map<string, { topic: string; correct: number; total: number }>();

  const items = questions.map(question => {
    const selected = answers[question.question_id] ?? null;
    const correctAnswer = question.content.answer.correct_answer;
    const isCorrect = correctAnswer ? selected === correctAnswer : null;
    if (isCorrect) correct += 1;
    if (isCorrect !== null) graded += 1;

    const topic = question.topic || 'unclassified';
    const bucket = topicMap.get(topic) ?? { topic, correct: 0, total: 0 };
    bucket.total += 1;
    if (isCorrect) bucket.correct += 1;
    topicMap.set(topic, bucket);

    return {
      question_id: question.question_id,
      q_number: question.q_number,
      topic,
      selected,
      correct_answer: correctAnswer,
      is_correct: isCorrect,
      explanation: question.content.answer.explanation,
      hint: question.content.answer.hint,
      needs_review: Boolean(question.needs_review) || !correctAnswer,
    };
  });

  return {
    exam_id: examId,
    total: questions.length,
    correct,
    graded,
    answer_key_available: graded > 0,
    score: graded > 0 ? Math.round((correct / graded) * 100) : null,
    topics: Array.from(topicMap.values()).map(topic => ({
      ...topic,
      score: topic.total > 0 && graded > 0 ? Math.round((topic.correct / topic.total) * 100) : null,
    })),
    items,
  };
}

export function getQuestionsNeedingReview(limit = 250) {
  return getDb()
    .prepare(`
      SELECT
        q.question_id,
        q.exam_id,
        q.q_number,
        q.question_text,
        q.topic,
        q.difficulty,
        e.grade,
        e.year_ec,
        e.subject_display
      FROM questions q
      JOIN exams e ON e.exam_id = q.exam_id
      WHERE q.needs_review = 1
         OR json_extract(q.content, '$.answer.correct_answer') IS NULL
      ORDER BY e.grade, e.subject_display, e.year_ec DESC, q.q_number
      LIMIT ?
    `)
    .all(limit) as Array<{
      question_id: string;
      exam_id: string;
      q_number: number;
      question_text: string;
      topic: string | null;
      difficulty: string | null;
      grade: number;
      year_ec: number;
      subject_display: string;
    }>;
}
