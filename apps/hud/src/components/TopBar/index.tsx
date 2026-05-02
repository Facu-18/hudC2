import type { GameState } from "@cs2-hud/types";
import { RoundHistory } from "./RoundHistory";
import { RoundTimer } from "./RoundTimer";
import { TeamScore } from "./TeamScore";

interface TopBarProps {
  gameState: GameState;
}

export function TopBar({ gameState }: TopBarProps) {
  return (
    <div
      className="absolute left-1/2 top-8 flex -translate-x-1/2 flex-col items-center"
      style={{ gap: 6 }}
    >
      {/* Score row — CT faces inward (flipped), T faces inward (default) */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {/* CT side — score block on right, name on left */}
        <TeamScore
          side="CT"
          name="Counter-Terrorists"
          score={gameState.map.team_ct.score}
          flipped
        />

        {/* Central timer — no gap, butts up against score panels */}
        <RoundTimer
          phase={gameState.round.phase}
          round={gameState.map.round}
          mapName={gameState.map.name}
        />

        {/* T side — score block on right, name on left */}
        <TeamScore
          side="T"
          name="Terrorists"
          score={gameState.map.team_t.score}
        />
      </div>

      {/* Round history pills */}
      <div
        style={{
          background: "rgba(5,5,10,0.75)",
          padding: "4px 10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <RoundHistory
          ctScore={gameState.map.team_ct.score}
          tScore={gameState.map.team_t.score}
        />
      </div>
    </div>
  );
}
