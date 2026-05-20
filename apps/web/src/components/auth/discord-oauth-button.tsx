"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { authClient, getOAuthRedirectUrl } from "@/auth"
import { SocialLogo } from "@/components/auth/social-logo"
import { Button } from "@/components/ui/button"

export function DiscordOAuthButton({
  disabled,
}: {
  disabled?: boolean
}) {
  const t = useTranslations()
  const [loading, setLoading] = useState(false)

  const handleDiscordSignIn = async () => {
    setLoading(true)
    const { data, error } = await authClient.signIn.social({
      provider: "discord",
      callbackURL: getOAuthRedirectUrl(),
    })
    setLoading(false)
    if (error) {
      toast.error(error.message ?? t("auth.discordSignInFailed"))
      return
    }
    if (data?.url) window.location.href = data.url
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full gap-2"
      onClick={handleDiscordSignIn}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <SocialLogo src="/logo/discord.svg" alt="Discord" />
      )}
      {t("auth.continueWithDiscord")}
    </Button>
  )
}
