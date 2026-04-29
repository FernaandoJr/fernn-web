# Locale resolution (cookie → next-intl → HTML `lang`)

## Cookie

- Single constant, e.g. `NEXT_LOCALE`, set by the locale switcher with `path=/`, long `max-age`, `SameSite=Lax`.
- Read the same cookie name in `getRequestConfig` (next-intl) and in any server helper (`getServerLocale`).

## `resolveLocale(raw)`

Typical branches:

1. Normalize legacy values (e.g. cookie `pt-BR` → app locale `ptBR` if folders use `ptBR`).
2. If `raw` is in the supported set (`isLocale`), return it.
3. Otherwise return `defaultLocale`.

Always treat `raw` as possibly `undefined` (missing cookie).

## `messagesFor(locale)`

Return the imported JSON object for that locale. Avoid dynamic `import()` unless the project requires it—static imports give predictable bundles and types from `resolveJsonModule`.

## `getRequestConfig` return value

```ts
return {
  locale,
  messages: messagesFor(locale),
  timeZone: "UTC", // or project TZ
}
```

`locale` must be a **string** (never `undefined`) so `NextIntlClientProvider` and `getLocale()` stay consistent.

## `<html lang>`

- `getLocale()` returns the **app** locale id (e.g. `ptBR`).
- Browsers and SEO expect BCP-47 where applicable (e.g. `pt-BR`).
- Use a small helper:

```ts
export function htmlLangAttribute(locale: string) {
  return locale === "ptBR" ? "pt-BR" : locale
}
```

Wire: `lang={htmlLangAttribute(await getLocale())}` in root layout.

## Locale switcher

1. `useLocale()` for current locale.
2. On change: set `document.cookie` with the chosen code, then `router.refresh()` so the server re-reads the cookie and re-renders with new messages.

Do not forget `key={locale}` on `NextIntlClientProvider` if you need a full subtree reset when locale changes (optional but helps avoid stale client state).
