"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { authClient, getOAuthRedirectUrl, useSignUp } from "@/auth"
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

interface SignUpFormValues {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignUpForm() {
  const [discordLoading, setDiscordLoading] = useState(false)
  const t = useTranslations()
  const { mutate: signUp, isPending: isSubmitting } = useSignUp()

  const signUpSchema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t("auth.validationNameRequired")),
          email: z
            .email(t("auth.validationEmailInvalid"))
            .min(1, t("auth.validationEmailRequired")),
          password: z.string().min(8, t("auth.validationPasswordMin")),
          confirmPassword: z.string().min(1, t("auth.validationPasswordMin")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.validationPasswordMatch"),
          path: ["confirmPassword"],
        }),
    [t]
  )

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
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
          {t("auth.createAccountTitle")}
        </h1>
      </div>

      <Form {...form}>
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) =>
            signUp({
              name: values.name,
              email: values.email,
              password: values.password,
            })
          )}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("auth.enterName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder={t("auth.enterPassword")}
                    autoComplete="new-password"
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
                {t("auth.signingUp")}
              </>
            ) : (
              t("auth.createAccount")
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
        {t("auth.alreadyHaveAccount")}{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline">
          {t("auth.signIn")}
        </Link>
      </p>
    </div>
  )
}
