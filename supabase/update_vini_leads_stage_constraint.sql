-- Atualiza o CHECK constraint de stage para incluir whatsapp, ligacao e fechado
ALTER TABLE public.vini_leads DROP CONSTRAINT IF EXISTS vini_leads_stage_check;
ALTER TABLE public.vini_leads
  ADD CONSTRAINT vini_leads_stage_check
  CHECK (stage IN (
    'mapeado','abordagem1','abordagem2','abordagem3',
    'whatsapp','ligacao',
    'reuniao_agendada','reuniao_realizada','proposta','fechado','recusa'
  ));
