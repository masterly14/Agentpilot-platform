-- Retención del video de la landing: sesiones anónimas, sin CAPI.

CREATE TYPE "VideoDropReason" AS ENUM (
    'PAUSE',
    'TAB_HIDDEN',
    'PAGE_LEAVE',
    'SCROLL',
    'ENDED'
);

CREATE TABLE "VideoWatchSession" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastHeartbeatAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxSecond" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "droppedAtSecond" INTEGER,
    "dropReason" "VideoDropReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoWatchSession_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "VideoWatchSession_videoId_startedAt_idx" ON "VideoWatchSession"("videoId", "startedAt");
CREATE INDEX "VideoWatchSession_visitorId_idx" ON "VideoWatchSession"("visitorId");
CREATE INDEX "VideoWatchSession_videoId_completed_idx" ON "VideoWatchSession"("videoId", "completed");
