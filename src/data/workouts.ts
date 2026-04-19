// Hypertrophy beginner plan — preloaded workouts A, B, C, D
export type Exercise = {
  id: string;
  name: string;
  sets: string; // e.g. "4"
  reps: string; // e.g. "12-15 → 10-12 → 8-10 → 6-8"
  rest: string; // e.g. "60-90s"
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
  title: "Lower body stretch & activation",
  kind: "stretch",
  exercises: [
    { id: "ls1", name: "Hip flexor stretch", sets: "1", reps: "30s each side", rest: "—" },
    { id: "ls2", name: "Glute bridge activation", sets: "2", reps: "15", rest: "30s" },
    { id: "ls3", name: "Bodyweight squats (slow)", sets: "1", reps: "15", rest: "—" },
  ],
};

const upperStretch: WorkoutSection = {
  title: "Upper body stretch & activation",
  kind: "stretch",
  exercises: [
    { id: "us1", name: "Shoulder rolls + arm circles", sets: "1", reps: "30s", rest: "—" },
    { id: "us2", name: "Cat-cow", sets: "2", reps: "10", rest: "—" },
    { id: "us3", name: "Band pull-aparts", sets: "2", reps: "15", rest: "30s" },
  ],
};

export const WORKOUTS: Workout[] = [
  {
    id: "A",
    name: "Workout A",
    focus: "Lower body — Quadriceps focus",
    emoji: "🦵",
    color: "primary",
    sections: [
      lowerStretch,
      {
        title: "Main workout",
        kind: "main",
        exercises: [
          { id: "a1", name: "Barbell back squat", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90-120s", notes: "Tempo 3-1-1, controlled descent" },
          { id: "a2", name: "Leg press", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90s", notes: "Feet low for quads" },
          { id: "a3", name: "Bulgarian split squat", sets: "3", reps: "10-12 each leg", rest: "60s", notes: "Front knee tracks toes" },
          { id: "a4", name: "Leg extension", sets: "3", reps: "12-15", rest: "60s", notes: "Drop set on last set" },
          { id: "a5", name: "Walking lunges", sets: "3", reps: "12 steps each leg", rest: "60s" },
          { id: "a6", name: "Standing calf raise", sets: "4", reps: "15-20", rest: "45s", notes: "2s isometric hold at top" },
        ],
      },
      {
        title: "Optional cardio",
        kind: "cardio",
        exercises: [
          { id: "ac1", name: "Incline walk", sets: "1", reps: "15 min @ incline 8", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "B",
    name: "Workout B",
    focus: "Upper body + abs + cardio",
    emoji: "💪",
    color: "secondary",
    sections: [
      upperStretch,
      {
        title: "Main workout",
        kind: "main",
        exercises: [
          { id: "b1", name: "Lat pulldown", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "75s", notes: "Squeeze lats at bottom" },
          { id: "b2", name: "Seated cable row", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "75s" },
          { id: "b3", name: "Dumbbell shoulder press", sets: "3", reps: "10-12", rest: "75s", notes: "Neutral grip" },
          { id: "b4", name: "Dumbbell chest press", sets: "3", reps: "10-12", rest: "75s" },
          { id: "b5", name: "Bicep curls", sets: "3", reps: "12", rest: "45s", notes: "Rest-pause on last set" },
          { id: "b6", name: "Triceps rope pushdown", sets: "3", reps: "12-15", rest: "45s" },
          { id: "b7", name: "Plank", sets: "3", reps: "45s hold", rest: "45s", notes: "Isometric — keep glutes tight" },
          { id: "b8", name: "Hanging knee raises", sets: "3", reps: "12-15", rest: "45s" },
        ],
      },
      {
        title: "Cardio finisher",
        kind: "cardio",
        exercises: [
          { id: "bc1", name: "Stationary bike intervals", sets: "1", reps: "10 min — 30s fast / 30s slow", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "C",
    name: "Workout C",
    focus: "Glutes & posterior chain",
    emoji: "🍑",
    color: "accent",
    sections: [
      lowerStretch,
      {
        title: "Main workout",
        kind: "main",
        exercises: [
          { id: "c1", name: "Hip thrust", sets: "4", reps: "12-15 → 10-12 → 8-10 → 6-8", rest: "90s", notes: "2s squeeze at top" },
          { id: "c2", name: "Romanian deadlift", sets: "4", reps: "10-12", rest: "90s", notes: "Slight knee bend, hinge at hips" },
          { id: "c3", name: "Cable kickback", sets: "3", reps: "12-15 each leg", rest: "45s" },
          { id: "c4", name: "Sumo deadlift", sets: "3", reps: "10", rest: "90s" },
          { id: "c5", name: "Glute medius abduction", sets: "3", reps: "15", rest: "45s", notes: "Drop set on last set" },
          { id: "c6", name: "Hyperextension", sets: "3", reps: "12-15", rest: "60s", notes: "Squeeze glutes, not lower back" },
        ],
      },
      {
        title: "Optional cardio",
        kind: "cardio",
        exercises: [
          { id: "cc1", name: "Stairmaster", sets: "1", reps: "12 min steady", rest: "—" },
        ],
      },
    ],
  },
  {
    id: "D",
    name: "Workout D",
    focus: "Full lower body (A + C combo)",
    emoji: "🔥",
    color: "primary",
    sections: [
      lowerStretch,
      {
        title: "Main workout",
        kind: "main",
        exercises: [
          { id: "d1", name: "Barbell back squat", sets: "4", reps: "10-12", rest: "90s" },
          { id: "d2", name: "Hip thrust", sets: "4", reps: "10-12", rest: "90s", notes: "2s squeeze at top" },
          { id: "d3", name: "Romanian deadlift", sets: "3", reps: "10", rest: "90s" },
          { id: "d4", name: "Walking lunges", sets: "3", reps: "12 each leg", rest: "60s" },
          { id: "d5", name: "Leg extension", sets: "3", reps: "12-15", rest: "45s", notes: "Rest-pause final set" },
          { id: "d6", name: "Standing calf raise", sets: "4", reps: "15-20", rest: "45s" },
        ],
      },
      {
        title: "Optional cardio",
        kind: "cardio",
        exercises: [
          { id: "dc1", name: "Incline walk", sets: "1", reps: "15 min @ incline 10", rest: "—" },
        ],
      },
    ],
  },
];

export const WORKOUT_BY_ID = Object.fromEntries(WORKOUTS.map(w => [w.id, w])) as Record<Workout["id"], Workout>;
