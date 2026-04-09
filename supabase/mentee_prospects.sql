-- ============================================================
-- ARCUS CLUB — Mentee Prospects (CRM da Mentorada)
-- Execute no SQL Editor do Supabase
-- ============================================================

CREATE TABLE IF NOT EXISTS public.mentee_prospects (
  id               uuid   PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id        text   NOT NULL REFERENCES public.mentees(id) ON DELETE CASCADE,

  -- Escola
  school_name      text   NOT NULL,
  school_type      text   DEFAULT 'particular'
                          CHECK (school_type IN ('particular', 'publica', 'tecnica', 'universidade')),
  city             text   DEFAULT '',
  state            text   DEFAULT '',

  -- Contato
  contact_name     text   DEFAULT '',
  contact_role     text   DEFAULT '',
  phone            text   DEFAULT '',
  email            text   DEFAULT '',

  -- Pipeline
  status           text   DEFAULT 'identificado'
                          CHECK (status IN (
                            'identificado', 'contato', 'apresentacao',
                            'proposta', 'negociacao', 'fechado', 'perdido'
                          )),

  -- Ações
  notes            text   DEFAULT '',
  next_action      text   DEFAULT '',
  next_action_date text   DEFAULT '',

  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentee_prospects_mentee_id ON public.mentee_prospects(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentee_prospects_status    ON public.mentee_prospects(status);
CREATE INDEX IF NOT EXISTS idx_mentee_prospects_created   ON public.mentee_prospects(created_at DESC);

-- Row Level Security
ALTER TABLE public.mentee_prospects ENABLE ROW LEVEL SECURITY;

-- Admin: acesso total
CREATE POLICY "Admin full access on mentee_prospects"
  ON public.mentee_prospects FOR ALL
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Mentorada: acesso apenas aos seus próprios prospects
CREATE POLICY "Mentee can manage own prospects"
  ON public.mentee_prospects FOR ALL
  USING (
    mentee_id = (
      SELECT mentee_id::text FROM public.profiles WHERE id = auth.uid()
    )
  );

-- Auto-atualiza updated_at
DROP TRIGGER IF EXISTS mentee_prospects_updated_at ON public.mentee_prospects;
CREATE TRIGGER mentee_prospects_updated_at
  BEFORE UPDATE ON public.mentee_prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
