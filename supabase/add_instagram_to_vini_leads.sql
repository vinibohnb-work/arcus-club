-- Adiciona campos de Instagram em vini_leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'instagram'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN instagram text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'instagram_connected'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN instagram_connected boolean DEFAULT false;
  END IF;
END $$;
