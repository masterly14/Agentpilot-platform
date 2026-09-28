-- Video outreach campaign (WhatsApp marketing_video2 + delayed email + Cal.com).

CREATE TYPE "OutreachEmailStatus" AS ENUM ('PENDING', 'SENT', 'SKIPPED', 'FAILED');

ALTER TABLE "FormSubmission"
ADD COLUMN "videoOutreachAt" TIMESTAMP(3),
ADD COLUMN "videoOutreachBookedAt" TIMESTAMP(3),
ADD COLUMN "videoOutreachCalUid" TEXT;

CREATE INDEX "FormSubmission_videoOutreachAt_idx" ON "FormSubmission"("videoOutreachAt");
CREATE INDEX "FormSubmission_videoOutreachCalUid_idx" ON "FormSubmission"("videoOutreachCalUid");

CREATE TABLE "OutreachSend" (
    "id" TEXT NOT NULL,
    "campaignKey" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "submissionId" TEXT,
    "firstName" TEXT NOT NULL,
    "videoMediaId" TEXT,
    "waMessageId" TEXT,
    "waStatus" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "email" TEXT,
    "emailStatus" "OutreachEmailStatus" NOT NULL DEFAULT 'PENDING',
    "emailError" TEXT,
    "qstashMessageId" TEXT,
    "calPrivateLinkId" TEXT,
    "calBookingUrl" TEXT NOT NULL,
    "calBookingUid" TEXT,
    "bookedAt" TIMESTAMP(3),
    "meetingTime" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutreachSend_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OutreachSend_campaignKey_contactId_idx" ON "OutreachSend"("campaignKey", "contactId");
CREATE INDEX "OutreachSend_submissionId_idx" ON "OutreachSend"("submissionId");
CREATE INDEX "OutreachSend_calPrivateLinkId_idx" ON "OutreachSend"("calPrivateLinkId");
CREATE INDEX "OutreachSend_calBookingUid_idx" ON "OutreachSend"("calBookingUid");
CREATE INDEX "OutreachSend_email_idx" ON "OutreachSend"("email");

ALTER TABLE "OutreachSend" ADD CONSTRAINT "OutreachSend_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OutreachSend" ADD CONSTRAINT "OutreachSend_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
