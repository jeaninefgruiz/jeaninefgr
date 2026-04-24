// Plano de hipertrofia para iniciantes — Natflix Fitness (Jul/24)
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
  kind: "stretch" | "warmup" | "main";
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

const lowerStretch = (idPrefix: string): WorkoutSection => ({
  title: "Alongamento — Inferiores",
  kind: "stretch",
  exercises: [
    { id: `${idPrefix}ls1`, name: "Mobilidade dinâmica de quadril + abertura de quadril", sets: "1 + 2", reps: "10 + 8 cada lado", rest: "—" },
    { id: `${idPrefix}ls2`, name: "Alongamento posterior, tornozelo + adutor de coxa", sets: "1", reps: "10 movimentos, sustentar 10s na frente cada lado", rest: "—" },
    { id: `${idPrefix}ls3`, name: "Alongamento posterior de coxa", sets: "2", reps: "40s cada perna", rest: "—" },
    { id: `${idPrefix}ls4`, name: "Alongamento reto femural", sets: "2", reps: "30s cada lado", rest: "—" },
    { id: `${idPrefix}ls5`, name: "Alongamento de adutores", sets: "1", reps: "30s + 40s forçando perna p/ baixo", rest: "—" },
    { id: `${idPrefix}ls6`, name: "Mobilidade dinâmica (joelhos no chão)", sets: "1", reps: "20 totais (10 cada lado)", rest: "—" },
  ],
});

const upperStretch = (idPrefix: string): WorkoutSection => ({
  title: "Alongamento — Superiores",
  kind: "stretch",
  exercises: [
    { id: `${idPrefix}us1`, name: "Alongamento para lombar (criança + cobra/cachorro)", sets: "2 + 1", reps: "30s + 8 movimentos", rest: "—" },
    { id: `${idPrefix}us2`, name: "Alongamento para ombros (cruzado no peito)", sets: "1 + 2", reps: "16 totais + 20s cada lado", rest: "—" },
    { id: `${idPrefix}us3`, name: "Alongamento para tríceps", sets: "2", reps: "30s cada braço", rest: "—" },
    { id: `${idPrefix}us4`, name: "Alongamento de punho", sets: "1", reps: "15 movimentos frente e trás", rest: "—" },
    { id: `${idPrefix}us5`, name: "Alongamento peitoral", sets: "1", reps: "40s + 20s cada lado", rest: "—" },
    { id: `${idPrefix}us6`, name: "Alongamento dinâmico (prancha lateral c/ rotação)", sets: "1", reps: "16 totais (8 cada lado)", rest: "—" },
  ],
});

