/**
 * Apunta packages/db del repo Airbnb a la Neon del CRM y congela migraciones.
 * Guarda la URL vieja en AIRBNB_LEGACY_DATABASE_URL (no imprime secretos).
 *
 *   pnpm airbnb:cutover-env -- --airbnb-env "../Agent Pilot Prospect Airbnb/.env"
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

function parseEnv(filePath: string) {
  if (!existsSync(filePath)) throw new Error(`No encontré ${filePath}.`)
  const text = readFileSync(filePath, "utf8")
  const values: Record<string, string> = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const trimmed = rawLine.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[key] = value
  }
  return { text, values }
}

function quote(value: string) {
  return `"${value.replaceAll('"', '\\"')}"`
}

function upsertLine(text: string, key: string, value: string) {
  const line = `${key}=${quote(value)}`
  const re = new RegExp(`^${key}=.*$`, "m")
  if (re.test(text)) return text.replace(re, line)
  return `${text.replace(/\s*$/, "")}\n${line}\n`
}

function argValue(flag: string) {
  const idx = process.argv.indexOf(flag)
  if (idx < 0) return null
  return process.argv[idx + 1] ?? null
}

const crmEnvPath = path.resolve(process.cwd(), ".env")
const airbnbEnvPath = path.resolve(
  argValue("--airbnb-env") ?? "../Agent Pilot Prospect Airbnb/.env",
)

const crm = parseEnv(crmEnvPath)
const crmUrl = crm.values.DATABASE_URL?.trim()
if (!crmUrl) throw new Error("Falta DATABASE_URL en el .env del CRM.")

const airbnb = parseEnv(airbnbEnvPath)
const previous = airbnb.values.DATABASE_URL?.trim()
if (!previous) throw new Error("Falta DATABASE_URL en el .env de Airbnb.")

if (previous === crmUrl && airbnb.values.CRM_OWNS_SCHEMA === "1") {
  console.log("Cutover env ya aplicado (DATABASE_URL del CRM + CRM_OWNS_SCHEMA=1).")
  process.exit(0)
}

let next = airbnb.text
if (previous !== crmUrl && !airbnb.values.AIRBNB_LEGACY_DATABASE_URL) {
  next = upsertLine(next, "AIRBNB_LEGACY_DATABASE_URL", previous)
}
next = upsertLine(next, "DATABASE_URL", crmUrl)
next = upsertLine(next, "CRM_OWNS_SCHEMA", "1")

writeFileSync(airbnbEnvPath, next, "utf8")
console.log(`Actualicé ${airbnbEnvPath}: DATABASE_URL → Neon CRM, CRM_OWNS_SCHEMA=1.`)
console.log("La Neon vieja quedó en AIRBNB_LEGACY_DATABASE_URL. No la borres hasta verificar workers.")
