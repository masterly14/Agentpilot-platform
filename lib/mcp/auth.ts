import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js"

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return mismatch === 0
}

export async function verifyMcpBearerToken(
  _req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> {
  const expected = process.env.MCP_API_KEY?.trim()
  if (!expected || !bearerToken) return undefined
  if (!timingSafeEqual(bearerToken, expected)) return undefined

  return {
    token: bearerToken,
    clientId: "crm-leads",
    scopes: ["leads:read"],
  }
}
