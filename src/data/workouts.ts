// Plano de hipertrofia para iniciantes — treinos A, B, C, D pré-carregados
export type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
};

export type WorkoutSection = {
  title: string;
  kind: "stretch" | "warmup" | "main" | "cardio";
  exercises: Exercise[];
};

export type Workout = {
  id: "A" | "B" | "C" | "D";
  name: string;
  focus: string;
  emoji: string;
  color: "primary" | "secondary" | "accent";
  sections: WorkoutSection[];
};

const lowerStretch: WorkoutSection = {
  title: "Alongamento e ativação inferior",
  kind: "stretch",
  exercises: [
    { id: "ls1", name: "Alongamento de flexor do quadril", sets: "1", reps: "30s cada lado", rest: "—" },
    { id: "ls2", name: "Ativação de glúteo (ponte)", sets: "2", reps: "15", rest: "30s" },
    { id: "ls3", name: "Agachamento livre lento", sets: "1", reps: "15", rest: "—" },
  ],
};

const upperStretch: WorkoutSection = {
  title: "Alongamento e ativação superior",
  kind: "stretch",
  exercises: [
    { id: "us1", name: "Rotação de ombros + círculos com os braços", sets: "1", reps: "30s", rest: "—" },
    { id: "us2", name: "Gato-camelo", sets: "2", reps: "10", rest: "—" },
    { id: "us3", name: "Abertura com elástico (band pull-apart)", sets: "2", reps: "15", rest: "30s" },
  ],
};

export const WORKOUTS: Workout[] = [
  {
    id: "A",
    name: "Treino A",
    focus: "Inferior — Foco em quadríceps",
    emoji: "🦵",
    color: "primary",
    sections: [
      lowerStretch,
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "a1", name: "Agachamento livre com barra", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90-120s", notes: "Tempo 3-1-1, descida controlada" },
          { id: "a2", name: "Leg press", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90s", notes: "Pés baixos para focar quadríceps" },
          { id: "a3", name: "Agachamento búlgaro", sets: "3", reps: "10-12 cada perna", rest: "60s", notes: "Joelho da frente alinhado com o pé" },
          { id: "a4", name: "Cadeira extensora", sets: "3", reps: "12-15", rest: "60s", notes: "Drop set na última série" },
          { id: "a5", name: "Avanço caminhando", sets: "3", reps: "12 passos cada perna", rest: "60s" },
          { id: "a6", name: "Panturrilha em pé", sets: "4", reps: "15-20", rest: "45s", notes: "Isometria de 2s no topo" },
        ],
      },
      {
        title: "Cardio opcional",
        kind: "cardio",
        exercises: [
          { id: "ac1", name: "Caminhada inclinada", sets: "1", reps: "15 min · inclinação 8", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "B",
    name: "Treino B",
    focus: "Superior + abdômen + cardio",
    emoji: "💪",
    color: "secondary",
    sections: [
      upperStretch,
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "b1", name: "Puxada alta (pulley)", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "75s", notes: "Apertar dorsais embaixo" },
          { id: "b2", name: "Remada sentada na polia", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "75s" },
          { id: "b3", name: "Desenvolvimento com halteres", sets: "3", reps: "10-12", rest: "75s", notes: "Pegada neutra" },
          { id: "b4", name: "Supino com halteres", sets: "3", reps: "10-12", rest: "75s" },
          { id: "b5", name: "Rosca direta", sets: "3", reps: "12", rest: "45s", notes: "Rest-pause na última série" },
          { id: "b6", name: "Tríceps na corda", sets: "3", reps: "12-15", rest: "45s" },
          { id: "b7", name: "Prancha", sets: "3", reps: "45s isometria", rest: "45s", notes: "Mantenha glúteos contraídos" },
          { id: "b8", name: "Elevação de joelhos suspenso", sets: "3", reps: "12-15", rest: "45s" },
        ],
      },
      {
        title: "Cardio finalizador",
        kind: "cardio",
        exercises: [
          { id: "bc1", name: "Bike — intervalado", sets: "1", reps: "10 min · 30s forte / 30s leve", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "C",
    name: "Treino C",
    focus: "Glúteos & cadeia posterior",
    emoji: "🍑",
    color: "accent",
    sections: [
      lowerStretch,
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "c1", name: "Elevação de quadril (hip thrust)", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90s", notes: "2s de contração no topo" },
          { id: "c2", name: "Levantamento terra romeno", sets: "4", reps: "10-12", rest: "90s", notes: "Joelho semiflexionado, dobra no quadril" },
          { id: "c3", name: "Coice na polia (kickback)", sets: "3", reps: "12-15 cada perna", rest: "45s" },
          { id: "c4", name: "Levantamento terra sumô", sets: "3", reps: "10", rest: "90s" },
          { id: "c5", name: "Abdução de glúteo médio", sets: "3", reps: "15", rest: "45s", notes: "Drop set na última série" },
          { id: "c6", name: "Hiperextensão lombar", sets: "3", reps: "12-15", rest: "60s", notes: "Contraia glúteos, não a lombar" },
        ],
      },
      {
        title: "Cardio opcional",
        kind: "cardio",
        exercises: [
          { id: "cc1", name: "Escada (stairmaster)", sets: "1", reps: "12 min ritmo constante", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "D",
    name: "Treino D",
    focus: "Inferior completo (combo A + C)",
    emoji: "🔥",
    color: "primary",
    sections: [
      lowerStretch,
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "d1", name: "Agachamento livre com barra", sets: "4", reps: "10-12", rest: "90s" },
          { id: "d2", name: "Elevação de quadril (hip thrust)", sets: "4", reps: "10-12", rest: "90s", notes: "2s de contração no topo" },
          { id: "d3", name: "Levantamento terra romeno", sets: "3", reps: "10", rest: "90s" },
          { id: "d4", name: "Avanço caminhando", sets: "3", reps: "12 cada perna", rest: "60s" },
          { id: "d5", name: "Cadeira extensora", sets: "3", reps: "12-15", rest: "45s", notes: "Rest-pause na última série" },
          { id: "d6", name: "Panturrilha em pé", sets: "4", reps: "15-20", rest: "45s" },
        ],
      },
      {
        title: "Cardio opcional",
        kind: "cardio",
        exercises: [
          { id: "dc1", name: "Caminhada inclinada", sets: "1", reps: "15 min · inclinação 10", rest: "—" },
        ],
      },
    ],
  },
];

export const WORKOUT_BY_ID = Object.fromEntries(WORKOUTS.map(w => [w.id, w])) as Record<Workout["id"], Workout>;
