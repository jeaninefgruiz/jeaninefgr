// Cloud storage layer backed by Supabase, with one-time migration from localStorage.
import { supabase } from "@/integrations/supabase/client";
import { loadLS, saveLS, todayKey } from "./storage";

export type TaskDuration = "quick" | "medium" | "long";
export type TaskEnergy = "light" | "medium" | "heavy";
export type PlannerTask = {
  id: string;
  time: string;
  title: string;
  done: boolean;
  duration?: TaskDuration | null;
  energy?: TaskEnergy | null;
};

export type RoutinePeriod = "morning" | "afternoon" | "evening";
export type RoutineTask = {
  id: string;
  period: RoutinePeriod;
  time: string;
  title: string;
  duration?: TaskDuration | null;
  energy?: TaskEnergy | null;
  position: number;
};
export type Habits = { water: number; skincare: boolean; skincareNight: boolean; sleep: number };
export type WeekPlan = Record<string, string | null>;
export type WorkoutTime = "06:00" | "18:00";

const MIGRATION_FLAG = (uid: string) => `cloudMigrated:${uid}`;

// ---------- Planner ----------
export async function fetchPlanner(userId: string, day = todayKey()): Promise<PlannerTask[]> {
  const { data, error } = await supabase
    .from("planner_tasks")
    .select("id,time,title,done,duration,energy")
    .eq("user_id", userId)
    .eq("day", day)
    .order("time");
  if (error) throw error;
  return (data ?? []) as PlannerTask[];
}

