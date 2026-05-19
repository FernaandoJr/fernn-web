import type { Context } from 'hono';
import type { auth } from '../auth.js';
import { assertUserManagesGuild } from '../services/discord.js';
import { validateUser } from '../utils/validateUser.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];

export async function requireGuildManager(
  c: Context,
  guildId: string,
): Promise<SessionUser | Response> {
  const user = validateUser(c);

  try {
    await assertUserManagesGuild(user.id, guildId);
    return user;
  } catch (err) {
    const code = err instanceof Error ? err.message : '';
    if (code === 'DISCORD_NOT_LINKED') {
      return c.json({ error: 'Discord account not linked' }, 400);
    }
    if (code === 'BOT_NOT_IN_GUILD') {
      return c.json({ error: 'Bot is not in this server' }, 404);
    }
    return c.json({ error: 'Forbidden' }, 403);
  }
}
