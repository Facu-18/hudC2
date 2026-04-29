interface PlayerHPProps {
  health: number;
  armor: number;
}

export function PlayerHP({ health, armor }: PlayerHPProps) {
  const healthPct = Math.max(0, Math.min(100, health));
  const armorPct = Math.max(0, Math.min(100, armor));

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="h-2 w-full overflow-hidden rounded-sm bg-red-950/80">
        <div className="h-full bg-red-500" style={{ width: `${healthPct}%` }} />
      </div>
      <div className="h-1 w-full overflow-hidden rounded-sm bg-slate-800">
        <div className="h-full bg-slate-300" style={{ width: `${armorPct}%` }} />
      </div>
    </div>
  );
}
