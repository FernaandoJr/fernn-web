"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ModeToggle({
  className,
  menuState,
}: {
  className?: string
  menuState?: boolean
}) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className={cn("cursor-pointer", className)}>
        <Moon className="size-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("cursor-pointer", menuState && "w-full", className)}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-[1.2rem] dark:hidden" />
      <Moon className="hidden size-[1.2rem] dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
