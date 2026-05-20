"use client"

import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { useEffect, useState, type ComponentProps } from "react"
import { createPortal } from "react-dom"

import { useUser } from "@/auth"
import { MenuToggleIcon } from "@/components/header/menu-toggle-icon"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  disableSticky?: boolean
}

export function Header({ disableSticky = false }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const t = useTranslations()
  const { user } = useUser()
  const isLoggedIn = !!user

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      className={cn(
        "z-50 w-full border-b border-border bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/50",
        !disableSticky && "fixed top-0 right-0 left-0",
        disableSticky && "relative",
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 select-none">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2 rounded-md p-2">
            <Image
              src="/fernn.png"
              alt="Fernn"
              width={24}
              height={24}
              className="size-6 rounded-md object-cover"
            />
            <span className="text-lg font-medium">Fernn</span>
          </Link>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button variant="link" className="cursor-pointer">
                {t("nav.dashboard")}
              </Button>
            </Link>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/sign-in">{t("nav.signIn")}</Link>
            </Button>
          )}
          <LocaleSwitcher />
          <ModeToggle />
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(!open)}
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t("a11y.toggleMenu")}
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </Button>
      </nav>
      <MobileMenu open={open} className="flex flex-col gap-4 overflow-y-auto">
        <div className="grid w-full gap-2">
          {isLoggedIn ? (
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                {t("nav.dashboard")}
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                {t("nav.signIn")}
              </Link>
            </Button>
          )}
          <LocaleSwitcher className="w-full" />
          <ModeToggle menuState className="w-full" />
        </div>
      </MobileMenu>
    </header>
  )
}

type MobileMenuProps = ComponentProps<"div"> & {
  open: boolean
}

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/50 backdrop-blur-lg",
        "fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden",
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
