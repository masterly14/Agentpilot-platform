import { NextResponse } from "next/server"
import { stampEbookPdf } from "@/lib/ebook/stamp-pdf"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const maxDuration = 60

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("lead")?.trim()
  if (!token) {
    return NextResponse.json({ error: "Token inválido" }, { status: 400 })
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { pdfToken: token },
    select: { id: true },
  })

  if (!submission) {
    return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 })
  }

  try {
    const pdfBytes = await stampEbookPdf(token)
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="guia-agent-pilot.pdf"',
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("[ebook/download]", error)
    return NextResponse.json({ error: "No se pudo generar la guía" }, { status: 500 })
  }
}
