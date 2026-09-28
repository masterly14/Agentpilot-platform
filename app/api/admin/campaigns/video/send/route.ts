import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { WHATSAPP_VIDEO_MAX_BYTES } from "@/lib/campaigns/constants"
import { sendVideoOutreach } from "@/lib/campaigns/video-outreach"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const form = await request.formData()
  const leadId = String(form.get("leadId") ?? "").trim()
  const video = form.get("video")

  if (!leadId) {
    return NextResponse.json({ error: "Selecciona un lead." }, { status: 400 })
  }
  if (!(video instanceof File) || video.size === 0) {
    return NextResponse.json({ error: "Adjunta un video." }, { status: 400 })
  }
  if (video.size > WHATSAPP_VIDEO_MAX_BYTES) {
    return NextResponse.json({ error: "El video supera el límite de 16 MB de WhatsApp." }, { status: 400 })
  }

  const bytes = new Uint8Array(await video.arrayBuffer())

  try {
    const result = await sendVideoOutreach({
      leadId,
      video: {
        bytes,
        filename: video.name || "video.mp4",
        mimeType: video.type || "video/mp4",
      },
    })
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo enviar la campaña." },
      { status: 502 },
    )
  }
}
