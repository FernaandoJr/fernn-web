"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { queryKeys } from "@/lib/query-keys"
import {
  GuildChannelSelectField,
  GuildFeatureEnabledField,
} from "@/components/guilds/guild-feature-fields"
import { QueryErrorCard } from "@/components/guilds/query-error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGuildChannels } from "@/services/guilds"
import {
  fetchVoiceChatStats,
  updateVoiceChatSettings,
} from "@/services/voice-chat"

export function VoiceChatSettings({ guildId }: { guildId: string }) {
  const t = useTranslations()
  const queryClient = useQueryClient()

  const statsQuery = useQuery({
    queryKey: queryKeys.voiceChat.stats(guildId),
    queryFn: () => fetchVoiceChatStats(guildId),
  })

  const channelsQuery = useQuery({
    queryKey: queryKeys.guilds.channels(guildId, "voice"),
    queryFn: () => fetchGuildChannels(guildId, "voice"),
    enabled: statsQuery.isSuccess,
  })

  const [hubChannelId, setHubChannelId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!statsQuery.data) return
    setHubChannelId(statsQuery.data.settings.hubChannelId)
    setEnabled(statsQuery.data.settings.enabled)
  }, [statsQuery.data])

  const saveMutation = useMutation({
    mutationFn: () =>
      updateVoiceChatSettings(guildId, { hubChannelId, enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.voiceChat.stats(guildId),
      })
      toast.success(t("dashboard.voiceChat.saved"))
    },
    onError: () => toast.error(t("dashboard.voiceChat.saveFailed")),
  })

  if (statsQuery.isLoading) {
    return <Skeleton className="h-64 w-full max-w-xl" />
  }

  if (statsQuery.isError) {
    return <QueryErrorCard />
  }

  const rooms = statsQuery.data?.rooms ?? []

  return (
    <div className="max-w-2xl space-y-8">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          saveMutation.mutate()
        }}
      >
        <p className="text-muted-foreground text-sm">
          {t("dashboard.voiceChat.description")}{" "}
          <Link
            href={`/dashboard/guilds/${guildId}/voice-chat/history`}
            className="text-primary underline"
          >
            {t("dashboard.voiceChat.history.title")}
          </Link>
        </p>

        <GuildFeatureEnabledField
          id="voice-enabled"
          labelKey="dashboard.voiceChat.enabled"
          hintKey="dashboard.voiceChat.enabledHint"
          checked={enabled}
          onCheckedChange={setEnabled}
        />

        <GuildChannelSelectField
          value={hubChannelId}
          onChange={setHubChannelId}
          channels={channelsQuery.data}
          loading={channelsQuery.isLoading}
          labelKey="dashboard.voiceChat.hubChannel"
          placeholderKey="dashboard.voiceChat.hubPlaceholder"
          noneKey="dashboard.voiceChat.noHub"
          prefix=""
        />

        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {t("dashboard.voiceChat.save")}
        </Button>
      </form>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            {t("dashboard.voiceChat.activeRooms")}
          </h3>
          <Badge variant="secondary">{statsQuery.data?.activeCount ?? 0}</Badge>
        </div>
        {rooms.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("dashboard.voiceChat.noRooms")}
          </p>
        ) : (
          <ul className="divide-border divide-y rounded-md border">
            {rooms.map((room) => (
              <li
                key={room.channelId}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
              >
                <span className="font-medium">{room.name}</span>
                <span className="text-muted-foreground">
                  {room.userLimit === 0
                    ? t("dashboard.voiceChat.limitUnlimited")
                    : t("dashboard.voiceChat.limitUsers", {
                        count: room.userLimit,
                      })}
                  {" · "}
                  <span className="font-mono text-xs">{room.ownerId}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
