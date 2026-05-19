"use client"

import { useState } from "react"
import Link from "next/link"
import { Maximize2, Minimize2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DEFAULT_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"

const glass =
  "rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] backdrop-blur-xl"

export function HeroSection({
  videoUrl = DEFAULT_VIDEO_URL,
  inviteUrl,
  className,
}: {
  videoUrl?: string
  inviteUrl: string
  className?: string
}) {
  const [fullBleed, setFullBleed] = useState(true)
  const t = useTranslations()
  const line2After = t("hero.headlineLine2After")

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden transition-all duration-500 ease-in-out",
        fullBleed ? "min-h-[calc(100dvh-5.5rem)] lg:min-h-[calc(100dvh-6rem)]" : "py-32 lg:py-40",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setFullBleed(!fullBleed)}
        aria-label={fullBleed ? t("a11y.heroHeightFull") : t("a11y.heroHeightFit")}
        className={cn(
          "absolute right-4 top-20 z-20 p-2.5 text-foreground transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:top-24",
          glass,
          "hover:bg-[rgba(85,80,110,0.6)]"
        )}
      >
        {fullBleed ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
      </button>

      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/35 to-black/70"
        aria-hidden
      />

      <div className="relative z-10 mx-auto mt-28 flex max-w-5xl flex-col items-center px-6 text-center lg:mt-36">
        <div
          className={cn(
            "inline-flex h-[38px] items-center gap-2.5 px-3.5 shadow-[0_0_20px_rgba(195,6,152,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]",
            glass,
            "[font-family:var(--font-cabin)]"
          )}
        >
          <span className="rounded-[6px] bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow-[0_0_8px_rgba(195,6,152,0.45)]">
            {t("hero.pillBadge")}
          </span>
          <span className="text-sm font-medium tracking-wide text-white">{t("hero.pillLine")}</span>
        </div>

        <h1
          className={cn(
            "mt-8 max-w-5xl text-5xl leading-[1.05] tracking-[-0.02em] text-white lg:text-[clamp(2.75rem,6vw,5.5rem)]",
            "[font-family:var(--font-instrument)]"
          )}
        >
          {t("hero.headlineLine1")}
          <br className="hidden lg:block" />
          {t("hero.headlineLine2Before")}{" "}
          <em className="mx-[0.08em] inline-block italic">{t("hero.headlineEm")}</em>
          {line2After ? ` ${line2After}` : ""}
        </h1>

        <p className="mt-6 max-w-[662px] text-pretty text-lg font-normal text-white/80 [font-family:var(--font-sans)]">
          {t("hero.subtext")}
        </p>

        <div className="mt-8 flex w-full max-w-2xl flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <Button
            asChild
            size="lg"
            className={cn(
              "rounded-[10px] px-8 py-6 text-base shadow-lg shadow-primary/25 [font-family:var(--font-cabin)]"
            )}
          >
            <a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("a11y.discordInvite")}
            >
              {t("hero.addBotButton")}
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "rounded-[10px] px-8 py-6 text-base [font-family:var(--font-cabin)]",
              "border-white/35 bg-black/25 text-white hover:bg-white/15 hover:text-white"
            )}
          >
            <Link href="/terms">{t("hero.termsButton")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "rounded-[10px] px-8 py-6 text-base [font-family:var(--font-cabin)]",
              "border-white/35 bg-black/25 text-white hover:bg-white/15 hover:text-white"
            )}
          >
            <Link href="/privacy">{t("hero.privacyButton")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
