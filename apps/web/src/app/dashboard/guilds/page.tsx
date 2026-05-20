"use client"

import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { GuildList } from "@/components/guilds/guild-list"

export default function GuildsPage() {
  const t = useTranslations()

  return (
    <DashboardShell title={t("dashboard.guilds.title")}>
      <GuildList />
    </DashboardShell>
  )
}
