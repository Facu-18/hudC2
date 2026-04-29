import type { GameState } from "@cs2-hud/types";
import { RoundHistory } from "./RoundHistory";
import { RoundTimer } from "./RoundTimer";
import { TeamScore } from "./TeamScore";

interface TopBarProps {
  gameState: GameState;
}

export function TopBar({ gameState }: TopBarProps) {
  return (
    <div className="absolute left-1/2 top-8 flex -translate-x-1/2 flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <TeamScore side="CT" name="Counter-Terrorists" score={gameState.map.team_ct.score} />
        <RoundTimer phase={gameState.round.phase} round={gameState.map.round} mapName={gameState.map.name} />
        <TeamScore side="T" name="Terrorists" score={gameState.map.team_t.score} />
      </div>
      <RoundHistory ctScore={gameState.map.team_ct.score} tScore={gameState.map.team_t.score} />
    </div>
  );
}