export async function upsertPlannerTask(userId: string, day: string, t: PlannerTask) {
  const { error } = await supabase.from("planner_tasks").upsert({
    id: t.id, user_id: userId, day, time: t.time, title: t.title, done: t.done,
    duration: t.duration ?? null, energy: t.energy ?? null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deletePlannerTask(id: string) {
  const { error } = await supabase.from("planner_tasks").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Routines (recurring) ----------
export async function fetchRoutines(userId: string): Promise<RoutineTask[]> {
  const { data, error } = await supabase
    .from("routine_tasks")
    .select("id,period,time,title,duration,energy,position")
    .eq("user_id", userId)
    .order("position");
  if (error) throw error;
  return (data ?? []) as RoutineTask[];
}

export async function upsertRoutine(userId: string, r: RoutineTask) {
  const { error } = await supabase.from("routine_tasks").upsert({
    id: r.id, user_id: userId, period: r.period, time: r.time, title: r.title,
    duration: r.duration ?? null, energy: r.energy ?? null, position: r.position,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function deleteRoutine(id: string) {
  const { error } = await supabase.from("routine_tasks").delete().eq("id", id);
  if (error) throw error;
}

// Materialize routines into today's planner if not already added.
// Dedupe via source_routine_id unique index (user_id, day, source_routine_id).
export async function materializeRoutinesForDay(userId: string, day: string) {
  const routines = await fetchRoutines(userId);
  if (!routines.length) return;
  const { data: existing, error: exErr } = await supabase
    .from("planner_tasks")
    .select("source_routine_id")
    .eq("user_id", userId)
    .eq("day", day)
    .not("source_routine_id", "is", null);
  if (exErr) throw exErr;
  const seen = new Set((existing ?? []).map((r) => r.source_routine_id as string));
  const rows = routines
    .filter((r) => !seen.has(r.id))
    .map((r) => ({
      user_id: userId,
      day,
      time: r.time,
      title: r.title,
      done: false,
      duration: r.duration ?? null,
      energy: r.energy ?? null,
      source_routine_id: r.id,
    }));
  if (!rows.length) return;
  const { error } = await supabase.from("planner_tasks").insert(rows);
  if (error && error.code !== "23505") throw error;
}

// ---------- Habits ----------
export async function fetchHabits(userId: string, day = todayKey()): Promise<Habits> {
  const { data, error } = await supabase
    .from("habits_daily").select("water,steps,skincare_night,sleep")
    .eq("user_id", userId).eq("day", day).maybeSingle();
  if (error) throw error;
  return data
    ? {
        water: data.water,
        skincare: (data.steps ?? 0) > 0,
        skincareNight: (data.skincare_night ?? 0) > 0,
        sleep: Number(data.sleep),
      }
    : { water: 0, skincare: false, skincareNight: false, sleep: 0 };
}

export async function saveHabits(userId: string, day: string, h: Habits) {
  const { error } = await supabase.from("habits_daily").upsert(
    {
      user_id: userId, day, water: h.water,
      steps: h.skincare ? 1 : 0,
      skincare_night: h.skincareNight ? 1 : 0,
      sleep: h.sleep,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day" }
  );
  if (error) throw error;
}

// ---------- Workout history ----------
export async function fetchWorkoutHistory(userId: string): Promise<Record<string, string[]>> {
  const { data, error } = await supabase
    .from("workout_history").select("day,workout_id").eq("user_id", userId);
  if (error) throw error;
  const out: Record<string, string[]> = {};
  for (const row of data ?? []) {
    const k = row.day as string;
    if (!out[k]) out[k] = [];
    out[k].push(row.workout_id);
  }
  return out;
}

export async function logWorkoutDone(userId: string, day: string, workoutId: string) {
  const { error } = await supabase.from("workout_history").upsert(
    { user_id: userId, day, workout_id: workoutId },
    { onConflict: "user_id,day,workout_id" }
  );
  if (error) throw error;
}

export async function unlogWorkoutDone(userId: string, day: string, workoutId: string) {
  const { error } = await supabase
    .from("workout_history")
    .delete()
    .eq("user_id", userId)
    .eq("day", day)
    .eq("workout_id", workoutId);
  if (error) throw error;
}

export async function fetchWorkoutHistoryForDay(userId: string, day: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("workout_history")
    .select("workout_id")
    .eq("user_id", userId)
    .eq("day", day);
  if (error) throw error;
  return (data ?? []).map((r) => r.workout_id as string);
}

// ---------- Week plan ----------
export async function fetchWeekPlan(userId: string): Promise<WeekPlan> {
  const { data, error } = await supabase
    .from("week_plan").select("plan").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return ((data?.plan ?? {}) as WeekPlan);
}

export async function saveWeekPlan(userId: string, plan: WeekPlan) {
  const { error } = await supabase.from("week_plan").upsert(
    { user_id: userId, plan, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

// ---------- Prefs ----------
export async function fetchPrefs(userId: string): Promise<{ workoutTime: WorkoutTime }> {
  const { data, error } = await supabase
    .from("user_prefs").select("workout_time").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return { workoutTime: (data?.workout_time as WorkoutTime) ?? "18:00" };
}

export async function savePrefs(userId: string, workoutTime: WorkoutTime) {
  const { error } = await supabase.from("user_prefs").upsert(
    { user_id: userId, workout_time: workoutTime, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  if (error) throw error;
}

// ---------- Running progress ----------
export type RunKey = `${number}-${number}`; // `${week}-${day}`

export async function fetchRunningProgress(userId: string): Promise<Set<RunKey>> {
  const { data, error } = await supabase
    .from("running_progress").select("week,day").eq("user_id", userId);
  if (error) throw error;
  return new Set((data ?? []).map((r) => `${r.week}-${r.day}` as RunKey));
}

export async function toggleRunSession(
  userId: string,
  week: number,
  day: number,
  completed: boolean
) {
  if (completed) {
    const { error } = await supabase
      .from("running_progress")
      .upsert(
        { user_id: userId, week, day, completed_at: new Date().toISOString().slice(0, 10) },
        { onConflict: "user_id,week,day" }
      );
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("running_progress")
      .delete()
      .eq("user_id", userId)
      .eq("week", week)
      .eq("day", day);
    if (error) throw error;
  }
}

// ---------- One-time migration from localStorage ----------
export async function migrateLocalToCloud(userId: string) {
  if (loadLS<boolean>(MIGRATION_FLAG(userId), false)) return;
  try {
    // Planner: scan keys planner:YYYY-MM-DD
    const plannerRows: { id: string; user_id: string; day: string; time: string; title: string; done: boolean }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("planner:")) continue;
      const day = k.slice("planner:".length);
      const tasks = loadLS<PlannerTask[]>(k, []);
      for (const t of tasks) {
        plannerRows.push({ id: t.id, user_id: userId, day, time: t.time, title: t.title, done: t.done });
      }
    }
    if (plannerRows.length) await supabase.from("planner_tasks").upsert(plannerRows);

    // Habits
    const habitRows: { user_id: string; day: string; water: number; steps: number; sleep: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith("habits:")) continue;
      const day = k.slice("habits:".length);
      const h = loadLS<{ water: number; steps?: number; skincare?: boolean; sleep: number }>(k, { water: 0, sleep: 0 });
      habitRows.push({
        user_id: userId,
        day,
        water: h.water,
        steps: h.skincare ? 1 : (typeof h.steps === "number" ? (h.steps > 0 ? 1 : 0) : 0),
        sleep: h.sleep,
      });
    }
    if (habitRows.length) await supabase.from("habits_daily").upsert(habitRows, { onConflict: "user_id,day" });

    // Workout history
    const history = loadLS<Record<string, string[]>>("workoutHistory", {});
    const histRows: { user_id: string; day: string; workout_id: string }[] = [];
    for (const [day, ids] of Object.entries(history)) {
      for (const id of ids) histRows.push({ user_id: userId, day, workout_id: id });
    }
    if (histRows.length) await supabase.from("workout_history").upsert(histRows, { onConflict: "user_id,day,workout_id" });

    // Week plan
    const plan = loadLS<WeekPlan | null>("weekPlan", null);
    if (plan) await saveWeekPlan(userId, plan);

    // Prefs
    const prefs = loadLS<{ workoutTime: WorkoutTime } | null>("userPrefs", null);
    if (prefs?.workoutTime) await savePrefs(userId, prefs.workoutTime);

    saveLS(MIGRATION_FLAG(userId), true);
  } catch (e) {
    console.error("Migration failed", e);
  }
}
