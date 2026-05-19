"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VoiceChatSettings } from "@/components/guilds/voice-chat-settings"
import { Button } from "@/components/ui/button"

export default function GuildVoiceChatPage() {
  const t = useTranslations()
  const params = useParams()
  const guildId = params.guildId as string

  return (
    <DashboardShell
      title={t("dashboard.voiceChat.title")}
      description={t("dashboard.voiceChat.pageDescription")}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/guilds/${guildId}/voice-chat/history`}>
              {t("dashboard.voiceChat.history.title")}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/guilds/${guildId}`}>
              {t("dashboard.voiceChat.backToLogging")}
            </Link>
          </Button>
        </div>
      }
    >
      <VoiceChatSettings guildId={guildId} />
    </DashboardShell>
  )
}
