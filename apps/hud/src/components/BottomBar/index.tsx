import type { GameState, Player } from "@cs2-hud/types";
import { PlayerCard } from "./PlayerCard";

interface BottomBarProps {
  gameState: GameState;
}

function sortPlayers(players: Player[]) {
  return players.sort((a, b) => b.state.health - a.state.health || a.name.localeCompare(b.name));
}

function getObservedPlayer(gameState: GameState, players: Player[]) {
  if (gameState.observedPlayerSteamId) {
    return gameState.allplayers[gameState.observedPlayerSteamId];
  }

  if (gameState.bomb.player) {
    return gameState.allplayers[gameState.bomb.player];
  }

  return players.find((player) => player.state.health > 0) ?? players[0];
}

export function BottomBar({ gameState }: BottomBarProps) {
  const players = Object.values(gameState.allplayers);
  const observedPlayer = getObservedPlayer(gameState, players);
  const ct = sortPlayers(players.filter((player) => player.team === "CT")).slice(0, 5);
  const t = sortPlayers(players.filter((player) => player.team === "T")).slice(0, 5);

  return (
    <div className="absolute bottom-5 left-1/2 flex w-[1860px] -translate-x-1/2 items-end justify-center gap-3 overflow-visible">
      <div className="flex items-end gap-2 overflow-visible">
        {t.map((player) => <PlayerCard key={player.steamId} player={player} />)}
      </div>
      {observedPlayer ? <PlayerCard player={observedPlayer} variant="featured" /> : null}
      <div className="flex items-end gap-2 overflow-visible">
        {ct.map((player) => <PlayerCard key={player.steamId} player={player} />)}
      </div>
    </div>
  );
}
