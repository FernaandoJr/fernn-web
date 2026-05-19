"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Check, Clock, X } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const timelineVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      default: "gap-4",
      compact: "gap-2",
      spacious: "gap-8",
    },
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row overflow-x-auto pb-4",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "vertical",
  },
})

const timelineItemVariants = cva("relative flex gap-3 pb-2", {
  variants: {
    orientation: {
      vertical: "flex-row",
      horizontal: "min-w-64 shrink-0 flex-col",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

const timelineConnectorVariants = cva("bg-border", {
  variants: {
    orientation: {
      vertical: "absolute top-9 left-3 h-full w-px",
      horizontal: "absolute top-3 left-8 h-px w-full",
    },
    status: {
      default: "bg-border",
      completed: "bg-primary",
      active: "bg-primary",
      pending: "bg-muted-foreground/30",
      error: "bg-destructive",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    status: "default",
  },
})

const timelineIconVariants = cva(
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background text-xs font-medium",
  {
    variants: {
      status: {
        default: "border-border text-muted-foreground",
        completed:
          "border-primary bg-primary text-primary-foreground",
        active: "border-primary bg-background text-primary animate-pulse",
        pending: "border-muted-foreground/30 text-muted-foreground",
        error: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

export type TimelineItemStatus =
  | "default"
  | "completed"
  | "active"
  | "pending"
  | "error"

export interface TimelineItemData {
  id: string
  title: string
  description?: string
  timestamp?: string | Date
  status?: TimelineItemStatus
  icon?: ReactNode
  content?: ReactNode
}

export interface TimelineProps extends VariantProps<typeof timelineVariants> {
  items: TimelineItemData[]
  className?: string
  showConnectors?: boolean
  showTimestamps?: boolean
  timestampPosition?: "top" | "bottom" | "inline"
}

function statusIcon(status: TimelineItemStatus | undefined) {
  switch (status) {
    case "completed":
      return <Check className="size-3" />
    case "active":
      return <Clock className="size-3" />
    case "pending":
      return <Clock className="size-3" />
    case "error":
      return <X className="size-3" />
    default:
      return <AlertCircle className="size-3 opacity-60" />
  }
}

function formatTimestamp(timestamp: string | Date): string {
  const date =
    typeof timestamp === "string" ? new Date(timestamp) : timestamp
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function Timeline({
  items,
  className,
  variant,
  orientation = "vertical",
  showConnectors = true,
  showTimestamps = true,
  timestampPosition = "top",
}: TimelineProps) {
  return (
    <div className={cn(timelineVariants({ variant, orientation }), className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(timelineItemVariants({ orientation }))}
        >
          {showConnectors && index < items.length - 1 ? (
            <div
              className={cn(
                timelineConnectorVariants({
                  orientation,
                  status: item.status,
                })
              )}
            />
          ) : null}

          <div className="relative z-10 flex shrink-0">
            <div
              className={cn(timelineIconVariants({ status: item.status }))}
            >
              {item.icon ?? statusIcon(item.status)}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {showTimestamps &&
            timestampPosition === "top" &&
            item.timestamp ? (
              <time className="text-muted-foreground text-xs">
                {formatTimestamp(item.timestamp)}
              </time>
            ) : null}

            <div className="flex items-start justify-between gap-2">
              <h3 className="leading-tight font-medium">{item.title}</h3>
              {showTimestamps &&
              timestampPosition === "inline" &&
              item.timestamp ? (
                <time className="text-muted-foreground shrink-0 text-xs">
                  {formatTimestamp(item.timestamp)}
                </time>
              ) : null}
            </div>

            {item.description ? (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            ) : null}

            {item.content ? <div>{item.content}</div> : null}

            {showTimestamps &&
            timestampPosition === "bottom" &&
            item.timestamp ? (
              <time className="text-muted-foreground text-xs">
                {formatTimestamp(item.timestamp)}
              </time>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

