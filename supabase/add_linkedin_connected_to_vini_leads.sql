-- Adiciona campo de conexão LinkedIn em vini_leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'linkedin_connected'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN linkedin_connected boolean DEFAULT false;
  END IF;
END $$;
