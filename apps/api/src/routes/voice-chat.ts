import { zValidator } from '@hono/zod-validator';
import {
  defaultVoiceChatSettings,
  patchVoiceChatSettingsSchema,
  type VoiceChatEvent,
  type VoiceChatRoom,
  type VoiceChatSettings,
} from '@fernn/domains/voice-chat';
import { ObjectId } from 'mongodb';
import { Hono } from 'hono';
import {
  VOICE_CHAT_CHANNELS,
  VOICE_CHAT_EVENTS,
  VOICE_CHAT_SETTINGS,
} from '../db/collections.js';
import { db } from '../db/mongo.js';
import { upsertByGuildId } from '../db/upsert-by-guild-id.js';
import { requireGuildManager } from '../middleware/guild-access.js';
import type { AppVariables } from '../types/session.js';

function docToSettings(
  guildId: string,
  doc: Record<string, unknown> | null,
): VoiceChatSettings {
  if (!doc) return defaultVoiceChatSettings(guildId);
  return {
    guildId,
    hubChannelId: (doc.hubChannelId as string | null) ?? null,
    enabled: Boolean(doc.enabled),
  };
}

function docToRoom(doc: Record<string, unknown>): VoiceChatRoom {
  return {
    channelId: String(doc.channelId),
    guildId: String(doc.guildId),
    ownerId: String(doc.ownerId),
    name: String(doc.name),
    userLimit: Number(doc.userLimit) || 0,
    allowedRoleIds: Array.isArray(doc.allowedRoleIds)
      ? (doc.allowedRoleIds as string[])
      : [],
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : typeof doc.createdAt === 'string'
          ? doc.createdAt
          : undefined,
  };
}

export function createVoiceChatRoutes() {
  return new Hono<{ Variables: AppVariables }>()
    .get('/guilds/:guildId/voice-chat', async (c) => {
      const guildId = c.req.param('guildId');
      const result = await requireGuildManager(c, guildId);
      if (result instanceof Response) return result;

      const settingsDoc = await db
        .collection(VOICE_CHAT_SETTINGS)
        .findOne({ guildId });

      const settings = docToSettings(guildId, settingsDoc);

      const roomDocs = await db
        .collection(VOICE_CHAT_CHANNELS)
        .find({ guildId })
        .sort({ createdAt: -1 })
        .limit(25)
        .toArray();

      const rooms = roomDocs.map((d) => docToRoom(d as Record<string, unknown>));

      return c.json({
        settings,
        activeCount: rooms.length,
        rooms,
      });
    })

    .patch(
      '/guilds/:guildId/voice-chat',
      zValidator('json', patchVoiceChatSettingsSchema),
      async (c) => {
        const guildId = c.req.param('guildId');
        const result = await requireGuildManager(c, guildId);
        if (result instanceof Response) return result;

        const body = c.req.valid('json');

        const existing = await db
          .collection(VOICE_CHAT_SETTINGS)
          .findOne({ guildId });

        const current = docToSettings(guildId, existing);

        const update = {
          guildId,
          hubChannelId:
            body.hubChannelId !== undefined
              ? body.hubChannelId
              : current.hubChannelId,
          enabled: body.enabled !== undefined ? body.enabled : current.enabled,
          updatedAt: new Date(),
        };

        if (body.hubChannelId && body.enabled === undefined) {
          update.enabled = true;
        }

        await upsertByGuildId(VOICE_CHAT_SETTINGS, guildId, update);

        return c.json({
          guildId: update.guildId,
          hubChannelId: update.hubChannelId,
          enabled: update.enabled,
        } satisfies VoiceChatSettings);
      },
    )

    .get('/guilds/:guildId/voice-chat/events', async (c) => {
      const guildId = c.req.param('guildId');
      const result = await requireGuildManager(c, guildId);
      if (result instanceof Response) return result;

      const cursor = c.req.query('cursor');
      const limit = Math.min(
        Number.parseInt(c.req.query('limit') ?? '40', 10) || 40,
        100,
      );

      const filter: Record<string, unknown> = { guildId };
      if (cursor) {
        const before = new Date(cursor);
        if (!Number.isNaN(before.getTime())) {
          filter.createdAt = { $lt: before };
        }
      }

      const docs = await db
        .collection(VOICE_CHAT_EVENTS)
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(limit + 1)
        .toArray();

      const hasMore = docs.length > limit;
      const page = hasMore ? docs.slice(0, limit) : docs;

      const items: VoiceChatEvent[] = page.map((doc) => {
        const id =
          doc._id instanceof ObjectId ? doc._id.toString() : String(doc._id);
        const snap = doc.snapshot as Record<string, unknown> | undefined;
        return {
          id,
          guildId: String(doc.guildId),
          channelId: String(doc.channelId),
          type: doc.type as VoiceChatEvent['type'],
          ownerId: String(doc.ownerId),
          actorId: doc.actorId ? String(doc.actorId) : undefined,
          snapshot: {
            channelId: String(snap?.channelId ?? doc.channelId),
            ownerId: String(snap?.ownerId ?? doc.ownerId),
            name: String(snap?.name ?? ''),
            userLimit: Number(snap?.userLimit) || 0,
            allowedRoleIds: Array.isArray(snap?.allowedRoleIds)
              ? (snap.allowedRoleIds as string[])
              : [],
            memberCount:
              typeof snap?.memberCount === 'number'
                ? snap.memberCount
                : undefined,
          },
          previousName: doc.previousName ? String(doc.previousName) : undefined,
          createdAt:
            doc.createdAt instanceof Date
              ? doc.createdAt.toISOString()
              : String(doc.createdAt),
        };
      });

      const nextCursor =
        hasMore && items.length > 0
          ? items[items.length - 1]!.createdAt
          : null;

      return c.json({ items, nextCursor });
    });
}
