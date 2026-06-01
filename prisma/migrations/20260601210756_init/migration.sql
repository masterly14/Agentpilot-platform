-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('PERSONAL', 'COMPANY');

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "projectType" "ProjectType" NOT NULL,
    "companyName" TEXT,
    "companyWebsite" TEXT,
    "companySocialMedia" TEXT,
    "projectDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);
