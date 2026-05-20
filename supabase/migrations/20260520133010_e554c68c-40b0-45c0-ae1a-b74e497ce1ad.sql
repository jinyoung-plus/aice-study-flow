-- Helper SQL functions to hash and verify passwords using pgcrypto.
CREATE OR REPLACE FUNCTION public.hash_password(pw text)
RETURNS text
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT crypt(pw, gen_salt('bf'));
$$;

CREATE OR REPLACE FUNCTION public.verify_password(pw text, hash text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT crypt(pw, hash) = hash;
$$;

REVOKE EXECUTE ON FUNCTION public.hash_password(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_password(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hash_password(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_password(text, text) TO service_role;