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
