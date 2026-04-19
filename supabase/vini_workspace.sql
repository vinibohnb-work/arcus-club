-- ============================================================
-- VINI WORKSPACE — EPC Clients & Contracts
-- Execute no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vini_epc_clients (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text        NOT NULL,
  modules           text[]      DEFAULT '{}',
  phase             text        DEFAULT '',
  next_action       text        DEFAULT '',
  monthly_recurring numeric     DEFAULT 0,
  status            text        DEFAULT 'ativo'
                                CHECK (status IN ('ativo', 'concluido', 'pausado')),
  start_date        date,
  notes             text        DEFAULT '',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE public.vini_epc_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on vini_epc_clients"
  ON public.vini_epc_clients FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.vini_contracts (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name          text        NOT NULL,
  product              text        NOT NULL,
  -- 'epc-diagnostico' | 'epc-implementacao' | 'epc-manutencao'
  -- 'arcus-consultoria' | 'arcus-advisory'
  total_value          numeric     DEFAULT 0,
  payments_received    numeric     DEFAULT 0,
  next_payment_date    date,
  next_payment_amount  numeric     DEFAULT 0,
  status               text        DEFAULT 'ativo'
                                   CHECK (status IN ('ativo', 'concluido', 'cancelado')),
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE public.vini_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on vini_contracts"
  ON public.vini_contracts FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ──────────────────────────────────────────────────────────────
-- CRM: pipeline de leads pessoal do Vinícius
-- stages: mapeado | abordagem1 | abordagem2 | abordagem3 |
--         reuniao_agendada | reuniao_realizada | proposta | recusa
-- product: epc | arcus | NULL
-- recusa_from: stage de onde o lead foi movido para recusa
-- ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.vini_leads (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  phone        text        DEFAULT '',
  source       text        DEFAULT '',
  stage        text        DEFAULT 'mapeado'
                           CHECK (stage IN (
                             'mapeado','abordagem1','abordagem2','abordagem3',
                             'reuniao_agendada','reuniao_realizada','proposta','recusa'
                           )),
  recusa_from  text        DEFAULT NULL,
  product      text        DEFAULT NULL
                           CHECK (product IN ('epc','arcus') OR product IS NULL),
  notes        text        DEFAULT '',
  interactions jsonb       DEFAULT '[]',
  next_steps   jsonb       DEFAULT '[]',
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.vini_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on vini_leads"
  ON public.vini_leads FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- ── Migration: se a tabela já existia com o schema antigo ───────────────────
-- Execute apenas se necessário (ignorar erros "already exists" / "does not exist")
DO $$
BEGIN
  -- Adiciona coluna recusa_from se não existir
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'recusa_from'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN recusa_from text DEFAULT NULL;
  END IF;

  -- Atualiza o CHECK constraint de stage
  ALTER TABLE public.vini_leads DROP CONSTRAINT IF EXISTS vini_leads_stage_check;
  ALTER TABLE public.vini_leads
    ADD CONSTRAINT vini_leads_stage_check
    CHECK (stage IN (
      'mapeado','abordagem1','abordagem2','abordagem3',
      'reuniao_agendada','reuniao_realizada','proposta','recusa'
    ));
END $$;
