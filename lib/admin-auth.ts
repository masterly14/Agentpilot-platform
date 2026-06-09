import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const ADMIN_COOKIE = "sv_admin_session"
const SESSION_PREFIX = "sv-admin:"

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

export async function createSessionToken(password: string) {
  const data = new TextEncoder().encode(`${SESSION_PREFIX}${password}`)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return bufferToHex(hash)
}

async function getExpectedSessionToken() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return createSessionToken(password)
}

export async function isValidSessionValue(value: string | undefined) {
  const expected = await getExpectedSessionToken()
  if (!expected || !value) return false
  if (value.length !== expected.length) return false

  let mismatch = 0
  for (let index = 0; index < value.length; index += 1) {
    mismatch |= value.charCodeAt(index) ^ expected.charCodeAt(index)
  }
  return mismatch === 0
}

export async function isAdminAuthenticated() {
  const session = (await cookies()).get(ADMIN_COOKIE)
  return isValidSessionValue(session?.value)
}

export async function createAdminSessionCookie() {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null

  const token = await createSessionToken(password)
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}

export function clearAdminSessionCookie() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "No autorizado" }, { status: 401 })
}
