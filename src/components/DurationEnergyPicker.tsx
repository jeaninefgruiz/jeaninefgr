import { Zap, Battery, BatteryLow, Sprout, Dumbbell, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskDuration, TaskEnergy } from "@/lib/cloudStorage";

const DURATIONS: { id: TaskDuration; label: string; sub: string; Icon: typeof Zap }[] = [
  { id: "quick", label: "Rápida", sub: "≤5min", Icon: Zap },
  { id: "medium", label: "Média", sub: "~15min", Icon: Battery },
  { id: "long", label: "Longa", sub: "30min+", Icon: BatteryLow },
];

const ENERGIES: { id: TaskEnergy; label: string; Icon: typeof Sprout }[] = [
  { id: "light", label: "Leve", Icon: Sprout },
  { id: "medium", label: "Média", Icon: Dumbbell },
  { id: "heavy", label: "Pesada", Icon: Flame },
];

export const DurationEnergyPicker = ({
  duration,
  energy,
  onChange,
}: {
  duration: TaskDuration | null;
  energy: TaskEnergy | null;
  onChange: (d: TaskDuration | null, e: TaskEnergy | null) => void;
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Quanto tempo?</label>
        <div className="grid grid-cols-3 gap-1.5">
          {DURATIONS.map(({ id, label, sub, Icon }) => {
            const active = duration === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(active ? null : id, energy)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl border-2 p-2 transition-all active:scale-95",
                  active ? "border-primary bg-primary-soft" : "border-border bg-background"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[10px] text-muted-foreground">{sub}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Que energia exige?</label>
        <div className="grid grid-cols-3 gap-1.5">
          {ENERGIES.map(({ id, label, Icon }) => {
            const active = energy === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(duration, active ? null : id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-2xl border-2 p-2 transition-all active:scale-95",
                  active ? "border-secondary bg-secondary-soft" : "border-border bg-background"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-secondary" : "text-muted-foreground")} />
                <span className="text-xs font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};