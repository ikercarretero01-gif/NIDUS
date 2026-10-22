-- ==============================================================================
-- SCHEMA SQL PARA NIDUS EN SUPABASE
-- Pega este script completo en: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Asegurar que la columna user_id exista si la tabla ya había sido creada previamente
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'local-user';

-- 2. Tabla de Metas de Proyectos (Roadmap)
CREATE TABLE IF NOT EXISTS public.project_goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'local-user',
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'todo',
  priority TEXT NOT NULL DEFAULT 'media',
  target_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.project_goals ADD COLUMN IF NOT EXISTS user_id TEXT NOT NULL DEFAULT 'local-user';

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

-- Índices de alto rendimiento para consultas filtradas por usuario
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_project_goals_user ON public.project_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_recurrence_rules_user ON public.recurrence_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_recurrence_completions_user ON public.recurrence_completions(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS): AISLAMIENTO ESTRICTO DE DATOS
-- ==============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrence_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurrence_completions ENABLE ROW LEVEL SECURITY;

-- 1. ELIMINAR POLÍTICAS OBSOLETAS O ANÓNIMAS ABIERTAS (Mitigación de vulnerabilidad)
DROP POLICY IF EXISTS "Anon all projects" ON public.projects;
DROP POLICY IF EXISTS "Anon all project_goals" ON public.project_goals;
DROP POLICY IF EXISTS "Anon all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Anon all recurrence_rules" ON public.recurrence_rules;
DROP POLICY IF EXISTS "Anon all recurrence_completions" ON public.recurrence_completions;

DROP POLICY IF EXISTS "Users own projects" ON public.projects;
DROP POLICY IF EXISTS "Users own project_goals" ON public.project_goals;
DROP POLICY IF EXISTS "Users own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users own recurrence_rules" ON public.recurrence_rules;
DROP POLICY IF EXISTS "Users own recurrence_completions" ON public.recurrence_completions;

-- 2. CREACIÓN DE POLÍTICAS RLS SEGURAS
-- Cada usuario solo puede consultar y mutar sus propias filas (auth.uid() = user_id)
-- o cuando se accede vía service_role / token de propietario verificado.
CREATE POLICY "Users own projects"
  ON public.projects
  FOR ALL
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  );

CREATE POLICY "Users own project_goals"
  ON public.project_goals
  FOR ALL
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  );

CREATE POLICY "Users own tasks"
  ON public.tasks
  FOR ALL
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  );

CREATE POLICY "Users own recurrence_rules"
  ON public.recurrence_rules
  FOR ALL
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  );

CREATE POLICY "Users own recurrence_completions"
  ON public.recurrence_completions
  FOR ALL
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
    OR auth.role() = 'service_role'
    OR (auth.jwt() ->> 'sub') = user_id
  );

-- ==============================================================================
-- HABILITAR REALTIME (Sincronización instantánea filtrada por usuario)
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
