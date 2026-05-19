"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { authClient, getOAuthRedirectUrl, useSignIn } from "@/auth"
import { PasswordInput } from "@/components/auth/password-input"
import { SocialLogo } from "@/components/auth/social-logo"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface SignInFormValues {
  email: string
  password: string
}

export function SignInForm() {
  const [discordLoading, setDiscordLoading] = useState(false)
  const t = useTranslations()
  const { mutate: signIn, isPending: isSubmitting } = useSignIn()

  const signInSchema = useMemo(
    () =>
      z.object({
        email: z
          .email(t("auth.validationEmailInvalid"))
          .min(1, t("auth.validationEmailRequired")),
        password: z.string().min(6, t("auth.validationPasswordMin")),
      }),
    [t]
  )

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })

  const handleDiscordSignIn = async () => {
    setDiscordLoading(true)
    const { data, error } = await authClient.signIn.social({
      provider: "discord",
      callbackURL: getOAuthRedirectUrl(),
    })
    setDiscordLoading(false)
    if (error) {
      toast.error(error.message ?? t("auth.discordSignInFailed"))
      return
    }
    if (data?.url) window.location.href = data.url
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-primary text-sm font-medium tracking-wide uppercase">
          fernn
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
          {t("auth.welcome")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("auth.accessYourAccount")}
        </p>
      </div>

      <Form {...form}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) =>
            signIn({ email: values.email, password: values.password })
          )}
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.emailAddress")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("auth.enterEmail")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.password")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("auth.enterPassword")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || discordLoading}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                {t("auth.signingIn")}
              </>
            ) : (
              t("auth.signIn")
            )}
          </Button>
        </form>
      </Form>

      <div className="relative flex items-center justify-center">
        <span className="border-border w-full border-t" />
        <span className="text-muted-foreground bg-background absolute px-3 text-xs">
          {t("auth.orContinueWith")}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleDiscordSignIn}
        disabled={discordLoading || isSubmitting}
      >
        {discordLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <SocialLogo src="/logo/discord.svg" alt="Discord" />
        )}
        {t("auth.continueWithDiscord")}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        {t("auth.newToPlatform")}{" "}
        <Link href="/auth/sign-up" className="text-primary hover:underline">
          {t("auth.createAccount")}
        </Link>
      </p>
    </div>
  )
}
