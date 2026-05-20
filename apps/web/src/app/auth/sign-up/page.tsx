"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { SignUpForm } from "@/components/auth/sign-up-form"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SignUpPage() {
  const t = useTranslations()

  return (
    <>
      <header className="border-border/60 relative z-10 border-b px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          fernn
        </Link>
      </header>
      <ScrollArea className="relative z-10 flex-1">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-lg items-center justify-center p-6 sm:p-10">
          <div className="border-border/80 bg-card/90 w-full rounded-md border p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <SignUpForm />
            <p className="text-muted-foreground mt-6 text-center text-xs">
              <Link href="/terms" className="hover:text-foreground underline">
                {t("footer.terms")}
              </Link>
              {" · "}
              <Link href="/privacy" className="hover:text-foreground underline">
                {t("footer.privacy")}
              </Link>
            </p>
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
