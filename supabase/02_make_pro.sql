-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 2 — Correr DESPUÉS de crear el usuario desde el Dashboard de Supabase
-- Activa el plan pro para elfabito@gmail.com
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO public.profiles (id, email, is_pro, pro_purchased_at)
SELECT id, email, true, now()
FROM auth.users
WHERE email = 'elfabito@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  is_pro = true,
  pro_purchased_at = COALESCE(profiles.pro_purchased_at, now()),
  email = EXCLUDED.email;
