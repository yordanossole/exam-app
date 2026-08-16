export const schemaSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS plans (
  plan_id       TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  grade         INTEGER NOT NULL,
  price_etb     REAL NOT NULL,
  duration_days INTEGER NOT NULL,
  badge         TEXT,
  is_active     INTEGER NOT NULL DEFAULT 1,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  user_id        TEXT PRIMARY KEY,
  display_name   TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  role           TEXT NOT NULL DEFAULT 'student',
  status         TEXT NOT NULL DEFAULT 'active',
  grade          INTEGER,
  plan_id        TEXT REFERENCES plans(plan_id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_active_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_plan ON users(plan_id);
CREATE INDEX IF NOT EXISTS idx_plans_active_sort ON plans(is_active, sort_order);

INSERT OR IGNORE INTO plans (plan_id, name, description, grade, price_etb, duration_days, badge, sort_order)
VALUES
  ('grade-6-monthly', 'Grade 6 Access', 'All Grade 6 national exam papers and detailed results.', 6, 149, 30, NULL, 1),
  ('grade-8-monthly', 'Grade 8 Access', 'Complete Grade 8 exam library with answer explanations.', 8, 199, 30, 'Popular', 2),
  ('grade-12-monthly', 'Grade 12 Access', 'Full Grade 12 preparation library and performance insights.', 12, 249, 30, NULL, 3);

INSERT OR IGNORE INTO users (user_id, display_name, email, role, status, grade, plan_id, last_active_at)
VALUES ('demo-user', 'Test User', 'student@example.com', 'student', 'active', 6, 'grade-6-monthly', CURRENT_TIMESTAMP);

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
