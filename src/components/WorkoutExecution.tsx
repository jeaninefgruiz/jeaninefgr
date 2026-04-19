import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Trophy } from "lucide-react";
import { WORKOUT_BY_ID, Workout, Exercise } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loadLS, saveLS, todayKey } from "@/lib/storage";
import { toast } from "sonner";

type SetLog = { weight: string; reps: string; done: boolean };
type ExerciseLog = { sets: SetLog[] };

const parseRestSeconds = (rest: string) => {
  const m = rest.match(/(\d+)/g);
  if (!m) return 60;
  const nums = m.map(Number);
  return Math.max(...nums);
};
const parseSets = (s: string) => Math.max(1, parseInt(s, 10) || 3);

export const WorkoutExecution = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workout = id ? WORKOUT_BY_ID[id as Workout["id"]] : undefined;

  const flatExercises = useMemo<Exercise[]>(() => {
    if (!workout) return [];
    return workout.sections.flatMap((s) => s.exercises);
  }, [workout]);

  const [logs, setLogs] = useState<Record<string, ExerciseLog>>(() => {
    if (!workout) return {};
    const init: Record<string, ExerciseLog> = {};
    workout.sections.forEach((s) =>
      s.exercises.forEach((ex) => {
        init[ex.id] = {
          sets: Array.from({ length: parseSets(ex.sets) }, () => ({ weight: "", reps: "", done: false })),
        };
      })
    );
    return init;
  });

  const [idx, setIdx] = useState(0);
  const current = flatExercises[idx];
  const total = flatExercises.length;

  // Rest timer
  const [restLeft, setRestLeft] = useState(0);
  const [restRunning, setRestRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!restRunning) return;
    intervalRef.current = window.setInterval(() => {
      setRestLeft((s) => {
        if (s <= 1) {
          setRestRunning(false);
          toast.success("Descanso terminou — bora! 💪");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [restRunning]);

  if (!workout || !current) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ChevronLeft className="mr-1 h-4 w-4" />Voltar</Button>
        <p>Treino não encontrado.</p>
      </div>
    );
  }

  const log = logs[current.id];
  const totalSetsAll = Object.values(logs).reduce((acc, l) => acc + l.sets.length, 0);
  const doneSetsAll = Object.values(logs).reduce((acc, l) => acc + l.sets.filter((s) => s.done).length, 0);
  const progress = totalSetsAll === 0 ? 0 : Math.round((doneSetsAll / totalSetsAll) * 100);

  const updateSet = (setIdx: number, patch: Partial<SetLog>) => {
    setLogs((prev) => ({
      ...prev,
      [current.id]: {
        sets: prev[current.id].sets.map((s, i) => (i === setIdx ? { ...s, ...patch } : s)),
      },
    }));
  };

  const completeSet = (setIdx: number) => {
    const wasDone = log.sets[setIdx].done;
    updateSet(setIdx, { done: !wasDone });
    if (!wasDone) {
      const seconds = parseRestSeconds(current.rest);
      setRestLeft(seconds);
      setRestRunning(true);
    }
  };

  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  const finish = () => {
    // Save completion
    const key = "workoutHistory";
    const history = loadLS<Record<string, string[]>>(key, {});
    const today = todayKey();
    const arr = history[today] ?? [];
    if (!arr.includes(workout.id)) arr.push(workout.id);
    history[today] = arr;
    saveLS(key, history);
    toast.success(`Treino ${workout.id} concluído! 🎉`);
    navigate("/stats");
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="mr-1 h-4 w-4" />Sair
        </Button>
        <div className="text-xs font-semibold text-muted-foreground">
          {idx + 1} / {total}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-semibold">
          <span>Progresso do treino</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Exercise card */}
      <div className="rounded-3xl bg-card p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{workout.name}</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight">{current.name}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span><strong className="text-foreground">{current.sets}</strong> séries</span>
          <span><strong className="text-foreground">{current.reps}</strong></span>
          <span>Descanso: <strong className="text-foreground">{current.rest}</strong></span>
        </div>
        {current.notes && (
          <p className="mt-3 rounded-xl bg-primary-soft p-3 text-xs text-primary">💡 {current.notes}</p>
        )}

        {/* Sets */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-[32px_1fr_1fr_44px] items-center gap-2 px-1 text-xs font-semibold text-muted-foreground">
            <span>#</span>
            <span>Carga</span>
            <span>Reps</span>
            <span></span>
          </div>
          {log.sets.map((s, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[32px_1fr_1fr_44px] items-center gap-2 rounded-2xl p-2 transition-all",
                s.done ? "bg-secondary-soft" : "bg-muted/40"
              )}
            >
              <span className="text-center text-sm font-bold">{i + 1}</span>
              <Input
                inputMode="decimal"
                placeholder="kg"
                value={s.weight}
                onChange={(e) => updateSet(i, { weight: e.target.value })}
                className="h-10 rounded-xl border-0 bg-card text-center"
              />
              <Input
                inputMode="numeric"
                placeholder="reps"
                value={s.reps}
                onChange={(e) => updateSet(i, { reps: e.target.value })}
                className="h-10 rounded-xl border-0 bg-card text-center"
              />
              <button
                onClick={() => completeSet(i)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-90",
                  s.done ? "gradient-success text-secondary-foreground shadow-success" : "bg-card text-muted-foreground"
                )}
              >
                <Check className="h-5 w-5" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rest timer */}
      {(restRunning || restLeft > 0) && (
        <div className="animate-slide-up rounded-3xl gradient-warm p-5 text-accent-foreground shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase opacity-90">Descanso</p>
              <p className="text-4xl font-bold tabular-nums">{fmt(restLeft)}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="secondary" className="h-11 w-11 rounded-2xl bg-white/25 text-accent-foreground hover:bg-white/35" onClick={() => setRestRunning((r) => !r)}>
                {restRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button size="icon" variant="secondary" className="h-11 w-11 rounded-2xl bg-white/25 text-accent-foreground hover:bg-white/35" onClick={() => { setRestLeft(0); setRestRunning(false); }}>
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 rounded-2xl h-12" onClick={prev} disabled={idx === 0}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
        </Button>
        {idx < total - 1 ? (
          <Button className="flex-1 rounded-2xl h-12 gradient-primary border-0" onClick={next}>
            Próximo <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button className="flex-1 rounded-2xl h-12 gradient-success border-0" onClick={finish}>
            <Trophy className="mr-1 h-4 w-4" /> Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};
