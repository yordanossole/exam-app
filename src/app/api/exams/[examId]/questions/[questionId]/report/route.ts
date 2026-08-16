import { NextResponse } from 'next/server';
import { getDb, getQuestionsForExam } from '../../../../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  context: { params: Promise<{ examId: string; questionId: string }> }
) {
  const { examId, questionId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (message.length < 3) {
    return NextResponse.json({ error: 'Please describe the issue.' }, { status: 400 });
  }

  if (message.length > 2000) {
    return NextResponse.json({ error: 'Report is too long.' }, { status: 400 });
  }

  const questionExists = getQuestionsForExam(examId).some(question => question.question_id === questionId);
  if (!questionExists) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  const db = getDb();
  // Keep this endpoint usable when an already-running server opened the database
  // before the reports table was added to the shared schema.
  db.exec(`
    CREATE TABLE IF NOT EXISTS question_reports (
      report_id   INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id     TEXT NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
      message     TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.prepare(`
    INSERT INTO question_reports (exam_id, question_id, message)
    VALUES (?, ?, ?)
  `).run(examId, questionId, message);

  return NextResponse.json({ ok: true });
}
