"use client"

import { Dithering } from "@paper-design/shaders-react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { useUser } from "@/auth"
import { cn } from "@/lib/utils"

const DITHER_COLOR_FRONT = "#a84a4a"

const ctaClassName =
  "group bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-primary/20 relative inline-flex h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full px-12 text-base font-medium transition-all duration-300 hover:scale-105 hover:ring-4 active:scale-95"

const secondaryCtaClassName =
  "group border-border bg-background/80 text-foreground hover:bg-background hover:ring-border/40 relative inline-flex h-14 cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full border px-12 text-base font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:ring-4 active:scale-95"

function HeroCta({
  href,
  label,
  external,
  ariaLabel,
  className,
}: {
  href: string
  label: string
  external?: boolean
  ariaLabel?: string
  className?: string
}) {
  const inner = (
    <>
      <span className="relative z-10">{label}</span>
      <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? label}
        className={className}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  )
}

export function HeroSection({ inviteUrl }: { inviteUrl: string }) {
  const t = useTranslations()
  const { theme, resolvedTheme } = useTheme()
  const { user, isLoading } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = (resolvedTheme ?? theme) === "dark"
  const isLoggedIn = !!user
  const line2After = t("hero.headlineLine2After")

  const authHref = isLoggedIn ? "/dashboard" : "/auth/sign-in"
  const authLabel = isLoading
    ? t("nav.dashboard")
    : isLoggedIn
      ? t("nav.dashboard")
      : t("nav.signIn")

  return (
    <section className="w-full">
      <div className="relative w-full">
        <div className="bg-card relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden duration-500">
          <div className="absolute inset-0 z-0">
            {mounted ? (
              <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply">
                <Dithering
                  colorBack={isDark ? "#000000" : "#ffffff"}
                  colorFront={DITHER_COLOR_FRONT}
                  shape="warp"
                  type="4x4"
                  speed={0.8}
                  className="h-full w-full"
                  minPixelRatio={1}
                />
              </div>
            ) : null}
            <div className="from-background pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
            <h1
              className={cn(
                "text-foreground mb-8 text-5xl leading-[1.05] font-medium tracking-tight md:text-7xl lg:text-8xl",
                "[font-family:var(--font-instrument)]",
              )}
            >
              {t("hero.headlineLine1")}
              <br />
              <span className="text-foreground/80">
                {t("hero.headlineLine2Before")}{" "}
                <em className="italic">{t("hero.headlineEm")}</em>
                {line2After ? ` ${line2After}` : ""}
              </span>
            </h1>

            <p className="text-muted-foreground mb-12 max-w-2xl text-lg leading-relaxed md:text-xl">
              {t("hero.subtext")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
              <HeroCta
                href={inviteUrl}
                label={t("hero.addBotButton")}
                ariaLabel={t("a11y.discordInvite")}
                external
                className={ctaClassName}
              />
              <HeroCta
                href={authHref}
                label={authLabel}
                className={secondaryCtaClassName}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
