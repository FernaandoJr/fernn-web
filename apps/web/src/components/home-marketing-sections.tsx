import Link from "next/link"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const HOME_FEATURE_KEYS = [
  "slashFirst",
  "moderation",
  "serverInsight",
  "serverLogging",
  "stack",
  "docker",
] as const

const HOME_COMMAND_KEYS = [
  "ping",
  "ship",
  "uptime",
  "ban",
  "kick",
  "mute",
  "nickname",
  "clear",
  "userInfo",
  "serverInfo",
  "serverLog",
  "serverIcon",
] as const

export async function HomeMarketingSections() {
  const t = await getTranslations()

  return (
    <div className="border-t border-border bg-background px-4 py-14 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <section id="about" className="scroll-mt-24">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight text-foreground",
              "[font-family:var(--font-instrument)]"
            )}
          >
            {t("home.aboutTitle")}
          </h2>
          <div className="mt-4 max-w-3xl space-y-4 text-muted-foreground [font-family:var(--font-sans)]">
            <p className="text-pretty leading-relaxed">{t("home.aboutP1")}</p>
            <p className="text-pretty leading-relaxed">{t("home.aboutP2")}</p>
          </div>
        </section>

        <section id="features" className="scroll-mt-24">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight text-foreground",
              "[font-family:var(--font-instrument)]"
            )}
          >
            {t("home.featuresTitle")}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_FEATURE_KEYS.map((key) => (
              <li key={key}>
                <Card className="h-full border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg [font-family:var(--font-cabin)]">
                      {t(`home.features.${key}.title`)}
                    </CardTitle>
                    <CardDescription className="text-pretty leading-relaxed">
                      {t(`home.features.${key}.description`)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section id="commands" className="scroll-mt-24">
          <h2
            className={cn(
              "text-3xl font-semibold tracking-tight text-foreground",
              "[font-family:var(--font-instrument)]"
            )}
          >
            {t("home.commandsTitle")}
          </h2>
          <div className="mt-6 overflow-x-auto rounded-md border border-border/60">
            <table className="w-full min-w-lg border-collapse text-left text-sm">
              <thead className="bg-muted/50 [font-family:var(--font-cabin)]">
                <tr>
                  <th className="border-b border-border px-4 py-3 font-medium text-foreground">
                    {t("home.commandsColCommand")}
                  </th>
                  <th className="border-b border-border px-4 py-3 font-medium text-foreground">
                    {t("home.commandsColDescription")}
                  </th>
                </tr>
              </thead>
              <tbody className="[font-family:var(--font-sans)]">
                {HOME_COMMAND_KEYS.map((key) => (
                  <tr
                    key={key}
                    className="border-b border-border/80 last:border-b-0 odd:bg-background even:bg-muted/20"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground sm:text-sm">
                      {t(`home.commands.${key}.name`)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t(`home.commands.${key}.description`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-pretty text-xs text-muted-foreground sm:text-sm">
            {t("home.commandsFootnote")}
          </p>
        </section>

        <section aria-labelledby="legal-strip-heading">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle id="legal-strip-heading" className="[font-family:var(--font-cabin)]">
                {t("home.legalStripTitle")}
              </CardTitle>
              <CardDescription className="text-pretty">
                {t("home.legalStripDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <Link href="/terms">{t("home.termsCta")}</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/privacy">{t("home.privacyCta")}</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
