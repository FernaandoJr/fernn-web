# Code Review — fernn-web (Monorepo)

**Repository:** `fernn-web`  
**Date:** 2026-05-19  
**Scope:** `apps/api`, `apps/web`, `packages/domains`  
**Implementation (2026-05-19):** C3, C4, M1, M2, M5–M6 applied — see [Status](#implementation-status) below.

---

## Implementation Status

| Item | Status |
|------|--------|
| C3 signOut axios | Done |
| C4 `@fernn/domains` in web | Done |
| M1 `requireGuildManager` middleware | Done |
| M2 `db/collections.ts` | Done |
| M5–M6 query error UI (`query-error-card`) | Done |
| C2 httpOnly auth | Pending |
| C1 bot parity / C5 middleware hardening | Pending |
| M3–M4, M7–M10 | Pending |

---

## Executive Summary

- Coherent Turborepo: Next.js 16 dashboard, Hono API + Better Auth, Zod in `@fernn/domains`.
- Server-log settings align with bot `serverlogsettings` on `fernn` `main`.
- Voice-chat API/dashboard may run ahead of bot deploy — confirm collection parity before production.
- Main risks: repeated guild-auth blocks in API, duplicate types in `api-types.ts` vs domains, thin dashboard error UX, auth split (localStorage + cookie middleware).
- No invalid `<motion>` JSX (only Radix `data-motion` in navigation-menu).

---

## Critical (Must Fix)

| # | Issue | Location | Recommendation | Effort |
|---|--------|----------|----------------|--------|
| C1 | Voice-chat schema vs bot | API `voice-chat.ts` | Ship bot models or gate feature | 1–3 d |
| C2 | Bearer token in `localStorage` | `auth/storage.ts` | httpOnly session long-term | 2–4 d |
| C3 | **`signOut` axios bug** | `auth/service.ts` | `post(url, {}, { headers })` not headers as body | 15 min |
| C4 | Type duplication | `api-types.ts` vs `@fernn/domains` | Web depends on `@fernn/domains` | 2–4 h |
| C5 | Middleware cookie-only | `middleware.ts` | Strengthen with session validation | 4–8 h |

---

## Medium (Should Fix)

| # | Issue | Recommendation | Effort |
|---|--------|----------------|--------|
| M1 | Guild-auth boilerplate ×10 | `withGuildManager()` middleware | 3–6 h |
| M2 | `SETTINGS_COLLECTION` duplicated | `db/collections.ts` constants | 30 min |
| M3 | Parallel `/channels` and `/voice-channels` | Optional `?type=text|voice` merge | 2–3 h |
| M4 | Settings form duplication | Shared form shell + slots | 4–8 h |
| M5 | Missing query error UI | All guild components except `guild-list` | 4–6 h |
| M6 | Logs view no fetch error state | `guild-logs-view.tsx` | 1–2 h |
| M7 | Hardcoded auth strings | i18n in hooks/api | 1–2 h |
| M8 | API no `lint` script | Add eslint to `apps/api` | 1–2 h |
| M9 | `GuildSettings` vs `ServerLogSettings` | Rename for clarity | 1 h |
| M10 | Dual axios clients | Shared factory | 2–3 h |

---

## Nice-to-Have

- `activeCount` misleading (capped at 25 rooms)
- Privacy copy for `voicechatevents`
- Cache bot guild IDs in `discord.ts` (TTL)
- Marketing: add `/voice-chat` to home commands

---

## UI Error States Matrix

| Component | Loading | Empty | Error |
|-----------|---------|-------|-------|
| `guild-list.tsx` | ✓ | ✓ | ✓ |
| `guild-settings-form.tsx` | ✓ | — | ✗ |
| `voice-chat-settings.tsx` | ✓ | ✓ | ✗ |
| `guild-logs-view.tsx` | ✓ | ✓ | ✗ |
| `voice-chat-history.tsx` | ✓ | ✓ | ✗ |

---

## Priority Order

1. Fix **signOut** (C3)
2. **@fernn/domains** in web (C5)
3. **Guild access middleware** (M1)
4. **Error UI** on all guild views (M5–M6)
5. Auth hardening (C2) before public launch

**Estimated hardening pass:** ~5–8 developer-days.
