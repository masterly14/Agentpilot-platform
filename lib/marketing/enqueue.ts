import { getPipelineBaseUrl, getQstashClient, isQstashConfigured } from "@/lib/qstash/client"
import { sendLeadEventToMeta } from "@/lib/marketing/capi"

const SEND_PATH = "/api/marketing/capi/send"

function pipelineBaseIsLocal() {
  return /localhost|127\.0\.0\.1/i.test(getPipelineBaseUrl())
}

export async function enqueueCapiSend(eventId: string) {
  const sendInline =
    !isQstashConfigured() ||
    pipelineBaseIsLocal() ||
    process.env.NODE_ENV !== "production"
  if (sendInline) {
    if (!isQstashConfigured()) {
      console.warn("[marketing] QStash no configurado: envío CAPI inline", eventId)
    }
    try {
      await sendLeadEventToMeta(eventId)
    } catch (error) {
      console.error("[marketing] fallo envío CAPI inline", eventId, error)
    }
    return null
  }

  const qstash = getQstashClient()
  if (!qstash) return null

  const published = await qstash.publishJSON({
    url: `${getPipelineBaseUrl()}${SEND_PATH}`,
    body: { eventId },
    deduplicationId: eventId.slice(0, 128),
  })

  return published.messageId
}
