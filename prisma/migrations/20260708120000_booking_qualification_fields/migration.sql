-- Replace legacy qualification fields with booking questions

CREATE TYPE "PmsUsage" AS ENUM ('YES', 'NO', 'EVALUATING');
CREATE TYPE "PropertyCount" AS ENUM ('ONE_TO_FIVE', 'SIX_TO_FIFTEEN', 'SIXTEEN_TO_FIFTY', 'FIFTY_ONE_PLUS');
CREATE TYPE "RevenueRange" AS ENUM ('UNDER_10M', 'TEN_TO_FIFTY_M', 'FIFTY_TO_200M', 'OVER_200M');

ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "projectType";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "projectStage";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "productType";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "businessProblem";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "companyName";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "companyWebsite";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "companySocialMedia";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "companySize";
ALTER TABLE "FormSubmission" DROP COLUMN IF EXISTS "projectDescription";

ALTER TABLE "FormSubmission" ADD COLUMN "usesPms" "PmsUsage";
ALTER TABLE "FormSubmission" ADD COLUMN "propertyCount" "PropertyCount";
ALTER TABLE "FormSubmission" ADD COLUMN "revenueRange" "RevenueRange";

UPDATE "FormSubmission"
SET
  "usesPms" = 'NO',
  "propertyCount" = 'ONE_TO_FIVE',
  "revenueRange" = 'UNDER_10M',
  "email" = COALESCE("email", 'sin-email@placeholder.local')
WHERE "usesPms" IS NULL;

ALTER TABLE "FormSubmission" ALTER COLUMN "usesPms" SET NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "propertyCount" SET NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "revenueRange" SET NOT NULL;
ALTER TABLE "FormSubmission" ALTER COLUMN "email" SET NOT NULL;

DROP TYPE IF EXISTS "ProjectType";
DROP TYPE IF EXISTS "ProjectStage";
DROP TYPE IF EXISTS "ProductType";
DROP TYPE IF EXISTS "BusinessProblem";
DROP TYPE IF EXISTS "CompanySize";
