import { createTool } from "@mastra/core/tools"
import { z } from "zod"
import { getConfluenceConfig } from "@/lib/confluence/config"
import { getConfluencePagePlainText } from "@/lib/confluence/client"

const PRODUCT_TEXT_LIMIT = 24_000

export async function loadProductKnowledge() {
  const { productPageId } = getConfluenceConfig()
  if (!productPageId) return "No hay página de producto configurada."
  const text = await getConfluencePagePlainText(productPageId)
  if (!text) return "La página de producto en Confluence está vacía."
  if (text.length <= PRODUCT_TEXT_LIMIT) return text
  return `${text.slice(0, PRODUCT_TEXT_LIMIT)}\n\n[Producto truncado]`
}

export const productKnowledgeTool = createTool({
  id: "product-knowledge",
  description:
    "Lee la ficha de producto de Real State Pilot / Agent Pilot desde Confluence. Úsala si necesitas contrastar lo que dijo el vendedor con el producto real.",
  inputSchema: z.object({
    reason: z.string().describe("Por qué necesitas releer el producto"),
  }),
  outputSchema: z.object({
    product: z.string(),
  }),
  execute: async () => {
    return { product: await loadProductKnowledge() }
  },
})
