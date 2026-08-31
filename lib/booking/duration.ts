import { bookingConfig } from "@/lib/booking/config"

export type BookingMeetingKind = "sql" | "mql" | "demo"

export function parseBookingKind(value: string | null | undefined): BookingMeetingKind {
  if (value === "mql" || value === "demo" || value === "sql") return value
  return "sql"
}

export function meetingDurationMinutes(kind: BookingMeetingKind): number {
  if (kind === "sql") return bookingConfig.sqlDurationMinutes
  if (kind === "demo") return bookingConfig.demoDurationMinutes
  return bookingConfig.mqlDurationMinutes
}

export function occupancyStepMinutes(kind: BookingMeetingKind): number {
  return meetingDurationMinutes(kind) + bookingConfig.bufferMinutes
}

export function diagnosisKindFromQualification(
  qualification: "SQL" | "MQL" | "DISQUALIFIED" | null | undefined
): Exclude<BookingMeetingKind, "demo"> {
  return qualification === "SQL" ? "sql" : "mql"
}

export function diagnosisDurationMinutes(
  qualification: "SQL" | "MQL" | "DISQUALIFIED" | null | undefined
): number {
  return meetingDurationMinutes(diagnosisKindFromQualification(qualification))
}

export function meetingKindForPipeline(input: {
  currentStage?: string | null
  funnelOrigin?: string | null
  qualification?: "SQL" | "MQL" | "DISQUALIFIED" | null
}): BookingMeetingKind {
  if (input.currentStage === "PRE_DEMO") return "demo"
  if (input.funnelOrigin === "SQL" || input.qualification === "SQL") return "sql"
  if (input.funnelOrigin === "MQL" || input.qualification === "MQL") return "mql"
  return diagnosisKindFromQualification(input.qualification)
}
