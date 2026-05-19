"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuildSettingsForm } from "@/components/guilds/guild-settings-form"
import { Button } from "@/components/ui/button"

export default function GuildSettingsPage() {
  const t = useTranslations()
  const params = useParams()
  const guildId = params.guildId as string

  return (
    <DashboardShell
      title={t("dashboard.settings.title")}
      description={t("dashboard.settings.description")}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/guilds/${guildId}/voice-chat`}>
              {t("dashboard.voiceChat.openSettings")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/guilds/${guildId}/logs`}>
              {t("dashboard.logs.viewHistory")}
            </Link>
          </Button>
        </div>
      }
    >
      <GuildSettingsForm guildId={guildId} />
    </DashboardShell>
  )
}
