-- AlterEnum: shared with WhatsApp ConversationMessage; harvest notes use SYSTEM.
ALTER TYPE "MessageDirection" ADD VALUE 'SYSTEM';

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM (
    'LEAD_DISCOVERED',
    'INITIAL_MSG_SENT',
    'FOLLOW_UP_1_SENT',
    'FOLLOW_UP_2_SENT',
    'FOLLOW_UP_3_SENT',
    'REPLIED_IN_PROGRESS',
    'HUMAN_TAKEOVER',
    'CLOSED_WON',
    'CLOSED_LOST'
);

CREATE TYPE "IcpSkipReason" AS ENUM (
    'below_min',
    'above_max',
    'not_superhost',
    'hotel_loft',
    'wrong_market'
);

CREATE TYPE "AccountStatus" AS ENUM (
    'ACTIVE',
    'COOLDOWN',
    'BLOCKED',
    'PENDING_GMAIL',
    'PENDING_CREDENTIALS',
    'VERIFYING'
);

CREATE TYPE "BlockType" AS ENUM ('RATE_LIMIT', 'IDENTITY', 'CAPTCHA', 'OTHER');

CREATE TYPE "ContactSource" AS ENUM (
    'OUTBOUND',
    'MANUAL_SYNC',
    'MANUAL_REGISTER',
    'AIRBNB_PRESEND_GUARD',
    'BACKFILL'
);

CREATE TYPE "AirbnbCommercialStage" AS ENUM (
    'HANDOFF',
    'SCHEDULED',
    'SHOWED_UP',
    'NO_SHOW',
    'PURCHASED'
);

-- LeadEvent: optional inbound subject + Airbnb subject (XOR enforced below).
ALTER TABLE "LeadEvent" ALTER COLUMN "submissionId" DROP NOT NULL;
ALTER TABLE "LeadEvent" ADD COLUMN "airbnbLeadId" TEXT;

