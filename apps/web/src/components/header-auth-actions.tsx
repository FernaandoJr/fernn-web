"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { AUTH_COOKIE_NAME } from "@/auth"
import { Button } from "@/components/ui/button"

export function HeaderAuthActions() {
  const t = useTranslations()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(
      typeof document !== "undefined" &&
        document.cookie.includes(`${AUTH_COOKIE_NAME}=1`)
    )
  }, [])

  if (isAuth) {
    return null
  }

  return (
    <Button asChild size="sm" className="hidden sm:inline-flex">
      <Link href="/auth/sign-in">{t("nav.signIn")}</Link>
    </Button>
  )
}
