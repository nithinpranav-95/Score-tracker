CREATE TABLE public.troops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX troops_name_lower_idx ON public.troops (lower(name));
GRANT SELECT, INSERT ON public.troops TO anon, authenticated;
GRANT ALL ON public.troops TO service_role;
ALTER TABLE public.troops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read troops" ON public.troops FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create troops" ON public.troops FOR INSERT TO anon, authenticated WITH CHECK (true);
INSERT INTO public.troops (name) VALUES ('Connect with pani poori');
ALTER TABLE public.players ADD COLUMN troop text NOT NULL DEFAULT 'Connect with pani poori';