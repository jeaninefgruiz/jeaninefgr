import { useMemo } from "react";
import { Flame, Trophy, Target, Calendar } from "lucide-react";
import { loadLS, todayKey } from "@/lib/storage";

const dayKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const StatsPage = () => {
  const history = loadLS<Record<string, string[]>>("workoutHistory", {});
  const weekPlan = loadLS<Record<string, string | null>>("weekPlan", {});

  const { streak, weekDone, weekPlanned, last7 } = useMemo(() => {
    // Streak: consecutive days back from today with at least 1 workout
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const k = dayKey(d);
      if (history[k] && history[k].length > 0) s++;
      else if (i > 0) break; // allow today empty without breaking
      else continue;
    }

    // Week: monday..today
    const todayIdx = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - todayIdx);

    let done = 0;
    const last7Arr: { label: string; done: boolean; today: boolean }[] = [];
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const k = dayKey(d);
      const has = !!(history[k] && history[k].length > 0);
      if (has) done++;
      last7Arr.push({ label: dayLabels[i], done: has, today: dayKey(d) === todayKey() });
    }

    const planned = Object.values(weekPlan).filter((v) => v && v !== "REST").length || 4;

    return { streak: s, weekDone: done, weekPlanned: planned, last7: last7Arr };
  }, [history, weekPlan]);

  const consistency = Math.round((weekDone / Math.max(1, weekPlanned)) * 100);
  const total = Object.values(history).reduce((a, v) => a + v.length, 0);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Your progress</p>
        <h1 className="text-3xl font-bold tracking-tight">Stats</h1>
      </div>

      <div className="rounded-3xl gradient-warm p-5 text-accent-foreground shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current streak</p>
            <p className="text-5xl font-bold">{streak}</p>
            <p className="text-sm opacity-90">{streak === 1 ? "day" : "days"} in a row</p>
          </div>
          <Flame className="h-14 w-14 opacity-90" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <Trophy className="mb-2 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">Total workouts</p>
        </div>
        <div className="rounded-3xl bg-card p-4 shadow-soft">
          <Target className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-2xl font-bold">{consistency}%</p>
          <p className="text-xs text-muted-foreground">This week</p>
        </div>
      </div>

      <div className="rounded-3xl bg-card p-5 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">This week</h2>
        </div>
        <div className="flex justify-between gap-2">
          {last7.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`flex h-10 w-full items-center justify-center rounded-xl text-sm font-bold transition-all ${
                  d.done
                    ? "gradient-success text-secondary-foreground shadow-success"
                    : d.today
                    ? "border-2 border-primary text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {d.done ? "✓" : d.label}
              </div>
              <span className="text-[10px] text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {weekDone} of {weekPlanned} planned workouts done
        </p>
      </div>
    </div>
  );
};
