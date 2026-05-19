export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <div className="from-primary/10 via-background to-background pointer-events-none absolute inset-0 bg-gradient-to-br" />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  )
}
