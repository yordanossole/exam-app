import { NextResponse } from 'next/server';
import { getMedia } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function GET(_request: Request, context: { params: Promise<{ mediaId: string }> }) {
  const { mediaId } = await context.params;
  const media = getMedia(mediaId);
  if (!media) return NextResponse.json({ error: 'Media not found' }, { status: 404 });
  return NextResponse.json({ media });
}
