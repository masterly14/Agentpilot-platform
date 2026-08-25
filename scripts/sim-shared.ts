/**
 * Helpers compartidos por las simulaciones de nutrición (SQL y MQL).
 *
 * Todas las sims:
 *  - cargan .env, abortan si el entorno es production
 *  - hablan con el server local (pnpm dev + QSTASH_SKIP_VERIFY=true)
 *  - disparan pasos por tiempo vía POST /api/pipeline/execute
 *  - disparan inbound firmado vía POST /api/whatsapp/webhook
 *  - esperan el POST de status de Meta y abortan si el mensaje quedó FAILED
 */
import { createHmac, randomBytes } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { Client } from "@upstash/qstash"
import type { PipelineState, PrismaClient } from "../prisma/generated/client/index.js"

export const ENV_FILE = path.resolve(process.cwd(), ".env")
export const EXECUTE_PATH = "/api/pipeline/execute"
export const WEBHOOK_PATH = "/api/whatsapp/webhook"
export const DEFAULT_PHONE_E164 = "573113541077"

export type ExecuteResult = { status?: string; toState?: PipelineState }

export function loadEnvFile(filePath: string = ENV_FILE) {
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

export function abortIfProduction() {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    throw new Error("Abortado: no correr simulaciones en production")
  }
}

export function getBaseUrl() {
  return (
    process.env.PIPELINE_SIM_BASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://127.0.0.1:3000"
  ).replace(/\/$/, "")
}

export function qstashToken() {
  return (process.env.QSTASH_TOKEN || "").trim()
}

export function makeQstashClient(): Client | null {
  const token = qstashToken()
  return token ? new Client({ token }) : null
}

/**
 * Parsea un teléfono E.164 (solo dígitos, país + nacional) desde `--phone`.
 * Asume país de 2 dígitos (57 Colombia) cuando no se indica lo contrario.
 */
export function parsePhone(argv: string[], fallback = DEFAULT_PHONE_E164) {
  const flagIndex = argv.findIndex((arg) => arg === "--phone")
  const inline = argv.find((arg) => arg.startsWith("--phone="))
  const raw =
    flagIndex >= 0 && argv[flagIndex + 1]
      ? argv[flagIndex + 1]
      : inline
        ? inline.slice("--phone=".length)
        : fallback
  const digits = raw.replace(/\D/g, "")
  if (digits.length < 10) {
    throw new Error(`--phone inválido: "${raw}" (se esperan dígitos país+nacional, ej. 573113541077)`)
  }
  const countryCode = digits.length > 10 ? digits.slice(0, digits.length - 10) : "57"
  const national = digits.slice(-10)
  return { e164: digits, countryCode, national }
}

export function hasFlag(argv: string[], flag: string) {
  return argv.includes(flag)
}

export function generatePdfToken() {
  return randomBytes(24).toString("base64url")
}

export async function assertServerUp(baseUrl: string) {
  try {
    const response = await fetch(baseUrl, { method: "GET", redirect: "manual" })
    await response.arrayBuffer()
  } catch (error) {
    const extra = error instanceof Error ? error.message : String(error)
    throw new Error(
      `No pude hablar con ${baseUrl}. Arranca pnpm dev y pon QSTASH_SKIP_VERIFY=true. (${extra})`,
    )
  }
}

export async function deleteQstashMessage(
  qstash: Client | null,
  messageId: string | null | undefined,
) {
  if (!qstash || !messageId) return
  try {
    await qstash.messages.delete(messageId)
  } catch (error) {
    const status =
      error && typeof error === "object" && "status" in error
        ? Number((error as { status?: number }).status)
        : null
    if (status === 404) return
    console.warn("[sim] no se pudo borrar QStash", messageId, error)
  }
}

/**
 * Dispara el paso programado por tiempo, sin esperar el delay real de QStash.
 * Usa el job PENDING si existe (para respetar dedupKey/expectedState reales).
 */
