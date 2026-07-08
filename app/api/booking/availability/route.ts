import { NextResponse } from "next/server"
import { getDayAvailability, isValidBookingDate } from "@/lib/booking/composio-calendar"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date || !isValidBookingDate(date)) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const availability = await getDayAvailability(date)
    return NextResponse.json(availability)
  } catch (error) {
    console.error("[booking/availability]", error)
    return NextResponse.json({ error: "No se pudieron cargar los horarios" }, { status: 500 })
  }
}
