
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Categories enum
CREATE TYPE public.property_category AS ENUM ('venda', 'locacao', 'administracao');

CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category property_category NOT NULL,
  property_type TEXT,
  price NUMERIC,
  bedrooms INT,
  bathrooms INT,
  parking INT,
  area_m2 NUMERIC,
  address TEXT,
  neighborhood TEXT,
  city TEXT DEFAULT 'Teresina',
  state TEXT DEFAULT 'PI',
  video_url TEXT,
  cover_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published properties" ON public.properties
  FOR SELECT USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update properties" ON public.properties
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete properties" ON public.properties
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.property_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media" ON public.property_media FOR SELECT USING (true);
CREATE POLICY "Admins insert media" ON public.property_media FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update media" ON public.property_media FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete media" ON public.property_media FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_properties_category ON public.properties(category);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_property_media_property ON public.property_media(property_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('property-media','property-media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read property-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-media');
CREATE POLICY "Admins upload property-media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update property-media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'property-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins delete property-media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'property-media' AND public.has_role(auth.uid(),'admin'));
