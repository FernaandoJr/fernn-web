"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import {
  DoorOpen,
  Loader2,
  Pencil,
  Settings2,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import type { ReactNode } from "react"

import type { VoiceChatEvent, VoiceChatEventType } from "@/lib/api-types"
import { QueryErrorCard } from "@/components/guilds/query-error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Timeline,
  type TimelineItemData,
  type TimelineItemStatus,
} from "@/components/ui/timeline"
import { fetchVoiceChatEvents } from "@/services/voice-chat"

const EVENT_ICONS: Record<VoiceChatEventType, ReactNode> = {
  room_created: <DoorOpen className="size-3" />,
  room_deleted: <Trash2 className="size-3" />,
  room_renamed: <Pencil className="size-3" />,
  limit_changed: <Users className="size-3" />,
  roles_changed: <Settings2 className="size-3" />,
  member_joined: <UserPlus className="size-3" />,
}

const EVENT_STATUS: Record<VoiceChatEventType, TimelineItemStatus> = {
  room_created: "completed",
  room_deleted: "error",
  room_renamed: "active",
  limit_changed: "default",
  roles_changed: "default",
  member_joined: "pending",
}

function limitLabel(t: ReturnType<typeof useTranslations>, limit: number) {
  return limit === 0
    ? t("dashboard.voiceChat.limitUnlimited")
    : t("dashboard.voiceChat.limitUsers", { count: limit })
}

function eventDescription(
  event: VoiceChatEvent,
  t: ReturnType<typeof useTranslations>
) {
  const snap = event.snapshot
  const lines: string[] = [
    t("dashboard.voiceChat.history.channelName", { name: snap.name }),
    t("dashboard.voiceChat.history.owner", { id: event.ownerId }),
    t("dashboard.voiceChat.history.limit", {
      limit: limitLabel(t, snap.userLimit),
    }),
  ]

  if (event.type === "room_renamed" && event.previousName) {
    lines.push(
      t("dashboard.voiceChat.history.previousName", {
        name: event.previousName,
      })
    )
  }

  if (snap.memberCount !== undefined) {
    lines.push(
      t("dashboard.voiceChat.history.members", { count: snap.memberCount })
    )
  }

  if (snap.allowedRoleIds.length > 0) {
    lines.push(
      t("dashboard.voiceChat.history.roles", {
        count: snap.allowedRoleIds.length,
      })
    )
  }

  if (event.channelId) {
    lines.push(
      t("dashboard.voiceChat.history.channelId", { id: event.channelId })
    )
  }

  return lines.join(" · ")
}

function toTimelineItem(
  event: VoiceChatEvent,
  t: ReturnType<typeof useTranslations>
): TimelineItemData {
  const deleted = event.type === "room_deleted"

  return {
    id: event.id,
    title: t(`dashboard.voiceChat.history.event.${event.type}`),
    description: eventDescription(event, t),
    timestamp: event.createdAt,
    status: EVENT_STATUS[event.type],
    icon: EVENT_ICONS[event.type],
    content: (
      <div className="bg-muted/60 space-y-1 rounded-md border p-3 text-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant={deleted ? "destructive" : "secondary"}>
            {snapBadge(event, t)}
          </Badge>
          {event.actorId && event.actorId !== event.ownerId ? (
            <Badge variant="outline">
              {t("dashboard.voiceChat.history.actor", { id: event.actorId })}
            </Badge>
          ) : null}
        </div>
      </div>
    ),
  }
}

function snapBadge(
  event: VoiceChatEvent,
  t: ReturnType<typeof useTranslations>
) {
  if (event.type === "room_deleted") {
    return t("dashboard.voiceChat.history.deletedChannel")
  }
  return event.snapshot.name
}

export function VoiceChatHistory({ guildId }: { guildId: string }) {
  const t = useTranslations()
  const locale = useLocale()

  const eventsQuery = useInfiniteQuery({
    queryKey: ["voice-chat-events", guildId, locale],
    queryFn: ({ pageParam }) =>
      fetchVoiceChatEvents(guildId, {
        cursor: pageParam as string | undefined,
        limit: 30,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })

  const events =
    eventsQuery.data?.pages.flatMap((page) => page.items) ?? []

  if (eventsQuery.isError) {
    return <QueryErrorCard />
  }

  if (eventsQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        {t("dashboard.voiceChat.history.empty")}
      </p>
    )
  }

  const items = [...events]
    .reverse()
    .map((event) => toTimelineItem(event, t))

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        {t("dashboard.voiceChat.history.hint")}
      </p>
      <Timeline items={items} variant="spacious" timestampPosition="top" />
      {eventsQuery.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          disabled={eventsQuery.isFetchingNextPage}
          onClick={() => eventsQuery.fetchNextPage()}
        >
          {eventsQuery.isFetchingNextPage ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {t("dashboard.voiceChat.history.loadMore")}
        </Button>
      ) : null}
    </div>
  )
}
