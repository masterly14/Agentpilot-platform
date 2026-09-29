/**
 * Los recordatorios y la nutrición automática (WhatsApp/correo programados por QStash)
 * están en pausa mientras se llama a los leads a mano. Para reactivarlos:
 * PIPELINE_AUTOMATION_ENABLED=true.
 */
export function isPipelineAutomationPaused() {
  return process.env.PIPELINE_AUTOMATION_ENABLED !== "true"
}
