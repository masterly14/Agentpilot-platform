import { NextResponse } from "next/server"
import { isAdminAuthenticated, unauthorizedResponse } from "@/lib/admin-auth"
import { resolveDiagnosisWhatsAppContact } from "@/lib/admin/diagnosis-leads"
import { buildDiagnosisPdf, diagnosisWhatsAppCaption } from "@/lib/admin/diagnosis-pdf"
import { hydrateLeakMap } from "@/lib/admin/leak-map"
import { sendWhatsAppDocument } from "@/lib/whatsapp/send-template"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return unauthorizedResponse()

  const body = (await request.json()) as {
    state?: unknown
    submissionId?: unknown
    airbnbLeadId?: unknown
  }
  const submissionId = typeof body.submissionId === "string" && body.submissionId ? body.submissionId : null
  const airbnbLeadId = typeof body.airbnbLeadId === "string" && body.airbnbLeadId ? body.airbnbLeadId : null

  if (!submissionId && !airbnbLeadId) {
    return NextResponse.json({ error: "Selecciona el lead de esta reunión antes de enviar." }, { status: 400 })
  }
  if (submissionId && airbnbLeadId) {
    return NextResponse.json({ error: "El diagnóstico solo puede ligarse a un lead." }, { status: 400 })
  }

  const contact = await resolveDiagnosisWhatsAppContact({ submissionId, airbnbLeadId })
  if (!contact?.phoneE164) {
    return NextResponse.json(
      { error: "Este lead no tiene un número de WhatsApp registrado." },
      { status: 400 },
    )
  }

  const state = hydrateLeakMap(body.state)
  const { bytes, filename, model } = await buildDiagnosisPdf(state)

  try {
    const sent = await sendWhatsAppDocument({
      contact,
      bytes,
      filename,
      caption: diagnosisWhatsAppCaption(model),
    })
    return NextResponse.json({
      success: true,
      messageId: sent.messageId,
      to: contact.phoneE164,
      filename,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo enviar por WhatsApp." },
      { status: 502 },
    )
  }
}
