"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Suspense, useEffect } from "react"
import { toast } from "sonner"

import { SignInForm } from "@/components/auth/sign-in-form"
import { ScrollArea } from "@/components/ui/scroll-area"

function OAuthCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations()

  useEffect(() => {
    if (searchParams.get("error") === "callback") {
      toast.error(t("auth.callbackError"))
      router.replace("/auth/sign-in")
    }
  }, [searchParams, router, t])

  return null
}

export default function SignInPage() {
  const t = useTranslations()

  return (
    <>
      <Suspense>
        <OAuthCallbackHandler />
      </Suspense>
      <header className="border-border/60 relative z-10 border-b px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          fernn
        </Link>
      </header>
      <ScrollArea className="relative z-10 flex-1">
        <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-lg items-center justify-center p-6 sm:p-10">
          <div className="border-border/80 bg-card/90 w-full rounded-2xl border p-6 shadow-lg backdrop-blur-sm sm:p-8">
            <SignInForm />
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
