-- Replace property count ranges and add lead qualification fields

ALTER TYPE "PropertyCount" RENAME TO "PropertyCount_old";

CREATE TYPE "PropertyCount" AS ENUM (
  'UNDER_5',
  'FIVE_TO_FIFTEEN',
  'SIXTEEN_TO_TWENTY_FIVE',
  'OVER_25'
);

ALTER TABLE "FormSubmission"
  ALTER COLUMN "propertyCount" DROP DEFAULT;

ALTER TABLE "FormSubmission"
  ALTER COLUMN "propertyCount" TYPE "PropertyCount"
  USING (
    CASE "propertyCount"::text
      WHEN 'ONE_TO_FIVE' THEN 'UNDER_5'
      WHEN 'SIX_TO_FIFTEEN' THEN 'FIVE_TO_FIFTEEN'
      WHEN 'SIXTEEN_TO_FIFTY' THEN 'SIXTEEN_TO_TWENTY_FIVE'
      WHEN 'FIFTY_ONE_PLUS' THEN 'OVER_25'
      ELSE 'UNDER_5'
    END::"PropertyCount"
  );

DROP TYPE "PropertyCount_old";

ALTER TYPE "RevenueRange" RENAME TO "RevenueRange_old";

CREATE TYPE "RevenueRange" AS ENUM (
  'UNDER_10M',
  'TEN_TO_TWENTY_M',
  'TWENTY_ONE_TO_FIFTY_M',
  'OVER_50M'
);

ALTER TABLE "FormSubmission"
  ALTER COLUMN "revenueRange" DROP DEFAULT;

ALTER TABLE "FormSubmission"
  ALTER COLUMN "revenueRange" TYPE "RevenueRange"
  USING (
    CASE "revenueRange"::text
      WHEN 'UNDER_10M' THEN 'UNDER_10M'
      WHEN 'TEN_TO_FIFTY_M' THEN 'TEN_TO_TWENTY_M'
      WHEN 'FIFTY_TO_200M' THEN 'OVER_50M'
      WHEN 'OVER_200M' THEN 'OVER_50M'
      ELSE 'UNDER_10M'
    END::"RevenueRange"
  );

DROP TYPE "RevenueRange_old";

CREATE TYPE "YesNo" AS ENUM ('YES', 'NO');
CREATE TYPE "IndustryTime" AS ENUM ('UNDER_5', 'FIVE_TO_TEN', 'OVER_10');

ALTER TABLE "FormSubmission" ADD COLUMN "companyName" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "phoneCountryCode" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "websiteUrl" TEXT;
ALTER TABLE "FormSubmission" ADD COLUMN "isTodero" "YesNo";
ALTER TABLE "FormSubmission" ADD COLUMN "usesAi" "YesNo";
ALTER TABLE "FormSubmission" ADD COLUMN "industryTime" "IndustryTime";
