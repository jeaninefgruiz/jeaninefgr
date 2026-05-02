import { useEffect, useState } from "react";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--primary-glow))",
];

type Piece = { id: number; tx: number; ty: number; color: string; delay: number };

export const Confetti = ({ trigger }: { trigger: number }) => {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const newPieces: Piece[] = Array.from({ length: 14 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
      const dist = 40 + Math.random() * 50;
      return {
        id: trigger * 100 + i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist - 20,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.05,
      };
    });
    setPieces(newPieces);
    const t = setTimeout(() => setPieces([]), 900);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!pieces.length) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute h-2 w-2 rounded-sm animate-confetti"
          style={{
            background: p.color,
            // @ts-expect-error css custom props
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};