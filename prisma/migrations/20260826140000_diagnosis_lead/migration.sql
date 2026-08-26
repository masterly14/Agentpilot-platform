-- Ligar cada diagnóstico operativo a un lead inbound o Airbnb, y a la reunión.

ALTER TABLE "OperationalDiagnosis" ADD COLUMN "submissionId" TEXT;
ALTER TABLE "OperationalDiagnosis" ADD COLUMN "airbnbLeadId" TEXT;
ALTER TABLE "OperationalDiagnosis" ADD COLUMN "meetingTime" TIMESTAMP(3);

CREATE INDEX "OperationalDiagnosis_submissionId_idx" ON "OperationalDiagnosis"("submissionId");
CREATE INDEX "OperationalDiagnosis_airbnbLeadId_idx" ON "OperationalDiagnosis"("airbnbLeadId");

ALTER TABLE "OperationalDiagnosis" ADD CONSTRAINT "OperationalDiagnosis_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "OperationalDiagnosis" ADD CONSTRAINT "OperationalDiagnosis_airbnbLeadId_fkey" FOREIGN KEY ("airbnbLeadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
