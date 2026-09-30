CREATE TABLE public.live_sessions (
  troop text PRIMARY KEY,
  game jsonb NOT NULL,
  live_players jsonb NOT NULL DEFAULT '[]'::jsonb,
  round integer NOT NULL DEFAULT 1,
  round_history jsonb NOT NULL DEFAULT '[]'::jsonb,
  scorekeeper_id text,
  scorekeeper_name text,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_sessions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_sessions TO authenticated;
GRANT ALL ON public.live_sessions TO service_role;

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY live_sessions_shared_all ON public.live_sessions
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE TRIGGER live_sessions_updated_at BEFORE UPDATE ON public.live_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.live_sessions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_sessions;