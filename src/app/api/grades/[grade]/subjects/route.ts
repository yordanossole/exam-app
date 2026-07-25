import { NextResponse } from 'next/server';
import { getSubjectsByGrade } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ grade: string }> }) {
  const { grade } = await context.params;
  return NextResponse.json({ subjects: getSubjectsByGrade(Number(grade)) });
}
