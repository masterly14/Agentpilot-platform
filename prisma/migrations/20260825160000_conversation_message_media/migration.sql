-- Media inbound (audio, imagen, video, documento, sticker, ubicación)
-- para trazabilidad en el Chat View del admin.

ALTER TYPE "MessageType" ADD VALUE 'AUDIO';
ALTER TYPE "MessageType" ADD VALUE 'IMAGE';
ALTER TYPE "MessageType" ADD VALUE 'VIDEO';
ALTER TYPE "MessageType" ADD VALUE 'DOCUMENT';
ALTER TYPE "MessageType" ADD VALUE 'STICKER';
ALTER TYPE "MessageType" ADD VALUE 'LOCATION';

ALTER TABLE "ConversationMessage" ADD COLUMN "mediaId" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "mimeType" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "mediaFilename" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "mediaUrl" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "caption" TEXT;
