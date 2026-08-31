-- Conversation state kept while the WhatsApp rescheduling agent negotiates a new time.
ALTER TABLE "LeadPipeline" ADD COLUMN "rescheduleContext" JSONB;

ALTER TYPE "PipelineState" ADD VALUE IF NOT EXISTS 'NEED_RESCHEDULE';
