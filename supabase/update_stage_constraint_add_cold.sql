-- 1. Remove a constraint antiga
ALTER TABLE public.vini_leads
DROP CONSTRAINT IF EXISTS vini_leads_stage_check;

-- 2. Recria incluindo todos os stages do COLD CRM
ALTER TABLE public.vini_leads
ADD CONSTRAINT vini_leads_stage_check CHECK (stage IN (
  -- HOT CRM
  'mapeado',
  'abordagem1',
  'abordagem2',
  'abordagem3',
  'whatsapp',
  'msg_pre_ligacao',
  'ligacao',
  'reuniao_agendada',
  'reuniao_realizada',
  'proposta',
  'fechado',
  'recusa',
  -- COLD CRM
  'cold_mapeado',
  'cold_contato1',
  'cold_contato2',
  'cold_contato3',
  'cold_recusa'
));

-- 3. Agora move os SDR para cold_mapeado
UPDATE public.vini_leads
SET stage = 'cold_mapeado', updated_at = NOW()
WHERE source = 'SDR Agent';

-- 4. Carlos Eduardo Pires → cold_contato1
UPDATE public.vini_leads
SET stage = 'cold_contato1', updated_at = NOW()
WHERE source = 'SDR Agent'
  AND name ILIKE '%Carlos Eduardo Pires%';

-- 5. Verificação
SELECT name, stage, source
FROM public.vini_leads
WHERE source = 'SDR Agent'
ORDER BY stage, name;
