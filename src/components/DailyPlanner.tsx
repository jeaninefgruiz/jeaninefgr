import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Check, Trash2, Pencil, Sparkles, Repeat, Zap, Battery, BatteryLow, Sprout, Dumbbell, Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { todayKey } from "@/lib/storage";
import {
  fetchPlanner,
  upsertPlannerTask,
  deletePlannerTask,
  materializeRoutinesForDay,
  type PlannerTask,
  type TaskDuration,
  type TaskEnergy,
} from "@/lib/cloudStorage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Confetti } from "./Confetti";
import { DurationEnergyPicker } from "./DurationEnergyPicker";

const HOURS = Array.from({ length: 19 }, (_, i) => 5 + i); // 5..23

const durationMeta: Record<TaskDuration, { label: string; Icon: typeof Zap }> = {
  quick: { label: "≤5min", Icon: Zap },
  medium: { label: "~15min", Icon: Battery },
  long: { label: "30min+", Icon: BatteryLow },
};
const energyMeta: Record<TaskEnergy, { label: string; Icon: typeof Sprout }> = {
  light: { label: "Leve", Icon: Sprout },
  medium: { label: "Média", Icon: Dumbbell },
  heavy: { label: "Pesada", Icon: Flame },
};

const nowMinutes = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const toMin = (t: string) => {
  const [h, m] = t.split(":").map((n) => parseInt(n, 10));
  return h * 60 + m;
};

const ENCOURAGEMENTS = [
  "Mandou bem! 🎉",
  "Mais uma! ✨",
  "Você está em chamas! 🔥",
  "Continue assim! 💪",
  "Que orgulho! 🌟",
];

