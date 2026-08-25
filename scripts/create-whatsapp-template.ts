/**
 * Crea plantillas de WhatsApp Cloud API (Message Templates).
 *
 * Credenciales desde .env:
 *   WHATSAPP_ACCESS_TOKEN          token permanente (whatsapp_business_management)
 *   WHATSAPP_BUSINESS_ACCOUNT_ID   WABA ID
 *   WHATSAPP_GRAPH_API_VERSION     opcional, default v23.0
 *   WHATSAPP_TEMPLATE_LANGUAGE     opcional, default es
 *
 * Uso:
 *   pnpm whatsapp:template --list
 *   pnpm whatsapp:template --remote
 *   pnpm whatsapp:template --dry-run --name ap_confirmation_sent1
 *   pnpm whatsapp:template --name ap_confirmation_sent1
 *   pnpm whatsapp:template --all
 *   pnpm whatsapp:template --from-json ruta.json
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import {
  buildWhatsAppCreatePayload,
  getWhatsAppTemplate,
  isWhatsAppTemplateName,
  listWhatsAppTemplateNames,
  listWhatsAppTemplates,
  validateWhatsAppCatalog,
  WHATSAPP_TEMPLATE_LANGUAGE,
} from "../lib/whatsapp/templates.ts"
import type {
  WhatsAppCreateTemplatePayload,
  WhatsAppRemoteTemplate,
} from "../lib/whatsapp/types.ts"

const ENV_FILE = path.resolve(process.cwd(), ".env")
const DEFAULT_API_VERSION = "v23.0"

type CliArgs = Record<string, string | boolean>

const ansi = {
  dim: (value: string) => `\x1b[2m${value}\x1b[0m`,
  bold: (value: string) => `\x1b[1m${value}\x1b[0m`,
  green: (value: string) => `\x1b[32m${value}\x1b[0m`,
  yellow: (value: string) => `\x1b[33m${value}\x1b[0m`,
  red: (value: string) => `\x1b[31m${value}\x1b[0m`,
  cyan: (value: string) => `\x1b[36m${value}\x1b[0m`,
}

function line(char = "─", width = 64) {
  return ansi.dim(char.repeat(width))
}

function logStep(title: string) {
  console.log(`\n${line()}`)
  console.log(ansi.bold(title))
  console.log(line())
}

function logKv(label: string, value: string) {
  console.log(`  ${ansi.dim(label.padEnd(14))} ${value}`)
}

function maskSecret(value: string) {
  if (value.length <= 8) return "••••"
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}

function formatStatus(status: string) {
  const upper = status.toUpperCase()
  if (upper === "APPROVED" || upper === "OK") return ansi.green(upper)
  if (upper === "PENDING" || upper === "RECEIVED") return ansi.yellow(upper)
  if (upper === "REJECTED" || upper === "ERROR") return ansi.red(upper)
  if (upper === "SKIP") return ansi.dim(upper)
  return upper
}

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`No encontré ${filePath}. Crea el archivo y agrega las variables WHATSAPP_*.`)
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

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {}
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith("--")) continue
    const key = token.slice(2)
    const next = argv[i + 1]
    if (!next || next.startsWith("--")) {
      args[key] = true
    } else {
      args[key] = next
      i++
    }
  }
  return args
}

function env(name: string, fallback = "") {
  return (process.env[name] ?? fallback).trim()
}

function requiredConfig() {
  const accessToken =
    env("WHATSAPP_ACCESS_TOKEN") ||
    env("WHATSAPP_TOKEN") ||
    env("META_WHATSAPP_ACCESS_TOKEN")
  const wabaId =
    env("WHATSAPP_BUSINESS_ACCOUNT_ID") ||
    env("WHATSAPP_WABA_ID") ||
    env("META_WABA_ID")
  const apiVersion = env("WHATSAPP_GRAPH_API_VERSION", DEFAULT_API_VERSION)
  const language = env("WHATSAPP_TEMPLATE_LANGUAGE", WHATSAPP_TEMPLATE_LANGUAGE)

  const missing: string[] = []
  if (!accessToken) missing.push("WHATSAPP_ACCESS_TOKEN")
  if (!wabaId) missing.push("WHATSAPP_BUSINESS_ACCOUNT_ID")
  if (missing.length) {
    throw new Error(
      `Faltan variables en .env: ${missing.join(", ")}.\n` +
        "Agrega un token permanente con permiso whatsapp_business_management y el WABA ID.",
    )
  }

  return { accessToken, wabaId, apiVersion, language }
}

async function graphRequest({
  accessToken,
  apiVersion,
  path: apiPath,
  method = "GET",
  body,
}: {
  accessToken: string
  apiVersion: string
  path: string
  method?: string
  body?: unknown
}) {
  const url = `https://graph.facebook.com/${apiVersion}${apiPath}`
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const payload = (await response.json().catch(() => ({}))) as {
    error?: { message?: string; error_user_msg?: string; code?: number; error_subcode?: number }
    data?: WhatsAppRemoteTemplate[]
    paging?: { next?: string }
    id?: string
    status?: string
    category?: string
  }

  if (!response.ok) {
    const meta = payload.error
    const detail = meta
      ? `${meta.message}${meta.error_user_msg ? ` — ${meta.error_user_msg}` : ""} (${meta.code}/${meta.error_subcode || "—"})`
      : JSON.stringify(payload)
    throw new Error(detail)
  }
  return payload
}

async function listRemote({
  accessToken,
  wabaId,
  apiVersion,
}: {
  accessToken: string
  wabaId: string
  apiVersion: string
}) {
  const templates: WhatsAppRemoteTemplate[] = []
  let urlPath: string | undefined =
    `/${wabaId}/message_templates?fields=id,name,status,category,language,rejected_reason&limit=100`

  while (urlPath) {
    const page = await graphRequest({
      accessToken,
      apiVersion,
      path: urlPath.startsWith("http")
        ? urlPath.replace(`https://graph.facebook.com/${apiVersion}`, "")
        : urlPath,
    })
    templates.push(...(page.data ?? []))
    const next = page.paging?.next
    urlPath = next ? next.replace(`https://graph.facebook.com/${apiVersion}`, "") : undefined
  }

  return templates
}

async function createTemplate({
  accessToken,
  wabaId,
  apiVersion,
  payload,
  dryRun,
}: {
  accessToken: string
  wabaId: string
  apiVersion: string
  payload: WhatsAppCreateTemplatePayload
  dryRun: boolean
}) {
  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2))
    return { dryRun: true as const, name: payload.name, id: undefined, status: "DRY_RUN", category: payload.category }
  }

  const started = Date.now()
  const result = await graphRequest({
    accessToken,
    apiVersion,
    path: `/${wabaId}/message_templates`,
    method: "POST",
    body: payload,
  })

  return {
    name: payload.name,
    id: result.id,
    status: result.status ?? "UNKNOWN",
    category: result.category ?? payload.category,
    elapsedMs: Date.now() - started,
  }
}

function printCatalog(language: string) {
  validateWhatsAppCatalog()
  const catalog = listWhatsAppTemplates()
  logStep(`Catálogo local · ${catalog.length} plantillas · ${language}`)
  for (const template of catalog) {
    const params = template.params.join(", ") || "—"
    const buttons = template.buttons.length ? template.buttons.map((button) => button.text).join(" · ") : "—"
    console.log(`  ${ansi.cyan(template.name)}`)
    console.log(
      `    ${ansi.dim(`${template.category} · ${template.pipeline} · ${template.state} · ${template.funnelOrigin}`)}`,
    )
    console.log(`    ${ansi.dim(`params ${params}`)}`)
    console.log(`    ${ansi.dim(`buttons ${buttons}`)}`)
  }
}

function printUsage() {
  console.log(`Crear plantillas de WhatsApp Cloud API

Uso:
  pnpm whatsapp:template --list
  pnpm whatsapp:template --remote
  pnpm whatsapp:template --dry-run --name ap_confirmation_sent1
  pnpm whatsapp:template --name ap_confirmation_sent1
  pnpm whatsapp:template --all
  pnpm whatsapp:template --from-json ruta.json

Variables en .env:
  WHATSAPP_ACCESS_TOKEN
  WHATSAPP_BUSINESS_ACCOUNT_ID
  WHATSAPP_GRAPH_API_VERSION     (opcional, default ${DEFAULT_API_VERSION})
  WHATSAPP_TEMPLATE_LANGUAGE     (opcional, default ${WHATSAPP_TEMPLATE_LANGUAGE})
`)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function exampleOverrides() {
  const appUrl = env("NEXT_PUBLIC_APP_URL").replace(/\/$/, "")
  if (!appUrl) return undefined
  return { link: `${appUrl}/agendar` }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const envFile = typeof args["env-file"] === "string" ? path.resolve(args["env-file"]) : ENV_FILE
  loadEnvFile(envFile)

  const language =
    (typeof args.language === "string" && args.language) ||
    env("WHATSAPP_TEMPLATE_LANGUAGE", WHATSAPP_TEMPLATE_LANGUAGE)
  const dryRun = Boolean(args["dry-run"])

  if (args.help || args.h) {
    printUsage()
    return
  }

  if (args.list) {
    printCatalog(language)
    return
  }

  if (!args.remote && !args.name && !args.all && !args["from-json"]) {
    printUsage()
    printCatalog(language)
    return
  }

  const config = dryRun
    ? {
        accessToken: "",
        wabaId: "",
        apiVersion: env("WHATSAPP_GRAPH_API_VERSION", DEFAULT_API_VERSION),
        language,
      }
    : requiredConfig()
  const apiLanguage = typeof args.language === "string" ? args.language : config.language

  if (!dryRun) {
    logStep("WhatsApp Cloud API · creación de plantillas")
    logKv(".env", envFile)
    logKv("WABA", config.wabaId)
    logKv("API", config.apiVersion)
    logKv("language", apiLanguage)
    logKv("token", maskSecret(config.accessToken))
  }

  if (args.remote) {
    logStep("Plantillas remotas")
    const remote = await listRemote(config)
    if (!remote.length) {
      console.log(`  ${ansi.dim("No hay plantillas en este WABA.")}`)
      return
    }
    logKv("total", String(remote.length))
    console.log("")
    for (const item of remote) {
      const reason = item.rejected_reason ? `  ${ansi.red(item.rejected_reason)}` : ""
      console.log(
        `  ${ansi.cyan(String(item.name).padEnd(32))} ${formatStatus(String(item.status))}  ${ansi.dim(`${item.category} · ${item.language} · ${item.id}`)}${reason}`,
      )
    }
    return
  }

  if (typeof args["from-json"] === "string") {
    const filePath = path.resolve(args["from-json"])
    const payload = JSON.parse(readFileSync(filePath, "utf8")) as WhatsAppCreateTemplatePayload
    if (!payload.name || !payload.category || !payload.components) {
      throw new Error("El JSON debe incluir name, category y components.")
    }
    payload.language = payload.language || apiLanguage
    await createTemplate({ ...config, payload, dryRun })
    return
  }

  const requested = args.all ? listWhatsAppTemplateNames() : [String(args.name)]
  const unknown = requested.filter((name) => !isWhatsAppTemplateName(name))
  if (unknown.length) {
    throw new Error(
      `Plantilla(s) no están en el catálogo: ${unknown.join(", ")}\nUsa --list para ver nombres válidos.`,
    )
  }
  const names = requested.filter(isWhatsAppTemplateName)

  logStep("Validación del catálogo")
  validateWhatsAppCatalog()
  console.log(`  ${ansi.green("OK")} ${names.length} plantillas listas para enviar`)

  const existing = dryRun ? [] : await listRemote(config)
  const existingByKey = new Map(existing.map((item) => [`${item.name}:${item.language}`, item]))
  const examples = exampleOverrides()

  if (!dryRun) {
    logStep("Estado remoto")
    logKv("existentes", String(existing.length))
  }

  let created = 0
  let skipped = 0
  let failed = 0

  logStep(dryRun ? "Dry-run" : "Creación")

  for (const [index, name] of names.entries()) {
    const template = getWhatsAppTemplate(name)
    const payload = buildWhatsAppCreatePayload(name, { language: apiLanguage, examples })
    const key = `${payload.name}:${payload.language}`
    const current = `${index + 1}/${names.length}`
    const meta = existingByKey.get(key)

    console.log(`\n  ${ansi.bold(current)}  ${ansi.cyan(payload.name)}`)
    console.log(
      `       ${ansi.dim(`${template.category} · ${template.pipeline} · ${template.state}`)}`,
    )

    if (!dryRun && meta && !args.force) {
      console.log(`       ${formatStatus("SKIP")}  ya existe · ${formatStatus(meta.status)} · ${ansi.dim(meta.id)}`)
      skipped++
      continue
    }

    try {
      const result = await createTemplate({ ...config, payload, dryRun })
      if (dryRun) {
        console.log(`       ${formatStatus("DRY_RUN")}  payload listo`)
      } else {
        const elapsed = "elapsedMs" in result && result.elapsedMs ? ` · ${result.elapsedMs}ms` : ""
        console.log(
          `       ${formatStatus(String(result.status))}  id=${result.id ?? "—"}${elapsed}`,
        )
      }
      created++
    } catch (error) {
      failed++
      const message = error instanceof Error ? error.message : String(error)
      console.log(`       ${formatStatus("ERROR")}  ${ansi.red(message)}`)
    }

    if (!dryRun && names.length > 1) await sleep(400)
  }

  logStep("Resumen")
  logKv("creadas", ansi.green(String(created)))
  logKv("omitidas", ansi.yellow(String(skipped)))
  logKv("errores", failed ? ansi.red(String(failed)) : ansi.green("0"))
  console.log("")

  if (failed) process.exitCode = 1
}

main().catch((error) => {
  console.error(`\n${ansi.red("Falló el script")}`)
  console.error(`  ${error instanceof Error ? error.message : error}`)
  process.exitCode = 1
})
