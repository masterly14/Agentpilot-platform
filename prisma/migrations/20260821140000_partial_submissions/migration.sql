-- Allow incomplete leads so abandoned forms can still be captured.

ALTER TYPE "SubmissionStatus" ADD VALUE 'PARTIAL';

ALTER TABLE "FormSubmission" ALTER COLUMN "fullName" DROP NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "usesPms" DROP NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "propertyCount" DROP NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "revenueRange" DROP NOT NULL;
