"use client"

import { Bot, FolderGit2, Mail } from "lucide-react"
import { useTranslations } from "next-intl"

import { Footer } from "@/components/ui/footer"
import { FERNN_GITHUB_REPO_URL } from "@/lib/discord"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: { className?: string }) {
  const t = useTranslations()

  return (
    <Footer
      className={cn("mt-auto border-t border-border/80 bg-muted/40", className)}
      logo={<Bot className="size-10 text-primary" aria-hidden />}
      brandName="fernn"
      socialLinks={[
        {
          icon: <FolderGit2 className="size-5" aria-hidden />,
          href: FERNN_GITHUB_REPO_URL,
          label: t("footer.githubLabel"),
        },
        {
          icon: <Mail className="size-5" aria-hidden />,
          href: "mailto:contact@fernaandojr.dev",
          label: t("footer.emailLabel"),
        },
      ]}
      mainLinks={[
        { href: "/", label: t("footer.home") },
        { href: "/terms", label: t("footer.terms") },
        { href: "/privacy", label: t("footer.privacy") },
      ]}
      legalLinks={[
        { href: "/terms", label: t("footer.termsFull") },
        { href: "/privacy", label: t("footer.privacyFull") },
      ]}
      copyright={{
        text: t("footer.copyright"),
      }}
    />
  )
}
