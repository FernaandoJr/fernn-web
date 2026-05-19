"use client"

import { LayoutDashboard, Server, User, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"

import { useUser } from "@/auth"
import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NAV_ITEMS: { titleKey: string; url: string; icon: LucideIcon }[] = [
  {
    titleKey: "dashboard.nav.overview",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "dashboard.nav.guilds",
    url: "/dashboard/guilds",
    icon: Server,
  },
  {
    titleKey: "dashboard.nav.profile",
    url: "/dashboard/profile",
    icon: User,
  },
]

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
  const t = useTranslations()
  const { user, isLoading } = useUser()

  const items = NAV_ITEMS.map((item) => ({
    title: t(item.titleKey),
    url: item.url,
    icon: item.icon,
  }))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-sm font-bold">
                  f
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">fernn</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {t("dashboard.sidebarTagline")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label={t("dashboard.nav.platform")} items={items} />
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: user.image ?? "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
