import type { Context } from 'hono';
import {
  assertUserManagesGuild,
  getDiscordAccessToken,
} from '../services/discord.js';
import type { SessionUser } from '../types/session.js';
import { apiError } from '../utils/api-error.js';
import { validateUser } from '../utils/validateUser.js';

export type GuildManagerContext = {
  user: SessionUser;
  accessToken: string;
};

export async function requireGuildManager(
  c: Context,
  guildId: string,
): Promise<GuildManagerContext | Response> {
  const user = validateUser(c);

  const accessToken = await getDiscordAccessToken(user.id);
  if (!accessToken) {
    return apiError(
      c,
      400,
      'DISCORD_NOT_LINKED',
      'Discord account not linked',
    );
  }

  try {
    await assertUserManagesGuild(user.id, guildId, accessToken);
    return { user, accessToken };
  } catch (err) {
    const code = err instanceof Error ? err.message : '';
    if (code === 'DISCORD_NOT_LINKED') {
      return apiError(
        c,
        400,
        'DISCORD_NOT_LINKED',
        'Discord account not linked',
      );
    }
    if (code === 'BOT_NOT_IN_GUILD') {
      return apiError(c, 404, 'BOT_NOT_IN_GUILD', 'Bot is not in this server');
    }
    return apiError(c, 403, 'FORBIDDEN', 'Forbidden');
  }
}
