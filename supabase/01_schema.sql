-- ═══════════════════════════════════════════════════════════════════════════
-- PASO 1 — Correr primero
-- Crea las tablas, triggers y políticas RLS.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id                       uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                    text,
  is_pro                   boolean NOT NULL DEFAULT false,
  pro_purchased_at         timestamptz,
  stripe_customer_id       text,
  stripe_payment_intent_id text,
  created_at               timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.folders (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dynamic_qrs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shortcode       text NOT NULL UNIQUE,
  destination_url text NOT NULL,
  name            text,
  folder_id       uuid REFERENCES public.folders(id) ON DELETE SET NULL,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.scans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_id       uuid NOT NULL REFERENCES public.dynamic_qrs(id) ON DELETE CASCADE,
  scanned_at  timestamptz NOT NULL DEFAULT now(),
  country     text,
  device_type text,
  browser     text
);

CREATE TABLE IF NOT EXISTS public.brand_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  config     jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS dynamic_qrs_updated_at ON public.dynamic_qrs;
CREATE TRIGGER dynamic_qrs_updated_at
  BEFORE UPDATE ON public.dynamic_qrs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger: auto-crear profile al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_qrs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles: owner select" ON public.profiles;
DROP POLICY IF EXISTS "profiles: owner update" ON public.profiles;
CREATE POLICY "profiles: owner select"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: owner update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "folders: owner all" ON public.folders;
CREATE POLICY "folders: owner all"
  ON public.folders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "dynamic_qrs: owner all"     ON public.dynamic_qrs;
DROP POLICY IF EXISTS "dynamic_qrs: public select" ON public.dynamic_qrs;
CREATE POLICY "dynamic_qrs: owner all"
  ON public.dynamic_qrs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dynamic_qrs: public select"
  ON public.dynamic_qrs FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "scans: owner select" ON public.scans;
DROP POLICY IF EXISTS "scans: anon insert"  ON public.scans;
CREATE POLICY "scans: owner select"
  ON public.scans FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.dynamic_qrs
    WHERE dynamic_qrs.id = scans.qr_id AND dynamic_qrs.user_id = auth.uid()
  ));
CREATE POLICY "scans: anon insert"
  ON public.scans FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "brand_templates: owner all" ON public.brand_templates;
CREATE POLICY "brand_templates: owner all"
  ON public.brand_templates FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
