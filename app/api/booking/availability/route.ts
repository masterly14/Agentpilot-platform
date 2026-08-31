import { NextResponse } from "next/server"
import { getDayAvailability, isValidBookingDate } from "@/lib/booking/composio-calendar"
import { meetingDurationMinutes, parseBookingKind } from "@/lib/booking/duration"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const durationMinutes = meetingDurationMinutes(parseBookingKind(searchParams.get("kind")))

    if (!date || !isValidBookingDate(date)) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const availability = await getDayAvailability(date, durationMinutes)
    return NextResponse.json(availability)
  } catch (error) {
    console.error("[booking/availability]", error)
    return NextResponse.json({ error: "No se pudieron cargar los horarios" }, { status: 500 })
  }
}
