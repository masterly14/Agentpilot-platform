import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { getChatMessageForMedia } from "@/lib/admin/chat-record"
import { getWhatsAppMediaBuffer } from "@/lib/whatsapp/client"

export const runtime = "nodejs"
export const maxDuration = 30

export async function GET(
  _request: Request,
  context: { params: Promise<{ messageId: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }

  const { messageId } = await context.params
  const message = await getChatMessageForMedia(messageId)
  if (!message?.mediaId) {
    return NextResponse.json({ error: "Adjunto no disponible" }, { status: 404 })
  }

  const media = await getWhatsAppMediaBuffer(message.mediaId)
  if (!media) {
    return NextResponse.json({ error: "Adjunto no disponible" }, { status: 410 })
  }

  const filename = message.mediaFilename || `whatsapp-${message.id}`
  return new NextResponse(new Uint8Array(media.buffer), {
    status: 200,
    headers: {
      "Content-Type": media.mimeType || message.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=300",
    },
  })
}
