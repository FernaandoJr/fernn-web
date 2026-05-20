/** Cookie name aligned with typical Next.js locale pattern (see agrocrm @repo/i18n). */
export const LOCALE_COOKIE = "NEXT_LOCALE"

export const locales = ["en", "es", "ptBR"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale = "en"

export function isLocale(value: string | undefined | null) {
  return (
    value != null &&
    typeof value === "string" &&
    (locales as readonly string[]).includes(value)
  )
}

export const localeLabels: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ptBR: "Português",
}

export const localeFlagSrc: Record<Locale, string> = {
  en: "/flags/en.svg",
  es: "/flags/es.svg",
  ptBR: "/flags/pt-br.svg",
}
