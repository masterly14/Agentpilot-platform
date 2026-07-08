export type BookingSlot = {
  start: string
  label12h: string
  label24h: string
}

export type BookingFormPayload = {
  date: string
  slotStart: string
  fullName: string
  email: string
  phoneCountryCode: string
  phoneNumber: string
  companyName: string
  websiteUrl: string
  usesPms: string
  propertyCount: string
  revenueRange: string
}

export type AvailabilityResponse = {
  date: string
  slots: BookingSlot[]
  source: "composio" | "mock"
}

export type MonthAvailabilityResponse = {
  year: number
  month: number
  availableDays: number[]
  unavailableDays: number[]
  slotsByDate: Record<string, BookingSlot[]>
  source: "composio" | "mock"
}
export type BookingCreateResponse = {
  success: boolean
  source: "composio" | "mock"
  eventId?: string
  htmlLink?: string
  meetLink?: string
}
