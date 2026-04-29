interface RoundTimerProps {
  phase: string;
  round: number;
  mapName: string;
}

export function RoundTimer({ phase, round, mapName }: RoundTimerProps) {
  return (
    <div className="flex h-24 w-[300px] flex-col items-center justify-center rounded bg-zinc-950/95 shadow-2xl">
      <div className="text-sm font-bold uppercase text-zinc-400">{mapName}</div>
      <div className="text-4xl font-black uppercase leading-none">{phase}</div>
      <div className="mt-1 text-xs font-bold uppercase text-zinc-500">Round {round + 1}</div>
    </div>
  );
}
