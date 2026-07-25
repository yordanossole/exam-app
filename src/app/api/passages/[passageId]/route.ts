import { NextResponse } from 'next/server';
import { getPassage } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ passageId: string }> }) {
  const { passageId } = await context.params;
  const passage = getPassage(passageId);
  if (!passage) return NextResponse.json({ error: 'Passage not found' }, { status: 404 });
  return NextResponse.json({ passage });
}
