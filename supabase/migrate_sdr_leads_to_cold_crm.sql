-- Move todos os leads do SDR Agent para o COLD CRM
-- Todos vão para 'cold_mapeado', exceto Carlos Eduardo Pires → 'cold_contato1'

-- 1. Todos os SDR Agent → cold_mapeado
UPDATE public.vini_leads
SET stage = 'cold_mapeado', updated_at = NOW()
WHERE source = 'SDR Agent'
  AND stage NOT LIKE 'cold_%'; -- evita sobrescrever quem já está no cold

-- 2. Carlos Eduardo Pires → cold_contato1 (override)
UPDATE public.vini_leads
SET stage = 'cold_contato1', updated_at = NOW()
WHERE source = 'SDR Agent'
  AND name ILIKE '%Carlos Eduardo Pires%';

-- Verificação: mostra o resultado
SELECT name, company, stage, source
FROM public.vini_leads
WHERE source = 'SDR Agent'
ORDER BY stage, name;
