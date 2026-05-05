"use client";

import { ReactNode, useEffect, useState } from "react";

const hudWidth = 1920;
const hudHeight = 1080;
const compactHudHeight = 600;

function useHudScale() {
  const [scale, setScale] = useState(1);
  const [canvasHeight, setCanvasHeight] = useState(hudHeight);

  useEffect(() => {
    function updateScale() {
      const nextCanvasHeight = window.innerHeight < 800 ? compactHudHeight : hudHeight;
      const widthScale = window.innerWidth / hudWidth;
      const heightScale = window.innerHeight / nextCanvasHeight;
      setCanvasHeight(nextCanvasHeight);
      setScale(Math.min(widthScale, heightScale));
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return { scale, canvasHeight };
}

export function HudCanvas({ children }: { children: ReactNode }) {
  const { scale, canvasHeight } = useHudScale();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-transparent text-white">
      <div
        className="absolute left-1/2 top-1/2 w-[1920px] origin-center overflow-visible bg-transparent"
        style={{ height: canvasHeight, transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
      </div>
    </main>
  );
}