export async function fireExpected(input: {
  prisma: PrismaClient
  baseUrl: string
  qstash: Client | null
  pipelineId: string
  contactId: string
  expectedState: PipelineState
}): Promise<ExecuteResult> {
  const { prisma, baseUrl, qstash, pipelineId, contactId, expectedState } = input
  const pending = await prisma.pipelineJob.findFirst({
    where: { pipelineId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  })
  await deleteQstashMessage(qstash, pending?.qstashMessageId)
  const body = {
    contactId,
    expectedState: pending?.expectedState ?? expectedState,
    dedupKey: pending?.dedupKey ?? `sim-${contactId}-${expectedState}-${Date.now()}`,
  }
  const response = await fetch(`${baseUrl}${EXECUTE_PATH}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(
      `POST ${EXECUTE_PATH} ${response.status}: ${text}` +
        (response.status === 401
          ? " — pon QSTASH_SKIP_VERIFY=true en el server local y reinicia pnpm dev"
          : ""),
    )
  }
  return JSON.parse(text) as ExecuteResult
}

/**
 * Simula un mensaje entrante de WhatsApp firmando el body igual que Meta
 * (x-hub-signature-256 con WHATSAPP_APP_SECRET). Sirve para botones y texto.
 */
export async function fireInbound(input: {
  baseUrl: string
  waId: string
  phoneNumberId?: string
  profileName?: string
  text?: string
  buttonId?: string
  buttonText?: string
}) {
  const { baseUrl, waId, phoneNumberId, profileName, text, buttonId, buttonText } = input
  const waMessageId = `wamid.SIM${randomBytes(12).toString("hex").toUpperCase()}`

  const message: Record<string, unknown> = {
    from: waId,
    id: waMessageId,
    timestamp: `${Math.floor(Date.now() / 1000)}`,
  }
  if (buttonId || buttonText) {
    message.type = "interactive"
    message.interactive = {
      type: "button_reply",
      button_reply: { id: buttonId, title: buttonText ?? buttonId },
    }
  } else {
    message.type = "text"
    message.text = { body: text ?? "" }
  }

  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        id: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ?? "sim-waba",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: waId,
                phone_number_id: phoneNumberId ?? process.env.WHATSAPP_PHONE_NUMBER_ID ?? "sim-phone",
              },
              contacts: [{ wa_id: waId, profile: { name: profileName ?? "Sim Lead" } }],
              messages: [message],
            },
          },
        ],
      },
    ],
  }

  const rawBody = JSON.stringify(payload)
  const secret = process.env.WHATSAPP_APP_SECRET
  const headers: Record<string, string> = { "content-type": "application/json" }
  if (secret) {
    headers["x-hub-signature-256"] = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`
  }

  const response = await fetch(`${baseUrl}${WEBHOOK_PATH}`, {
    method: "POST",
    headers,
    body: rawBody,
  })
  const responseText = await response.text()
  if (!response.ok) {
    throw new Error(`POST ${WEBHOOK_PATH} ${response.status}: ${responseText}`)
  }
  return waMessageId
}

export async function fireInboundOverlay(input: {
  prisma: PrismaClient
  baseUrl: string
  waId: string
  contactId: string
  state: PipelineState
  label: string
  phoneNumberId?: string
  profileName?: string
  text?: string
  buttonId?: string
  buttonText?: string
}) {
  console.log(`\n  inbound ${input.label}`)
  await fireInbound({
    baseUrl: input.baseUrl,
    waId: input.waId,
    phoneNumberId: input.phoneNumberId,
    profileName: input.profileName,
    text: input.text,
    buttonId: input.buttonId,
    buttonText: input.buttonText,
  })
  await printOutbound(input.prisma, input.contactId, input.state)
  const delivery = await waitForDelivery({
    prisma: input.prisma,
    contactId: input.contactId,
    state: input.state,
  })
  console.log(`    overlay   ${delivery ?? "sin status del webhook (¿ngrok/suscripción?)"}`)
}

/**
 * Espera a que Meta reporte el status del último outbound de este estado.
 * Aborta la sim si el mensaje quedó FAILED (p. ej. 131049 tope de marketing).
 * Devuelve el status final observado ("SENT" si nunca llegó DELIVERED/READ).
 */
export async function waitForDelivery(input: {
  prisma: PrismaClient
  contactId: string
  state: PipelineState
  timeoutMs?: number
  pollMs?: number
}): Promise<string | null> {
  const { prisma, contactId, state, timeoutMs = 8000, pollMs = 1000 } = input
  const deadline = Date.now() + timeoutMs
  let last: { status: string; templateName: string | null; waMessageId: string | null } | null = null

  while (Date.now() < deadline) {
    const message = await prisma.conversationMessage.findFirst({
      where: { conversation: { contactId }, direction: "OUTBOUND", pipelineState: state },
      orderBy: { createdAt: "desc" },
      select: { status: true, templateName: true, waMessageId: true },
    })
    last = message
    if (message?.status === "FAILED") {
      throw new Error(
        `[sim] entrega FALLIDA en ${state} (${message.templateName ?? "—"}). ` +
          "Revisa el log del server para el código de error (131049 = tope de marketing). " +
          "No reintentes la misma plantilla enseguida; usa --phone con un número limpio.",
      )
    }
    if (message?.status === "DELIVERED" || message?.status === "READ") {
      return message.status
    }
    await new Promise((resolve) => setTimeout(resolve, pollMs))
  }

  return last?.status ?? null
}

export async function printOutbound(
  prisma: PrismaClient,
  contactId: string,
  state: PipelineState,
) {
  const message = await prisma.conversationMessage.findFirst({
    where: { conversation: { contactId }, direction: "OUTBOUND", pipelineState: state },
    orderBy: { createdAt: "desc" },
  })
  if (!message) {
    console.log(`    whatsapp   (sin mensaje outbound para ${state})`)
    return
  }
  console.log(
    `    whatsapp   ${message.status} · ${message.templateName ?? "—"} · ${message.waMessageId ?? "sin waMessageId"}`,
  )
}

/** Solo mensajes de esta corrida (el contacto reutiliza conversación entre sims). */
export async function listRunOutbound(
  prisma: PrismaClient,
  contactId: string,
  since: Date,
) {
  return prisma.conversationMessage.findMany({
    where: {
      conversation: { contactId },
      direction: "OUTBOUND",
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: { pipelineState: true, templateName: true, status: true, waMessageId: true },
  })
}
