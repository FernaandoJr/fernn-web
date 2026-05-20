export const queryKeys = {
  user: ["user"] as const,
  guilds: {
    all: ["guilds"] as const,
    settings: (guildId: string) => ["guild-settings", guildId] as const,
    channels: (guildId: string, kind: "text" | "voice") =>
      ["guild-channels", guildId, kind] as const,
    logs: (guildId: string, category: string, q: string) =>
      ["guild-logs", guildId, category, q] as const,
  },
  voiceChat: {
    stats: (guildId: string) => ["voice-chat", guildId] as const,
    events: (guildId: string) => ["voice-chat-events", guildId] as const,
  },
} as const
