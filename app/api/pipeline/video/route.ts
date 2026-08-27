import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAppUrl } from "@/lib/ebook/app-url"

export const runtime = "nodejs"

function videoRedirectUrl(token?: string) {
  const url = new URL("/video", getAppUrl())
  if (token) url.searchParams.set("lead", token)
  return url.toString()
}

async function recordVideo(token: string) {
  const submission = await prisma.formSubmission.findUnique({
    where: { pdfToken: token },
    select: { id: true, contactId: true },
  })
  if (!submission) return false

  // Validar el token antes de propagarlo a la página; abrir el enlace no emite eventos de marketing.
  return true
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim()
  let isKnownLead = false
  if (token) {
    try {
      isKnownLead = await recordVideo(token)
    } catch (error) {
      console.error("[pipeline/video]", error)
    }
  }
  return NextResponse.redirect(videoRedirectUrl(isKnownLead ? token : undefined))
}

export async function POST(request: Request) {
  const urlToken = new URL(request.url).searchParams.get("token")?.trim()
  let bodyToken = ""
  try {
    const body = (await request.json()) as { token?: unknown }
    if (typeof body.token === "string") bodyToken = body.token.trim()
  } catch {
    bodyToken = ""
  }

  const token = bodyToken || urlToken
  if (!token) {
    return NextResponse.json({ error: "token requerido" }, { status: 400 })
  }

  const recorded = await recordVideo(token)
  return NextResponse.json({ success: recorded })
}
