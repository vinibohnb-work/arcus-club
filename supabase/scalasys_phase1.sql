-- ============================================================
-- SCALASYS — FASE 1 · Fundação
-- Rode este arquivo de uma vez no Supabase SQL Editor.
-- ============================================================

-- 1. Clientes ativos (substitui vini_epc_clients)
CREATE TABLE IF NOT EXISTS public.scalasys_clients (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  company            text DEFAULT '',
  status             text DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'finalizado')),
  start_date         date,
  monthly_recurring  numeric DEFAULT 0,
  phase              text DEFAULT '',
  next_action        text DEFAULT '',
  notes              text DEFAULT '',
  lead_id            uuid REFERENCES public.vini_leads(id) ON DELETE SET NULL,
  created_at         timestamptz DEFAULT NOW(),
  updated_at         timestamptz DEFAULT NOW()
);

-- 2. Projetos por cliente (kanban de entrega)
CREATE TABLE IF NOT EXISTS public.scalasys_projects (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          uuid REFERENCES public.scalasys_clients(id) ON DELETE CASCADE,
  name               text NOT NULL,
  scope_summary      text DEFAULT '',
  status             text DEFAULT 'diagnostico' CHECK (status IN ('diagnostico', 'desenvolvimento', 'revisao', 'entregue')),
  value              numeric DEFAULT 0,
  deadline           date,
  hours_per_week     numeric DEFAULT 0,
  next_step          text DEFAULT '',
  next_step_date     date,
  created_at         timestamptz DEFAULT NOW(),
  updated_at         timestamptz DEFAULT NOW()
);

-- 3. Catálogo de módulos (biblioteca reutilizável)
CREATE TABLE IF NOT EXISTS public.scalasys_modules (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  description        text DEFAULT '',
  decoupling_level   text DEFAULT 'chumbado' CHECK (decoupling_level IN ('chumbado', 'parcial', 'pronto')),
  notes              text DEFAULT '',
  created_at         timestamptz DEFAULT NOW(),
  updated_at         timestamptz DEFAULT NOW()
);

-- 4. Relação N:N projetos ↔ módulos
CREATE TABLE IF NOT EXISTS public.scalasys_project_modules (
  project_id         uuid REFERENCES public.scalasys_projects(id) ON DELETE CASCADE,
  module_id          uuid REFERENCES public.scalasys_modules(id) ON DELETE CASCADE,
  was_created_here   boolean DEFAULT false,
  notes              text DEFAULT '',
  created_at         timestamptz DEFAULT NOW(),
  PRIMARY KEY (project_id, module_id)
);

-- 5. Configurações (capacidade semanal)
CREATE TABLE IF NOT EXISTS public.scalasys_settings (
  id                              text PRIMARY KEY DEFAULT 'default',
  weekly_hours_total              numeric DEFAULT 40,
  weekly_hours_library_block      numeric DEFAULT 8,
  weekly_hours_positioning_block  numeric DEFAULT 6,
  updated_at                      timestamptz DEFAULT NOW()
);
INSERT INTO public.scalasys_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;

-- 6. Migrar dados existentes de vini_epc_clients → scalasys_clients (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vini_epc_clients') THEN
    INSERT INTO public.scalasys_clients (name, company, status, start_date, monthly_recurring, phase, next_action, created_at, updated_at)
    SELECT
      name,
      COALESCE(NULLIF(name, ''), '') AS company,
      COALESCE(status, 'ativo'),
      start_date,
      COALESCE(monthly_recurring, 0),
      COALESCE(phase, ''),
      COALESCE(next_action, ''),
      created_at,
      updated_at
    FROM public.vini_epc_clients
    WHERE NOT EXISTS (
      SELECT 1 FROM public.scalasys_clients sc WHERE sc.name = vini_epc_clients.name
    );
  END IF;
END $$;

-- 7. Verificação
SELECT 'scalasys_clients' AS tabela, COUNT(*) AS rows FROM public.scalasys_clients
UNION ALL SELECT 'scalasys_projects',         COUNT(*) FROM public.scalasys_projects
UNION ALL SELECT 'scalasys_modules',          COUNT(*) FROM public.scalasys_modules
UNION ALL SELECT 'scalasys_project_modules',  COUNT(*) FROM public.scalasys_project_modules
UNION ALL SELECT 'scalasys_settings',         COUNT(*) FROM public.scalasys_settings;
