import { NextResponse } from 'next/server';
import { getQuestionsForExam } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ examId: string }> }) {
  const { examId } = await context.params;
  return NextResponse.json({ questions: getQuestionsForExam(examId) });
}
