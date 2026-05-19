"use client"

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

type QueryErrorCardProps = {
  titleKey?: string
  descriptionKey?: string
  showDiscordLink?: boolean
}

export function QueryErrorCard({
  titleKey = "dashboard.errors.title",
  descriptionKey = "dashboard.errors.description",
  showDiscordLink = true,
}: QueryErrorCardProps) {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(titleKey)}</CardTitle>
        <CardDescription>{t(descriptionKey)}</CardDescription>
      </CardHeader>
      {showDiscordLink ? (
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/dashboard/profile">
              {t("dashboard.profile.connectDiscord")}
            </Link>
          </Button>
        </CardContent>
      ) : null}
    </Card>
  )
}
