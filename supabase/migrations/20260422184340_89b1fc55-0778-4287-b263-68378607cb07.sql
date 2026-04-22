-- Planner tasks
CREATE TABLE public.planner_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX planner_tasks_user_day_idx ON public.planner_tasks(user_id, day);
ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own planner tasks" ON public.planner_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own planner tasks" ON public.planner_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own planner tasks" ON public.planner_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own planner tasks" ON public.planner_tasks FOR DELETE USING (auth.uid() = user_id);

-- Habits daily check-in
CREATE TABLE public.habits_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  water INTEGER NOT NULL DEFAULT 0,
  steps INTEGER NOT NULL DEFAULT 0,
  sleep NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day)
);
ALTER TABLE public.habits_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own habits" ON public.habits_daily FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own habits" ON public.habits_daily FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own habits" ON public.habits_daily FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own habits" ON public.habits_daily FOR DELETE USING (auth.uid() = user_id);

-- Workout history (which workouts were done on a given day)
CREATE TABLE public.workout_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day DATE NOT NULL,
  workout_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day, workout_id)
);
CREATE INDEX workout_history_user_day_idx ON public.workout_history(user_id, day);
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own workout history" ON public.workout_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workout history" ON public.workout_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own workout history" ON public.workout_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own workout history" ON public.workout_history FOR DELETE USING (auth.uid() = user_id);

-- Week plan (one row per user, JSON of day->workout)
CREATE TABLE public.week_plan (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.week_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own week plan" ON public.week_plan FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own week plan" ON public.week_plan FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own week plan" ON public.week_plan FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own week plan" ON public.week_plan FOR DELETE USING (auth.uid() = user_id);

-- User preferences
CREATE TABLE public.user_prefs (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_time TEXT NOT NULL DEFAULT '18:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users select own prefs" ON public.user_prefs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own prefs" ON public.user_prefs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own prefs" ON public.user_prefs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own prefs" ON public.user_prefs FOR DELETE USING (auth.uid() = user_id);