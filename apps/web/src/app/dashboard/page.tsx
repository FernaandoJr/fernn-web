"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { useUser } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const t = useTranslations()
  const { user, isLoading } = useUser()

  return (
    <DashboardShell
      title={t("dashboard.overview.title")}
      description={t("dashboard.overview.description")}
    >
      {isLoading ? (
        <Skeleton className="h-32 w-full max-w-lg" />
      ) : (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>
              {t("dashboard.overview.greeting", { name: user?.name ?? "" })}
            </CardTitle>
            <CardDescription>
              {user?.discordId
                ? t("dashboard.overview.discordLinked")
                : t("dashboard.overview.discordNotLinked")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/dashboard/guilds">
                {t("dashboard.overview.manageGuilds")}
              </Link>
            </Button>
            {!user?.discordId ? (
              <Button asChild variant="outline">
                <Link href="/dashboard/profile">
                  {t("dashboard.profile.connectDiscord")}
                </Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}
