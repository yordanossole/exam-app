import { NextResponse } from 'next/server';
import { z } from 'zod';
import { TelegramInitDataError, verifyTelegramInitData } from '../../../../lib/telegram-auth';
import {
  createTelegramSessionCookie,
  TELEGRAM_SESSION_COOKIE,
  TELEGRAM_SESSION_MAX_AGE,
  type TelegramSessionUser,
} from '../../../../lib/telegram-session';

export const runtime = 'nodejs';

const requestSchema = z.object({ initData: z.string().min(1).max(16_384) });

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Telegram authentication is not configured.' }, { status: 503 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Telegram initData is required.' }, { status: 400 });

  try {
    // Do not read any identity field before this server-side verification succeeds.
    const verified = verifyTelegramInitData(parsed.data.initData, botToken, {
      maxAgeSeconds: Number(process.env.TELEGRAM_INIT_DATA_MAX_AGE_SECONDS) || TELEGRAM_SESSION_MAX_AGE,
    });
    const telegramUser = verified.user;
    const user: TelegramSessionUser = {
      user_id: `telegram:${telegramUser.id}`,
      telegram_id: telegramUser.id,
      display_name: [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' '),
      username: telegramUser.username ?? null,
      avatar_url: telegramUser.photo_url ?? null,
      role: 'student',
      status: 'active',
      active_subscription: null,
    };

    const response = NextResponse.json({ user });
    response.headers.set('Cache-Control', 'no-store');
    response.cookies.set({
      name: TELEGRAM_SESSION_COOKIE,
      value: createTelegramSessionCookie(user, process.env.TELEGRAM_SESSION_SECRET || botToken),
      httpOnly: true,
      sameSite: 'lax',
      secure: new URL(request.url).protocol === 'https:',
      path: '/',
      maxAge: TELEGRAM_SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    const message = error instanceof TelegramInitDataError ? error.message : 'Telegram authentication failed.';
    return NextResponse.json({ error: message }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }
}

