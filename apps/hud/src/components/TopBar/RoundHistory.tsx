interface RoundHistoryProps {
  ctScore: number;
  tScore: number;
}

export function RoundHistory({ ctScore, tScore }: RoundHistoryProps) {
  const total = Math.min(12, ctScore + tScore);

  return (
    <div className="flex h-8 items-center gap-1">
      {Array.from({ length: 12 }).map((_, index) => {
        const won = index < total;
        const ct = index < ctScore;
        return (
          <div
            key={index}
            className={`h-2 w-8 rounded-sm ${won ? (ct ? "bg-sky-500" : "bg-amber-400") : "bg-white/20"}`}
          />
        );
      })}
    </div>
  );
}
