import type { Metadata } from "next"
import {
  Cabin,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { htmlLangAttribute } from "@/lib/i18n/server"
import { cn } from "@/lib/utils"
import { getSiteUrl } from "@/lib/site"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

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
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        plusJakarta.variable,
        inter.variable,
        jetbrainsMono.variable,
        "font-sans",
        cabin.variable,
        instrumentSerif.variable
      )}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              {children}
              <Toaster richColors position="top-center" />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
