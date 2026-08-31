import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { loadMcpEnv } from "./load-env.ts"

loadMcpEnv()

async function main() {
  const { registerCrmLeadTools } = await import("../lib/mcp/register-tools.ts")
  const server = new McpServer({
    name: "crm-leads",
    version: "1.0.0",
  })
  registerCrmLeadTools(server)
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
