-- Adiciona coluna sdr_data a vini_leads para preservar metadados do SDR Agent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'sdr_data'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN sdr_data jsonb DEFAULT NULL;
  END IF;
END $$;
