import type { Player } from "@cs2-hud/types";
import { PlayerHP } from "./PlayerHP";
import { WeaponIcon } from "./WeaponIcon";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const activeWeapon = Object.values(player.weapons).find((weapon) => weapon.state === "active");
  const sideClass = player.team === "CT" ? "border-sky-500" : "border-amber-400";

  return (
    <div className={`h-32 w-[178px] overflow-hidden rounded border-t-4 ${sideClass} bg-zinc-950/90 shadow-2xl`}>
      <div className="flex h-full flex-col justify-between p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-lg font-black uppercase">{player.name}</div>
            <div className="text-xs font-bold text-zinc-400">
              {player.match_stats.kills}/{player.match_stats.deaths}/{player.match_stats.assists}
            </div>
          </div>
          <div className="text-2xl font-black">{player.state.health}</div>
        </div>
        <WeaponIcon weaponName={activeWeapon?.name} />
        <PlayerHP health={player.state.health} armor={player.state.armor} />
      </div>
    </div>
  );
}
