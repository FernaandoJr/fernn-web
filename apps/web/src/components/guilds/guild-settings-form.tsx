"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { ServerLogEventFlags } from "@/lib/api-types"
import { queryKeys } from "@/lib/query-keys"
import {
  GuildChannelSelectField,
  GuildFeatureEnabledField,
} from "@/components/guilds/guild-feature-fields"
import { QueryErrorCard } from "@/components/guilds/query-error-card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import {
  fetchGuildChannels,
  fetchGuildSettings,
  updateGuildSettings,
} from "@/services/guilds"

const EVENT_KEYS: (keyof ServerLogEventFlags)[] = [
  "voice",
  "members",
  "moderation",
  "messages",
]

export function GuildSettingsForm({ guildId }: { guildId: string }) {
  const t = useTranslations()
  const queryClient = useQueryClient()

  const settingsQuery = useQuery({
    queryKey: queryKeys.guilds.settings(guildId),
    queryFn: () => fetchGuildSettings(guildId),
  })

  const channelsQuery = useQuery({
    queryKey: queryKeys.guilds.channels(guildId, "text"),
    queryFn: () => fetchGuildChannels(guildId, "text"),
    enabled: settingsQuery.isSuccess,
  })

  const [channelId, setChannelId] = useState<string | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [events, setEvents] = useState<ServerLogEventFlags>({
    voice: true,
    members: true,
    moderation: true,
    messages: true,
  })

  useEffect(() => {
    if (!settingsQuery.data) return
    setChannelId(settingsQuery.data.channelId)
    setEnabled(settingsQuery.data.enabled)
    setEvents(settingsQuery.data.events)
  }, [settingsQuery.data])

  const saveMutation = useMutation({
    mutationFn: () =>
      updateGuildSettings(guildId, { channelId, enabled, events }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.guilds.settings(guildId),
      })
      toast.success(t("dashboard.settings.saved"))
    },
    onError: () => toast.error(t("dashboard.settings.saveFailed")),
  })

  if (settingsQuery.isLoading) {
    return <Skeleton className="h-64 w-full max-w-xl" />
  }

  if (settingsQuery.isError) {
    return <QueryErrorCard />
  }

  return (
    <form
      className="max-w-xl space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        saveMutation.mutate()
      }}
    >
      <GuildFeatureEnabledField
        id="logging-enabled"
        labelKey="dashboard.settings.enabled"
        hintKey="dashboard.settings.enabledHint"
        checked={enabled}
        onCheckedChange={setEnabled}
      />

      <GuildChannelSelectField
        value={channelId}
        onChange={setChannelId}
        channels={channelsQuery.data}
        loading={channelsQuery.isLoading}
        labelKey="dashboard.settings.channel"
        placeholderKey="dashboard.settings.channelPlaceholder"
        noneKey="dashboard.settings.noChannel"
      />

      <div className="space-y-3">
        <Label>{t("dashboard.settings.categories")}</Label>
        {EVENT_KEYS.map((key) => (
          <div className="flex items-center justify-between gap-4" key={key}>
            <span className="text-sm">{t(`dashboard.settings.event.${key}`)}</span>
            <Switch
              checked={events[key]}
              onCheckedChange={(checked) =>
                setEvents((prev) => ({ ...prev, [key]: checked }))
              }
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={saveMutation.isPending}>
        {saveMutation.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : null}
        {t("dashboard.settings.save")}
      </Button>
    </form>
  )
}
