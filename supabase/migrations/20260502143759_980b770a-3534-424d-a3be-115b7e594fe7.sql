ALTER TABLE public.planner_tasks
  ADD COLUMN IF NOT EXISTS source_routine_id uuid;

CREATE UNIQUE INDEX IF NOT EXISTS planner_tasks_routine_day_unique
  ON public.planner_tasks(user_id, day, source_routine_id)
  WHERE source_routine_id IS NOT NULL;