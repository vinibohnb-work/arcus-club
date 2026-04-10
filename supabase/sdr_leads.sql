-- ============================================================
-- ARCUS CLUB — SDR Leads (Prospecção Automatizada)
-- Execute no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS public.sdr_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Pessoa / empresa
  name text NOT NULL,
  founder_name text,
  company_name text,
  email text,
  phone text,
  website text,
  instagram_handle text,
  linkedin_url text,

  -- Dados da empresa
  cnpj text,
  segment text,
  employees_estimate text,
  revenue_estimate text,
  city text,
  state text,
  country text DEFAULT 'BR',

  -- Metadados do agente SDR
  source text NOT NULL,          -- 'linkedin', 'instagram', 'website', 'google_maps', 'startupbase', etc.
  source_url text,               -- URL de origem do lead
  source_query text,             -- Query que encontrou este lead
  qualification_score integer CHECK (qualification_score BETWEEN 0 AND 100),
  qualification_notes text,      -- Raciocínio do Claude sobre o score
  raw_data jsonb DEFAULT '{}'::jsonb,  -- Dados brutos da fonte

  -- Status no pipeline
  status text DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'descartado', 'convertido')),

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes para queries comuns
CREATE INDEX IF NOT EXISTS idx_sdr_leads_source       ON public.sdr_leads(source);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_status       ON public.sdr_leads(status);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_score        ON public.sdr_leads(qualification_score DESC);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_created      ON public.sdr_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sdr_leads_linkedin     ON public.sdr_leads(linkedin_url)       WHERE linkedin_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sdr_leads_instagram    ON public.sdr_leads(instagram_handle)   WHERE instagram_handle IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sdr_leads_cnpj         ON public.sdr_leads(cnpj)               WHERE cnpj IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sdr_leads_email        ON public.sdr_leads(email)               WHERE email IS NOT NULL;

-- Row Level Security — apenas admins
ALTER TABLE public.sdr_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access on sdr_leads"
  ON public.sdr_leads FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Auto-atualiza updated_at a cada UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sdr_leads_updated_at ON public.sdr_leads;
CREATE TRIGGER sdr_leads_updated_at
  BEFORE UPDATE ON public.sdr_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
