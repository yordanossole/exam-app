import 'server-only';

import { createHmac, timingSafeEqual } from 'node:crypto';

export type VerifiedTelegramUser = {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
};

export type VerifiedTelegramInitData = {
  authDate: Date;
  queryId?: string;
  startParam?: string;
  user: VerifiedTelegramUser;
};

export class TelegramInitDataError extends Error {}

function parseTelegramUser(value: string | null): VerifiedTelegramUser {
  if (!value) throw new TelegramInitDataError('Telegram initData does not contain a user.');

  let candidate: unknown;
  try {
    candidate = JSON.parse(value);
  } catch {
    throw new TelegramInitDataError('Telegram user data is not valid JSON.');
  }

  if (!candidate || typeof candidate !== 'object') {
    throw new TelegramInitDataError('Telegram user data is invalid.');
  }

  const user = candidate as Record<string, unknown>;
  if (!Number.isSafeInteger(user.id) || Number(user.id) <= 0 || typeof user.first_name !== 'string' || !user.first_name.trim()) {
    throw new TelegramInitDataError('Telegram user data is incomplete.');
  }

  return {
    id: Number(user.id),
    ...(typeof user.is_bot === 'boolean' ? { is_bot: user.is_bot } : {}),
    first_name: user.first_name,
    ...(typeof user.last_name === 'string' ? { last_name: user.last_name } : {}),
    ...(typeof user.username === 'string' ? { username: user.username } : {}),
    ...(typeof user.language_code === 'string' ? { language_code: user.language_code } : {}),
    ...(typeof user.is_premium === 'boolean' ? { is_premium: user.is_premium } : {}),
    ...(typeof user.photo_url === 'string' ? { photo_url: user.photo_url } : {}),
  };
}

/**
 * Verifies Telegram Mini App initData with Telegram's two-step HMAC-SHA256
 * algorithm. Nothing parsed from initData is returned until its signature and
 * age have both been checked.
 */
export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  options: { maxAgeSeconds?: number; now?: Date } = {},
): VerifiedTelegramInitData {
  if (!initData || !botToken) throw new TelegramInitDataError('Telegram authentication is not configured.');

  const params = new URLSearchParams(initData);
  const seen = new Set<string>();
  for (const [key] of params) {
    if (seen.has(key)) throw new TelegramInitDataError(`Duplicate Telegram initData field: ${key}.`);
    seen.add(key);
  }

  const receivedHash = params.get('hash');
  if (!receivedHash || !/^[a-f\d]{64}$/i.test(receivedHash)) {
    throw new TelegramInitDataError('Telegram initData has no valid hash.');
  }

  const dataCheckString = Array.from(params.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Telegram defines the first HMAC's key as the literal string "WebAppData".
  const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expectedHash = createHmac('sha256', secretKey).update(dataCheckString).digest();
  const receivedHashBytes = Buffer.from(receivedHash, 'hex');

  if (receivedHashBytes.length !== expectedHash.length || !timingSafeEqual(receivedHashBytes, expectedHash)) {
    throw new TelegramInitDataError('Telegram initData signature is invalid.');
  }

  const authDateSeconds = Number(params.get('auth_date'));
  if (!Number.isSafeInteger(authDateSeconds) || authDateSeconds <= 0) {
    throw new TelegramInitDataError('Telegram initData has an invalid auth_date.');
  }

  const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1000);
  const maxAgeSeconds = options.maxAgeSeconds ?? 86_400;
  if (authDateSeconds > nowSeconds + 30 || nowSeconds - authDateSeconds > maxAgeSeconds) {
    throw new TelegramInitDataError('Telegram initData has expired.');
  }

  return {
    authDate: new Date(authDateSeconds * 1000),
    ...(params.get('query_id') ? { queryId: params.get('query_id')! } : {}),
    ...(params.get('start_param') ? { startParam: params.get('start_param')! } : {}),
    user: parseTelegramUser(params.get('user')),
  };
}
