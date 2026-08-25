import { NextRequest, NextResponse } from 'next/server';
import { readTelegramSessionCookie, TELEGRAM_SESSION_COOKIE } from '../../../../lib/telegram-session';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const secret = process.env.TELEGRAM_SESSION_SECRET || process.env.TELEGRAM_BOT_TOKEN;
  const session = secret
    ? readTelegramSessionCookie(request.cookies.get(TELEGRAM_SESSION_COOKIE)?.value, secret)
    : null;

  if (!session) return NextResponse.json({ error: 'No valid Telegram session.' }, { status: 401 });
  return NextResponse.json({ user: session.user }, { headers: { 'Cache-Control': 'no-store' } });
}