-- Operational Airbnb tables (physical names match @repo/db).
CREATE TABLE "ProspectAccount" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "airbnbEmail" TEXT NOT NULL,
    "airbnbPasswordEnc" TEXT,
    "composioUserId" TEXT,
    "composioConnectionId" TEXT,
    "composioConnectedAt" TIMESTAMP(3),
    "proxyHost" TEXT,
    "proxyPort" INTEGER,
    "proxyUser" TEXT,
    "proxyPassEnc" TEXT,
    "proxyProvider" TEXT,
    "proxySessionId" TEXT,
    "proxyCountry" TEXT,
    "sessionPath" TEXT,
    "sessionStateEnc" TEXT,
    "market" TEXT,
    "messagesSentToday" INTEGER NOT NULL DEFAULT 0,
    "waveMessagesSent" INTEGER NOT NULL DEFAULT 0,
    "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "rateLimitedAt" TIMESTAMP(3),
    "cooldownUntil" TIMESTAMP(3),
    "lastWaveStartedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProspectAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SystemState" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemState_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "DailyOutboundStats" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "market" TEXT NOT NULL,
    "coldMessagesSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyOutboundStats_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LeadIdentityAlias" (
    "id" TEXT NOT NULL,
    "aliasId" TEXT NOT NULL,
    "canonicalId" TEXT NOT NULL,
    "leadId" TEXT,

    CONSTRAINT "LeadIdentityAlias_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "hostAirbnbId" TEXT NOT NULL,
    "threadId" TEXT,
    "name" TEXT NOT NULL,
    "hostProfileUrl" TEXT NOT NULL,
    "primaryListingUrl" TEXT NOT NULL,
    "primaryListingName" TEXT,
    "totalProperties" INTEGER NOT NULL DEFAULT 1,
    "companyName" TEXT,
    "isSuperhost" BOOLEAN NOT NULL DEFAULT false,
    "market" TEXT,
    "icpSkipReason" "IcpSkipReason",
    "status" "LeadStatus" NOT NULL DEFAULT 'LEAD_DISCOVERED',
    "businessScale" TEXT,
    "painPoints" TEXT,
    "executiveSummary" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "nextFollowUpAt" TIMESTAMP(3),
    "botReplyCount" INTEGER NOT NULL DEFAULT 0,
    "calLinkSent" BOOLEAN NOT NULL DEFAULT false,
    "calBookedAt" TIMESTAMP(3),
    "hostEmail" TEXT,
    "contactId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "prospectAccountId" TEXT,
    "direction" "MessageDirection" NOT NULL,
    "content" TEXT NOT NULL,
    "aiIntent" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HostContact" (
    "id" TEXT NOT NULL,
    "hostAirbnbId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "firstContactedAt" TIMESTAMP(3) NOT NULL,
    "firstContactAccountId" TEXT,
    "source" "ContactSource" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HostContact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CalBooking" (
    "id" TEXT NOT NULL,
    "calUid" TEXT NOT NULL,
    "calBookingId" INTEGER,
    "leadId" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "attendeeEmail" TEXT,
    "attendeeName" TEXT,
    "eventTypeSlug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalBooking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AccountBlockEvent" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "type" "BlockType" NOT NULL,
    "message" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountBlockEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AirbnbCommercial" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "stage" "AirbnbCommercialStage" NOT NULL,
    "hostEmail" TEXT,
    "meetingTime" TIMESTAMP(3),
    "meetLink" TEXT,
    "meetingId" TEXT,
    "contractValueUsd" DECIMAL(12, 2),
    "contractPlan" "ContractPlan",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AirbnbCommercial_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "ProspectAccount_airbnbEmail_key" ON "ProspectAccount"("airbnbEmail");
CREATE INDEX "ProspectAccount_status_cooldownUntil_idx" ON "ProspectAccount"("status", "cooldownUntil");

CREATE UNIQUE INDEX "DailyOutboundStats_date_market_key" ON "DailyOutboundStats"("date", "market");
CREATE INDEX "DailyOutboundStats_date_idx" ON "DailyOutboundStats"("date");

CREATE UNIQUE INDEX "LeadIdentityAlias_aliasId_key" ON "LeadIdentityAlias"("aliasId");
CREATE INDEX "LeadIdentityAlias_canonicalId_idx" ON "LeadIdentityAlias"("canonicalId");

CREATE UNIQUE INDEX "Lead_hostAirbnbId_key" ON "Lead"("hostAirbnbId");
CREATE UNIQUE INDEX "Lead_threadId_key" ON "Lead"("threadId");
CREATE UNIQUE INDEX "Lead_contactId_key" ON "Lead"("contactId");
CREATE INDEX "Lead_status_nextFollowUpAt_idx" ON "Lead"("status", "nextFollowUpAt");

CREATE INDEX "Message_leadId_sentAt_idx" ON "Message"("leadId", "sentAt");
CREATE INDEX "Message_prospectAccountId_idx" ON "Message"("prospectAccountId");

CREATE UNIQUE INDEX "HostContact_hostAirbnbId_key" ON "HostContact"("hostAirbnbId");
CREATE UNIQUE INDEX "HostContact_leadId_key" ON "HostContact"("leadId");
CREATE INDEX "HostContact_firstContactAccountId_idx" ON "HostContact"("firstContactAccountId");

CREATE UNIQUE INDEX "CalBooking_calUid_key" ON "CalBooking"("calUid");
CREATE INDEX "CalBooking_leadId_idx" ON "CalBooking"("leadId");

CREATE INDEX "AccountBlockEvent_accountId_occurredAt_idx" ON "AccountBlockEvent"("accountId", "occurredAt");

CREATE UNIQUE INDEX "AirbnbCommercial_leadId_key" ON "AirbnbCommercial"("leadId");

CREATE UNIQUE INDEX "LeadEvent_airbnbLeadId_eventName_key" ON "LeadEvent"("airbnbLeadId", "eventName");
CREATE INDEX "LeadEvent_airbnbLeadId_idx" ON "LeadEvent"("airbnbLeadId");

-- Foreign keys
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Message" ADD CONSTRAINT "Message_prospectAccountId_fkey" FOREIGN KEY ("prospectAccountId") REFERENCES "ProspectAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HostContact" ADD CONSTRAINT "HostContact_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HostContact" ADD CONSTRAINT "HostContact_firstContactAccountId_fkey" FOREIGN KEY ("firstContactAccountId") REFERENCES "ProspectAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CalBooking" ADD CONSTRAINT "CalBooking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AccountBlockEvent" ADD CONSTRAINT "AccountBlockEvent_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ProspectAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AirbnbCommercial" ADD CONSTRAINT "AirbnbCommercial_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_airbnbLeadId_fkey" FOREIGN KEY ("airbnbLeadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_subject_xor" CHECK (
    ("submissionId" IS NOT NULL AND "airbnbLeadId" IS NULL)
    OR ("submissionId" IS NULL AND "airbnbLeadId" IS NOT NULL)
);
