import type { GameState, Player } from "@cs2-hud/types";
import { PlayerCard } from "./PlayerCard";

interface BottomBarProps {
  gameState: GameState;
}

function sortPlayers(players: Player[]) {
  return players.sort((a, b) => b.state.health - a.state.health || a.name.localeCompare(b.name));
}

export function BottomBar({ gameState }: BottomBarProps) {
  const players = Object.values(gameState.allplayers);
  const ct = sortPlayers(players.filter((player) => player.team === "CT")).slice(0, 5);
  const t = sortPlayers(players.filter((player) => player.team === "T")).slice(0, 5);

  return (
    <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-end gap-10">
      <div className="flex gap-2">{ct.map((player) => <PlayerCard key={player.steamId} player={player} />)}</div>
      <div className="h-20 w-px bg-white/20" />
      <div className="flex gap-2">{t.map((player) => <PlayerCard key={player.steamId} player={player} />)}</div>
    </div>
  );
}
