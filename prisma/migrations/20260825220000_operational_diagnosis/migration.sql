-- Diagnósticos del mapa de fugas (reunión de diagnóstico con el ICP).

CREATE TABLE "OperationalDiagnosis" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationalDiagnosis_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OperationalDiagnosis_slug_key" ON "OperationalDiagnosis"("slug");
CREATE INDEX "OperationalDiagnosis_updatedAt_idx" ON "OperationalDiagnosis"("updatedAt");
