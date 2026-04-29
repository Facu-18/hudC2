import type { Server as HttpServer } from "node:http";
import type { GameState } from "@cs2-hud/types";
import { Server } from "socket.io";

let io: Server | undefined;
let latestGameState: GameState | undefined;

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: process.env.HUD_ORIGIN ?? "http://localhost:3001",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    if (latestGameState) {
      socket.emit("gamestate", latestGameState);
    }
  });

  return io;
}

export function emitGameState(gameState: GameState): void {
  latestGameState = gameState;
  io?.emit("gamestate", gameState);
}

export function getLatestGameState(): GameState | undefined {
  return latestGameState;
}
