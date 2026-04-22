import { useEffect, useMemo, useState } from "react";
import { Plus, Check, Trash2, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { todayKey } from "@/lib/storage";
import { fetchPlanner, upsertPlannerTask, deletePlannerTask, type PlannerTask } from "@/lib/cloudStorage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const HOURS = Array.from({ length: 17 }, (_, i) => 6 + i); // 6..22

export const DailyPlanner = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<PlannerTask[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PlannerTask | null>(null);
  const [form, setForm] = useState<{ time: string; title: string }>({ time: "09:00", title: "" });
  const day = todayKey();

  useEffect(() => {
    if (!user) return;
    fetchPlanner(user.id, day).then(setTasks).catch((e) => toast.error(e.message));
  }, [user, day]);

  const sorted = useMemo(() => [...tasks].sort((a, b) => a.time.localeCompare(b.time)), [tasks]);
  const progress = tasks.length === 0 ? 0 : Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);

  const openAdd = () => {
    setEditing(null);
    setForm({ time: "09:00", title: "" });
    setDialogOpen(true);
  };
  const openEdit = (t: PlannerTask) => {
    setEditing(t);
    setForm({ time: t.time, title: t.title });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!user || !form.title.trim()) return;
    if (editing) {
      const updated = { ...editing, ...form, title: form.title.trim() };
      setTasks((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
      await upsertPlannerTask(user.id, day, updated);
      toast.success("Tarefa atualizada");
    } else {
      const t: PlannerTask = { id: crypto.randomUUID(), time: form.time, title: form.title.trim(), done: false };
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

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{today}</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Hoje</h1>
        </div>
        <Button size="icon" onClick={openAdd} className="h-12 w-12 rounded-2xl shadow-glow gradient-primary border-0">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="rounded-3xl gradient-primary p-5 text-primary-foreground shadow-glow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Progresso do dia</p>
            <p className="text-4xl font-bold">{progress}%</p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <Sparkles className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs opacity-90">
          {tasks.filter((t) => t.done).length} de {tasks.length} tarefas concluídas
        </p>
      </div>

      <div className="space-y-1">
        {HOURS.map((h) => {
          const items = tasksByHour.get(h) ?? [];
          const label = `${String(h).padStart(2, "0")}:00`;
          return (
            <div key={h} className="flex gap-3">
              <div className="w-14 pt-3 text-right text-xs font-medium text-muted-foreground">{label}</div>
              <div className="flex-1 border-l border-border pl-3">
                {items.length === 0 ? (
                  <div className="h-12" />
                ) : (
                  <div className="space-y-2 py-1">
                    {items.map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          "group animate-slide-up flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-all",
                          t.done && "bg-secondary-soft"
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
                          <p className="text-xs text-muted-foreground">{t.time}</p>
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
