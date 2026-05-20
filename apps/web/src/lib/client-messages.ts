import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/config"
import en from "@/lib/i18n/locales/en/common.json"
import es from "@/lib/i18n/locales/es/common.json"
import ptBR from "@/lib/i18n/locales/ptBR/common.json"

type MessageKey = "auth.sessionExpired"

const catalogs = { en, es, ptBR } as const

function resolveLocale(): keyof typeof catalogs {
  if (typeof document === "undefined") return defaultLocale as keyof typeof catalogs
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`)
  )
  const value = match?.[1]
  return isLocale(value) ? (value as keyof typeof catalogs) : defaultLocale as keyof typeof catalogs
}

export function getClientMessage(key: MessageKey): string {
  const locale = resolveLocale()
  const parts = key.split(".")
  let node: unknown = catalogs[locale]
  for (const part of parts) {
    if (node == null || typeof node !== "object") break
    node = (node as Record<string, unknown>)[part]
  }
  if (typeof node === "string") return node

  let fallback: unknown = catalogs.en
  for (const part of parts) {
    if (fallback == null || typeof fallback !== "object") break
    fallback = (fallback as Record<string, unknown>)[part]
  }
  return typeof fallback === "string" ? fallback : key
}
