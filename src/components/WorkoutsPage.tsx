import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, Sun, Moon } from "lucide-react";
import { WORKOUTS, Workout } from "@/data/workouts";
import { cn } from "@/lib/utils";
import { fetchWeekPlan, saveWeekPlan, fetchPrefs, savePrefs as savePrefsCloud, type WeekPlan, type WorkoutTime } from "@/lib/cloudStorage";
import { syncGymTaskToToday } from "@/lib/prefs";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABEL: Record<string, string> = {
  Mon: "Seg", Tue: "Ter", Wed: "Qua", Thu: "Qui", Fri: "Sex", Sat: "Sáb", Sun: "Dom",
};

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
  const { user } = useAuth();
  const [plan, setPlan] = useState<WeekPlan>(defaultPlan);
  const [workoutTime, setWorkoutTime] = useState<WorkoutTime>("18:00");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchWeekPlan(user.id), fetchPrefs(user.id)]).then(([p, prefs]) => {
      if (p && Object.keys(p).length > 0) setPlan(p);
      setWorkoutTime(prefs.workoutTime);
      setLoaded(true);
    });
  }, [user]);

  const todayName = useMemo(() => {
    const idx = (new Date().getDay() + 6) % 7;
    return DAYS[idx];
  }, []);

  const chooseTime = async (t: WorkoutTime) => {
    if (!user) return;
    setWorkoutTime(t);
    await savePrefsCloud(user.id, t);
    const todayPlan = plan[todayName];
    const isTrainingDay = todayPlan && todayPlan !== "REST";
    if (isTrainingDay) {
      await syncGymTaskToToday(user.id, t);
      toast.success(`Treino marcado para ${t === "06:00" ? "6:00" : "18:00"}`, {
        description: "Planner de hoje atualizado",
      });
    } else {
      toast.success(`Treino marcado para ${t === "06:00" ? "6:00" : "18:00"}`);
    }
  };

  const cycle = async (day: string) => {
    if (!user) return;
    const order: (Workout["id"] | "REST" | "CARDIO" | null)[] = ["A", "B", "C", "D", "CARDIO", "REST", null];
    const cur = plan[day];
    const i = order.indexOf((cur as Workout["id"] | "REST" | "CARDIO" | null) ?? null);
    const next = order[(i + 1) % order.length];
    const newPlan = { ...plan, [day]: next };
    setPlan(newPlan);
    await saveWeekPlan(user.id, newPlan);
  };

  const presets: { label: string; freq: number; days: WeekPlan }[] = [
    { label: "3×/sem", freq: 3, days: { Mon: "A", Tue: "REST", Wed: "B", Thu: "REST", Fri: "C", Sat: "REST", Sun: "REST" } },
    { label: "4×/sem", freq: 4, days: { Mon: "A", Tue: "B", Wed: "REST", Thu: "C", Fri: "REST", Sat: "D", Sun: "REST" } },
    { label: "5×/sem", freq: 5, days: { Mon: "A", Tue: "B", Wed: "C", Thu: "REST", Fri: "D", Sat: "B", Sun: "REST" } },
    { label: "6×/sem", freq: 6, days: { Mon: "A", Tue: "B", Wed: "C", Thu: "D", Fri: "B", Sat: "CARDIO", Sun: "REST" } },
  ];

  const applyPreset = async (p: WeekPlan, label: string) => {
    if (!user) return;
    setPlan(p);
    await saveWeekPlan(user.id, p);
    toast.success(`Definido para ${label}`);
  };

  const labelFor = (v: WeekPlan[string]) => {
    if (!v) return "—";
    if (v === "REST") return "Folga";
    if (v === "CARDIO") return "Cardio";
    return v;
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Plano de hipertrofia (iniciante)</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Treinos</h1>
      </div>

      <section className="rounded-3xl bg-card p-4 shadow-card">
        <h2 className="mb-3 text-sm font-semibold">Horário preferido do treino</h2>
        <div className="grid grid-cols-2 gap-2">
          {([
            { t: "06:00" as WorkoutTime, label: "6:00", sub: "Manhã", Icon: Sun },
            { t: "18:00" as WorkoutTime, label: "18:00", sub: "Noite", Icon: Moon },
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

      <section className="rounded-3xl bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Esta semana — toque para mudar</h2>
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
                <span className="text-[10px] font-semibold uppercase opacity-80">{DAY_LABEL[d]}</span>
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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">Todos os treinos</h2>
        {WORKOUTS.map((w) => (
          <button
            key={w.id}
            onClick={() => navigate(`/workouts/${w.id}`)}
            className={cn(
              "flex w-full items-center gap-4 rounded-3xl p-5 text-left shadow-card transition-all hover:scale-[1.01] active:scale-[0.99]",
              colorMap[w.color]
            )}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/20 text-3xl backdrop-blur">
              {w.emoji}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{w.name}</p>
              <p className="text-base font-bold leading-tight">{w.focus}</p>
              <p className="mt-0.5 text-xs opacity-80">
                {w.sections.find((s) => s.kind === "main")?.exercises.length ?? 0} exercícios
              </p>
            </div>
            <ChevronRight className="h-5 w-5 opacity-80" />
          </button>
        ))}
      </section>
    </div>
  );
};
