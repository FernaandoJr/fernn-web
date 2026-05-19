import type { Metadata } from "next"

import { LegalLayout } from "@/components/legal-layout"
import { TermsArticle } from "@/components/legal/terms-article"
import { getCommonBundle, getServerLocale } from "@/lib/i18n/server"
import { getSiteUrl } from "@/lib/site"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale()
  const m = getCommonBundle(locale)
  return {
    title: m.terms.metaTitle,
    description: m.terms.metaDescription,
    alternates: { canonical: `${getSiteUrl()}/terms` },
  }
}

export default async function TermsPage() {
  const locale = await getServerLocale()
  const m = getCommonBundle(locale)

  return (
    <LegalLayout title={m.terms.title} description={m.terms.description}>
      <TermsArticle locale={locale} />
    </LegalLayout>
  )
}
