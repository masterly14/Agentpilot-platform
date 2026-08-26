"use client"

import { ChevronDown, Globe } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { bookingConfig } from "@/lib/booking/config"
import {
  formatTimezoneLabel,
  getBookingTimezoneOptions,
} from "@/lib/booking/timezone"
import { cn } from "@/lib/utils"

export function BookingTimezonePicker({
  value,
  onChange,
  variant,
}: {
  value: string
  onChange: (timeZone: string) => void
  variant: "dark" | "light"
}) {
  const options = getBookingTimezoneOptions(value)
  const isDark = variant === "dark"

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        size="sm"
        aria-label="Zona horaria"
        className={cn(
          "h-auto w-full max-w-full border-0 bg-transparent p-0 shadow-none",
          "gap-2 rounded-none text-sm whitespace-normal",
          "focus-visible:border-0 focus-visible:ring-0",
          "data-[size=sm]:h-auto",
          "[&>svg:last-child]:hidden",
          isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-900"
        )}
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">
          {formatTimezoneLabel(value)}
        </span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0", isDark ? "text-zinc-500" : "text-zinc-400")}
        />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-72",
          isDark && "border-zinc-700 bg-zinc-900 text-zinc-100"
        )}
      >
        {options.map((timeZone) => (
          <SelectItem
            key={timeZone}
            value={timeZone}
            className={cn(isDark && "focus:bg-zinc-800 focus:text-white")}
          >
            {formatTimezoneLabel(timeZone)}
            {timeZone === bookingConfig.timezone ? " · sede" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
