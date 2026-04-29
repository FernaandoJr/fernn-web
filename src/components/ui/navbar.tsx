"use client"

import { FolderGit2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import * as React from "react"

import { LocaleSwitcher } from "@/components/locale-switcher"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type NavCategory = {
  name: string
  items: { href: string; label: string }[]
}

export type NavbarProps = {
	nav: NavCategory[]
	className?: string
}

function NavTextLink({
	href,
	className,
	children,
	onClick,
}: {
	href: string
	className?: string
	children: React.ReactNode
	onClick?: () => void
}) {
	const internal = href.startsWith("/") && !href.startsWith("//")
	if (internal) {
		return (
			<Link href={href} className={className} onClick={onClick}>
				{children}
			</Link>
		)
	}
	return (
		<a
			href={href}
			className={className}
			onClick={onClick}
			target="_blank"
			rel="noopener noreferrer">
			{children}
		</a>
	)
}

export function MobileNav({
	nav,
	toggleSr,
}: {
	nav: NavCategory[]
	toggleSr: string
}) {
	const [open, setOpen] = React.useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className={cn(
						"extend-touch-target flex size-8 touch-manipulation items-center justify-center gap-2.5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent md:hidden dark:hover:bg-transparent"
					)}>
					<div className="relative flex items-center justify-center">
						<div className="relative size-4">
							<span
								className={cn(
									"absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
									open ? "top-[0.4rem] -rotate-45" : "top-1"
								)}
							/>
							<span
								className={cn(
									"absolute left-0 block h-0.5 w-4 bg-foreground transition-all duration-100",
									open ? "top-[0.4rem] rotate-45" : "top-2.5"
								)}
							/>
						</div>
						<span className="sr-only">{toggleSr}</span>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"h-(--radix-popover-content-available-height) w-(--radix-popover-content-available-width) overflow-y-auto rounded-none border-none bg-background/90 p-0 shadow-none backdrop-blur-md duration-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
					"data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
				)}
				align="start"
				side="bottom"
				alignOffset={-16}
				sideOffset={4}>
				<div className="flex flex-col gap-12 overflow-auto px-6 py-6">
					{nav.map((category) => (
						<div
							className="flex flex-col gap-4"
							key={category.name}>
							<p className="text-sm font-medium text-muted-foreground">
								{category.name}
							</p>
							<div className="flex flex-col gap-3">
								{category.items.map((item) => (
									<NavTextLink
										key={`${category.name}-${item.href}`}
										href={item.href}
										className="text-2xl font-medium text-foreground"
										onClick={() => setOpen(false)}>
										{item.label}
									</NavTextLink>
								))}
							</div>
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}

export function Navbar({ nav, className }: NavbarProps) {
	const t = useTranslations()
	const primary = nav[0]

	return (
		<header
			className={cn(
				"mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6",
				className
			)}>
			<Link
				href="/"
				className="shrink-0 text-lg font-semibold tracking-tight text-foreground">
				fernn
			</Link>

			<div className="hidden max-w-full flex-1 items-center justify-start md:flex">
				<NavigationMenu viewport={false}>
					<NavigationMenuList className="flex-wrap justify-start gap-0.5">
						{primary.items.map((link) => (
							<NavigationMenuItem key={link.href}>
								<NavigationMenuLink asChild>
									{link.href.startsWith("/") &&
									!link.href.startsWith("//") ? (
										<Link
											href={link.href}
											className="rounded-md px-3 py-1.5 font-medium data-[active=true]:bg-muted/50">
											{link.label}
										</Link>
									) : (
										<a
											href={link.href}
											className="rounded-md px-3 py-1.5 font-medium data-[active=true]:bg-muted/50"
											target="_blank"
											rel="noopener noreferrer">
											{link.label}
										</a>
									)}
								</NavigationMenuLink>
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</div>

			<div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
				<LocaleSwitcher />
				<MobileNav nav={nav} toggleSr={t("a11y.toggleMenu")} />
				<a
					href="https://github.com/FernaandoJr/fernn"
					target="_blank"
					rel="noopener noreferrer"
					aria-label={t("a11y.github")}
					className={cn(
						buttonVariants({ variant: "ghost", size: "icon" }),
						"text-accent-foreground dark:hover:bg-accent [&_svg:not([class*='size-'])]:size-6"
					)}>
					<FolderGit2 className="size-6" />
				</a>
				<Button
					asChild
					variant="secondary"
					size="sm"
					className="hidden sm:inline-flex">
					<Link href="/terms">{t("footer.terms")}</Link>
				</Button>
				<Button asChild size="sm" className="hidden sm:inline-flex">
					<Link href="/privacy">{t("footer.privacy")}</Link>
				</Button>
			</div>
		</header>
	)
}
