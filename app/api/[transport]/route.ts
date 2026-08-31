import { createMcpHandler, withMcpAuth } from "mcp-handler"
import { verifyMcpBearerToken } from "@/lib/mcp/auth"
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

const authHandler = withMcpAuth(handler, verifyMcpBearerToken, {
  required: true,
  requiredScopes: ["leads:read"],
})

type RouteContext = { params: Promise<{ transport: string }> }

async function mcpRoute(request: Request, context: RouteContext) {
  const { transport } = await context.params
  if (transport !== "mcp") {
    return Response.json({ error: "Not found" }, { status: 404 })
  }
  return authHandler(request)
}

export { mcpRoute as GET, mcpRoute as POST, mcpRoute as DELETE }
