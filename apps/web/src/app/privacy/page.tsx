import type { Metadata } from "next"

import { LegalLayout } from "@/components/legal-layout"
import { PrivacyArticle } from "@/components/legal/privacy-article"
import { getCommonBundle, getServerLocale } from "@/lib/i18n/server"
import { getSiteUrl } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const m = getCommonBundle(locale)
  return {
    title: m.privacy.metaTitle,
    description: m.privacy.metaDescription,
    alternates: { canonical: `${getSiteUrl()}/privacy` },
  }
}

export default async function PrivacyPage() {
  const locale = await getServerLocale()
  const m = getCommonBundle(locale)

  return (
    <LegalLayout title={m.privacy.title} description={m.privacy.description}>
      <PrivacyArticle locale={locale} siteUrl={getSiteUrl()} />
    </LegalLayout>
  )
}
