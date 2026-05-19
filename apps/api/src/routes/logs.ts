import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { logCategorySchema } from '@fernn/domains/server-log';
import type { auth } from '../auth.js';
import { SERVER_LOG_SETTINGS } from '../db/collections.js';
import { db } from '../db/mongo.js';
import { requireGuildManager } from '../middleware/guild-access.js';
import {
  fetchChannelMessages,
} from '../services/discord.js';
import {
  matchesLogQuery,
  parseMessageToLogEntries,
} from '../services/log-parser.js';
const logsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(25),
  category: logCategorySchema.optional(),
  q: z.string().optional(),
});

type SessionUser = (typeof auth.$Infer)['Session']['user'];

export function createLogsRoutes() {
  return new Hono<{ Variables: { user: SessionUser | null } }>().get(
    '/guilds/:guildId/logs',
    zValidator('query', logsQuerySchema),
    async (c) => {
      const guildId = c.req.param('guildId');
      const userOrResponse = await requireGuildManager(c, guildId);
      if (userOrResponse instanceof Response) return userOrResponse;

      const { cursor, limit, category, q } = c.req.valid('query');

      const settings = await db
        .collection(SERVER_LOG_SETTINGS)
        .findOne({ guildId });

      if (!settings?.channelId) {
        return c.json({
          items: [],
          nextCursor: null,
          channelId: null,
        });
      }

      const channelId = settings.channelId as string;

      let messages;
      try {
        messages = await fetchChannelMessages(channelId, {
          before: cursor,
          limit,
        });
      } catch {
        return c.json({ error: 'Failed to fetch log messages' }, 502);
      }

      let items = messages.flatMap((msg) =>
        parseMessageToLogEntries(msg, guildId),
      );

      if (category) {
        items = items.filter((entry) => entry.category === category);
      }

      if (q) {
        items = items.filter((entry) => matchesLogQuery(entry, q));
      }

      const nextCursor =
        messages.length >= limit ? messages[messages.length - 1]?.id : null;

      return c.json({
        items,
        nextCursor,
        channelId,
      });
    },
  );
}
