"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { enUS, es, ptBR } from "date-fns/locale"
import { ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"

import type { LogCategory } from "@/lib/api-types"
import { QueryErrorCard } from "@/components/guilds/query-error-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchGuildLogs, logJumpUrl } from "@/services/guilds"

const CATEGORIES: (LogCategory | "all")[] = [
  "all",
  "voice",
  "members",
  "moderation",
  "messages",
]

const dateLocales = { en: enUS, es, ptBR } as const

export function GuildLogsView({ guildId }: { guildId: string }) {
  const t = useTranslations()
  const locale = useLocale()
  const [category, setCategory] = useState<LogCategory | "all">("all")
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")

  const dateLocale =
    dateLocales[locale as keyof typeof dateLocales] ?? enUS

  const logsQuery = useInfiniteQuery({
    queryKey: ["guild-logs", guildId, category, query],
    queryFn: ({ pageParam }) =>
      fetchGuildLogs(guildId, {
        cursor: pageParam as string | undefined,
        category: category === "all" ? undefined : category,
        q: query || undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  })

  const items = logsQuery.data?.pages.flatMap((p) => p.items) ?? []
  const channelId = logsQuery.data?.pages[0]?.channelId

  if (logsQuery.isError) {
    return <QueryErrorCard />
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[10rem] flex-1 space-y-1">
          <label className="text-sm font-medium">
            {t("dashboard.logs.category")}
          </label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as LogCategory | "all")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c === "all"
                    ? t("dashboard.logs.allCategories")
                    : t(`dashboard.settings.event.${c}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[12rem] flex-[2] space-y-1">
          <label className="text-sm font-medium">
            {t("dashboard.logs.search")}
          </label>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("dashboard.logs.searchPlaceholder")}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery(search)
            }}
          />
        </div>
        <Button type="button" variant="secondary" onClick={() => setQuery(search)}>
          {t("dashboard.logs.applyFilters")}
        </Button>
      </div>

      {!channelId && !logsQuery.isLoading ? (
        <p className="text-muted-foreground text-sm">
          {t("dashboard.logs.noChannel")}{" "}
          <Link
            href={`/dashboard/guilds/${guildId}`}
            className="text-primary underline"
          >
            {t("dashboard.logs.configure")}
          </Link>
        </p>
      ) : null}

      {logsQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {t("dashboard.logs.empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((entry) => (
            <li
              key={entry.id}
              className="border-border flex gap-3 rounded-lg border p-4"
              style={{
                borderLeftWidth: 4,
                borderLeftColor: entry.color
                  ? `#${entry.color.toString(16).padStart(6, "0")}`
                  : undefined,
              }}
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {t(`dashboard.settings.event.${entry.category}`)}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(entry.timestamp), {
                      addSuffix: true,
                      locale: dateLocale,
                    })}
                  </span>
                </div>
                <p className="font-medium">{entry.title}</p>
                {entry.description ? (
                  <p className="text-muted-foreground line-clamp-3 text-sm">
                    {entry.description}
                  </p>
                ) : null}
              </div>
              <Button asChild variant="ghost" size="icon" className="shrink-0">
                <a
                  href={logJumpUrl(
                    entry.guildId,
                    entry.channelId,
                    entry.messageId
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("dashboard.logs.openDiscord")}
                >
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {logsQuery.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          disabled={logsQuery.isFetchingNextPage}
          onClick={() => logsQuery.fetchNextPage()}
        >
          {logsQuery.isFetchingNextPage ? (
            <Loader2 className="size-4 animate-spin" />
          ) : null}
          {t("dashboard.logs.loadMore")}
        </Button>
      ) : null}
    </div>
  )
}

