"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { QueryErrorCard } from "@/components/guilds/query-error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  fetchGuildVoiceChannels,
  fetchVoiceChatStats,
  updateVoiceChatSettings,
} from "@/services/voice-chat"

export function VoiceChatSettings({ guildId }: { guildId: string }) {
  const t = useTranslations()
  const queryClient = useQueryClient()

  const statsQuery = useQuery({
    queryKey: ["voice-chat", guildId],
    queryFn: () => fetchVoiceChatStats(guildId),
  })

  const channelsQuery = useQuery({
    queryKey: ["guild-voice-channels", guildId],
    queryFn: () => fetchGuildVoiceChannels(guildId),
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
      queryClient.invalidateQueries({ queryKey: ["voice-chat", guildId] })
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

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="voice-enabled">
              {t("dashboard.voiceChat.enabled")}
            </Label>
            <p className="text-muted-foreground text-sm">
              {t("dashboard.voiceChat.enabledHint")}
            </p>
          </div>
          <Switch
            id="voice-enabled"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("dashboard.voiceChat.hubChannel")}</Label>
          <Select
            value={hubChannelId ?? "none"}
            onValueChange={(v) => setHubChannelId(v === "none" ? null : v)}
            disabled={channelsQuery.isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("dashboard.voiceChat.hubPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {t("dashboard.voiceChat.noHub")}
              </SelectItem>
              {channelsQuery.data?.map((ch) => (
                <SelectItem key={ch.id} value={ch.id}>
                  {ch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          <ul className="divide-border divide-y rounded-lg border">
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

