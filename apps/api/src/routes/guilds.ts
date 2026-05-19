import { zValidator } from '@hono/zod-validator';
import {
  defaultServerLogEvents,
  defaultServerLogSettings,
  patchServerLogSettingsSchema,
  type ServerLogEventFlags,
  type ServerLogSettings,
} from '@fernn/domains/server-log';
import { Hono } from 'hono';
import type { auth } from '../auth.js';
import { SERVER_LOG_SETTINGS } from '../db/collections.js';
import { db } from '../db/mongo.js';
import { requireGuildManager } from '../middleware/guild-access.js';
import {
  canManageGuild,
  fetchBotGuilds,
  fetchGuildTextChannels,
  fetchGuildVoiceChannels,
  fetchUserGuilds,
  getDiscordAccessToken,
  guildIconUrl,
} from '../services/discord.js';
import { validateUser } from '../utils/validateUser.js';
import { createLogsRoutes } from './logs.js';
import { createVoiceChatRoutes } from './voice-chat.js';

type SessionUser = (typeof auth.$Infer)['Session']['user'];

function mergeEvents(
  events: Partial<ServerLogEventFlags> | undefined,
): ServerLogEventFlags {
  const defaults = defaultServerLogEvents();
  if (!events) return defaults;
  return {
    voice: events.voice ?? defaults.voice,
    members: events.members ?? defaults.members,
    moderation: events.moderation ?? defaults.moderation,
    messages: events.messages ?? defaults.messages,
  };
}

function docToSettings(
  guildId: string,
  doc: Record<string, unknown> | null,
): ServerLogSettings {
  if (!doc) return defaultServerLogSettings(guildId);
  return {
    guildId,
    channelId: (doc.channelId as string | null) ?? null,
    enabled: Boolean(doc.enabled),
    events: mergeEvents(doc.events as Partial<ServerLogEventFlags> | undefined),
  };
}

const guildsRoutes = new Hono<{ Variables: { user: SessionUser | null } }>()
  .get('/guilds', async (c) => {
    const user = validateUser(c);
    const accessToken = await getDiscordAccessToken(user.id);
    if (!accessToken) {
      return c.json({ error: 'Discord account not linked' }, 400);
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

  .get('/guilds/:guildId/voice-channels', async (c) => {
    const guildId = c.req.param('guildId');
    const userOrResponse = await requireGuildManager(c, guildId);
    if (userOrResponse instanceof Response) return userOrResponse;
    const user = userOrResponse;

    const accessToken = await getDiscordAccessToken(user.id);
    if (!accessToken) {
      return c.json({ error: 'Discord account not linked' }, 400);
    }

    try {
      const channels = await fetchGuildVoiceChannels(guildId, accessToken);
      return c.json({ channels });
    } catch {
      return c.json({ error: 'Failed to fetch voice channels' }, 502);
    }
  })

  .get('/guilds/:guildId/channels', async (c) => {
    const guildId = c.req.param('guildId');
    const userOrResponse = await requireGuildManager(c, guildId);
    if (userOrResponse instanceof Response) return userOrResponse;
    const user = userOrResponse;

    const accessToken = await getDiscordAccessToken(user.id);
    if (!accessToken) {
      return c.json({ error: 'Discord account not linked' }, 400);
    }

    try {
      const channels = await fetchGuildTextChannels(guildId, accessToken);
      return c.json({ channels });
    } catch {
      return c.json({ error: 'Failed to fetch channels' }, 502);
    }
  })

  .get('/guilds/:guildId/settings', async (c) => {
    const guildId = c.req.param('guildId');
    const userOrResponse = await requireGuildManager(c, guildId);
    if (userOrResponse instanceof Response) return userOrResponse;

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
      const userOrResponse = await requireGuildManager(c, guildId);
      if (userOrResponse instanceof Response) return userOrResponse;

      const body = c.req.valid('json');

      const existing = await db
        .collection(SERVER_LOG_SETTINGS)
        .findOne({ guildId });

      const current = docToSettings(guildId, existing);
      const nextEvents = body.events
        ? mergeEvents({ ...current.events, ...body.events })
        : current.events;

      const update = {
        guildId,
        channelId:
          body.channelId !== undefined ? body.channelId : current.channelId,
        enabled: body.enabled !== undefined ? body.enabled : current.enabled,
        events: nextEvents,
        updatedAt: new Date(),
      };

      if (!existing) {
        await db.collection(SERVER_LOG_SETTINGS).insertOne({
          ...update,
          createdAt: new Date(),
        });
      } else {
        await db
          .collection(SERVER_LOG_SETTINGS)
          .updateOne({ guildId }, { $set: update });
      }

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
