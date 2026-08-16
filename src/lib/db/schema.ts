export const schemaSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS exams (
  exam_id             TEXT PRIMARY KEY,
  grade               INTEGER NOT NULL,
  year_ec             INTEGER NOT NULL,
  subject             TEXT NOT NULL,
  subject_display     TEXT NOT NULL,
  total_questions     INTEGER NOT NULL,
  total_sections      INTEGER NOT NULL,
  has_passages        INTEGER NOT NULL DEFAULT 0,
  has_images          INTEGER NOT NULL DEFAULT 0,
  has_tables          INTEGER NOT NULL DEFAULT 0,
  source_file         TEXT,
  entry_date          TEXT,
  entered_by          TEXT,
  verified            INTEGER NOT NULL DEFAULT 0,
  notes               TEXT
);

CREATE TABLE IF NOT EXISTS sections (
  section_id     TEXT PRIMARY KEY,
  exam_id        TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  section_number INTEGER NOT NULL,
  section_title  TEXT NOT NULL,
  instruction    TEXT,
  question_from  INTEGER NOT NULL,
  question_to    INTEGER NOT NULL,
  has_passage    INTEGER NOT NULL DEFAULT 0,
  passage_id     TEXT REFERENCES passages(passage_id),
  notes          TEXT
);

CREATE TABLE IF NOT EXISTS passages (
  passage_id           TEXT PRIMARY KEY,
  section_id           TEXT REFERENCES sections(section_id) ON DELETE CASCADE,
  exam_id              TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  passage_type         TEXT NOT NULL,
  passage_title        TEXT,
  content              TEXT NOT NULL,
  applies_to_questions TEXT,
  media_ids            TEXT,
  notes                TEXT
);

CREATE TABLE IF NOT EXISTS media (
  media_id        TEXT PRIMARY KEY,
  exam_id         TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  media_type      TEXT NOT NULL,
  appears_in      TEXT NOT NULL,
  question_number INTEGER,
  passage_id      TEXT REFERENCES passages(passage_id),
  caption         TEXT,
  alt_text        TEXT,
  file_name       TEXT,
  folder          TEXT,
  table_content   TEXT,
  notes           TEXT
);

CREATE TABLE IF NOT EXISTS questions (
  question_id       TEXT PRIMARY KEY,
  exam_id           TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  section_id        TEXT NOT NULL REFERENCES sections(section_id),
  q_number          INTEGER NOT NULL,
  question_text     TEXT NOT NULL,
  question_language TEXT NOT NULL DEFAULT 'amharic',
  topic             TEXT,
  difficulty        TEXT,
  needs_review      INTEGER NOT NULL DEFAULT 0,
  content           TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exams_grade_subject_year ON exams(grade, subject, year_ec);
CREATE INDEX IF NOT EXISTS idx_sections_exam ON sections(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_exam ON questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_media_exam ON media(exam_id);

CREATE TABLE IF NOT EXISTS question_reports (
  report_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  exam_id     TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_question_reports_question ON question_reports(question_id);
`;
