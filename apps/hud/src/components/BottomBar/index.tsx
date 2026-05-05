import type { GameState, Player } from "@cs2-hud/types";
import { PlayerCard } from "./PlayerCard";
import { PlayerSpectingCard } from "./PlayerSpectingCard";

interface BottomBarProps {
  gameState: GameState;
}

function sortPlayers(players: Player[]) {
  return players.sort((a, b) => b.state.health - a.state.health || a.name.localeCompare(b.name));
}

function getObservedPlayer(gameState: GameState, players: Player[]) {
  if (gameState.observedPlayerSteamId) {
    const observed = gameState.allplayers[gameState.observedPlayerSteamId];
    if (observed?.state.health > 0) {
      return observed;
    }
  }

  if (gameState.bomb.player) {
    const bombCarrier = gameState.allplayers[gameState.bomb.player];
    if (bombCarrier?.state.health > 0) {
      return bombCarrier;
    }
  }

  return players.find((player) => player.state.health > 0);
}

export function BottomBar({ gameState }: BottomBarProps) {
  const players = Object.values(gameState.allplayers);
  const alivePlayers = players.filter((player) => player.state.health > 0);
  const observedPlayer = getObservedPlayer(gameState, alivePlayers);
  const ct = sortPlayers(alivePlayers.filter((player) => player.team === "CT")).slice(0, 5);
  const t = sortPlayers(alivePlayers.filter((player) => player.team === "T")).slice(0, 5);

  return (
    <div
      className="absolute bottom-[165px] left-1/2 flex w-[1600px] items-end justify-center gap-3 overflow-visible"
      style={{ transform: "translateX(-50%) scale(0.68)", transformOrigin: "bottom center" }}
    >
      <div className="flex items-end gap-1.5 overflow-visible">
        {t.map((player) => <PlayerCard key={player.steamId} player={player} />)}
      </div>
      {observedPlayer ? <PlayerSpectingCard player={observedPlayer} /> : null}
      <div className="flex items-end gap-1.5 overflow-visible">
        {ct.map((player) => <PlayerCard key={player.steamId} player={player} />)}
      </div>
    </div>
  );
}
