-- ============================================================
-- ARCUS CLUB — Histórico e Próximos Passos em mentee_prospects
-- Execute no SQL Editor do Supabase
-- ============================================================

ALTER TABLE public.mentee_prospects
  ADD COLUMN IF NOT EXISTS interactions  jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS next_steps    jsonb DEFAULT '[]'::jsonb;

-- interactions: [{ id, type, note, date }]
-- next_steps:   [{ id, type, title, note, date, done }]
