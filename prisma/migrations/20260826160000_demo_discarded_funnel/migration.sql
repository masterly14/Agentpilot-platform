-- Etapas de kanban: demo agendada y lead descartado tras el diagnóstico.

ALTER TYPE "MarketingFunnelStage" ADD VALUE 'DEMO_SCHEDULED';
ALTER TYPE "MarketingFunnelStage" ADD VALUE 'DISCARDED';
