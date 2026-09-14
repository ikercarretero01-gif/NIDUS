-- ==============================================================================
-- SCHEMA SQL PARA NIDUS EN SUPABASE
-- Pega este script completo en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de Metas de Proyectos (Roadmap)
CREATE TABLE IF NOT EXISTS public.project_goals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'media',
  target_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de Tareas
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  title TEXT NOT NULL,
  notes TEXT DEFAULT '',
  date TEXT NOT NULL,
  time TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  is_persistent_reminder BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'media',
  tag TEXT,
  project_id TEXT,
  project_goal_id TEXT,
  recurrence_rule_id TEXT,
  is_recurrence_exception BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Tabla de Reglas de Recurrencia (Hábitos y Rutinas)
CREATE TABLE IF NOT EXISTS public.recurrence_rules (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  task_template JSONB NOT NULL,
  frequency TEXT NOT NULL,
  interval INTEGER NOT NULL DEFAULT 1,
  days_of_week JSONB,
  day_of_month INTEGER,
  start_date TEXT NOT NULL,
  end_date TEXT,
  count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Tabla de Registro de Completados Recurrentes
CREATE TABLE IF NOT EXISTS public.recurrence_completions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  recurrence_rule_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- POLÍTICAS DE ACCESO (Permitir lectura y escritura con la anon key)
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrence_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrence_completions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon all projects') THEN
    CREATE POLICY "Anon all projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon all project_goals') THEN
    CREATE POLICY "Anon all project_goals" ON public.project_goals FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon all tasks') THEN
    CREATE POLICY "Anon all tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon all recurrence_rules') THEN
    CREATE POLICY "Anon all recurrence_rules" ON public.recurrence_rules FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anon all recurrence_completions') THEN
    CREATE POLICY "Anon all recurrence_completions" ON public.recurrence_completions FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ==============================================================================
-- HABILITAR REALTIME (Para sincronización instantánea entre móvil y portátil)
-- ==============================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.project_goals;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.recurrence_rules;
  EXCEPTION WHEN duplicate_object THEN END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.recurrence_completions;
  EXCEPTION WHEN duplicate_object THEN END;
END $$;
