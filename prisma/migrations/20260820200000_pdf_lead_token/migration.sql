-- Unique token per lead for personalized PDF booking links

ALTER TABLE "FormSubmission" ADD COLUMN "pdfToken" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "bookingSource" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "bookedAt" TIMESTAMP(3);

UPDATE "FormSubmission"
SET "pdfToken" = md5(random()::text || id || clock_timestamp()::text) || substr(md5(id), 1, 16)
WHERE "pdfToken" IS NULL;

ALTER TABLE "FormSubmission" ALTER COLUMN "pdfToken" SET NOT NULL;
CREATE UNIQUE INDEX "FormSubmission_pdfToken_key" ON "FormSubmission"("pdfToken");
