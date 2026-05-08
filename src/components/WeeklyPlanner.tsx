import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchPlannerRange,
  materializeRoutinesForDay,
  upsertPlannerTask,
  type PlannerTask,
} from "@/lib/cloudStorage";
import { todayKey } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function fmtDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  r.setDate(r.getDate() - r.getDay()); // Sunday start
  return r;
}

export const WeeklyPlanner = () => {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
  const [tasksByDay, setTasksByDay] = useState<Record<string, PlannerTask[]>>({});
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        // Materialize routines for each day in the week
        await Promise.all(days.map((d) => materializeRoutinesForDay(user.id, fmtDay(d))));
        const map = await fetchPlannerRange(user.id, fmtDay(days[0]), fmtDay(days[6]));
        if (!cancelled) setTasksByDay(map);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, weekStart]);

  const todayStr = todayKey();

  const toggle = async (day: string, t: PlannerTask) => {
    if (!user) return;
    const updated = { ...t, done: !t.done };
    setTasksByDay((prev) => ({
      ...prev,
      [day]: (prev[day] ?? []).map((x) => (x.id === t.id ? updated : x)),
    }));
    await upsertPlannerTask(user.id, day, updated);
  };

  const rangeLabel = `${days[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} – ${days[6].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-2xl"
          onClick={() => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() - 7);
            setWeekStart(d);
          }}
          aria-label="Semana anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Semana</p>
          <p className="font-display text-base font-bold">{rangeLabel}</p>
          <button
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="text-[10px] text-primary underline-offset-2 hover:underline"
          >
            Hoje
          </button>
        </div>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-2xl"
          onClick={() => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + 7);
            setWeekStart(d);
          }}
          aria-label="Próxima semana"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2">
        {days.map((d) => {
          const key = fmtDay(d);
          const items = (tasksByDay[key] ?? []).slice().sort((a, b) => a.time.localeCompare(b.time));
          const done = items.filter((t) => t.done).length;
          const isToday = key === todayStr;
          return (
            <div
              key={key}
              className={cn(
                "rounded-2xl bg-card p-3 shadow-soft",
                isToday && "ring-2 ring-primary/40"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold",
                      isToday ? "gradient-primary text-primary-foreground" : "bg-muted text-foreground"
                    )}
                  >
                    {d.getDate()}
                  </span>
                  <div>
                    <p className="text-xs font-semibold">{WEEKDAY_SHORT[d.getDay()]}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {items.length === 0 ? "Sem tarefas" : `${done}/${items.length} concluídas`}
                    </p>
                  </div>
                </div>
              </div>
              {items.length > 0 && (
                <div className="space-y-1.5">
                  {items.map((t) => (
                    <div
                      key={t.id}
                      className={cn(
                        "flex items-center gap-2 rounded-xl bg-background/60 px-2.5 py-2",
                        t.done && "opacity-60"
                      )}
                    >
                      <button
                        onClick={() => toggle(key, t)}
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          t.done
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border hover:border-primary"
                        )}
                      >
                        {t.done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </button>
                      <span className="w-12 shrink-0 text-[11px] font-medium text-muted-foreground">
                        {t.time}
                      </span>
                      <span className={cn("min-w-0 flex-1 truncate text-sm", t.done && "line-through")}>
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {loading && <p className="text-center text-xs text-muted-foreground">Carregando…</p>}
    </div>
  );
};