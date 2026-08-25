import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

export const TELEGRAM_SESSION_COOKIE = 'nt_telegram_session';
export const TELEGRAM_SESSION_MAX_AGE = 86_400;

export type TelegramSessionUser = {
  user_id: string;
  telegram_id: number;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
  role: 'student';
  status: 'active';
  active_subscription: null;
};

type TelegramSession = {
  user: TelegramSessionUser;
  expiresAt: number;
};

function signingKey(secret: string) {
  return createHmac('sha256', secret).update('nt-exams-telegram-session-v1').digest();
}

export function createTelegramSessionCookie(user: TelegramSessionUser, secret: string) {
  const payload: TelegramSession = {
    user,
    expiresAt: Math.floor(Date.now() / 1000) + TELEGRAM_SESSION_MAX_AGE,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', signingKey(secret)).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function readTelegramSessionCookie(cookie: string | undefined, secret: string): TelegramSession | null {
  if (!cookie || !secret) return null;
  const [encoded, suppliedSignature, extra] = cookie.split('.');
  if (!encoded || !suppliedSignature || extra) return null;

  const expectedSignature = createHmac('sha256', signingKey(secret)).update(encoded).digest();
  let suppliedBytes: Buffer;
  try {
    suppliedBytes = Buffer.from(suppliedSignature, 'base64url');
  } catch {
    return null;
  }

  if (suppliedBytes.length !== expectedSignature.length || !timingSafeEqual(suppliedBytes, expectedSignature)) return null;

  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as TelegramSession;
    if (!session?.user || !Number.isSafeInteger(session.expiresAt) || session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

