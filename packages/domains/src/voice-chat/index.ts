import { z } from 'zod';

export const voiceChatSettingsSchema = z.object({
  guildId: z.string().min(1),
  hubChannelId: z.string().nullable(),
  enabled: z.boolean(),
});

export const patchVoiceChatSettingsSchema = z
  .object({
    hubChannelId: z.string().nullable().optional(),
    enabled: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const voiceChatRoomSchema = z.object({
  channelId: z.string(),
  guildId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  userLimit: z.number(),
  allowedRoleIds: z.array(z.string()),
  createdAt: z.string().optional(),
});

export const voiceChatStatsSchema = z.object({
  settings: voiceChatSettingsSchema,
  activeCount: z.number(),
  rooms: z.array(voiceChatRoomSchema),
});

export type VoiceChatSettings = z.infer<typeof voiceChatSettingsSchema>;
export type PatchVoiceChatSettingsInput = z.infer<
  typeof patchVoiceChatSettingsSchema
>;
export type VoiceChatRoom = z.infer<typeof voiceChatRoomSchema>;
export type VoiceChatStats = z.infer<typeof voiceChatStatsSchema>;

export const voiceChatEventTypeSchema = z.enum([
  'room_created',
  'room_deleted',
  'room_renamed',
  'limit_changed',
  'roles_changed',
  'member_joined',
]);

export const voiceChatEventSnapshotSchema = z.object({
  channelId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  userLimit: z.number(),
  allowedRoleIds: z.array(z.string()),
  memberCount: z.number().optional(),
});

export const voiceChatEventSchema = z.object({
  id: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  type: voiceChatEventTypeSchema,
  ownerId: z.string(),
  actorId: z.string().optional(),
  snapshot: voiceChatEventSnapshotSchema,
  previousName: z.string().optional(),
  createdAt: z.string(),
});

export const voiceChatEventsResponseSchema = z.object({
  items: z.array(voiceChatEventSchema),
  nextCursor: z.string().nullable(),
});

export type VoiceChatEventType = z.infer<typeof voiceChatEventTypeSchema>;
export type VoiceChatEvent = z.infer<typeof voiceChatEventSchema>;
export type VoiceChatEventsResponse = z.infer<
  typeof voiceChatEventsResponseSchema
>;

export const defaultVoiceChatSettings = (
  guildId: string,
): VoiceChatSettings => ({
  guildId,
  hubChannelId: null,
  enabled: false,
});
