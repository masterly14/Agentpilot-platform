import { getResendFromAddress } from "@/lib/email"
import { resend } from "@/lib/resend"
import type { ReplyIntent } from "@/lib/pipeline/replies"
import type { PipelineState } from "@/prisma/generated/client"

export async function notifyNurtureHandoff(input: {
  contactName: string
  phone: string
  state: PipelineState
  intent: ReplyIntent
  message: string | null
}) {
  const to = process.env.NOTIFICATION_EMAIL?.trim()
  if (!to) {
    console.warn("[pipeline] NOTIFICATION_EMAIL vacío; no se notifica handoff", {
      phone: input.phone,
      state: input.state,
      intent: input.intent,
    })
    return
  }

  const subject =
    input.intent === "guide_missing"
      ? `WhatsApp: ${input.contactName} no recibió la guía`
      : `WhatsApp: ${input.contactName} tiene dudas (${input.state})`

  try {
    await resend.emails.send({
      from: getResendFromAddress(),
      to,
      subject,
      text: [
        `Lead: ${input.contactName}`,
        `Teléfono: ${input.phone}`,
        `Estado: ${input.state}`,
        `Intención: ${input.intent}`,
        `Mensaje: ${input.message?.trim() || "(botón, sin texto)"}`,
      ].join("\n"),
    })
  } catch (error) {
    console.error("[pipeline] fallo notify handoff", error)
  }
}
