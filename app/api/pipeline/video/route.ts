import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { MARKETING_TRIGGERED_BY, recordMarketingStage } from "@/lib/marketing/events"
import { markVideoWatched } from "@/lib/pipeline/engine"

export const runtime = "nodejs"

function videoRedirectUrl() {
  return process.env.PIPELINE_VIDEO_URL?.trim() || "https://santiagovaron.com/diagnostico"
}

async function recordVideo(token: string) {
  const submission = await prisma.formSubmission.findUnique({
    where: { pdfToken: token },
    select: { id: true, contactId: true },
  })
  if (!submission) return false

  if (submission.contactId) {
    const pipeline = await prisma.leadPipeline.findUnique({
      where: { contactId: submission.contactId },
      select: { id: true },
    })
    if (pipeline) {
      await markVideoWatched(submission.contactId)
      return true
    }
  }

  await recordMarketingStage({
    submissionId: submission.id,
    to: "VIDEO_SENT",
    triggeredBy: MARKETING_TRIGGERED_BY.system,
  })
  return true
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim()
  if (token) {
    try {
      await recordVideo(token)
    } catch (error) {
      console.error("[pipeline/video]", error)
    }
  }
  return NextResponse.redirect(videoRedirectUrl())
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
