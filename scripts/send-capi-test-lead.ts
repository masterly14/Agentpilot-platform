/**
 * Manda un evento Lead de prueba a Meta Conversions API (Events Manager).
 *
 * Credenciales desde .env:
 *   META_CAPI_ACCESS_TOKEN
 *   META_PIXEL_ID o NEXT_PUBLIC_FACEBOOK_PIXEL_ID
 *   META_TEST_EVENT_CODE   (obligatorio para este script)
 *
 * Uso:
 *   pnpm capi:test-lead
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { sendTestLeadEventToMeta } from "../lib/marketing/capi-test.ts"

const ENV_FILE = path.resolve(process.cwd(), ".env")

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`No encontré ${filePath}.`)
  }

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

loadEnvFile(ENV_FILE)

try {
  const result = await sendTestLeadEventToMeta()
  console.log("Lead de prueba enviado a Meta CAPI")
  console.log(`  pixel_id         ${result.pixelId}`)
  console.log(`  test_event_code  ${result.testEventCode}`)
  console.log(`  event_id         ${result.eventId}`)
  console.log(`  lead_id          ${result.leadId}`)
  console.log(`  event_source_url ${result.eventSourceUrl}`)
  console.log(`  graph            ${JSON.stringify(result.raw)}`)
  console.log("")
  console.log("En Events Manager → Test events, filtra por el test_event_code de arriba.")
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
