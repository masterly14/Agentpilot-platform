CREATE TYPE "TeamSize" AS ENUM ('ONE', 'TWO', 'THREE_OR_MORE');

ALTER TABLE "FormSubmission"
ADD COLUMN "teamSize" "TeamSize";

ALTER TYPE "MarketingFunnelStage" ADD VALUE 'PENDING_CALL';
