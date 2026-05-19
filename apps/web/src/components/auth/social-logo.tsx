export function SocialLogo({
  src,
  alt,
  className = "size-5 shrink-0",
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <span
      className={`inline-block bg-foreground ${className}`}
      style={{
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
      role="img"
      aria-label={alt}
    />
  )
}
