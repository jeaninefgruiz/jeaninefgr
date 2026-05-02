-- Add estimation fields to planner_tasks
ALTER TABLE public.planner_tasks
  ADD COLUMN IF NOT EXISTS duration text,
  ADD COLUMN IF NOT EXISTS energy text;

-- Create routine_tasks table for recurring daily routines
CREATE TABLE IF NOT EXISTS public.routine_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  period text NOT NULL DEFAULT 'morning',
  time text NOT NULL DEFAULT '07:00',
  title text NOT NULL,
  duration text,
  energy text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own routines"
  ON public.routine_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own routines"
  ON public.routine_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own routines"
  ON public.routine_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own routines"
  ON public.routine_tasks FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_routine_tasks_user ON public.routine_tasks(user_id, period, position);