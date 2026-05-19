"use client"

import { useQuery } from "@tanstack/react-query"
import { Server } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDiscordInviteUrl } from "@/lib/discord"
import { fetchGuilds } from "@/services/guilds"

export function GuildList() {
  const t = useTranslations()
  const { data, isLoading, error } = useQuery({
    queryKey: ["guilds"],
    queryFn: fetchGuilds,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.guilds.errorTitle")}</CardTitle>
          <CardDescription>
            {t("dashboard.guilds.errorDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/profile">
              {t("dashboard.profile.connectDiscord")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.guilds.emptyTitle")}</CardTitle>
          <CardDescription>
            {t("dashboard.guilds.emptyDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <a href={getDiscordInviteUrl()} target="_blank" rel="noopener noreferrer">
              {t("dashboard.guilds.inviteBot")}
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((guild) => (
        <Link key={guild.id} href={`/dashboard/guilds/${guild.id}`}>
          <Card className="hover:border-primary/50 h-full transition-colors">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              {guild.icon ? (
                <Image
                  src={guild.icon}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                  <Server className="text-muted-foreground size-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-base">{guild.name}</CardTitle>
                {guild.owner ? (
                  <CardDescription>{t("dashboard.guilds.owner")}</CardDescription>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">
                {t("dashboard.guilds.manage")}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
