import type {
  VoiceChatEventsPage,
  VoiceChatSettings,
  VoiceChatSettingsUpdate,
  VoiceChatStats,
} from "@/lib/api-types"

import { apiClient } from "./api"

export async function fetchVoiceChatStats(
  guildId: string
): Promise<VoiceChatStats> {
  const res = await apiClient.get<VoiceChatStats>(
    `guilds/${guildId}/voice-chat`
  )
  return res.data
}

export async function updateVoiceChatSettings(
  guildId: string,
  body: VoiceChatSettingsUpdate
): Promise<VoiceChatSettings> {
  const res = await apiClient.patch<VoiceChatSettings>(
    `guilds/${guildId}/voice-chat`,
    body
  )
  return res.data
}

export async function fetchVoiceChatEvents(
  guildId: string,
  params?: { cursor?: string; limit?: number }
): Promise<VoiceChatEventsPage> {
  const res = await apiClient.get<VoiceChatEventsPage>(
    `guilds/${guildId}/voice-chat/events`,
    {
      params: {
        cursor: params?.cursor,
        limit: params?.limit ?? 40,
      },
    }
  )
  return res.data
}
