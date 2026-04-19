// User preferences (workout time, etc.)
import { loadLS, saveLS, todayKey } from "./storage";

export type WorkoutTime = "06:00" | "18:00";

const PREFS_KEY = "userPrefs";

export type Prefs = {
  workoutTime: WorkoutTime;
};

const DEFAULTS: Prefs = { workoutTime: "18:00" };

export const loadPrefs = (): Prefs => loadLS<Prefs>(PREFS_KEY, DEFAULTS);
export const savePrefs = (p: Prefs) => saveLS(PREFS_KEY, p);

// Inserts (or moves) the "Gym session" task in today's planner to the chosen time.
type PlannerTask = { id: string; time: string; title: string; done: boolean };

export const syncGymTaskToToday = (time: WorkoutTime) => {
  const key = `planner:${todayKey()}`;
  const tasks = loadLS<PlannerTask[]>(key, []);
  const idx = tasks.findIndex((t) => t.title.toLowerCase().includes("gym session"));
  if (idx >= 0) {
    tasks[idx] = { ...tasks[idx], time };
  } else {
    tasks.push({
      id: crypto.randomUUID(),
      time,
      title: "Gym session",
      done: false,
    });
  }
  saveLS(key, tasks);
};
