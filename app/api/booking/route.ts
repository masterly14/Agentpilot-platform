import { NextResponse } from "next/server"
import { sendBookingConfirmationEmails } from "@/lib/booking-emails"
import {
  createBooking,
  isValidBookingDate,
  isValidSlot,
} from "@/lib/booking/composio-calendar"
import { isValidPhoneNumber } from "@/lib/booking/phone-countries"
import type { BookingFormPayload } from "@/lib/booking/types"

function isValidPayload(body: unknown): body is BookingFormPayload {
  if (!body || typeof body !== "object") return false

  const record = body as Record<string, unknown>
  return (
    typeof record.date === "string" &&
    typeof record.slotStart === "string" &&
    typeof record.fullName === "string" &&
    typeof record.email === "string" &&
    typeof record.phoneCountryCode === "string" &&
    typeof record.phoneNumber === "string" &&
    typeof record.companyName === "string" &&
    typeof record.websiteUrl === "string" &&
    typeof record.usesPms === "string" &&
    typeof record.propertyCount === "string" &&
    typeof record.revenueRange === "string" &&
    record.fullName.trim().length > 0 &&
    record.email.trim().length > 0 &&
    record.phoneCountryCode.trim().length > 0 &&
    isValidPhoneNumber(record.phoneNumber) &&
    record.usesPms.trim().length > 0 &&
    record.propertyCount.trim().length > 0 &&
    record.revenueRange.trim().length > 0
  )
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidOptionalUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true

  try {
    const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    const url = new URL(normalized)
    return Boolean(url.hostname.includes("."))
  } catch {
    return false
  }
}

function normalizeWebsiteUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ""
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
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

    if (!isValidOptionalUrl(body.websiteUrl)) {
      return NextResponse.json({ error: "Enlace de página web inválido" }, { status: 400 })
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
      phoneCountryCode: body.phoneCountryCode.trim(),
      phoneNumber: body.phoneNumber.replace(/\D/g, ""),
      companyName: body.companyName.trim(),
      websiteUrl: normalizeWebsiteUrl(body.websiteUrl),
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
