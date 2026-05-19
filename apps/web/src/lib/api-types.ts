export type {
  LogCategory,
  LogEntry,
  PatchServerLogSettingsInput,
  ServerLogEventFlags,
  ServerLogSettings,
  ServerLogSettings as GuildSettings,
  PatchServerLogSettingsInput as GuildSettingsUpdate,
} from "@fernn/domains/server-log"

export type {
  PatchVoiceChatSettingsInput,
  PatchVoiceChatSettingsInput as VoiceChatSettingsUpdate,
  VoiceChatEvent,
  VoiceChatEventType,
  VoiceChatEventsResponse,
  VoiceChatEventsResponse as VoiceChatEventsPage,
  VoiceChatRoom,
  VoiceChatSettings,
  VoiceChatStats,
} from "@fernn/domains/voice-chat"

export interface GuildSummary {
  id: string
  name: string
  icon: string | null
  owner: boolean
}

export interface PaginatedLogs {
  items: import("@fernn/domains/server-log").LogEntry[]
  nextCursor: string | null
  channelId: string | null
}

export interface GuildChannel {
  id: string
  name: string
  type: number
}
