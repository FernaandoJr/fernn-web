"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VoiceChatHistory } from "@/components/guilds/voice-chat-history"
import { Button } from "@/components/ui/button"

export default function VoiceChatHistoryPage() {
  const t = useTranslations()
  const params = useParams()
  const guildId = params.guildId as string

  return (
    <DashboardShell
      title={t("dashboard.voiceChat.history.title")}
      description={t("dashboard.voiceChat.history.description")}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href={`/dashboard/guilds/${guildId}/voice-chat`}>
            {t("dashboard.voiceChat.history.backToSettings")}
          </Link>
        </Button>
      }
    >
      <VoiceChatHistory guildId={guildId} />
    </DashboardShell>
  )
}
