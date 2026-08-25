-- MQL / SQL classification, entry source, and booking flow

CREATE TYPE "LeadQualification" AS ENUM ('SQL', 'MQL', 'DISQUALIFIED');
CREATE TYPE "DisqualificationReason" AS ENUM ('REVENUE_VETO', 'LOW_SCORE');
CREATE TYPE "LeadEntrySource" AS ENUM ('EBOOK', 'DIAGNOSIS', 'DIRECT_BOOKING');
CREATE TYPE "BookingFlow" AS ENUM ('EBOOK_SQL', 'EBOOK_PDF', 'DIAGNOSIS_PUBLIC', 'DIRECT_BOOKING');

ALTER TABLE "FormSubmission" ADD COLUMN "wantsToScale" "YesNo";
ALTER TABLE "FormSubmission" ADD COLUMN "qualification" "LeadQualification";
ALTER TABLE "FormSubmission" ADD COLUMN "qualificationScore" INTEGER;
ALTER TABLE "FormSubmission" ADD COLUMN "disqualificationReason" "DisqualificationReason";
ALTER TABLE "FormSubmission" ADD COLUMN "scoreBreakdown" JSONB;
ALTER TABLE "FormSubmission" ADD COLUMN "entrySource" "LeadEntrySource" NOT NULL DEFAULT 'EBOOK';
ALTER TABLE "FormSubmission" ADD COLUMN "bookingFlow" "BookingFlow";

UPDATE "FormSubmission"
SET "bookingFlow" = 'EBOOK_PDF'
WHERE "bookingSource" = 'pdf';

ALTER TABLE "FormSubmission" DROP COLUMN "bookingSource";

CREATE INDEX "FormSubmission_qualification_idx" ON "FormSubmission"("qualification");
CREATE INDEX "FormSubmission_entrySource_idx" ON "FormSubmission"("entrySource");
CREATE INDEX "FormSubmission_bookingFlow_idx" ON "FormSubmission"("bookingFlow");
