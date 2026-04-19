-- ============================================================
-- MIGRAÇÃO: Leads da Arcus Club → CRM do Vinícius (vini_leads)
-- Execute UMA VEZ no SQL Editor do Supabase
-- ============================================================
-- Mapeamento de awareness level → etapa do pipeline:
--   Frio       → mapeado
--   Seguidor   → mapeado
--   Engajado   → abordagem1
--   Consciente → abordagem2
--   Quente     → reuniao_agendada
--   Recusa     → recusa  (recusa_from = 'Importado — Arcus Club')
-- ============================================================

INSERT INTO public.vini_leads (
  name,
  company,
  phone,
  source,
  notes,
  interactions,
  next_steps,
  stage,
  recusa_from,
  created_at
)
SELECT
  name,
  ''                                    AS company,
  COALESCE(phone, '')                   AS phone,
  COALESCE(source, '')                  AS source,
  COALESCE(notes, '')                   AS notes,
  COALESCE(interactions, '[]'::jsonb)   AS interactions,
  COALESCE(next_steps, '[]'::jsonb)     AS next_steps,

  CASE stage
    WHEN 'Frio'       THEN 'mapeado'
    WHEN 'Seguidor'   THEN 'mapeado'
    WHEN 'Engajado'   THEN 'abordagem1'
    WHEN 'Consciente' THEN 'abordagem2'
    WHEN 'Quente'     THEN 'reuniao_agendada'
    WHEN 'Recusa'     THEN 'recusa'
    ELSE 'mapeado'
  END                                   AS stage,

  CASE
    WHEN stage = 'Recusa' THEN 'Importado — era Quente na Arcus'
    ELSE NULL
  END                                   AS recusa_from,

  created_at

FROM public.leads
ORDER BY created_at;

-- Confirmar quantos leads foram migrados:
SELECT COUNT(*) AS leads_migrados FROM public.vini_leads;
