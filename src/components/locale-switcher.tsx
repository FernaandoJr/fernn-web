"use client"

import { useCallback, useTransition } from "react"
import { useLocale } from "next-intl"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { localeLabels, locales, LOCALE_COOKIE } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const setLocale = useCallback(
    (next: string) => {
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`
      startTransition(() => {
        router.refresh()
      })
    },
    [router]
  )

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 p-0.5",
        className
      )}
      role="group"
      aria-label="Language"
    >
      {locales.map((code) => (
        <Button
          key={code}
          type="button"
          size="sm"
          variant={locale === code ? "default" : "ghost"}
          className={cn(
            "h-7 min-w-8 rounded-full px-2 text-xs",
            locale === code && "pointer-events-none"
          )}
          disabled={isPending}
          onClick={() => setLocale(code)}
        >
          {localeLabels[code as keyof typeof localeLabels]}
        </Button>
      ))}
    </div>
  )
}
