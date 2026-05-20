import type {
  GuildChannel,
  GuildSettings,
  GuildSettingsUpdate,
  GuildSummary,
  LogCategory,
  PaginatedLogs,
} from "@/lib/api-types"

import { apiClient } from "./api"

export async function fetchGuilds(): Promise<GuildSummary[]> {
  const res = await apiClient.get<{ guilds: GuildSummary[] }>("guilds")
  return res.data.guilds
}

export async function fetchGuildSettings(
  guildId: string
): Promise<GuildSettings> {
  const res = await apiClient.get<GuildSettings>(
    `guilds/${guildId}/settings`
  )
  return res.data
}

export async function updateGuildSettings(
  guildId: string,
  body: GuildSettingsUpdate
): Promise<GuildSettings> {
  const res = await apiClient.patch<GuildSettings>(
    `guilds/${guildId}/settings`,
    body
  )
  return res.data
}

export async function fetchGuildChannels(
  guildId: string,
  kind: "text" | "voice" = "text"
): Promise<GuildChannel[]> {
  const res = await apiClient.get<{ channels: GuildChannel[] }>(
    `guilds/${guildId}/channels`,
    { params: { kind } }
  )
  return res.data.channels
}

export async function fetchGuildLogs(
  guildId: string,
  params?: {
    cursor?: string
    limit?: number
    category?: LogCategory
    q?: string
  }
): Promise<PaginatedLogs> {
  const res = await apiClient.get<PaginatedLogs>(`guilds/${guildId}/logs`, {
    params: {
      cursor: params?.cursor,
      limit: params?.limit ?? 25,
      category: params?.category,
      q: params?.q,
    },
  })
  return res.data
}

export function logJumpUrl(
  guildId: string,
  channelId: string,
  messageId: string
): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`
}
