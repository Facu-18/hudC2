import { Router } from "express";
import { emitGameState, getLatestGameState } from "../socket/socket.js";
import { parseGameState } from "./parser.js";
import type { GsiPayload } from "./types.js";

export const gsiRouter = Router();

gsiRouter.post("/gsi", (req, res) => {
  const gameState = parseGameState(req.body as GsiPayload);
  emitGameState(gameState);
  res.status(204).send();
});

gsiRouter.get("/gsi/latest", (_req, res) => {
  const latest = getLatestGameState();
  if (!latest) {
    res.status(404).json({ error: "No gamestate received yet" });
    return;
  }

  res.json(latest);
});
