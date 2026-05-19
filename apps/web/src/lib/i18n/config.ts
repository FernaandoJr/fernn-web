/** Cookie name aligned with typical Next.js locale pattern (see agrocrm @repo/i18n). */
export const LOCALE_COOKIE = "NEXT_LOCALE"

export const locales = ["en", "es", "ptBR"]

export const defaultLocale = "en"

export function isLocale(value: string | undefined | null) {
  return value != null && typeof value === "string" && locales.includes(value)
}

export const localeLabels = {
  en: "EN",
  es: "ES",
  ptBR: "PT",
}
