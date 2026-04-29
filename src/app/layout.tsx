import type { Metadata } from "next"
import { Cabin, Geist, Geist_Mono, Instrument_Serif, Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import "./globals.css"
import { htmlLangAttribute } from "@/lib/i18n/server"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "fernn — Discord bot",
    template: "%s — fernn",
  },
  description:
    "Invite fernn: a slash-command Discord bot for moderation, utilities, and server logging (Bun, TypeScript, discord.js). Terms and Privacy linked on-site.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={htmlLangAttribute(locale)}
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
        cabin.variable,
        instrumentSerif.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
