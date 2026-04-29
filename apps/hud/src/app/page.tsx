"use client";

import { BombTimer } from "@/components/Bomb/BombTimer";
import { BottomBar } from "@/components/BottomBar";
import { TopBar } from "@/components/TopBar";
import { useGameState } from "@/hooks/useGameState";

export default function HudPage() {
  const { gameState, connected } = useGameState();

  return (
    <main className="relative h-[1080px] w-[1920px] overflow-hidden bg-transparent text-white">
      {gameState ? (
        <>
          <TopBar gameState={gameState} />
          <BombTimer bomb={gameState.bomb} />
          <BottomBar gameState={gameState} />
        </>
      ) : (
        <div className="absolute left-8 top-8 rounded bg-zinc-950/80 px-5 py-3 text-sm font-bold uppercase text-zinc-300">
          {connected ? "Waiting for GSI" : "Socket disconnected"}
        </div>
      )}
    </main>
  );
}
