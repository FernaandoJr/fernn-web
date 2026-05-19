"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { ServerLogEventFlags } from "@/lib/api-types"
import { QueryErrorCard } from "@/components/guilds/query-error-card"
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
    queryKey: ["guild-settings", guildId],
    queryFn: () => fetchGuildSettings(guildId),
  })

  const channelsQuery = useQuery({
    queryKey: ["guild-channels", guildId],
    queryFn: () => fetchGuildChannels(guildId),
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
      queryClient.invalidateQueries({ queryKey: ["guild-settings", guildId] })
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
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <Label htmlFor="logging-enabled">
            {t("dashboard.settings.enabled")}
          </Label>
          <p className="text-muted-foreground text-sm">
            {t("dashboard.settings.enabledHint")}
          </p>
        </div>
        <Switch
          id="logging-enabled"
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("dashboard.settings.channel")}</Label>
        <Select
          value={channelId ?? "none"}
          onValueChange={(v) => setChannelId(v === "none" ? null : v)}
          disabled={channelsQuery.isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("dashboard.settings.channelPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">
              {t("dashboard.settings.noChannel")}
            </SelectItem>
            {channelsQuery.data?.map((ch) => (
              <SelectItem key={ch.id} value={ch.id}>
                #{ch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>{t("dashboard.settings.categories")}</Label>
        {EVENT_KEYS.map((key) => (
          <div key={key} className="flex items-center justify-between gap-4">
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


