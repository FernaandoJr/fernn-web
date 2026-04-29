import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { HomeMarketingSections } from "@/components/home-marketing-sections"
import { HeroSection } from "@/components/ui/glass-video-hero"
import { getDiscordInviteUrl } from "@/lib/discord"

export default async function Home() {
  const inviteUrl = getDiscordInviteUrl()

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection inviteUrl={inviteUrl} />
        <HomeMarketingSections />
      </main>
      <SiteFooter />
    </>
  )
}
