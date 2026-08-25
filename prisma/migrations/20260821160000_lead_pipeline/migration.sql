-- Pipeline de leads: origen, etapa, estados compartidos y registro de nutrición.

CREATE TYPE "FunnelOrigin" AS ENUM ('SQL', 'MQL', 'DIRECT_BOOKING');

CREATE TYPE "PipelineStage" AS ENUM ('NURTURING', 'PRE_MEETING', 'PRE_DEMO', 'POST_DEMO');

CREATE TYPE "PipelineState" AS ENUM (
    'LEAD_MAGNET_DOWNLOADED',
    'AWAITING_CONFIRMATION',
    'QUALIFICATION_OFFERED',
    'QUALIFYING_Q1',
    'QUALIFYING_Q2',
    'QUALIFYING_Q3',
    'FIT_CONFIRMED',
    'DISQUALIFIED',
    'VIDEO_SENT',
    'CTA_SENT_SAW_VIDEO',
    'CTA_SENT_NO_VIDEO',
    'LAST_NURTURE_SENT',
    'COLD_CALL_QUEUED',
    'SCHEDULED',
    'LOST',
    'LONG_TERM_NURTURE',
    'MEETING_SCHEDULED',
    'CONFIRMATION_SENT',
    'REMINDER_48H',
    'REMINDER_24H',
    'REMINDER_8AM_DAY_OF',
    'REMINDER_30MIN',
    'ATTENDED',
    'NO_SHOW',
    'RESCHEDULE_OFFERED',
    'DISCOVERY_COMPLETED',
    'DISCOVERY_SUMMARY_SENT',
    'DEMO_CONFIRMATION_SENT',
    'DEMO_REMINDER_48H',
    'DEMO_REMINDER_24H',
    'DEMO_REMINDER_8AM',
    'DEMO_REMINDER_30MIN',
    'QUOTE_PRESENTED',
    'WON',
    'FORMAL_PROPOSAL_SENT',
    'FOLLOWUP_48H',
    'FOLLOWUP_5_7_DAYS',
    'CUTOFF_20_DAYS'
);

CREATE TABLE "LeadPipeline" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "funnelOrigin" "FunnelOrigin" NOT NULL,
    "currentStage" "PipelineStage" NOT NULL,
    "currentState" "PipelineState" NOT NULL,
    "scheduledJobId" TEXT,
    "scheduledJobDedupKey" TEXT,
    "videoWatched" BOOLEAN NOT NULL DEFAULT false,
    "utmSource" TEXT,
    "pixelFiredAt" TIMESTAMP(3),
    "painPoint" TEXT,
    "qualificationAnswers" JSONB,
    "meetingId" TEXT,
    "meetingTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPipeline_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeadPipeline_leadId_key" ON "LeadPipeline"("leadId");
CREATE UNIQUE INDEX "LeadPipeline_scheduledJobDedupKey_key" ON "LeadPipeline"("scheduledJobDedupKey");
CREATE INDEX "LeadPipeline_currentStage_currentState_idx" ON "LeadPipeline"("currentStage", "currentState");
CREATE INDEX "LeadPipeline_funnelOrigin_idx" ON "LeadPipeline"("funnelOrigin");
CREATE INDEX "LeadPipeline_currentState_idx" ON "LeadPipeline"("currentState");
CREATE INDEX "LeadPipeline_meetingTime_idx" ON "LeadPipeline"("meetingTime");
CREATE INDEX "LeadPipeline_scheduledJobId_idx" ON "LeadPipeline"("scheduledJobId");

ALTER TABLE "LeadPipeline" ADD CONSTRAINT "LeadPipeline_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
