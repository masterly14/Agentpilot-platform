function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return mismatch === 0
}

export function extractMcpApiKey(request: Request): string | undefined {
  const apiKey =
    request.headers.get("x-api-key")?.trim() || request.headers.get("x-mcp-key")?.trim()
  if (apiKey) return apiKey

  const authorization = request.headers.get("authorization")?.trim()
  if (!authorization) return undefined

  const bearer = authorization.match(/^Bearer\s+(\S+)/i)
  if (bearer?.[1]) return bearer[1]

  if (!authorization.includes(" ")) return authorization
  return undefined
}

export function mcpApiKeyConfigured() {
  return Boolean(process.env.MCP_API_KEY?.trim())
}

export function isValidMcpApiKey(token: string | undefined) {
  const expected = process.env.MCP_API_KEY?.trim()
  if (!expected || !token) return false
  return timingSafeEqual(token, expected)
}

export function unauthorizedMcpResponse() {
  return Response.json(
    {
      error: "unauthorized",
      error_description:
        "API key inválida o ausente. En Claude elige Autenticación: Ninguno y añade el encabezado Authorization con valor Bearer <MCP_API_KEY>.",
    },
    {
      status: 401,
      headers: { "Cache-Control": "no-store" },
    },
  )
}

export function unconfiguredMcpResponse() {
  return Response.json(
    {
      error: "mcp_unconfigured",
      error_description: "Falta MCP_API_KEY en el servidor.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  )
}
