# fernn-web

Turborepo monorepo for the [fernn](https://github.com/FernaandoJr/fernn) Discord bot: a **Next.js** marketing and dashboard site plus a **Hono** API with Better Auth and MongoDB.

## Architecture

| Package | Path | Role |
|--------|------|------|
| **web** | `apps/web` | Next.js App Router — landing, legal pages, auth UI, guild dashboard |
| **api** | `apps/api` | Hono API on port `8787` — auth, guilds, logs, Discord integration |
| **domains** | `packages/domains` | Shared Zod schemas (`server-log`, `voice-chat`) consumed by the API |

```text
Browser  →  apps/web (3000)  →  NEXT_PUBLIC_API_URL  →  apps/api (8787)  →  MongoDB
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 9 (`packageManager` in root `package.json`)
- [MongoDB](https://www.mongodb.com/) running locally or a hosted URI

## Setup

```bash
pnpm install
```

1. **API** — copy `apps/api/.env.example` to `apps/api/.env` and fill in secrets (see [Environment variables](#environment-variables)).
2. **Web** — copy `apps/web/.env.example` to `apps/web/.env.local` and set public URLs for local dev.

A combined reference lives at [`.env.example`](.env.example) in the repo root.

## Development

From the repository root:

```bash
pnpm dev
```

This runs Turbo `dev` for all workspace apps (web on [http://localhost:3000](http://localhost:3000), API on [http://localhost:8787](http://localhost:8787)).

Other root scripts:

```bash
pnpm build   # production builds (web + api + packages)
pnpm lint    # ESLint in apps that define a lint task
```

## Environment variables

### `apps/web` (`.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API origin, e.g. `http://localhost:8787` (no trailing slash) |
| `NEXT_PUBLIC_WEB_URL` | Web app origin for auth redirects |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata and Open Graph |
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | Optional bot invite link; falls back to a default if unset |

### `apps/api` (`.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `API_URL` | Public API base URL (Better Auth `baseURL`) |
| `WEB_APP_ORIGIN` | Allowed browser origin for CORS and OAuth return |
| `BETTER_AUTH_SECRET` | Long random secret for session signing |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | Discord application client secret |
| `DISCORD_BOT_TOKEN` | Bot token for guild/member API calls |

## Discord Developer Portal

Create or use an application at [Discord Developer Portal](https://discord.com/developers/applications).

### OAuth2

Under **OAuth2 → Redirects**, add your API callback URL (Better Auth):

- Local: `http://localhost:8787/api/v1/auth/callback/discord`
- Production: `https://<api-host>/api/v1/auth/callback/discord`

Copy **Client ID** and **Client Secret** into `apps/api/.env`. Social sign-in uses callback `…/api/v1/auth/oauth-redirect`, which redirects back to the web app at `/auth/callback`.

### Bot

Under **Bot**, create a token and set `DISCORD_BOT_TOKEN` in `apps/api/.env`. Enable the intents your features need (e.g. guild-related scopes used by the dashboard).

### App links (store / verification)

Under **App settings → Links**:

- **Terms of Service URL**: `https://<your-domain>/terms`
- **Privacy Policy URL**: `https://<your-domain>/privacy`

Set `NEXT_PUBLIC_DISCORD_INVITE_URL` in the web app if you want a custom invite link on the marketing site.

## Legal pages

Terms and privacy content live under `apps/web`. Before publishing, confirm operator name, contact email, and effective dates in the locale JSON / article components, and have counsel review the text for your jurisdiction.

## Deploy

- **Web**: Vercel or any Node host; set all `NEXT_PUBLIC_*` vars to production HTTPS origins.
- **API**: Any Node host on port `8787` (or behind a reverse proxy); set `API_URL` and `WEB_APP_ORIGIN` to match production URLs.

Ensure `WEB_APP_ORIGIN` matches the deployed web URL exactly (scheme + host, no trailing slash).
