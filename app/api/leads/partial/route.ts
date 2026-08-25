import { NextResponse } from "next/server"
import { generatePdfToken } from "@/lib/ebook/token"
import {
  hasPersistableLeadData,
  isPartialBookingFlow,
  isPartialEntrySource,
  leadFormToPrismaData,
  parsePartialLeadFields,
} from "@/lib/partial-leads"
import { prisma } from "@/lib/prisma"
import { applyFirstTouchAttribution, attributionFromRequest } from "@/lib/marketing/attribution"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 })
    }

    const record = body as Record<string, unknown>
    if (!isPartialEntrySource(record.entrySource)) {
      return NextResponse.json({ error: "Origen inválido" }, { status: 400 })
    }

    const fields = leadFormToPrismaData(parsePartialLeadFields(record.fields))
    if (!hasPersistableLeadData(fields)) {
      return NextResponse.json({ error: "Sin datos para guardar" }, { status: 400 })
    }

    const bookingFlow = isPartialBookingFlow(record.bookingFlow) ? record.bookingFlow : undefined
    const requestedToken = typeof record.token === "string" ? record.token.trim() : ""
    const attribution = attributionFromRequest(request, body)

    const existing = requestedToken
      ? await prisma.formSubmission.findUnique({ where: { pdfToken: requestedToken } })
      : null

    if (existing?.status === "PARTIAL") {
      const submission = await prisma.formSubmission.update({
        where: { id: existing.id },
        data: {
          ...fields,
          ...(bookingFlow ? { bookingFlow } : {}),
        },
        select: { id: true, pdfToken: true, status: true },
      })
      await applyFirstTouchAttribution(submission.id, attribution)

      return NextResponse.json({
        success: true,
        id: submission.id,
        token: submission.pdfToken,
        status: submission.status,
      })
    }

    const submission = await prisma.formSubmission.create({
      data: {
        ...fields,
        pdfToken: generatePdfToken(),
        entrySource: record.entrySource,
        bookingFlow,
        status: "PARTIAL",
      },
      select: { id: true, pdfToken: true, status: true },
    })
    await applyFirstTouchAttribution(submission.id, attribution)

    return NextResponse.json({
      success: true,
      id: submission.id,
      token: submission.pdfToken,
      status: submission.status,
    })
  } catch (error) {
    console.error("[leads/partial]", error)
    return NextResponse.json({ error: "No se pudo guardar el avance" }, { status: 500 })
  }
}