export const DailyPlanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlannerTask | null>(null);
  const [form, setForm] = useState<{ time: string; title: string; duration: TaskDuration | null; energy: TaskEnergy | null }>(
    { time: "09:00", title: "", duration: null, energy: null }
  );
  const [confettiKey, setConfettiKey] = useState(0);
  const [tick, setTick] = useState(0); // to refresh "now" highlight
  const focusRef = useRef<HTMLDivElement>(null);
  const day = todayKey();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        await materializeRoutinesForDay(user.id, day);
      } catch (e) {
        // non-blocking
        console.warn("Routine materialize failed", e);
      }
      try {
        const data = await fetchPlanner(user.id, day);
        setTasks(data);
      } catch (e: any) {
        toast.error(e.message);
      }
    })();
  }, [user, day]);

  // refresh "now" indicator every minute
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const sorted = useMemo(() => [...tasks].sort((a, b) => a.time.localeCompare(b.time)), [tasks]);
  const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
  const doneCount = tasks.filter((t) => t.done).length;

  // streak: consecutive completed tasks ending at the latest completion in time order
  const streak = useMemo(() => {
    let s = 0;
    for (const t of sorted) {
      if (t.done) s++;
      else s = 0;
    }
    return s;
  }, [sorted]);

  // Focus task: next undone (>= now), else first undone, else null
  const focusTask = useMemo(() => {
    void tick;
    const now = nowMinutes();
    const undone = sorted.filter((t) => !t.done);
    if (!undone.length) return null;
    const upcoming = undone.find((t) => toMin(t.time) >= now - 30);
    return upcoming ?? undone[0];
  }, [sorted, tick]);

  const upNext = useMemo(() => {
    if (!focusTask) return null;
    const idx = sorted.findIndex((t) => t.id === focusTask.id);
    return sorted.slice(idx + 1).find((t) => !t.done) ?? null;
  }, [sorted, focusTask]);

  const openAdd = () => {
    setEditing(null);
    const h = String(new Date().getHours()).padStart(2, "0");
    setForm({ time: `${h}:00`, title: "", duration: null, energy: null });
    setDialogOpen(true);
  };
  const openEdit = (t: PlannerTask) => {
    setEditing(t);
    setForm({ time: t.time, title: t.title, duration: t.duration ?? null, energy: t.energy ?? null });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!user || !form.title.trim()) return;
    if (editing) {
      const updated: PlannerTask = { ...editing, ...form, title: form.title.trim() };
      setTasks((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
      await upsertPlannerTask(user.id, day, updated);
      toast.success("Tarefa atualizada");
    } else {
      const t: PlannerTask = {
        id: crypto.randomUUID(),
        time: form.time,
        title: form.title.trim(),
        done: false,
        duration: form.duration,
        energy: form.energy,
      };
      setTasks((prev) => [...prev, t]);
      await upsertPlannerTask(user.id, day, t);
      toast.success("Tarefa adicionada");
    }
    setDialogOpen(false);
  };

  const toggle = async (id: string) => {
    if (!user) return;
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const updated = { ...target, done: !target.done };
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    await upsertPlannerTask(user.id, day, updated);
    if (updated.done) {
      setConfettiKey((k) => k + 1);
      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      toast.success(msg);
    }
  };
  const remove = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deletePlannerTask(id);
  };

  const tasksByHour = useMemo(() => {
    const map = new Map<number, PlannerTask[]>();
    sorted.forEach((t) => {
      const h = parseInt(t.time.split(":")[0], 10);
      if (!map.has(h)) map.set(h, []);
      map.get(h)!.push(t);
    });
    return map;
  }, [sorted]);

  const currentHour = new Date().getHours();
  // hide hours that have no tasks AND are far from current time → reduce visual overload
  const visibleHours = useMemo(() => {
    return HOURS.filter((h) => {
      if (tasksByHour.has(h)) return true;
      // keep window near current hour for context
      return Math.abs(h - currentHour) <= 1;
    });
  }, [tasksByHour, currentHour]);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{today}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Hoje</h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigate("/routines")}
            className="h-12 w-12 rounded-2xl"
            aria-label="Rotinas fixas"
          >
            <Repeat className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={openAdd} className="h-12 w-12 rounded-2xl shadow-glow gradient-primary border-0">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* FOCO AGORA — destaque para reduzir paralisia de decisão */}
      {focusTask ? (
        <div ref={focusRef} className="relative overflow-visible rounded-3xl gradient-primary p-5 text-primary-foreground shadow-glow">
          <Confetti trigger={confettiKey} />
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-primary-foreground/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
              Agora
            </span>
            <span className="text-xs opacity-90">{focusTask.time}</span>
          </div>
          <p className="text-2xl font-bold leading-tight">{focusTask.title}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {focusTask.duration && (
              <span className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                {(() => {
                  const M = durationMeta[focusTask.duration];
                  const Ic = M.Icon;
                  return <><Ic className="h-3 w-3" /> {M.label}</>;
                })()}
              </span>
            )}
            {focusTask.energy && (
              <span className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                {(() => {
                  const M = energyMeta[focusTask.energy];
                  const Ic = M.Icon;
                  return <><Ic className="h-3 w-3" /> {M.label}</>;
                })()}
              </span>
            )}
          </div>
          <button
            onClick={() => toggle(focusTask.id)}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-foreground py-3 font-bold text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="h-5 w-5" strokeWidth={3} />
            Concluir essa
          </button>
          {upNext && (
            <div className="mt-3 flex items-center gap-2 text-xs opacity-90">
              <ArrowRight className="h-3 w-3" />
              <span>Depois: {upNext.title} • {upNext.time}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative overflow-visible rounded-3xl gradient-success p-5 text-secondary-foreground shadow-success">
          <Confetti trigger={confettiKey} />
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7" />
            <div>
              <p className="text-sm opacity-90">{tasks.length === 0 ? "Dia em branco" : "Tudo feito hoje!"}</p>
              <p className="text-xl font-bold">{tasks.length === 0 ? "Adicione algo simples" : "Você arrasou 🎉"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mini-stats com dopamina */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Progresso</p>
          <p className="font-display text-xl font-bold text-primary">{progress}%</p>
        </div>
        <div className="rounded-2xl bg-card p-3 text-center shadow-soft">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Concluídas</p>
          <p className="font-display text-xl font-bold text-secondary">{doneCount}<span className="text-xs text-muted-foreground">/{tasks.length}</span></p>
        </div>
        <div className={cn("rounded-2xl p-3 text-center shadow-soft", streak >= 2 ? "gradient-warm text-accent-foreground" : "bg-card")}>
          <p className={cn("text-[10px] font-semibold uppercase tracking-wider", streak >= 2 ? "opacity-90" : "text-muted-foreground")}>Sequência</p>
          <p className="font-display text-xl font-bold">{streak >= 2 ? `🔥 ${streak}` : streak}</p>
        </div>
      </div>

      <div className="space-y-1">
        {visibleHours.map((h) => {
          const items = tasksByHour.get(h) ?? [];
          const label = `${String(h).padStart(2, "0")}:00`;
          const isCurrent = h === currentHour;
          return (
            <div key={h} className="flex gap-3">
              <div className={cn("w-14 pt-3 text-right text-xs font-medium", isCurrent ? "font-bold text-primary" : "text-muted-foreground")}>
                {label}
              </div>
              <div className={cn("flex-1 border-l pl-3", isCurrent ? "border-primary" : "border-border")}>
                {items.length === 0 ? (
                  <div className="h-8" />
                ) : (
                  <div className="space-y-2 py-1">
                    {items.map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          "group animate-slide-up flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-all",
                          t.done && "bg-secondary-soft",
                          focusTask?.id === t.id && !t.done && "ring-2 ring-primary/40"
                        )}
                      >
                        <button
                          onClick={() => toggle(t.id)}
                          className={cn(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            t.done
                              ? "border-secondary bg-secondary text-secondary-foreground"
                              : "border-border hover:border-primary"
                          )}
                        >
                          {t.done && <Check className="h-4 w-4 animate-check" strokeWidth={3} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className={cn("truncate text-sm font-medium", t.done && "text-muted-foreground line-through")}>
                            {t.title}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span>{t.time}</span>
                            {t.duration && (
                              <span className="flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5">
                                {(() => { const Ic = durationMeta[t.duration].Icon; return <Ic className="h-2.5 w-2.5" />; })()}
                                {durationMeta[t.duration].label}
                              </span>
                            )}
                            {t.energy && (
                              <span className="flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5">
                                {(() => { const Ic = energyMeta[t.energy].Icon; return <Ic className="h-2.5 w-2.5" />; })()}
                                {energyMeta[t.energy].label}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(t)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(t.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tarefa" : "Nova tarefa"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Horário</label>
              <Input
                type="time"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">O que você vai fazer?</label>
              <Input
                placeholder="ex.: Treino na academia"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="rounded-xl"
                autoFocus
              />
            </div>
            <DurationEnergyPicker
              duration={form.duration}
              energy={form.energy}
              onChange={(d, e) => setForm((f) => ({ ...f, duration: d, energy: e }))}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save} className="gradient-primary border-0">{editing ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
