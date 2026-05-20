"use client"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardShell({
  title,
  description,
  children,
  actions,
  inset = false,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  inset?: boolean
}) {
  return (
    <>
      <header className="flex border-b p-2">
        <div className="flex w-full items-center justify-center gap-1 lg:gap-2 lg:px-6">
          <SidebarTrigger className="cursor-pointer" />
          <div className="flex justify-center">
            <Separator orientation="vertical" className="mx-2 h-4" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="truncate text-base font-medium">{title}</h1>
              {description ? (
                <p className="text-muted-foreground truncate text-xs">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <LocaleSwitcher />
              {actions}
            </div>
          </div>
        </div>
      </header>
      <div
        className={
          inset
            ? "flex flex-1 flex-col"
            : "flex flex-1 flex-col gap-4 p-4 md:p-6"
        }
      >
        {children}
      </div>
    </>
  )
}
