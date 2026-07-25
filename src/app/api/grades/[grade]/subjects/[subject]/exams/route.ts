import { NextResponse } from 'next/server';
import { getExamsByGradeAndSubject } from '../../../../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ grade: string; subject: string }> }) {
  const { grade, subject } = await context.params;
  return NextResponse.json({ exams: getExamsByGradeAndSubject(Number(grade), decodeURIComponent(subject)) });
}
