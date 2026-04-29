import { cookies } from "next/headers"

import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config"
import { i18nResources } from "./resources"

export async function getServerLocale() {
  const store = await cookies()
  const raw = store.get(LOCALE_COOKIE)?.value?.trim()
  if (raw === "pt-BR") return "ptBR"
  if (raw != null && isLocale(raw)) return raw
  return defaultLocale
}

export function getCommonBundle(locale: string) {
  if (locale === "es") return i18nResources.es
  if (locale === "ptBR") return i18nResources.ptBR
  return i18nResources.en
}

export function htmlLangAttribute(locale: string) {
  return locale === "ptBR" ? "pt-BR" : locale
}
