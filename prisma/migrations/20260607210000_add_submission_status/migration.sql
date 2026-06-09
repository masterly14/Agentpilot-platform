-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'REVIEWING', 'CONTACTED', 'MEETING_SCHEDULED', 'PROPOSAL_SENT', 'CLOSED_WON', 'CLOSED_LOST');

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW';
