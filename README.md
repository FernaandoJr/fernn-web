# fernn-web

Public **Terms of Service** and **Privacy Policy** site for the [fernn](https://github.com/FernaandoJr/fernn) Discord bot, built with **Next.js**, **shadcn/ui** (Luma style), and Tailwind CSS v4.

## Before you publish

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to your production origin (no trailing slash).
2. Legal pages list **Fernando Divino de Mores Júnior** as operator, **contact@fernaandojr.dev** for contact, effective **14 April 2026**. Update those files if your details change.
3. Have qualified counsel review the legal text for your jurisdiction.

## Discord Developer Portal

In your Discord application: **App settings → Links**, set:

- **Terms of Service URL**: `https://<your-domain>/terms`
- **Privacy Policy URL**: `https://<your-domain>/privacy`

## Theme

- **Luma**: initialized with `npx shadcn@latest init -f -b radix -p luma` ([Luma introduction](https://ui.shadcn.com/docs/changelog/2026-03-luma)).
- **Colors**: CSS variables in [`src/app/globals.css`](src/app/globals.css) mirror the bot palette from [fernn `src/constants/colors.ts`](https://github.com/FernaandoJr/fernn/blob/main/src/constants/colors.ts) (`#c30698` primary, `#7a4580` secondary, `#121f4e` info, etc.). Utilities: `text-fernn-success`, `bg-fernn-info`, etc.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Deploy

Deploy to Vercel or any Node host. Set `NEXT_PUBLIC_SITE_URL` in the host environment to your canonical HTTPS origin so Open Graph and canonical URLs resolve correctly.
