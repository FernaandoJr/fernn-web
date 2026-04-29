import { getTranslations } from "next-intl/server"

import { Navbar } from "@/components/ui/navbar"
import { FERNN_GITHUB_REPO_URL } from "@/lib/discord"
import { cn } from "@/lib/utils"

/** Routes and message keys — labels come from `nav.*` in locale JSON. */
const HEADER_NAV = [
  {
    nameKey: "nav.site.name",
    items: [
      { href: "/#features", labelKey: "nav.site.features" },
      { href: "/#commands", labelKey: "nav.site.commands" },
    ],
  },
  {
    nameKey: "nav.legal.name",
    items: [
      { href: "/terms", labelKey: "nav.legal.terms" },
      { href: "/privacy", labelKey: "nav.legal.privacy" },
    ],
  },
  {
    nameKey: "nav.project.name",
    items: [
      {
        href: FERNN_GITHUB_REPO_URL,
        labelKey: "nav.project.repo",
      },
    ],
  },
] as const

export async function SiteHeader({ className }: { className?: string }) {
  const t = await getTranslations()
  const nav = HEADER_NAV.map((cat) => ({
    name: t(cat.nameKey),
    items: cat.items.map((item) => ({
      href: item.href,
      label: t(item.labelKey),
    })),
  }))

  return (
    <header
      className={cn("border-b border-border/80 bg-card/80 backdrop-blur-sm", className)}
    >
      <Navbar nav={nav} />
    </header>
  )
}
