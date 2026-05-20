import type { Context } from 'hono';

export type ApiErrorCode =
  | 'DISCORD_NOT_LINKED'
  | 'BOT_NOT_IN_GUILD'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED';

export function apiError(
  c: Context,
  status: 400 | 401 | 403 | 404 | 502,
  code: ApiErrorCode,
  message: string,
) {
  return c.json({ error: { code, message } }, status);
}
