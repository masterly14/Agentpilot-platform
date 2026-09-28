/**
 * Registra el webhook de Cal.com para la campaña de video outreach.
 *
 * Credenciales desde .env:
 *   CAL_API_KEY           API key (cal_...) — con ella se resuelve el event type
 *   CAL_WEBHOOK_SECRET    secreto HMAC para verificar BOOKING_CREATED
 *   PIPELINE_BASE_URL o NEXT_PUBLIC_APP_URL
 *
 * Uso:
 *   pnpm cal:setup
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { getPipelineBaseUrl } from "../lib/qstash/client.ts"
import {
  createCalEventTypeWebhook,
  getCalConfig,
  isCalApiConfigured,
  listCalEventTypeWebhooks,
  resolveCalEventType,
} from "../lib/cal/client.ts"

const ENV_FILE = path.resolve(process.cwd(), ".env")

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) return
  const text = readFileSync(filePath, "utf8")
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

async function main() {
  loadEnvFile(ENV_FILE)
  loadEnvFile(path.resolve(process.cwd(), ".env.local"))

  if (!isCalApiConfigured()) {
    throw new Error("Falta CAL_API_KEY.")
  }

  const { webhookSecret } = getCalConfig()
  if (!webhookSecret) {
    throw new Error("Falta CAL_WEBHOOK_SECRET.")
  }

  const eventType = await resolveCalEventType()
  const subscriberUrl = `${getPipelineBaseUrl()}/api/webhooks/cal`
  console.log("Event type:", eventType.id, eventType.slug)
  console.log("Link público:", eventType.bookingUrl)
  console.log("Webhook URL:", subscriberUrl)

  const existing = await listCalEventTypeWebhooks()
  const already = existing.find((item) => item.subscriberUrl === subscriberUrl)
  if (already) {
    console.log("Ya existe un webhook con esa URL. id:", already.id)
    return
  }

  const created = await createCalEventTypeWebhook({
    subscriberUrl,
    secret: webhookSecret,
  })
  console.log("Webhook creado. id:", created.id)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
