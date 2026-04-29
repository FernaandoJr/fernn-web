import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"
import en from "@/lib/i18n/locales/en/common.json"
import es from "@/lib/i18n/locales/es/common.json"
import ptBR from "@/lib/i18n/locales/ptBR/common.json"

const messagesByLocale = {
  en,
  es,
  ptBR,
}

function resolveLocale(raw: string | undefined): string {
  if (raw === "pt-BR") return "ptBR"
  if (raw != null && isLocale(raw)) return raw
  return defaultLocale
}

function messagesFor(locale: string) {
  if (locale === "es") return messagesByLocale.es
  if (locale === "ptBR") return messagesByLocale.ptBR
  return messagesByLocale.en
}

export default getRequestConfig(async () => {
  const store = await cookies()
  const raw = store.get(LOCALE_COOKIE)?.value
  const locale = resolveLocale(raw?.trim())

  return {
    locale,
    messages: messagesFor(locale),
    timeZone: "UTC",
  }
})
