"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuildLogsView } from "@/components/guilds/guild-logs-view"
import { Button } from "@/components/ui/button"

export default function GuildLogsPage() {
  const t = useTranslations()
  const params = useParams()
  const guildId = params.guildId as string

  return (
    <DashboardShell
      title={t("dashboard.logs.title")}
      description={t("dashboard.logs.description")}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/guilds/${guildId}`}>
            {t("dashboard.settings.backToSettings")}
          </Link>
        </Button>
      }
    >
      <GuildLogsView guildId={guildId} />
    </DashboardShell>
  )
}
