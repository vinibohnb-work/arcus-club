-- Migra leads existentes de sdr_leads → vini_leads
-- Execute uma única vez no SQL Editor do Supabase.
-- Leads já presentes em vini_leads (por linkedin ou phone) são ignorados.

INSERT INTO public.vini_leads (
  name,
  company,
  phone,
  linkedin,
  source,
  stage,
  notes,
  sdr_data,
  created_at,
  updated_at
)
SELECT
  -- Nome: founder_name tem prioridade; fallback para name ou company_name
  COALESCE(NULLIF(founder_name, ''), NULLIF(name, ''), NULLIF(company_name, ''), 'Lead SDR') AS name,

  COALESCE(company_name, '')    AS company,
  COALESCE(phone, '')           AS phone,
  COALESCE(linkedin_url, '')    AS linkedin,

  'SDR Agent'                   AS source,
  'mapeado'                     AS stage,

  -- Notas legíveis geradas a partir dos metadados
  TRIM(CONCAT_WS(E'\n',
    NULLIF(qualification_notes, ''),
    CASE WHEN city IS NOT NULL OR state IS NOT NULL
      THEN 'Localização: ' || CONCAT_WS(', ', NULLIF(city,''), NULLIF(state,''))
      ELSE NULL
    END,
    CASE WHEN segment IS NOT NULL THEN 'Segmento: ' || segment ELSE NULL END,
    CASE WHEN email    IS NOT NULL THEN 'E-mail: '   || email    ELSE NULL END,
    CASE WHEN website  IS NOT NULL THEN 'Site: '     || website  ELSE NULL END,
    CASE WHEN instagram_handle IS NOT NULL THEN 'Instagram: @' || instagram_handle ELSE NULL END
  )) AS notes,

  -- Metadados SDR preservados em jsonb
  jsonb_strip_nulls(jsonb_build_object(
    'score',               qualification_score,
    'qualification_notes', NULLIF(qualification_notes, ''),
    'original_source',     NULLIF(source, ''),
    'source_url',          NULLIF(source_url, ''),
    'source_query',        NULLIF(source_query, ''),
    'instagram_handle',    NULLIF(instagram_handle, ''),
    'email',               NULLIF(email, ''),
    'website',             NULLIF(website, ''),
    'cnpj',                NULLIF(cnpj, ''),
    'segment',             NULLIF(segment, ''),
    'employees_estimate',  NULLIF(employees_estimate, ''),
    'revenue_estimate',    NULLIF(revenue_estimate, ''),
    'city',                NULLIF(city, ''),
    'state',               NULLIF(state, ''),
    'raw_data',            raw_data
  )) AS sdr_data,

  created_at,
  updated_at

FROM public.sdr_leads s

-- Ignora se já existe lead com mesmo LinkedIn ou telefone em vini_leads
WHERE
  NOT EXISTS (
    SELECT 1 FROM public.vini_leads v
    WHERE v.linkedin <> '' AND v.linkedin = s.linkedin_url
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.vini_leads v
    WHERE v.phone <> '' AND v.phone = s.phone
  )
  -- Só migra leads qualificados (descarta os descartados)
  AND s.status <> 'descartado';

-- Resultado: quantos foram migrados
SELECT
  COUNT(*) FILTER (WHERE source = 'SDR Agent') AS total_sdr_no_crm
FROM public.vini_leads;
