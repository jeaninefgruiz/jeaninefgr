import { useEffect, useRef, useState } from "react";
import { Droplet, Sparkles, Moon, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { todayKey } from "@/lib/storage";
import { fetchHabits, saveHabits, type Habits } from "@/lib/cloudStorage";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const goals = { water: 8, sleep: 8 };

export const HabitsPage = () => {
  const { user } = useAuth();
  const [h, setH] = useState<Habits>({ water: 0, skincare: false, sleep: 0 });
  const day = todayKey();
  const loadedRef = useRef(false);
  const saveTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchHabits(user.id, day).then((data) => {
      setH(data);
      loadedRef.current = true;
    });
  }, [user, day]);

  useEffect(() => {
    if (!user || !loadedRef.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveHabits(user.id, day, h);
    }, 400);
  }, [h, user, day]);

  const Card = ({
    icon: Icon, label, value, unit, goal, onChange, color, step = 1,
  }: {
    icon: typeof Droplet; label: string; value: number; unit: string; goal: number;
    onChange: (v: number) => void; color: "primary" | "secondary" | "accent"; step?: number;
  }) => {
    const pct = Math.min(100, Math.round((value / goal) * 100));
    const colorClass = color === "primary" ? "gradient-primary" : color === "secondary" ? "gradient-success" : "gradient-warm";
    return (
      <div className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClass} text-primary-foreground`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold">
                {value}<span className="text-sm font-medium text-muted-foreground"> / {goal} {unit}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl" onClick={() => onChange(Math.max(0, value - step))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" className="h-9 w-9 rounded-xl" onClick={() => onChange(value + step)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full ${colorClass} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Check-in diário</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Hábitos</h1>
      </div>

      <Card icon={Droplet} label="Água" value={h.water} unit="copos" goal={goals.water} color="primary"
        onChange={(v) => setH((p) => ({ ...p, water: v }))} />

      <button
        type="button"
        onClick={() => setH((p) => ({ ...p, skincare: !p.skincare }))}
        className="w-full rounded-3xl bg-card p-5 text-left shadow-card transition-all active:scale-[0.99]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl gradient-success text-secondary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Skincare</p>
              <p className="text-xl font-bold">
                {h.skincare ? "Feito hoje" : "Pendente"}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl border-2 transition-all",
              h.skincare
                ? "gradient-success border-secondary text-secondary-foreground shadow-success"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            <Check className="h-5 w-5" strokeWidth={3} />
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", h.skincare ? "gradient-success w-full" : "w-0")}
          />
        </div>
      </button>

      <Card icon={Moon} label="Sono" value={h.sleep} unit="h" goal={goals.sleep} color="accent"
        onChange={(v) => setH((p) => ({ ...p, sleep: v }))} />
    </div>
  );
};
