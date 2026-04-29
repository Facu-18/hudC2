import type { Bomb } from "@cs2-hud/types";

interface BombTimerProps {
  bomb: Bomb;
}

export function BombTimer({ bomb }: BombTimerProps) {
  if (bomb.state !== "planted") {
    return null;
  }

  const seconds = Number.parseFloat(bomb.countdown);
  const pct = Number.isFinite(seconds) ? Math.max(0, Math.min(100, (seconds / 40) * 100)) : 0;

  return (
    <div className="absolute left-1/2 top-40 flex w-[360px] -translate-x-1/2 flex-col gap-2 rounded bg-red-950/90 p-4 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase text-red-200">Bomb planted</span>
        <span className="text-3xl font-black">{Number.isFinite(seconds) ? seconds.toFixed(1) : bomb.countdown}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-sm bg-black/50">
        <div className="h-full bg-red-400" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
