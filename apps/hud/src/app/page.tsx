"use client";

import { BombTimer } from "@/components/Bomb/BombTimer";
import { BottomBar } from "@/components/BottomBar";
import { TopBar } from "@/components/TopBar";
import { useGameState } from "@/hooks/useGameState";
import { useEffect, useState } from "react";

const hudWidth = 1920;
const hudHeight = 1080;

function useHudScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function updateScale() {
      const widthScale = window.innerWidth / hudWidth;
      const heightScale = window.innerHeight / hudHeight;
      setScale(Math.min(widthScale, heightScale));
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return scale;
}

export default function HudPage() {
  const { gameState, connected } = useGameState();
  const scale = useHudScale();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-transparent text-white">
      <div
        className="absolute left-1/2 top-1/2 h-[1080px] w-[1920px] origin-center overflow-visible bg-transparent"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
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
      </div>
    </main>
  );
}
