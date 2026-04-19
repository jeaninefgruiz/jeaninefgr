import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, Sun, Moon } from "lucide-react";
import { WORKOUTS, Workout } from "@/data/workouts";
import { cn } from "@/lib/utils";
import { loadLS, saveLS } from "@/lib/storage";
import { loadPrefs, savePrefs, syncGymTaskToToday, type WorkoutTime } from "@/lib/prefs";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABEL: Record<string, string> = {
  Mon: "Seg", Tue: "Ter", Wed: "Qua", Thu: "Qui", Fri: "Sex", Sat: "Sáb", Sun: "Dom",
};
type WeekPlan = Record<string, Workout["id"] | "REST" | "CARDIO" | null>;

const defaultPlan: WeekPlan = {
  Mon: "A", Tue: "B", Wed: "REST", Thu: "C", Fri: "B", Sat: "D", Sun: "REST",
};

const colorMap: Record<Workout["color"], string> = {
  primary: "gradient-primary text-primary-foreground",
  secondary: "gradient-success text-secondary-foreground",
  accent: "gradient-warm text-accent-foreground",
};

export const WorkoutsPage = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WeekPlan>(() => loadLS<WeekPlan>("weekPlan", defaultPlan));
  const [workoutTime, setWorkoutTime] = useState<WorkoutTime>(() => loadPrefs().workoutTime);
  useEffect(() => saveLS("weekPlan", plan), [plan]);

  const todayName = useMemo(() => {
    const idx = (new Date().getDay() + 6) % 7;
    return DAYS[idx];
  }, []);

  const chooseTime = (t: WorkoutTime) => {
    setWorkoutTime(t);
    savePrefs({ workoutTime: t });
    const todayPlan = plan[todayName];
    const isTrainingDay = todayPlan && todayPlan !== "REST";
    if (isTrainingDay) {
      syncGymTaskToToday(t);
      toast.success(`Treino marcado para ${t === "06:00" ? "6:00" : "18:00"}`, {
        description: "Planner de hoje atualizado",
      });
    } else {
      toast.success(`Treino marcado para ${t === "06:00" ? "6:00" : "18:00"}`);
    }
  };

  const cycle = (day: string) => {
    const order: (Workout["id"] | "REST" | "CARDIO" | null)[] = ["A", "B", "C", "D", "CARDIO", "REST", null];
    setPlan((p) => {
      const cur = p[day];
      const i = order.indexOf(cur ?? null);
      const next = order[(i + 1) % order.length];
      return { ...p, [day]: next };
    });
  };

  const presets: { label: string; freq: number; days: WeekPlan }[] = [
    { label: "3×/week", freq: 3, days: { Mon: "A", Tue: "REST", Wed: "B", Thu: "REST", Fri: "C", Sat: "REST", Sun: "REST" } },
    { label: "4×/week", freq: 4, days: { Mon: "A", Tue: "B", Wed: "REST", Thu: "C", Fri: "REST", Sat: "D", Sun: "REST" } },
    { label: "5×/week", freq: 5, days: { Mon: "A", Tue: "B", Wed: "C", Thu: "REST", Fri: "D", Sat: "B", Sun: "REST" } },
    { label: "6×/week", freq: 6, days: { Mon: "A", Tue: "B", Wed: "C", Thu: "D", Fri: "B", Sat: "CARDIO", Sun: "REST" } },
  ];

  const applyPreset = (p: WeekPlan, label: string) => {
    setPlan(p);
    toast.success(`Set to ${label}`);
  };

  const labelFor = (v: WeekPlan[string]) => {
    if (!v) return "—";
    if (v === "REST") return "Rest";
    if (v === "CARDIO") return "Cardio";
    return v;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Hypertrophy beginner plan</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Workouts</h1>
      </div>

      {/* Workout time preference */}
      <section className="rounded-3xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-semibold">Preferred workout time</h2>
        <div className="grid grid-cols-2 gap-2">
          {([
            { t: "06:00" as WorkoutTime, label: "6:00 AM", sub: "Morning", Icon: Sun },
            { t: "18:00" as WorkoutTime, label: "6:00 PM", sub: "Evening", Icon: Moon },
          ]).map(({ t, label, sub, Icon }) => {
            const active = workoutTime === t;
            return (
              <button
                key={t}
                onClick={() => chooseTime(t)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]",
                  active
                    ? "border-primary bg-primary-soft shadow-glow"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl",
                    active ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-muted-foreground">{sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Weekly planner */}
      <section className="rounded-3xl bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">This week — tap a day to change</h2>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((d) => {
            const v = plan[d];
            const isToday = d === todayName;
            const w = typeof v === "string" && v !== "REST" && v !== "CARDIO" ? WORKOUTS.find((x) => x.id === v) : undefined;
            return (
              <button
                key={d}
                onClick={() => cycle(d)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl p-2 transition-all active:scale-95",
                  isToday && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                  w && colorMap[w.color],
                  v === "REST" && "bg-muted text-muted-foreground",
                  v === "CARDIO" && "gradient-warm text-accent-foreground",
                  !v && "bg-muted/50 text-muted-foreground"
                )}
              >
                <span className="text-[10px] font-semibold uppercase opacity-80">{d}</span>
                <span className="text-base font-bold">{labelFor(v)}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <Button key={p.label} variant="outline" size="sm" className="rounded-full text-xs" onClick={() => applyPreset(p.days, p.label)}>
              {p.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Workout list */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">All workouts</h2>
        {WORKOUTS.map((w) => (
          <button
            key={w.id}
            onClick={() => navigate(`/workouts/${w.id}`)}
            className={cn(
              "flex w-full items-center gap-4 rounded-3xl p-5 text-left shadow-card transition-all hover:scale-[1.01] active:scale-[0.99]",
              colorMap[w.color]
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/25 text-3xl backdrop-blur">
              {w.emoji}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{w.name}</p>
              <p className="text-base font-bold leading-tight">{w.focus}</p>
              <p className="mt-0.5 text-xs opacity-80">
                {w.sections.find((s) => s.kind === "main")?.exercises.length ?? 0} exercises
              </p>
            </div>
            <ChevronRight className="h-5 w-5 opacity-80" />
          </button>
        ))}
      </section>
    </div>
  );
};
