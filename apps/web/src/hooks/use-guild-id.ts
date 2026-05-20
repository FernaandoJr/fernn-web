"use client"

import { useParams } from "next/navigation"

export function useGuildId(): string {
  const params = useParams()
  const guildId = params.guildId
  if (typeof guildId !== "string" || !guildId) {
    throw new Error("useGuildId must be used under /dashboard/guilds/[guildId]")
  }
  return guildId
}
