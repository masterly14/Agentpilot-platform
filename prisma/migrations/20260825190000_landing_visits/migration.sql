-- Visitas anónimas a /ebook y /diagnosis. Sin CAPI: sirve para medir
-- PageView de anuncio vs Lead / Schedule en el dashboard interno.

CREATE TABLE "LandingVisit" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "landingPath" TEXT NOT NULL,
    "fromAd" BOOLEAN NOT NULL DEFAULT false,
    "fbclid" TEXT,
    "fbp" TEXT,
    "fbc" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "convertedAt" TIMESTAMP(3),
    "conversion" TEXT,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingVisit_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LandingVisit_visitorId_landingPath_key" ON "LandingVisit"("visitorId", "landingPath");
CREATE INDEX "LandingVisit_landingPath_fromAd_idx" ON "LandingVisit"("landingPath", "fromAd");
CREATE INDEX "LandingVisit_fromAd_convertedAt_idx" ON "LandingVisit"("fromAd", "convertedAt");
CREATE INDEX "LandingVisit_fbclid_idx" ON "LandingVisit"("fbclid");
