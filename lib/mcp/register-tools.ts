import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { getMetaCampaignLead, listMetaCampaignLeads } from "@/lib/leads/meta-campaign"

const qualificationSchema = z
  .enum(["SQL", "MQL", "DISQUALIFIED", "UNCLASSIFIED"])
  .optional()
  .describe("Filtra por calificación: SQL, MQL, DISQUALIFIED o UNCLASSIFIED (sin clasificar).")

function asJson(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  }
}

function asError(error: unknown) {
  const message = error instanceof Error ? error.message : "Error consultando leads de Meta."
  return {
    isError: true,
    content: [{ type: "text" as const, text: message }],
  }
}

export function registerCrmLeadTools(server: McpServer) {
  server.registerTool(
    "list_meta_leads",
    {
      title: "Listar leads de Meta",
      description:
        "Lista leads que llegaron por campaña de Meta (fbclid o utm_source facebook/ig/meta). Devuelve leadId, leadToken, empresa, calificación MQL/SQL, campaña y contacto. Usa este tool para reportes, conteos o búsquedas. No incluye Airbnb outbound.",
      inputSchema: {
        qualification: qualificationSchema,
        campaign: z
          .string()
          .optional()
          .describe("Nombre o fragmento de utm_campaign, p.ej. 'ebook-abril'."),
        query: z
          .string()
          .optional()
          .describe("Busca por nombre, email, empresa, leadId o leadToken."),
        since: z
          .string()
          .optional()
          .describe("Fecha inicial inclusive (YYYY-MM-DD o ISO). Zona America/Bogota si solo hay fecha."),
        until: z
          .string()
          .optional()
          .describe("Fecha final inclusive (YYYY-MM-DD o ISO). Zona America/Bogota si solo hay fecha."),
        booked: z.boolean().optional().describe("true = ya agendaron; false = no han agendado."),
        limit: z.number().int().min(1).max(50).optional().describe("Máximo 50. Default 25."),
        offset: z.number().int().min(0).optional().describe("Paginación. Default 0."),
      },
    },
    async (args) => {
      try {
        return asJson(await listMetaCampaignLeads(args))
      } catch (error) {
        return asError(error)
      }
    },
  )

  server.registerTool(
    "get_meta_lead",
    {
      title: "Ficha de un lead de Meta",
      description:
        "Devuelve un lead de campaña Meta por leadId (FormSubmission.id), leadToken (pdfToken) o email. Incluye empresa, MQL/SQL, campaña y datos para identificarlo.",
      inputSchema: {
        leadId: z.string().optional().describe("ID interno del lead (FormSubmission.id)."),
        leadToken: z.string().optional().describe("Token público del lead (pdfToken, query ?lead=)."),
        email: z.string().optional().describe("Email del lead o del contacto asociado."),
      },
    },
    async (args) => {
      try {
        return asJson(await getMetaCampaignLead(args))
      } catch (error) {
        return asError(error)
      }
    },
  )
}
