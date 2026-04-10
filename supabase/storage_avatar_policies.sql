-- ============================================================
-- ARCUS CLUB — Políticas de Storage para avatars de mentorados
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Leitura pública para avatars (qualquer um pode ver a foto)
CREATE POLICY "avatars public read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'mentee-files'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Upload: usuário autenticado pode fazer upsert no próprio avatar
-- O nome do arquivo deve começar com o mentee_id do perfil do usuário
CREATE POLICY "avatars authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'mentee-files'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Update (upsert): mesmo que INSERT
CREATE POLICY "avatars authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'mentee-files'
  AND (storage.foldername(name))[1] = 'avatars'
);

-- Se o bucket não for público, certifique-se de que está marcado como público
-- no dashboard: Storage → mentee-files → Make Public
-- (necessário para getPublicUrl funcionar sem signed URLs)
