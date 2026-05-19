"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { setAccessToken } from "@/auth"

export default function AuthCallbackPage() {
  const t = useTranslations()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading")

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? (() => {
            const hash = window.location.hash?.slice(1) || ""
            const params = new URLSearchParams(hash)
            return params.get("token") ?? null
          })()
        : null

    if (!token) {
      queueMicrotask(() => setStatus("error"))
      return
    }

    setAccessToken(token)
    queueMicrotask(() => setStatus("done"))
    router.replace("/dashboard")
  }, [router])

  if (status === "error") {
    router.replace("/auth/sign-in?error=callback")
    return null
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Loader2 className="text-primary size-8 animate-spin" />
      <p className="text-muted-foreground text-sm">{t("auth.signingIn")}</p>
    </div>
  )
}
