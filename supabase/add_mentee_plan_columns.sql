-- ============================================================
-- ARCUS CLUB — Novas colunas de plano estratégico para mentorados
-- Execute no SQL Editor do Supabase
-- ============================================================

ALTER TABLE public.mentees
  ADD COLUMN IF NOT EXISTS action_plan      jsonb DEFAULT '{"goals":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS tasks            jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS resources        jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reference_links  jsonb DEFAULT '[]'::jsonb;

-- action_plan: { goals: [{ id, title, color, items: [{ id, text }] }] }
-- tasks:       [{ id, title, goalId, dueDate, done }]
-- resources:   [{ id, label, icon, description, tab, url }]
-- reference_links: [{ id, title, url, description }]
