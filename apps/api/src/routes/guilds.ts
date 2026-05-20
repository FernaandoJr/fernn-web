import { zValidator } from '@hono/zod-validator';
import {
  defaultServerLogSettings,
  mergeServerLogEvents,
  patchServerLogSettingsSchema,
  type ServerLogSettings,
} from '@fernn/domains/server-log';
import { Hono } from 'hono';
import { z } from 'zod';
import { SERVER_LOG_SETTINGS } from '../db/collections.js';
import { db } from '../db/mongo.js';
import { upsertByGuildId } from '../db/upsert-by-guild-id.js';
import { requireGuildManager } from '../middleware/guild-access.js';
import {
  canManageGuild,
  fetchBotGuilds,
  fetchGuildChannels,
  fetchUserGuilds,
  getDiscordAccessToken,
  guildIconUrl,
} from '../services/discord.js';
import type { AppVariables } from '../types/session.js';
import { apiError } from '../utils/api-error.js';
import { validateUser } from '../utils/validateUser.js';
import { createLogsRoutes } from './logs.js';
import { createVoiceChatRoutes } from './voice-chat.js';

const channelsQuerySchema = z.object({
  kind: z.enum(['text', 'voice']).default('text'),
});

function docToSettings(
  guildId: string,
  doc: Record<string, unknown> | null,
): ServerLogSettings {
  if (!doc) return defaultServerLogSettings(guildId);
  return {
    guildId,
    channelId: (doc.channelId as string | null) ?? null,
    enabled: Boolean(doc.enabled),
    events: mergeServerLogEvents(
      doc.events as Partial<ServerLogSettings['events']> | undefined,
    ),
  };
}

const guildsRoutes = new Hono<{ Variables: AppVariables }>()
  .get('/guilds', async (c) => {
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

    const [userGuilds, botGuilds] = await Promise.all([
      fetchUserGuilds(accessToken),
      fetchBotGuilds(),
    ]);

    const botGuildIds = new Set(botGuilds.map((g) => g.id));

    const guilds = userGuilds
      .filter((g) => botGuildIds.has(g.id) && canManageGuild(g.permissions))
      .map((g) => ({
        id: g.id,
        name: g.name,
        icon: guildIconUrl(g.id, g.icon),
        owner: g.owner,
      }));

    return c.json({ guilds });
  })

  .get(
    '/guilds/:guildId/channels',
    zValidator('query', channelsQuerySchema),
    async (c) => {
      const guildId = c.req.param('guildId');
      const result = await requireGuildManager(c, guildId);
      if (result instanceof Response) return result;

      const { kind } = c.req.valid('query');

      try {
        const channels = await fetchGuildChannels(guildId, kind);
        return c.json({ channels });
      } catch (err) {
        console.error(
          `Failed to fetch ${kind} channels for guild ${guildId}:`,
          err instanceof Error ? err.message : err,
        );
        return c.json({ error: 'Failed to fetch channels' }, 502);
      }
    },
  )

  .get('/guilds/:guildId/settings', async (c) => {
    const guildId = c.req.param('guildId');
    const result = await requireGuildManager(c, guildId);
    if (result instanceof Response) return result;

    const doc = await db
      .collection(SERVER_LOG_SETTINGS)
      .findOne({ guildId });

    return c.json(docToSettings(guildId, doc));
  })

  .patch(
    '/guilds/:guildId/settings',
    zValidator('json', patchServerLogSettingsSchema),
    async (c) => {
      const guildId = c.req.param('guildId');
      const result = await requireGuildManager(c, guildId);
      if (result instanceof Response) return result;

      const body = c.req.valid('json');

      const existing = await db
        .collection(SERVER_LOG_SETTINGS)
        .findOne({ guildId });

      const current = docToSettings(guildId, existing);
      const nextEvents = body.events
        ? mergeServerLogEvents({ ...current.events, ...body.events })
        : current.events;

      const update = {
        guildId,
        channelId:
          body.channelId !== undefined ? body.channelId : current.channelId,
        enabled: body.enabled !== undefined ? body.enabled : current.enabled,
        events: nextEvents,
        updatedAt: new Date(),
      };

      await upsertByGuildId(SERVER_LOG_SETTINGS, guildId, update);

      return c.json({
        guildId: update.guildId,
        channelId: update.channelId,
        enabled: update.enabled,
        events: update.events,
      } satisfies ServerLogSettings);
    },
  );

guildsRoutes.route('/', createLogsRoutes());
guildsRoutes.route('/', createVoiceChatRoutes());

export default guildsRoutes;
