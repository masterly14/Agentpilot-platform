export function toBogotaDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ""
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`
}

export function fromBogotaDatetimeLocal(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  const date = new Date(`${trimmed}:00-05:00`)
  if (Number.isNaN(date.getTime())) return null
  return date
}
