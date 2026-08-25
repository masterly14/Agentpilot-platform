/**
 * Harness compartido para tests reales del funnel (HTTP + Prisma + CAPI).
 */
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { PrismaClient } from "../../prisma/generated/client/index.js"

const ENV_FILE = path.resolve(process.cwd(), ".env")
const EMAIL_PREFIX = "funnel-test-"
export const TEST_EMAIL_DOMAIN = "example.com"

export type CheckResult = {
  name: string
  pass: boolean
  detail: string
}

export type CookieJar = Map<string, string>

let envLoaded = false

export function loadEnvFile(filePath = ENV_FILE) {
  if (envLoaded) return
  envLoaded = true
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

export function requireEnv(name: string) {
  const value = process.env[name]?.trim()
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`)
  }
  return value
}

export function getBaseUrl() {
  return (process.env.FUNNEL_TEST_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "")
}

export function getPixelId() {
  return (
    process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID?.trim() ||
    process.env.META_PIXEL_ID?.trim() ||
    ""
  )
}

export const prisma = new PrismaClient()

export function pass(name: string, detail = ""): CheckResult {
  return { name, pass: true, detail }
}

export function fail(name: string, detail: string): CheckResult {
  return { name, pass: false, detail }
}

export function cookieHeader(jar: CookieJar) {
  return [...jar.entries()].map(([key, value]) => `${key}=${value}`).join("; ")
}

export function absorbSetCookie(jar: CookieJar, response: Response) {
  const raw = response.headers.getSetCookie?.() ?? []
  const fallback = response.headers.get("set-cookie")
  const lines = raw.length > 0 ? raw : fallback ? [fallback] : []
  for (const line of lines) {
    const pair = line.split(";")[0]
    const eq = pair.indexOf("=")
    if (eq < 1) continue
    jar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
}

export async function request(
  path: string,
  init: RequestInit & { jar?: CookieJar } = {},
) {
  const { jar, headers, redirect, ...rest } = init
  const merged = new Headers(headers)
  if (jar && jar.size > 0) merged.set("cookie", cookieHeader(jar))
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...rest,
    headers: merged,
    redirect: redirect ?? "manual",
  })
  if (jar) absorbSetCookie(jar, response)
  return response
}

export async function readText(response: Response) {
  return response.text()
}

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T
}

export function sqlLeadPayload(overrides: {
  email: string
  phoneNumber: string
  fullName?: string
}) {
  return {
    fullName: overrides.fullName ?? "Funnel Test Lead",
    email: overrides.email,
    companyName: "Funnel Test Stays",
    phoneCountryCode: "+57",
    phoneNumber: overrides.phoneNumber,
    websiteUrl: "https://funnel-test.example.com",
    instagramUrl: "",
    usesPms: "yes",
    propertyCount: "5-15",
    revenueRange: "21m-50m",
    isTodero: "yes",
    usesAi: "yes",
    wantsToScale: "yes",
    industryTime: "5-10",
  }
}

export function uniqueTestEmail(label: string) {
  return `${EMAIL_PREFIX}${label}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}@${TEST_EMAIL_DOMAIN}`
}

export function uniquePhone() {
  const n = Math.floor(3000000000 + Math.random() * 699999999)
  return String(n).slice(0, 10)
}

export const UTM_QUERY =
  "utm_source=meta&utm_medium=cpc&utm_campaign=funnel_test&utm_content=ad1&utm_term=pm&fbclid=TESTCLID"

export function pixelSnippetPresent(html: string, pixelId: string) {
  const hasId = html.includes(pixelId)
  const hasPageView =
    html.includes("PageView") || html.includes("fbq('track'") || html.includes("fbq(\"track\"")
  const hasLoader =
    html.includes("fbevents.js") || html.includes("facebook.com/tr?id=") || html.includes("tr?id=")
  return hasId && (hasPageView || hasLoader)
}

export function eventIdFor(submissionId: string, metaName: string) {
  return `${submissionId}-${metaName}`
}

function eventsReceivedFromMeta(metaResponse: unknown) {
  if (!metaResponse || typeof metaResponse !== "object") return 0
  const record = metaResponse as Record<string, unknown>
  const value = record.events_received ?? record.eventsReceived
  return typeof value === "number" ? value : 0
}

export async function waitForCapi(eventId: string, timeoutMs = 20_000) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    const event = await prisma.leadEvent.findUnique({ where: { id: eventId } })
    if (event?.sentToMeta) {
      return {
        sent: true,
        eventsReceived: eventsReceivedFromMeta(event.metaResponse),
        event,
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 400))
  }
  const event = await prisma.leadEvent.findUnique({ where: { id: eventId } })
  return {
    sent: Boolean(event?.sentToMeta),
    eventsReceived: eventsReceivedFromMeta(event?.metaResponse),
    event,
  }
}

export async function cleanupTestLeads() {
  const submissions = await prisma.formSubmission.findMany({
    where: { email: { startsWith: EMAIL_PREFIX } },
    select: { id: true, contactId: true },
  })
  const contactIds = [
    ...new Set(submissions.map((row) => row.contactId).filter((id): id is string => Boolean(id))),
  ]
  await prisma.formSubmission.deleteMany({
    where: { email: { startsWith: EMAIL_PREFIX } },
  })
  if (contactIds.length > 0) {
    await prisma.contact.deleteMany({
      where: { id: { in: contactIds } },
    })
  }
}

export function printResults(title: string, results: CheckResult[]) {
  console.log(`\n== ${title} ==`)
  for (const result of results) {
    const mark = result.pass ? "PASS" : "FAIL"
    const detail = result.detail ? ` — ${result.detail}` : ""
    console.log(`  [${mark}] ${result.name}${detail}`)
  }
  const failed = results.filter((result) => !result.pass).length
  console.log(`  ${results.length - failed}/${results.length} ok`)
  return failed
}
