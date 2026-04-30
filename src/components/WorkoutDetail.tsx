import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Play, Clock, Info } from "lucide-react";
import { WORKOUT_BY_ID, Workout } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sectionColor: Record<string, string> = {
  stretch: "bg-secondary-soft text-secondary",
  warmup: "bg-secondary-soft text-secondary",
  main: "bg-primary-soft text-primary",
};

const sectionLabel: Record<string, string> = {
  stretch: "Alongamento",
  warmup: "Aquecimento",
  main: "Principal",
};

export const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const workout = id ? WORKOUT_BY_ID[id as Workout["id"]] : undefined;

  if (!workout) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}><ChevronLeft className="mr-1 h-4 w-4" />Voltar</Button>
        <p>Treino não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full">
          <ChevronLeft className="mr-1 h-4 w-4" />Voltar
        </Button>
      </div>

      <div className="rounded-3xl gradient-primary p-6 text-primary-foreground shadow-glow">
        <div className="text-5xl">{workout.emoji}</div>
        <h1 className="mt-2 font-display text-2xl font-bold">{workout.name}</h1>
        <p className="opacity-90">{workout.focus}</p>
        <Link to={`/workouts/${workout.id}/start`}>
          <Button variant="secondary" className="mt-4 w-full rounded-2xl h-12 text-base font-semibold bg-background text-foreground hover:bg-background/90">
            <Play className="mr-2 h-5 w-5 fill-current" /> Iniciar treino
          </Button>
        </Link>
      </div>

      {workout.sections.map((s, idx) => (
        <section key={idx} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold uppercase", sectionColor[s.kind])}>
              {sectionLabel[s.kind]}
            </span>
            <h2 className="text-sm font-semibold">{s.title}</h2>
          </div>
          <div className="space-y-2">
            {s.exercises.map((ex) => (
              <div key={ex.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <p className="font-semibold">{ex.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span><strong className="text-foreground">{ex.sets}</strong> séries</span>
                  <span><strong className="text-foreground">{ex.reps}</strong></span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ex.rest}</span>
                </div>
                {ex.notes && (
                  <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-muted/60 p-2 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    {ex.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
