import { useEffect, useState } from "react";
import { Droplet, Footprints, Moon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadLS, saveLS, todayKey } from "@/lib/storage";

type Habits = { water: number; steps: number; sleep: number };

const key = () => `habits:${todayKey()}`;
const goals = { water: 8, steps: 8000, sleep: 8 };

export const HabitsPage = () => {
  const [h, setH] = useState<Habits>(() => loadLS<Habits>(key(), { water: 0, steps: 0, sleep: 0 }));
  useEffect(() => saveLS(key(), h), [h]);

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
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorClass} text-white`}>
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
        <p className="text-sm font-medium text-muted-foreground">Daily check-in</p>
        <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
      </div>

      <Card icon={Droplet} label="Water" value={h.water} unit="cups" goal={goals.water} color="primary"
        onChange={(v) => setH((p) => ({ ...p, water: v }))} />
      <Card icon={Footprints} label="Steps" value={h.steps} unit="" goal={goals.steps} color="secondary" step={500}
        onChange={(v) => setH((p) => ({ ...p, steps: v }))} />
      <Card icon={Moon} label="Sleep" value={h.sleep} unit="hrs" goal={goals.sleep} color="accent"
        onChange={(v) => setH((p) => ({ ...p, sleep: v }))} />
    </div>
  );
};
