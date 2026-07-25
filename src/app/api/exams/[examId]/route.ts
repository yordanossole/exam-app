import { NextResponse } from 'next/server';
import { getExamById } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ examId: string }> }) {
  const { examId } = await context.params;
  const exam = getExamById(examId);
  if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
  return NextResponse.json({ exam });
}
