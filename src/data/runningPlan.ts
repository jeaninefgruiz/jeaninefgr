// Plano de corrida para iniciantes — 8 semanas, 3 sessões/semana
export type RunSession = { day: number; description: string };
export type RunWeek = { week: number; title: string; sessions: RunSession[] };

export const RUNNING_PLAN: RunWeek[] = [
  {
    week: 1,
    title: "Adaptação — corrida curta",
    sessions: [
      { day: 1, description: "Caminhe 5 min, corra 1 min — repita 5x" },
      { day: 2, description: "Caminhe 5 min, corra 1 min — repita 6x" },
      { day: 3, description: "Caminhe 5 min, corra 1 min — repita 7x" },
    ],
  },
  {
    week: 2,
    title: "Aumentando tempo de corrida",
    sessions: [
      { day: 1, description: "Caminhe 4 min, corra 2 min — repita 5x" },
      { day: 2, description: "Caminhe 4 min, corra 2 min — repita 6x" },
      { day: 3, description: "Caminhe 4 min, corra 2 min — repita 7x" },
    ],
  },
  {
    week: 3,
    title: "Equilíbrio caminhada/corrida",
    sessions: [
      { day: 1, description: "Caminhe 3 min, corra 3 min — repita 5x" },
      { day: 2, description: "Caminhe 3 min, corra 3 min — repita 6x" },
      { day: 3, description: "Caminhe 3 min, corra 3 min — repita 7x" },
    ],
  },
  {
    week: 4,
    title: "Mais corrida que caminhada",
    sessions: [
      { day: 1, description: "Caminhe 2 min, corra 4 min — repita 5x" },
      { day: 2, description: "Caminhe 2 min, corra 4 min — repita 6x" },
      { day: 3, description: "Caminhe 2 min, corra 4 min — repita 7x" },
    ],
  },
  {
    week: 5,
    title: "Tijolos de 5 min",
    sessions: [
      { day: 1, description: "Caminhe 2 min, corra 5 min — repita 5x" },
      { day: 2, description: "Caminhe 2 min, corra 5 min — repita 6x" },
      { day: 3, description: "Caminhe 2 min, corra 5 min — repita 7x" },
    ],
  },
  {
    week: 6,
    title: "Caminhada curta entre corridas",
    sessions: [
      { day: 1, description: "Caminhe 1 min, corra 6 min — repita 5x" },
      { day: 2, description: "Caminhe 1 min, corra 6 min — repita 6x" },
      { day: 3, description: "Caminhe 1 min, corra 6 min — repita 7x" },
    ],
  },
  {
    week: 7,
    title: "Tijolos longos",
    sessions: [
      { day: 1, description: "Caminhe 1 min, corra 8 min — repita 4x" },
      { day: 2, description: "Caminhe 1 min, corra 9 min — repita 4x" },
      { day: 3, description: "Caminhe 1 min, corra 10 min — repita 3x" },
    ],
  },
  {
    week: 8,
    title: "Corrida contínua",
    sessions: [
      { day: 1, description: "Caminhe 5 min, corra 20 min" },
      { day: 2, description: "Caminhe 5 min, corra 25 min" },
      { day: 3, description: "Caminhe 5 min, corra 30 min" },
    ],
  },
];