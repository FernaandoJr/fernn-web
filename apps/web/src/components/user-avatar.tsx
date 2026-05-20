"use client"

import { useMemo } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  renderIdenticonToDataUrl,
  type IdenticonScheme,
} from "@/lib/identicon/render-bayer4"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function UserAvatar({
  userId,
  name,
  image,
  className,
  scheme = "oklch-mono",
}: {
  userId: string
  name: string
  image?: string | null
  className?: string
  scheme?: IdenticonScheme
}) {
  const identiconSrc = useMemo(
    () => renderIdenticonToDataUrl(userId, 32, scheme),
    [userId, scheme],
  )

  const src = image || identiconSrc

  return (
    <Avatar className={cn("size-8 rounded-md", className)}>
      <AvatarImage
        src={src}
        alt={name}
        className={cn(
          "rounded-md",
          !image && "image-rendering-pixelated",
        )}
      />
      <AvatarFallback className="rounded-md">{initials(name)}</AvatarFallback>
    </Avatar>
  )
}
