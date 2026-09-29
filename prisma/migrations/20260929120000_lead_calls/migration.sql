-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('CALLING', 'NO_ANSWER', 'ANSWERED');

-- CreateTable
CREATE TABLE "LeadCall" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "outcome" "CallOutcome" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadCall_submissionId_createdAt_idx" ON "LeadCall"("submissionId", "createdAt");

-- AddForeignKey
ALTER TABLE "LeadCall" ADD CONSTRAINT "LeadCall_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
