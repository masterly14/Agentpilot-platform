-- Persist the lead's local timezone so WhatsApp reminders use their clock, not Bogotá.

ALTER TABLE "LeadPipeline" ADD COLUMN "visitorTimezone" TEXT;
