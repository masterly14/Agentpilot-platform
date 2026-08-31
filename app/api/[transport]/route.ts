import { createMcpHandler } from "mcp-handler"
import {
  extractMcpApiKey,
  isValidMcpApiKey,
  mcpApiKeyConfigured,
  unauthorizedMcpResponse,
  unconfiguredMcpResponse,
} from "@/lib/mcp/auth"
import { registerCrmLeadTools } from "@/lib/mcp/register-tools"

export const runtime = "nodejs"
export const maxDuration = 60

const handler = createMcpHandler(
  (server) => {
    registerCrmLeadTools(server)
  },
  {
    serverInfo: { name: "crm-leads", version: "1.0.0" },
  },
  {
    basePath: "/api",
    maxDuration: 60,
    disableSse: true,
  },
)

type RouteContext = { params: Promise<{ transport: string }> }

function withCors(response: Response) {
  const headers = new Headers(response.headers)
  headers.set("Access-Control-Allow-Origin", "*")
  headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
  headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, Accept, X-Api-Key, X-MCP-Key, MCP-Protocol-Version, MCP-Session-Id",
  )
  return new Response(response.body, { status: response.status, headers })
}

export function OPTIONS() {
  return withCors(new Response(null, { status: 204 }))
}

async function mcpRoute(request: Request, context: RouteContext) {
  const { transport } = await context.params
  if (transport !== "mcp") {
    return withCors(Response.json({ error: "Not found" }, { status: 404 }))
  }
  if (!mcpApiKeyConfigured()) {
    return withCors(unconfiguredMcpResponse())
  }
  if (!isValidMcpApiKey(extractMcpApiKey(request))) {
    return withCors(unauthorizedMcpResponse())
  }
  return withCors(await handler(request))
}

export { mcpRoute as GET, mcpRoute as POST, mcpRoute as DELETE }
