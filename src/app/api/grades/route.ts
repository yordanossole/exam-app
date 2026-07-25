import { NextResponse } from 'next/server';
import { getGrades } from '../../../lib/db';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({ grades: getGrades() });
}
