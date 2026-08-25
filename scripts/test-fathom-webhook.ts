/**
 * POST de prueba a /api/fathom/webhook con firma Standard Webhooks.
 * Uso: pnpm exec tsx --env-file=.env scripts/test-fathom-webhook.ts
 * o: node --experimental-strip-types scripts/test-fathom-webhook.ts
 */
import { createHmac, randomBytes } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const ENV_FILE = path.resolve(process.cwd(), ".env")

function loadEnvFile(filePath: string = ENV_FILE) {
  if (!existsSync(filePath)) throw new Error(`No encontré ${filePath}.`)
  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
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

function sign(secret: string, webhookId: string, timestamp: number, rawBody: string) {
  const encoded = secret.startsWith("whsec_") ? secret.slice("whsec_".length) : secret
  const signature = createHmac("sha256", Buffer.from(encoded, "base64"))
    .update(`${webhookId}.${timestamp}.${rawBody}`)
    .digest("base64")
  return `v1,${signature}`
}

function fixture() {
  const recordingId = Number(process.env.FATHOM_TEST_RECORDING_ID) || 900000000 + Math.floor(Date.now() / 1000) % 100000
  const now = new Date()
  const start = new Date(now.getTime() - 40 * 60 * 1000)
  return {
    title: "Discovery call — Demo PM Medellín",
    meeting_title: "Discovery call — Demo PM Medellín",
    meeting_type: "Sales",
    recording_id: recordingId,
    url: `https://fathom.video/calls/${recordingId}`,
    meeting_url: "https://meet.google.com/test-webhook",
    share_url: `https://fathom.video/share/test-${recordingId}`,
    created_at: now.toISOString(),
    scheduled_start_time: start.toISOString(),
    scheduled_end_time: now.toISOString(),
    recording_start_time: start.toISOString(),
    recording_end_time: now.toISOString(),
    calendar_invitees_domains_type: "one_or_more_external",
    shared_with: "no_teams",
    transcript_language: "es",
    transcript: [
      {
        speaker: { display_name: "Santiago Varón", matched_calendar_invitee_email: "contacto@agentpilot.cloud" },
        text: "Hola Camila, gracias por el tiempo. Agent Pilot es un PMS con inteligencia artificial que les resuelve todo el hotel.",
        timestamp: "00:00:20",
      },
      {
        speaker: { display_name: "Camila Restrepo", matched_calendar_invitee_email: "camila@demo-pm.com" },
        text: "Tenemos 22 apartos en Medellín, yo hago de todo: WhatsApp de huéspedes, limpiezas, reportes a propietarios. Ya pagamos Hostaway.",
        timestamp: "00:01:10",
      },
      {
        speaker: { display_name: "Santiago Varón", matched_calendar_invitee_email: "contacto@agentpilot.cloud" },
        text: "Perfecto, entonces se ahorran Hostaway. El precio son como mil dólares y si quieren lo vemos otro día, les mando un PDF.",
        timestamp: "00:02:40",
      },
      {
        speaker: { display_name: "Camila Restrepo", matched_calendar_invitee_email: "camila@demo-pm.com" },
        text: "Mil dólares se me hace caro y ahora no es buen momento. Lo reviso con mi socio.",
        timestamp: "00:03:15",
      },
      {
        speaker: { display_name: "Santiago Varón", matched_calendar_invitee_email: "contacto@agentpilot.cloud" },
        text: "Dale, cualquier cosa me escribes. Gracias.",
        timestamp: "00:03:40",
      },
    ],
    default_summary: {
      template_name: "general",
      markdown_formatted:
        "## Resumen\nLlamada con una property manager de 22 unidades. Mencionó Hostaway y objeción de precio. No quedó next step.",
    },
    action_items: [
      {
        description: "Enviar PDF del producto",
        user_generated: false,
        completed: false,
        recording_timestamp: "00:03:00",
        recording_playback_url: `https://fathom.video/calls/${recordingId}?timestamp=180`,
        assignee: {
          name: "Santiago Varón",
          email: "contacto@agentpilot.cloud",
          team: null,
        },
      },
    ],
    calendar_invitees: [
      {
        name: "Santiago Varón",
        matched_speaker_display_name: "Santiago Varón",
        email: "contacto@agentpilot.cloud",
        is_external: false,
        email_domain: "agentpilot.cloud",
      },
      {
        name: "Camila Restrepo",
        matched_speaker_display_name: "Camila Restrepo",
        email: "camila@demo-pm.com",
        is_external: true,
        email_domain: "demo-pm.com",
      },
    ],
    recorded_by: {
      name: "Santiago Varón",
      email: "contacto@agentpilot.cloud",
      team: null,
      email_domain: "agentpilot.cloud",
    },
  }
}

async function main() {
  loadEnvFile()
  const secret = process.env.FATHOM_WEBHOOK_SECRET?.trim()
  if (!secret) throw new Error("Falta FATHOM_WEBHOOK_SECRET")

  const base =
    process.env.PIPELINE_BASE_URL?.trim().replace(/\/$/, "") ||
    "http://127.0.0.1:3000"
  const body = JSON.stringify(fixture())
  const timestamp = Math.floor(Date.now() / 1000)
  const webhookId = `msg_${randomBytes(12).toString("hex")}`

  const response = await fetch(`${base}/api/fathom/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "webhook-id": webhookId,
      "webhook-timestamp": String(timestamp),
      "webhook-signature": sign(secret, webhookId, timestamp, body),
    },
    body,
  })
  const text = await response.text()
  console.log(response.status, text)
  if (!response.ok) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
