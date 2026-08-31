import { NextResponse } from "next/server"
import { BOOKING_MONTH, BOOKING_YEAR } from "@/lib/booking/config"
import { getMonthAvailability } from "@/lib/booking/composio-calendar"
import { meetingDurationMinutes, parseBookingKind } from "@/lib/booking/duration"
import { isBookableMonth } from "@/lib/booking/rules"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = Number(searchParams.get("year") ?? BOOKING_YEAR)
    const month = Number(searchParams.get("month") ?? BOOKING_MONTH)
    const durationMinutes = meetingDurationMinutes(parseBookingKind(searchParams.get("kind")))

    if (!isBookableMonth(year, month)) {
      return NextResponse.json({ error: "Parámetros de mes inválidos" }, { status: 400 })
    }

    const availability = await getMonthAvailability(year, month, durationMinutes)
    return NextResponse.json(availability)
  } catch (error) {
    console.error("[booking/month]", error)
    return NextResponse.json({ error: "No se pudo cargar la disponibilidad del mes" }, { status: 500 })
  }
}
