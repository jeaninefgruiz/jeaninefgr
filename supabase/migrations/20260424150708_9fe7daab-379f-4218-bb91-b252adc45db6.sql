CREATE TABLE public.running_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, week, day)
);

ALTER TABLE public.running_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own running progress"
ON public.running_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own running progress"
ON public.running_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own running progress"
ON public.running_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own running progress"
ON public.running_progress FOR DELETE
USING (auth.uid() = user_id);