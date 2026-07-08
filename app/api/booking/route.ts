import { NextResponse } from "next/server"
import { sendBookingConfirmationEmails } from "@/lib/booking-emails"
import {
  createBooking,
  isValidBookingDate,
  isValidSlot,
} from "@/lib/booking/composio-calendar"
import type { BookingFormPayload } from "@/lib/booking/types"

function isValidPayload(body: unknown): body is BookingFormPayload {
  if (!body || typeof body !== "object") return false

  const record = body as Record<string, unknown>
  return (
    typeof record.date === "string" &&
    typeof record.slotStart === "string" &&
    typeof record.fullName === "string" &&
    typeof record.email === "string" &&
    typeof record.usesPms === "string" &&
    typeof record.propertyCount === "string" &&
    typeof record.revenueRange === "string" &&
    record.fullName.trim().length > 0 &&
    record.email.trim().length > 0 &&
    record.usesPms.trim().length > 0 &&
    record.propertyCount.trim().length > 0 &&
    record.revenueRange.trim().length > 0
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Datos de reserva inválidos" }, { status: 400 })
    }

    if (!isValidEmail(body.email.trim())) {
      return NextResponse.json({ error: "Correo electrónico inválido" }, { status: 400 })
    }

    if (!isValidBookingDate(body.date)) {
      return NextResponse.json({ error: "Fecha fuera del calendario disponible" }, { status: 400 })
    }

    if (!isValidSlot(body.date, body.slotStart)) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 400 })
    }

    const payload: BookingFormPayload = {
      date: body.date,
      slotStart: body.slotStart,
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      usesPms: body.usesPms,
      propertyCount: body.propertyCount,
      revenueRange: body.revenueRange,
    }

    const result = await createBooking(payload)

    await sendBookingConfirmationEmails(payload, result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[booking/create]", error)
    const message = error instanceof Error ? error.message : "No se pudo crear la reserva"
    const status = message.includes("ya no está disponible") ? 409 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
