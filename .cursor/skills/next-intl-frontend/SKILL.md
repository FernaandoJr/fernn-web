---
name: next-intl-frontend
description: >-
  Next.js App Router + next-intl: NEXT_LOCALE cookie, getRequestConfig, createNextIntlPlugin,
  NextIntlClientProvider, flat i18nResources / messagesByLocale, resolveLocale, JSON messages
  (no translation arrays—keyed objects + TS key lists), useTranslations() without namespace,
  getTranslations() in RSC, getServerLocale/getCommonBundle for metadata, html lang BCP-47
  (htmlLangAttribute), no message-types schema. Use when adding locales, locale JSON,
  LocaleSwitcher, i18n layout, generateMetadata, or SEO per locale.
---

# Next.js frontend i18n (next-intl)

Concise house style for **Next.js App Router** + **next-intl** + **static JSON** per locale. Longer snippets live in `references/`.

## When to use

- Wiring or changing **next-intl** (`getRequestConfig`, `createNextIntlPlugin`, `NextIntlClientProvider`).
- **Locale cookie**, supported locale codes, or **`<html lang>`** vs app locale IDs.
- Editing **`locales/*/common.json`** or adding keys across all locales.
- **Lists** of translated cards/table rows (avoid JSON arrays; use keyed objects + code key order).
- **LocaleSwitcher** (cookie + refresh) or **metadata** / legal pages that read messages on the server without `getTranslations` in every path.

## Stack scope

- **next-intl** with messages imported as JSON (bundled at build time).
- **Not** the default: do not add **react-i18next** / client singleton i18n unless the repo already does—see anti-patterns.

## File map (typical layout)

| Piece | Role |
| --- | --- |
| `next.config.ts` | `createNextIntlPlugin("./src/i18n/request.ts")` |
| `src/i18n/request.ts` | Read cookie → `resolveLocale` → `messagesFor(locale)` → `{ locale, messages, timeZone }` |
| `src/lib/i18n/config.ts` | `LOCALE_COOKIE`, `locales`, `defaultLocale`, `isLocale`, `localeLabels` |
| `src/lib/i18n/resources.ts` | `import en from ".../en/common.json"` etc.; export **`{ en, es, ptBR }`** flat (no extra `{ common: json }` wrapper in JS) |
| `src/lib/i18n/server.ts` | `getServerLocale()`, `getCommonBundle(locale)`, `htmlLangAttribute(locale)` |
| `src/lib/i18n/locales/<locale>/common.json` | Full message tree (nested objects, **no arrays** for UI lists) |
| `src/app/layout.tsx` | `getLocale`, `getMessages`, `NextIntlClientProvider`, **`lang={htmlLangAttribute(locale)}`** |
| `src/components/locale-switcher.tsx` | Set cookie + `router.refresh()` |

Details: [references/locale-resolution.md](references/locale-resolution.md), [references/json-structure.md](references/json-structure.md).

## Conventions (must follow)

1. **`useTranslations()`** — no namespace argument; keys are `nav.site.name`, `home.aboutTitle`, etc. (JSON is the root message object).
2. **`getTranslations()`** in Server Components / `generateMetadata` when `t("…")` is enough — also **no namespace** if messages are flat at root.
3. **No `message-types.ts` / `Messages`** as the source of truth — JSON + build/lint; add TS only where the compiler forces (e.g. `localeLabels[code as keyof typeof localeLabels]`).
4. **Locale IDs**: app may use `ptBR`; **HTML** uses BCP-47 (`pt-BR`) via `htmlLangAttribute`.
5. **Cookie**: `NEXT_LOCALE` (or single project constant); map legacy **`pt-BR` → `ptBR`** in `resolveLocale` if users may still have old cookies.
6. **Lists in UI**: JSON = **keyed objects**; TS = **`as const` array of keys** + `t(\`home.features.${key}.title\`)`. Do not store translatable lists as JSON arrays.

## Workflows

### 1. Add a new locale (e.g. `fr`)

- Add `fr` to `locales` and `localeLabels` in `config.ts`.
- Add `src/lib/i18n/locales/fr/common.json` (copy structure from `en`; translate values).
- In `request.ts`: add `fr` to `messagesByLocale` and a branch in `messagesFor`.
- In `resources.ts`: `import fr from "./locales/fr/common.json"` and add `fr` to `i18nResources`.
- In `server.ts`: extend `getCommonBundle` / `getServerLocale` if you branch explicitly (or use a small map).
- Run **`npm run build`**; fix any dynamic `t()` typing issues for that repo.

### 2. Add a new string

- Add the same **key path** to **every** `locales/*/common.json` with translated values.
- Use `t("section.sub.key")` in components; keep key paths stable.

### 3. Add a new “list” section (features, commands, FAQ, …)

- In JSON: `home.mySection.itemKey.title`, `home.mySection.itemKey.description` (objects only).
- In TS: `const MY_KEYS = ["itemKey", ...] as const` then `MY_KEYS.map((key) => … t(\`home.mySection.${key}.title\`) …)`.
- Never: `"mySection": [ { "title": … } ]` for user-visible list copy.

### 4. SEO / `generateMetadata` / legal copy from JSON

- `const locale = await getServerLocale()` then `const m = getCommonBundle(locale)` and read `m.terms.metaTitle`, etc., when you want the raw bundle without threading `getTranslations` through every helper.

## PR checklist

- [ ] Every locale file has the **same key tree** (no missing keys).
- [ ] Cookie name matches `LOCALE_COOKIE` / `request.ts`.
- [ ] `<html lang={…}>` uses **BCP-47** (`htmlLangAttribute`), not raw app codes like `ptBR` if invalid for `lang`.
- [ ] No new **JSON arrays** for translatable grids/lists.
- [ ] Client: **`useTranslations()`** only (no `'common'` namespace if messages are already root).
- [ ] **`npm run build`** (and lint) pass.

## Anti-patterns

- **`useTranslations('common')`** when `messages` passed to `NextIntlClientProvider` is already the contents of `common.json` (root = common).
- **Wrapping** imported JSON again as `{ common: en }` in `resources.ts` for server helpers—keep **`i18nResources.en = en`** flat.
- **`pt-BR` vs `ptBR`** in cookies, routes, or JSON folder names without a single **resolve** rule → subtle wrong locale / wrong `lang`.
- **JSON arrays** of `{ title, description }` for things translators must extend—prefer **named keys** + ordered key list in code.
- Dropping **next-intl** for **client-only i18next** “because another repo did it”—only if this repo’s `package.json` and architecture commit to that.

## Pitfalls

- **Dynamic keys** `t(\`home.x.${key}\`)` — some setups use strict message typing; always **run build** after refactors.
- **Next.js API drift**: if behavior differs from training data, read `node_modules/next/dist/docs/` for the installed major version (see project `AGENTS.md` if present).

## Optional

- **Codex `agents/openai.yaml`**: only if you also publish this skill for Codex UI; not required for Cursor `SKILL.md`.
- **Key validation script**: optional `scripts/` to diff JSON keys across locales—add only if teams keep missing keys.
