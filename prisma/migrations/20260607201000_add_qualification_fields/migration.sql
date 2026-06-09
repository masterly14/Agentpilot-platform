-- CreateEnum
CREATE TYPE "ProjectStage" AS ENUM ('CONCEPT', 'PLAN', 'BUILT');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('MOBILE', 'WEB', 'MARKETPLACE', 'SAAS', 'OTHER');

-- CreateEnum
CREATE TYPE "BusinessProblem" AS ENUM ('AUTOMATE', 'CUSTOM', 'INTEGRATE', 'MODERNIZE');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN "projectStage" "ProjectStage",
ADD COLUMN "productType" "ProductType",
ADD COLUMN "businessProblem" "BusinessProblem",
ADD COLUMN "companySize" "CompanySize",
ALTER COLUMN "projectDescription" DROP NOT NULL;
