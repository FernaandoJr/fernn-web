"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { authClient, getOAuthRedirectUrl, useUser } from "@/auth"
import { SocialLogo } from "@/components/auth/social-logo"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const t = useTranslations()
  const { user, isLoading, refetch } = useUser()
  const [discordLoading, setDiscordLoading] = useState(false)

  const handleConnectDiscord = async () => {
    setDiscordLoading(true)
    const { data, error } = await authClient.signIn.social({
      provider: "discord",
      callbackURL: getOAuthRedirectUrl(),
    })
    setDiscordLoading(false)
    if (error) {
      toast.error(error.message ?? t("auth.discordSignInFailed"))
      return
    }
    if (data?.url) window.location.href = data.url
  }

  return (
    <DashboardShell
      title={t("dashboard.profile.title")}
      description={t("dashboard.profile.description")}
    >
      {isLoading ? (
        <Skeleton className="h-48 w-full max-w-lg" />
      ) : (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>{user?.name}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">
                {t("dashboard.profile.discordStatus")}
              </span>
              {user?.discordId ? (
                <Badge variant="secondary">
                  {t("dashboard.profile.discordConnected")}
                </Badge>
              ) : (
                <Badge variant="outline">
                  {t("dashboard.profile.discordDisconnected")}
                </Badge>
              )}
            </div>
            {!user?.discordId ? (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={discordLoading}
                onClick={handleConnectDiscord}
              >
                {discordLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SocialLogo src="/logo/discord.svg" alt="Discord" />
                )}
                {t("dashboard.profile.connectDiscord")}
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t("dashboard.profile.discordLinkedHint")}
              </p>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
            >
              {t("dashboard.profile.refresh")}
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}
