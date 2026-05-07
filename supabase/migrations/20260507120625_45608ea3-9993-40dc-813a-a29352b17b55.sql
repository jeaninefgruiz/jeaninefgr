ALTER TABLE public.routine_tasks
  ADD COLUMN IF NOT EXISTS weekday smallint NULL,
  ADD COLUMN IF NOT EXISTS frequency text NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS anchor_date date NULL;

ALTER TABLE public.routine_tasks
  DROP CONSTRAINT IF EXISTS routine_tasks_frequency_check;
ALTER TABLE public.routine_tasks
  ADD CONSTRAINT routine_tasks_frequency_check
  CHECK (frequency IN ('daily','weekly','biweekly'));

ALTER TABLE public.routine_tasks
  DROP CONSTRAINT IF EXISTS routine_tasks_weekday_check;
ALTER TABLE public.routine_tasks
  ADD CONSTRAINT routine_tasks_weekday_check
  CHECK (weekday IS NULL OR (weekday BETWEEN 0 AND 6));