export const WORKOUTS: Workout[] = [
  {
    id: "A",
    name: "Treino A",
    focus: "Inferior — Foco em quadríceps",
    emoji: "🦵",
    color: "primary",
    sections: [
      lowerStretch("a"),
      {
        title: "Ativação e aquecimento",
        kind: "warmup",
        exercises: [
          { id: "aw1", name: "Cócoras com peso (5s isometria) + agachamento lateral sem peso", sets: "2", reps: "10 totais + 10 cada lado", rest: "30s", notes: "Peso leve apenas para ativar a musculatura." },
          { id: "aw2", name: "Aquecimento — Cadeira extensora", sets: "1", reps: "15 a 20", rest: "—", notes: "Peso leve apenas para aquecer." },
        ],
      },
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "a1", name: "Cadeira extensora", sets: "4", reps: "1ª: 12-15 (desc. 3s + 1s topo) · 2ª: 10-12 pesadas · 3ª: 8-10 pesadas · 4ª: 8-10 → -2 placas → 10-12 → -2 placas → 12-15", rest: "1 - 1:10 min", notes: "Aumente o peso a cada série. 4ª série em drop set duplo." },
          { id: "a2", name: "Afundo base parada no Smith com step no pé da frente", sets: "4", reps: "1ª: 12 cada perna · 2ª: 10 · 3ª: 8 · 4ª: 6-8 → 20s descanso → máximo (cada perna)", rest: "30-40s entre pernas / 1min entre séries", notes: "Aumente o peso até a 3ª série. 4ª série com rest-pause até a falha." },
          { id: "a3", name: "Agachamento livre ou no Smith (2 últimas séries conjugadas com goblet)", sets: "4", reps: "1ª e 2ª: 10-12 (desc. 2s + 1s embaixo) · 3ª: 8-10 + 12-15 goblet · 4ª: 8-10 + 15-20 goblet", rest: "1 - 1:10 min", notes: "Sustente 1s embaixo nas duas primeiras." },
          { id: "a4", name: "Leg press 45 ou horizontal", sets: "4", reps: "1ª: 12-15 (desc. 3s) · 2ª: 10-12 (desc. 3s) · 3ª: 8-10 com 2s embaixo · 4ª: 8-10 com rest-pause", rest: "1 - 1:10 min", notes: "Aumente o peso a cada série. 4ª: 8-10 → 20s → máximo até a falha." },
          { id: "a5", name: "Passada com halteres nas mãos (revezando com peso corporal)", sets: "4", reps: "1ª: 12/12 c/ peso · 2ª: 8/8 c/ peso + 10/10 sem peso · 3ª: 12/12 · 4ª: 8/8 c/ peso + 15/15 sem peso", rest: "1 - 1:10 min" },
          { id: "a6", name: "Panturrilha no leg ou na máquina", sets: "3", reps: "1ª: 15 · 2ª: 12 · 3ª: 10 com drop set", rest: "40s", notes: "Aumente o peso a cada série. 3ª: 10 → reduz peso → máximo (falha)." },
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
      upperStretch("b"),
      {
        title: "Mobilidade e aquecimento",
        kind: "warmup",
        exercises: [
          { id: "bw1", name: "Mobilidade de ombro com anilha + crucifixo inverso peso leve (1s em cima)", sets: "2", reps: "10 + 10 cada lado", rest: "30s", notes: "Peso baixo no crucifixo, execução bem controlada." },
          { id: "bw2", name: "Aquecimento — Elevação lateral com halteres em pé", sets: "1", reps: "15 a 20", rest: "1min", notes: "Peso baixo apenas para aquecer." },
        ],
      },
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "b1", name: "Elevação lateral com halteres em pé (2 últimas conjugadas c/ sentada)", sets: "4", reps: "1ª: 12-15 · 2ª: 10-12 · 3ª: 8-10 em pé + 10 sentada · 4ª: cluster 5-5-5 + 10 sentada", rest: "1:20 min", notes: "Aumente o peso até a 3ª. 4ª: 5 em pé → 20s → 5 → 20s → 5 → reduz peso → 10 sentada." },
          { id: "b2", name: "Desenvolvimento aberto unilateral c/ halter ou na máquina", sets: "4", reps: "1ª: 15 cada braço · 2ª: 12 · 3ª: 10 · 4ª: cluster 6-6-6 cada braço", rest: "40s", notes: "4ª: 6 → 20s → 6 → 20s → 6 (mesmo braço, depois repete no outro)." },
          { id: "b3", name: "Remada alta com halteres + Elevação frontal sentada alternada", sets: "3", reps: "1ª: 12-15 + 12 · 2ª: 10-12 + 12 · 3ª: 8-10 + cluster 5-5-5-5 frontal", rest: "1min", notes: "3ª frontal: 5 → 20s → 5 → 20s → 5 → 20s → 5." },
          { id: "b4", name: "Puxada aberta no pulley", sets: "4", reps: "1ª: 12 (2s embaixo) · 2ª: 10 · 3ª: 8 · 4ª: 6 com drop set", rest: "1min", notes: "Sustente 2s embaixo. 4ª: 6 pesadas → reduz peso → máximo (falha)." },
          { id: "b5", name: "Remada baixa triângulo + Pulldown com barra no cross", sets: "4", reps: "1ª: 12-15 (2s atrás) + 10-12 · 2ª: 10-12 + 10-12 · 3ª: 8-10 c/ drop set + 10-12", rest: "1min", notes: "3ª remada: 8-10 → reduz peso → máximo, depois 10-12 pulldown." },
          { id: "b6", name: "Supino banco inclinado c/ halteres + Tríceps mergulho no banco", sets: "3", reps: "1ª: 15 + 15 · 2ª: 12 + 15 · 3ª: 10 c/ drop set + 15", rest: "1min", notes: "Sempre 15 reps no tríceps. 3ª supino: 10 → reduz peso → máximo + 15 mergulho." },
          { id: "b7", name: "Bíceps martelo sentada com halteres", sets: "3", reps: "12 com rest-pause (todas as séries)", rest: "1min", notes: "Carga alta p/ 12 reps → 20s → máximo na falha. Isso conta como 1 série." },
          { id: "b8", name: "Abdominal bike + supra c/ peso (perna estendida) + isometria prancha alta", sets: "3", reps: "1ª: 20 + 10 + 20s · 2ª: 18 + 8 + 30s · 3ª: 16 + 6 + 40s", rest: "1min", notes: "Reps reduzem e tempo de prancha aumenta a cada série." },
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
      lowerStretch("c"),
      {
        title: "Ativação e aquecimento",
        kind: "warmup",
        exercises: [
          { id: "cw1", name: "Ponte de glúteo c/ band (2s em cima) + abdução c/ band (quadril alto) + isometria em abdução", sets: "2", reps: "15 + 15 + 20s", rest: "30s", notes: "Sem band: ponte sem band e abdução no cross com peso leve." },
          { id: "cw2", name: "Aquecimento — Coice na polia (cable kickback)", sets: "1", reps: "15 a 20 cada perna", rest: "1min", notes: "Peso baixo apenas para aquecer e ativar o glúteo." },
        ],
      },
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "c1", name: "Coice na polia (cable kickback)", sets: "4", reps: "1ª: 12-15 cada perna (1s em cima) · 2ª: 10-12 (1s em cima) · 3ª: 10-12 (1s em cima) · 4ª: cluster 6-6-6-6 cada perna", rest: "1:10 - 1:20 min", notes: "Substituto seguro p/ endometriose. Aumente o peso a cada série. 4ª: 6 pesadas → 20s → 6 → 20s → 6 → 20s → 6 (cada perna)." },
          { id: "c2", name: "Afundo p/ trás no Smith c/ tronco inclinado à frente", sets: "4", reps: "1ª: 12 cada perna · 2ª: 10-12 · 3ª: 8-10 · 4ª: 6-8 → 20s → máximo", rest: "30-40s entre pernas / 1min entre séries", notes: "4ª com rest-pause até a falha." },
          { id: "c3", name: "Stiff com barra e pés abduzidos", sets: "4", reps: "1ª: 12 (desc. 3s) · 2ª-4ª: 8-10 (desc. 2s)", rest: "1min", notes: "Aumente o peso a cada série." },
          { id: "c4", name: "Extensão de quadril (perna estendida) + Extensão de joelho e quadril (coice)", sets: "3", reps: "10-12 (1s em cima) + 8-10 (todas as séries)", rest: "1 - 1:10 min", notes: "Aumente o peso a cada série." },
          { id: "c5", name: "Mesa ou cadeira flexora", sets: "3", reps: "1ª: 10-12 · 2ª: 8-10 · 3ª: 6-8 com drop set", rest: "1min", notes: "3ª: 6-8 → reduz 30% do peso → máximo (falha)." },
          { id: "c6", name: "Cadeira abdutora com tronco reto", sets: "4", reps: "1ª-3ª: 12-15 (2s aberto) · 4ª: 8-10 → reduz peso → 8-10 → reduz peso → máximo", rest: "40s", notes: "4ª em drop set duplo até a falha." },
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
      lowerStretch("d"),
      {
        title: "Ativação e aquecimento",
        kind: "warmup",
        exercises: [
          { id: "dw1", name: "Cócoras com peso (5s isometria) + agachamento lateral sem peso", sets: "2", reps: "10 totais + 10 cada lado", rest: "30s", notes: "Peso leve apenas para ativar a musculatura." },
          { id: "dw2", name: "Aquecimento — Agachamento livre ou no Smith", sets: "1", reps: "15 a 20", rest: "—", notes: "Peso leve apenas para aquecer." },
        ],
      },
      {
        title: "Treino principal",
        kind: "main",
        exercises: [
          { id: "d1", name: "Agachamento livre ou no Smith (2 últimas conjugadas c/ goblet)", sets: "4", reps: "1ª e 2ª: 10-12 (desc. 2s + 1s embaixo) · 3ª: 8-10 + 12-15 goblet · 4ª: 8-10 + 15-20 goblet", rest: "1 - 1:10 min" },
          { id: "d2", name: "Cadeira extensora", sets: "4", reps: "1ª: 12-15 (desc. 3s + 1s topo) · 2ª: 10-12 pesadas · 3ª: 8-10 pesadas · 4ª: 8-10 → -2 placas → 10-12 → -2 placas → 12-15", rest: "1 - 1:10 min", notes: "4ª série em drop set duplo." },
          { id: "d3", name: "Stiff com barra e pés abduzidos", sets: "4", reps: "1ª: 12 (desc. 3s) · 2ª-4ª: 8-10 (desc. 2s)", rest: "1min", notes: "Aumente o peso a cada série." },
          { id: "d4", name: "Extensão de quadril (perna estendida) + Extensão de joelho e quadril (coice)", sets: "3", reps: "10-12 (1s em cima) + 8-10 (todas as séries)", rest: "1 - 1:10 min", notes: "Aumente o peso a cada série." },
          { id: "d5", name: "Cadeira abdutora com tronco reto", sets: "4", reps: "1ª-3ª: 12-15 (2s aberto) · 4ª: 8-10 → reduz peso → 8-10 → reduz peso → máximo", rest: "40s", notes: "4ª em drop set duplo até a falha." },
        ],
      },
    ],
  },
];

export const WORKOUT_BY_ID = Object.fromEntries(WORKOUTS.map(w => [w.id, w])) as Record<Workout["id"], Workout>;
