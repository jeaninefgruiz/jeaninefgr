import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { DailyPlanner } from "@/components/DailyPlanner";
import { WeeklyPlanner } from "@/components/WeeklyPlanner";
import { cn } from "@/lib/utils";

const Index = () => {
  const [view, setView] = useState<"day" | "week">("day");
  return (
    <AppShell>
      <div className="mb-4 inline-flex rounded-2xl bg-muted p-1">
        {(["day", "week"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "rounded-xl px-4 py-1.5 text-xs font-semibold transition-all",
              view === v ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"
            )}
          >
            {v === "day" ? "Dia" : "Semana"}
          </button>
        ))}
      </div>
      {view === "day" ? <DailyPlanner /> : <WeeklyPlanner />}
    </AppShell>
  );
};

export default Index;
