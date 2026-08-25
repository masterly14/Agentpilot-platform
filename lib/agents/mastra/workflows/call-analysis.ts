import { createStep, createWorkflow } from "@mastra/core/workflows"
import { z } from "zod"
import { loadProductKnowledge } from "@/lib/agents/mastra/tools/product-knowledge"
import { salesCoachAgent } from "@/lib/agents/mastra/agents/sales-coach"
import { publishAnalysisToConfluence } from "@/lib/confluence/client"
import { analysisPageBody, analysisPageTitle } from "@/lib/fathom/analysis-page"
import { callAnalysisSchema } from "@/lib/fathom/analysis-schema"
import { fathomMeetingSchema } from "@/lib/fathom/payload"
import { formatMeetingTranscript } from "@/lib/fathom/transcript"

const workflowInputSchema = z.object({
  meeting: fathomMeetingSchema,
  meetingPageUrl: z.string().optional().default(""),
})

const withKnowledgeSchema = workflowInputSchema.extend({
  productKnowledge: z.string(),
  transcript: z.string(),
})

const withAnalysisSchema = withKnowledgeSchema.extend({
  analysis: callAnalysisSchema,
})

const loadContext = createStep({
  id: "load-context",
  inputSchema: workflowInputSchema,
  outputSchema: withKnowledgeSchema,
  execute: async ({ inputData }) => {
    const productKnowledge = await loadProductKnowledge()
    const transcript = formatMeetingTranscript(inputData.meeting)
    if (!transcript) {
      throw new Error("La reunión no trae transcripción para analizar")
    }
    return {
      ...inputData,
      productKnowledge,
      transcript,
    }
  },
})

const scoreCall = createStep({
  id: "score-call",
  inputSchema: withKnowledgeSchema,
  outputSchema: withAnalysisSchema,
  execute: async ({ inputData, mastra }) => {
    const agent = mastra?.getAgentById?.("sales-coach") ?? salesCoachAgent
    const attendees = inputData.meeting.calendar_invitees
      .map((person) => {
        const role = person.is_external ? "externo" : "interno"
        return `- ${person.name || person.email || "sin nombre"} (${role}) ${person.email || ""}`
      })
      .join("\n")

    const prompt = `Analiza esta llamada de venta y devuelve el JSON estructurado.

## Meta
Título: ${inputData.meeting.meeting_title || inputData.meeting.title}
Grabó: ${inputData.meeting.recorded_by.name} <${inputData.meeting.recorded_by.email}>
Audiencia: ${inputData.meeting.calendar_invitees_domains_type || "desconocida"}
Resumen Fathom:
${inputData.meeting.default_summary?.markdown_formatted || "(sin resumen)"}

Participantes:
${attendees || "(sin invitados)"}

## Ficha de producto (Confluence)
${inputData.productKnowledge}

## Transcripción
${inputData.transcript}

Evalúa al vendedor, no al prospecto. Cita frases reales. Contrasta el pitch con la ficha de producto.`

    const response = await agent.generate(prompt, {
      structuredOutput: { schema: callAnalysisSchema },
    })
    const parsed = callAnalysisSchema.safeParse(response.object)
    if (!parsed.success) {
      throw new Error("El modelo no devolvió un análisis válido")
    }
    return { ...inputData, analysis: parsed.data }
  },
})

const publishAnalysis = createStep({
  id: "publish-analysis",
  inputSchema: withAnalysisSchema,
  outputSchema: z.object({
    pageId: z.string(),
    title: z.string(),
    url: z.string(),
    created: z.boolean(),
    overallScore: z.number(),
  }),
  execute: async ({ inputData }) => {
    const published = await publishAnalysisToConfluence({
      recordingId: inputData.meeting.recording_id,
      title: analysisPageTitle(inputData.meeting),
      body: analysisPageBody({
        meeting: inputData.meeting,
        analysis: inputData.analysis,
        meetingPageUrl: inputData.meetingPageUrl,
      }),
    })
    return {
      ...published,
      overallScore: inputData.analysis.overallScore,
    }
  },
})

export const callAnalysisWorkflow = createWorkflow({
  id: "call-analysis",
  inputSchema: workflowInputSchema,
  outputSchema: z.object({
    pageId: z.string(),
    title: z.string(),
    url: z.string(),
    created: z.boolean(),
    overallScore: z.number(),
  }),
})
  .then(loadContext)
  .then(scoreCall)
  .then(publishAnalysis)
  .commit()
