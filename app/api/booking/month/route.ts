import { NextResponse } from "next/server"
import { BOOKING_MONTH, BOOKING_YEAR } from "@/lib/booking/config"
import { getMonthAvailability } from "@/lib/booking/composio-calendar"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = Number(searchParams.get("year") ?? BOOKING_YEAR)
    const month = Number(searchParams.get("month") ?? BOOKING_MONTH)

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: "Parámetros de mes inválidos" }, { status: 400 })
    }

    const availability = await getMonthAvailability(year, month)
    return NextResponse.json(availability)
  } catch (error) {
    console.error("[booking/month]", error)
    return NextResponse.json({ error: "No se pudo cargar la disponibilidad del mes" }, { status: 500 })
  }
}
