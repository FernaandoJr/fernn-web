"use client"

import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder,
  autoComplete,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  placeholder: string
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"]
  className?: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute top-1/2 right-1 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="text-muted-foreground size-4" />
        ) : (
          <Eye className="text-muted-foreground size-4" />
        )}
      </Button>
    </div>
  )
}

