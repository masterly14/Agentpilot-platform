-- Contact identity, WhatsApp conversations, pipeline jobs, and LeadPipeline.contactId.

CREATE TYPE "ConversationChannel" AS ENUM ('WHATSAPP');
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'TEMPLATE', 'BUTTON', 'INTERACTIVE', 'STATUS');
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');
CREATE TYPE "PipelineJobStatus" AS ENUM ('PENDING', 'EXECUTED', 'STALE', 'CANCELLED');

CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phoneE164" TEXT NOT NULL,
    "waId" TEXT,
    "phoneCountryCode" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "companyName" TEXT,
    "websiteUrl" TEXT,
    "instagramUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Contact_phoneE164_key" ON "Contact"("phoneE164");
CREATE UNIQUE INDEX "Contact_waId_key" ON "Contact"("waId");
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

ALTER TABLE "FormSubmission" ADD COLUMN "contactId" TEXT;
CREATE INDEX "FormSubmission_contactId_idx" ON "FormSubmission"("contactId");

ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE "LeadPipeline";

CREATE TABLE "LeadPipeline" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
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
    "meetLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadPipeline_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeadPipeline_contactId_key" ON "LeadPipeline"("contactId");
CREATE UNIQUE INDEX "LeadPipeline_scheduledJobDedupKey_key" ON "LeadPipeline"("scheduledJobDedupKey");
CREATE INDEX "LeadPipeline_currentStage_currentState_idx" ON "LeadPipeline"("currentStage", "currentState");
CREATE INDEX "LeadPipeline_funnelOrigin_idx" ON "LeadPipeline"("funnelOrigin");
CREATE INDEX "LeadPipeline_currentState_idx" ON "LeadPipeline"("currentState");
CREATE INDEX "LeadPipeline_meetingTime_idx" ON "LeadPipeline"("meetingTime");
CREATE INDEX "LeadPipeline_scheduledJobId_idx" ON "LeadPipeline"("scheduledJobId");

ALTER TABLE "LeadPipeline" ADD CONSTRAINT "LeadPipeline_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "channel" "ConversationChannel" NOT NULL DEFAULT 'WHATSAPP',
    "waPhoneNumberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Conversation_contactId_channel_key" ON "Conversation"("contactId", "channel");

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ConversationMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "waMessageId" TEXT,
    "type" "MessageType" NOT NULL,
    "body" TEXT,
    "templateName" TEXT,
    "buttonId" TEXT,
    "rawPayload" JSONB,
    "pipelineState" "PipelineState",
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ConversationMessage_waMessageId_key" ON "ConversationMessage"("waMessageId");
CREATE INDEX "ConversationMessage_conversationId_createdAt_idx" ON "ConversationMessage"("conversationId", "createdAt");

ALTER TABLE "ConversationMessage" ADD CONSTRAINT "ConversationMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "PipelineJob" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "dedupKey" TEXT NOT NULL,
    "expectedState" "PipelineState" NOT NULL,
    "qstashMessageId" TEXT,
    "status" "PipelineJobStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "PipelineJob_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PipelineJob_dedupKey_key" ON "PipelineJob"("dedupKey");
CREATE INDEX "PipelineJob_pipelineId_status_idx" ON "PipelineJob"("pipelineId", "status");

ALTER TABLE "PipelineJob" ADD CONSTRAINT "PipelineJob_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "LeadPipeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
