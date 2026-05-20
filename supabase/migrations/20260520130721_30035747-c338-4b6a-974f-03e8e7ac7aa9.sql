
ALTER FUNCTION public.set_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Public read property-media" ON storage.objects;
CREATE POLICY "Public read property-media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-media' AND (storage.foldername(name))[1] IS NOT NULL);
