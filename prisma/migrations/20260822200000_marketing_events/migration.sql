-- Atribución first-touch, etapa de marketing y log inmutable de eventos CAPI.

CREATE TYPE "MarketingFunnelStage" AS ENUM (
    'LEAD_MAGNET_SENT',
    'VIDEO_SENT',
    'SCHEDULED',
    'SHOWED_UP',
    'NO_SHOW',
    'PURCHASED'
);

CREATE TYPE "MarketingEventName" AS ENUM (
    'VIEW_CONTENT',
    'LEAD',
    'SCHEDULE',
    'SHOW_UP',
    'PURCHASE'
);

CREATE TYPE "ContractPlan" AS ENUM ('THREE_MONTH', 'FIVE_MONTH', 'OTHER');

ALTER TABLE "FormSubmission"
    ADD COLUMN "fbclid" TEXT,
    ADD COLUMN "fbp" TEXT,
    ADD COLUMN "fbc" TEXT,
    ADD COLUMN "utmSource" TEXT,
    ADD COLUMN "utmMedium" TEXT,
    ADD COLUMN "utmCampaign" TEXT,
    ADD COLUMN "utmContent" TEXT,
    ADD COLUMN "utmTerm" TEXT,
    ADD COLUMN "landingPath" TEXT,
    ADD COLUMN "referrer" TEXT,
    ADD COLUMN "marketingFunnelStage" "MarketingFunnelStage",
    ADD COLUMN "contractValueUsd" DECIMAL(12, 2),
    ADD COLUMN "contractPlan" "ContractPlan";

CREATE INDEX "FormSubmission_marketingFunnelStage_idx" ON "FormSubmission"("marketingFunnelStage");

CREATE TABLE "LeadEvent" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "eventName" "MarketingEventName" NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventSourceUrl" TEXT,
    "value" DECIMAL(12, 2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "sentToMeta" BOOLEAN NOT NULL DEFAULT false,
    "metaResponse" JSONB,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "triggeredBy" TEXT NOT NULL,
    "clientIp" TEXT,
    "clientUserAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LeadEvent_submissionId_eventName_key" ON "LeadEvent"("submissionId", "eventName");
CREATE INDEX "LeadEvent_sentToMeta_createdAt_idx" ON "LeadEvent"("sentToMeta", "createdAt");
CREATE INDEX "LeadEvent_submissionId_idx" ON "LeadEvent"("submissionId");

ALTER TABLE "LeadEvent"
    ADD CONSTRAINT "LeadEvent_submissionId_fkey"
    FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
