import { useEffect, useMemo, useState } from "react";
import { Check, Footprints, Trophy } from "lucide-react";
import { RUNNING_PLAN } from "@/data/runningPlan";
import {
  fetchRunningProgress,
  toggleRunSession,
  type RunKey,
} from "@/lib/cloudStorage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const RunningPage = () => {
  const { user } = useAuth();
  const [done, setDone] = useState<Set<RunKey>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchRunningProgress(user.id)
      .then((s) => {
        setDone(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const totalSessions = useMemo(
    () => RUNNING_PLAN.reduce((acc, w) => acc + w.sessions.length, 0),
    []
  );
  const progress = totalSessions === 0 ? 0 : Math.round((done.size / totalSessions) * 100);

  const currentWeek = useMemo(() => {
    for (const w of RUNNING_PLAN) {
      const allDone = w.sessions.every((s) => done.has(`${w.week}-${s.day}` as RunKey));
      if (!allDone) return w.week;
    }
    return RUNNING_PLAN[RUNNING_PLAN.length - 1].week;
  }, [done]);

  const toggle = async (week: number, day: number) => {
    if (!user) return;
    const key = `${week}-${day}` as RunKey;
    const wasDone = done.has(key);
    const next = new Set(done);
    if (wasDone) next.delete(key);
    else next.add(key);
    setDone(next);
    try {
      await toggleRunSession(user.id, week, day, !wasDone);
      if (!wasDone) toast.success("Sessão concluída! 🏃‍♀️");
    } catch (e) {
      // revert
      setDone(done);
      toast.error("Não foi possível salvar");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">8 semanas · 3 sessões/sem</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Corrida iniciante</h1>
      </div>

      <div className="rounded-3xl gradient-warm p-5 text-accent-foreground shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Progresso geral</p>
            <p className="text-4xl font-bold">{progress}%</p>
            <p className="text-xs opacity-90">
              {done.size} de {totalSessions} sessões concluídas
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
            <Footprints className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {RUNNING_PLAN.map((w) => {
          const weekDone = w.sessions.filter((s) => done.has(`${w.week}-${s.day}` as RunKey)).length;
          const isCurrent = w.week === currentWeek;
          const isComplete = weekDone === w.sessions.length;
          return (
            <section
              key={w.week}
              className={cn(
                "rounded-3xl bg-card p-4 shadow-card transition-all",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              <header className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Semana {w.week}
                  </p>
                  <h2 className="text-base font-bold leading-tight">{w.title}</h2>
                </div>
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-bold",
                    isComplete
                      ? "gradient-success text-secondary-foreground shadow-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? <Trophy className="h-5 w-5" /> : `${weekDone}/${w.sessions.length}`}
                </div>
              </header>
              <div className="space-y-2">
                {w.sessions.map((s) => {
                  const checked = done.has(`${w.week}-${s.day}` as RunKey);
                  return (
                    <button
                      key={s.day}
                      type="button"
                      disabled={loading}
                      onClick={() => toggle(w.week, s.day)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all active:scale-[0.99]",
                        checked ? "bg-secondary-soft" : "bg-muted/40"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                          checked
                            ? "gradient-success text-secondary-foreground"
                            : "bg-card text-muted-foreground"
                        )}
                      >
                        {checked ? <Check className="h-5 w-5" strokeWidth={3} /> : `D${s.day}`}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Dia {s.day}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-medium leading-snug",
                            checked && "text-muted-foreground line-through"
                          )}
                        >
                          {s.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="px-1 text-center text-xs text-muted-foreground">
        Dica: faça as 3 sessões em dias não consecutivos da semana.
      </p>
    </div>
  );
};