import { z } from 'zod';

export const logCategorySchema = z.enum([
  'voice',
  'members',
  'moderation',
  'messages',
]);

export const serverLogEventFlagsSchema = z.object({
  voice: z.boolean(),
  members: z.boolean(),
  moderation: z.boolean(),
  messages: z.boolean(),
});

export const serverLogSettingsSchema = z.object({
  guildId: z.string().min(1),
  channelId: z.string().nullable(),
  enabled: z.boolean(),
  events: serverLogEventFlagsSchema,
});

export const patchServerLogSettingsSchema = z
  .object({
    channelId: z.string().nullable().optional(),
    enabled: z.boolean().optional(),
    events: serverLogEventFlagsSchema.partial().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const logEntrySchema = z.object({
  id: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  category: logCategorySchema,
  title: z.string(),
  description: z.string().optional(),
  color: z.number().optional(),
  timestamp: z.string(),
  messageId: z.string(),
});

export type LogCategory = z.infer<typeof logCategorySchema>;
export type ServerLogEventFlags = z.infer<typeof serverLogEventFlagsSchema>;
export type ServerLogSettings = z.infer<typeof serverLogSettingsSchema>;
export type PatchServerLogSettingsInput = z.infer<
  typeof patchServerLogSettingsSchema
>;
export type LogEntry = z.infer<typeof logEntrySchema>;

export const defaultServerLogEvents = (): ServerLogEventFlags => ({
  voice: true,
  members: true,
  moderation: true,
  messages: true,
});

export const defaultServerLogSettings = (
  guildId: string,
): ServerLogSettings => ({
  guildId,
  channelId: null,
  enabled: false,
  events: defaultServerLogEvents(),
});
