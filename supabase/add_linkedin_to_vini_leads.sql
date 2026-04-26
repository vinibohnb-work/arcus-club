-- Add linkedin column to vini_leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vini_leads' AND column_name = 'linkedin'
  ) THEN
    ALTER TABLE public.vini_leads ADD COLUMN linkedin text DEFAULT '';
  END IF;
END $$;
