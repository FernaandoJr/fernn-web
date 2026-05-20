"use client"

import { useTranslations } from "next-intl"

import type { GuildChannel } from "@/lib/api-types"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function GuildFeatureEnabledField({
  id,
  labelKey,
  hintKey,
  checked,
  onCheckedChange,
}: {
  id: string
  labelKey: string
  hintKey: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{t(labelKey)}</Label>
        <p className="text-muted-foreground text-sm">{t(hintKey)}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

export function GuildChannelSelectField({
  value,
  onChange,
  channels,
  loading,
  labelKey,
  placeholderKey,
  noneKey,
  prefix = "#",
}: {
  value: string | null
  onChange: (channelId: string | null) => void
  channels: GuildChannel[] | undefined
  loading?: boolean
  labelKey: string
  placeholderKey: string
  noneKey: string
  prefix?: string
}) {
  const t = useTranslations()

  return (
    <div className="space-y-2">
      <Label>{t(labelKey)}</Label>
      <Select
        value={value ?? "none"}
        onValueChange={(v) => onChange(v === "none" ? null : v)}
        disabled={loading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t(placeholderKey)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{t(noneKey)}</SelectItem>
          {channels?.map((ch) => (
            <SelectItem key={ch.id} value={ch.id}>
              {prefix}
              {ch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
