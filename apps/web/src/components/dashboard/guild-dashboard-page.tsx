"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export function GuildDashboardPage({
  titleKey,
  descriptionKey,
  actions,
  children,
}: {
  titleKey: string
  descriptionKey: string
  actions?: ReactNode
  children: ReactNode
}) {
  const t = useTranslations()

  return (
    <DashboardShell
      title={t(titleKey)}
      description={t(descriptionKey)}
      actions={actions}
    >
      {children}
    </DashboardShell>
  )
}
