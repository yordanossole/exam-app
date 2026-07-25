import { NextResponse } from 'next/server';
import { answerLetterSchema } from '../../../../../lib/db/question-content';
import { gradeSubmission } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(request: Request, context: { params: Promise<{ examId: string }> }) {
  const { examId } = await context.params;
  const body = await request.json().catch(() => ({}));
  const rawAnswers = body?.answers && typeof body.answers === 'object' ? body.answers : {};
  const answers: Record<string, 'a' | 'b' | 'c' | 'd' | 'e'> = {};

  for (const [questionId, value] of Object.entries(rawAnswers)) {
    const parsed = answerLetterSchema.safeParse(value);
    if (parsed.success) answers[questionId] = parsed.data;
  }

  return NextResponse.json({ result: gradeSubmission(examId, answers) });
}
