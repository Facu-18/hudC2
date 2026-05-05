"use client";

import { HudCanvas } from "@/components/HudCanvas";
import { BombTimer } from "@/components/Bomb/BombTimer";
import { TopBar } from "@/components/TopBar";
import { useGameState } from "@/hooks/useGameState";

export default function MarcadorPage() {
  const { gameState, connected } = useGameState();

  return (
    <HudCanvas>
      {gameState ? (
        <>
          <TopBar gameState={gameState} />
          <BombTimer bomb={gameState.bomb} />
        </>
      ) : (
        <div className="absolute left-8 top-8 rounded bg-zinc-950/80 px-5 py-3 text-sm font-bold uppercase text-zinc-300">
          {connected ? "Waiting for GSI" : "Socket disconnected"}
        </div>
      )}
    </HudCanvas>
  );
}
