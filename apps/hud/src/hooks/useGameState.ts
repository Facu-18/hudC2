"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { GameState } from "@cs2-hud/types";

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io(socketUrl, {
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("gamestate", (state: GameState) => setGameState(state));

    return () => {
      socket.disconnect();
    };
  }, []);

  return { gameState, connected };
}
