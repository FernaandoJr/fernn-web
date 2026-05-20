import { Header } from "@/components/header"

export function SiteHeader({
  disableSticky,
}: {
  disableSticky?: boolean
} = {}) {
  return <Header disableSticky={disableSticky} />
}
