interface TeamScoreProps {
  side: "CT" | "T";
  name: string;
  score: number;
}

export function TeamScore({ side, name, score }: TeamScoreProps) {
  const sideClass = side === "CT" ? "bg-sky-600" : "bg-amber-500 text-zinc-950";

  return (
    <div className="flex h-20 w-[420px] items-center overflow-hidden rounded bg-zinc-950/90 shadow-2xl">
      <div className={`flex h-full w-24 items-center justify-center text-4xl font-black ${sideClass}`}>
        {score}
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-6">
        <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">{side}</span>
        <span className="truncate text-3xl font-black uppercase">{name}</span>
      </div>
    </div>
  );
}
