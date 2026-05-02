import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, Sunrise, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchRoutines,
  upsertRoutine,
  deleteRoutine,
  type RoutineTask,
  type RoutinePeriod,
  type TaskDuration,
  type TaskEnergy,
} from "@/lib/cloudStorage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DurationEnergyPicker } from "./DurationEnergyPicker";

const PERIODS: { id: RoutinePeriod; label: string; Icon: typeof Sun; defaultTime: string }[] = [
  { id: "morning", label: "Manhã", Icon: Sunrise, defaultTime: "07:00" },
  { id: "afternoon", label: "Tarde", Icon: Sun, defaultTime: "13:00" },
  { id: "evening", label: "Noite", Icon: Moon, defaultTime: "21:00" },
];

export const RoutinesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [routines, setRoutines] = useState<RoutineTask[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ period: RoutinePeriod; time: string; title: string; duration: TaskDuration | null; energy: TaskEnergy | null }>(
    { period: "morning", time: "07:00", title: "", duration: null, energy: null }
  );

  useEffect(() => {
    if (!user) return;
    fetchRoutines(user.id).then(setRoutines).catch((e) => toast.error(e.message));
  }, [user]);

  const openAdd = (period: RoutinePeriod) => {
    const def = PERIODS.find((p) => p.id === period)!;
    setForm({ period, time: def.defaultTime, title: "", duration: null, energy: null });
    setOpen(true);
  };

  const save = async () => {
    if (!user || !form.title.trim()) return;
    const r: RoutineTask = {
      id: crypto.randomUUID(),
      period: form.period,
      time: form.time,
      title: form.title.trim(),
      duration: form.duration,
      energy: form.energy,
      position: routines.filter((x) => x.period === form.period).length,
    };
    setRoutines((prev) => [...prev, r]);
    await upsertRoutine(user.id, r);
    setOpen(false);
    toast.success("Rotina criada");
  };

  const remove = async (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    await deleteRoutine(id);
    toast.success("Rotina removida");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Aparecem todo dia automaticamente</p>
          <h1 className="font-display text-2xl font-bold tracking-tight">Rotinas fixas</h1>
        </div>
      </div>

      <p className="rounded-2xl bg-primary-soft p-3 text-xs text-foreground/80">
        ✨ Crie aqui suas rotinas de manhã e noite. Elas aparecem todos os dias no seu planner — sem precisar lembrar.
      </p>

      {PERIODS.map(({ id, label, Icon }) => {
        const items = routines.filter((r) => r.period === id).sort((a, b) => a.time.localeCompare(b.time));
        return (
          <section key={id} className="rounded-3xl bg-card p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">{label}</h2>
              </div>
              <Button size="sm" variant="ghost" onClick={() => openAdd(id)} className="h-8 gap-1 rounded-full">
                <Plus className="h-3.5 w-3.5" /> Adicionar
              </Button>
            </div>
            {items.length === 0 ? (
              <p className="py-3 text-center text-xs text-muted-foreground">Nenhuma rotina ainda</p>
            ) : (
              <ul className="space-y-2">
                {items.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-background p-3">
                    <span className="w-12 text-xs font-semibold text-muted-foreground">{r.time}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.title}</p>
                      <div className="mt-0.5 flex gap-1 text-[10px] text-muted-foreground">
                        {r.duration && <span>{durationLabel(r.duration)}</span>}
                        {r.duration && r.energy && <span>·</span>}
                        {r.energy && <span>{energyLabel(r.energy)}</span>}
                      </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(r.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Nova rotina</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {PERIODS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setForm((f) => ({ ...f, period: id }))}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-all",
                    form.period === id ? "border-primary bg-primary-soft" : "border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Horário</label>
              <Input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">O que você faz?</label>
              <Input
                placeholder="ex.: Skincare, tomar remédio…"
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
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={save} className="gradient-primary border-0">Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function durationLabel(d: TaskDuration) {
  return d === "quick" ? "⚡ Rápida" : d === "medium" ? "🔋 Média" : "🪫 Longa";
}
function energyLabel(e: TaskEnergy) {
  return e === "light" ? "🌱 Leve" : e === "medium" ? "💪 Média" : "🔥 Pesada";
}