import { Client, Receiver } from "@upstash/qstash"
import { getAppUrl } from "@/lib/ebook/app-url"

let client: Client | null = null
let receiver: Receiver | null = null

function envFirst(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim()
    if (value) return value
  }
  return ""
}

function qstashToken() {
  return envFirst("QSTASH_TOKEN", "QSTASH_TOKEN")
}

function qstashCurrentSigningKey() {
  return envFirst("QSTASH_CURRENT_SIGNING_KEY", "QSTASH_CURRENT_SIGNING_KEY")
}

function qstashNextSigningKey() {
  return envFirst("QSTASH_NEXT_SIGNING_KEY", "QSTASH_NEXT_SIGNING_KEY")
}

function qstashSkipVerify() {
  return (
    process.env.QSTASH_SKIP_VERIFY === "true" ||
    process.env.QSTASH_SKIP_VERIFY === "true"
  )
}

export function isQstashConfigured() {
  return Boolean(qstashToken() && qstashCurrentSigningKey() && qstashNextSigningKey())
}

export function getPipelineBaseUrl() {
  const explicit = process.env.PIPELINE_BASE_URL?.trim().replace(/\/$/, "")
  if (explicit) return explicit
  return getAppUrl()
}

export function getQstashClient() {
  const token = qstashToken()
  if (!token) return null
  if (!client) client = new Client({ token })
  return client
}

export function getQstashReceiver() {
  const currentSigningKey = qstashCurrentSigningKey()
  const nextSigningKey = qstashNextSigningKey()
  if (!currentSigningKey || !nextSigningKey) return null
  if (!receiver) {
    receiver = new Receiver({ currentSigningKey, nextSigningKey })
  }
  return receiver
}

export async function verifyQstashSignature(signature: string | null, body: string) {
  if (qstashSkipVerify()) return true
  const qstashReceiver = getQstashReceiver()
  if (!qstashReceiver || !signature) return false
  try {
    return await qstashReceiver.verify({ signature, body })
  } catch {
    return false
  }
}
