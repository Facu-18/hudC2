import { Router } from "express";
import { emitGameState, getLatestGameState } from "../socket/socket.js";
import { parseGameState } from "./parser.js";
import type { GsiPayload } from "./types.js";

export const gsiRouter = Router();
let latestRawPayload: GsiPayload | undefined;
let latestIncomingPayload: GsiPayload | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergePayload<T extends Record<string, unknown>>(current: T | undefined, incoming: T): T {
  if (!current) {
    return { ...incoming };
  }

  const merged: Record<string, unknown> = { ...current };

  for (const [key, value] of Object.entries(incoming)) {
    if (key === "previously") {
      continue;
    }

    const currentValue = merged[key];
    if (isRecord(currentValue) && isRecord(value)) {
      merged[key] = mergePayload(currentValue, value);
    } else {
      merged[key] = value;
    }
  }

  return merged as T;
}

gsiRouter.post("/gsi", (req, res) => {
  latestIncomingPayload = req.body as GsiPayload;
  latestRawPayload = mergePayload(latestRawPayload as Record<string, unknown> | undefined, latestIncomingPayload as Record<string, unknown>) as GsiPayload;
  const gameState = parseGameState(latestRawPayload);
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

gsiRouter.get("/gsi/debug", (_req, res) => {
  const latest = getLatestGameState();

  res.json({
    received: Boolean(latestRawPayload),
    incomingTopLevelKeys: latestIncomingPayload ? Object.keys(latestIncomingPayload) : [],
    mergedTopLevelKeys: latestRawPayload ? Object.keys(latestRawPayload) : [],
    rawAllplayersCount: latestRawPayload?.allplayers ? Object.keys(latestRawPayload.allplayers).length : 0,
    normalizedAllplayersCount: latest ? Object.keys(latest.allplayers).length : 0,
    normalizedAliveCount: latest
      ? Object.values(latest.allplayers).filter((player) => player.state.health > 0).length
      : 0,
    observedPlayerSteamId: latest?.observedPlayerSteamId,
    players: latest
      ? Object.values(latest.allplayers).map((player) => ({
          steamId: player.steamId,
          name: player.name,
          team: player.team,
          health: player.state.health,
          armor: player.state.armor,
          helmet: player.state.helmet,
          weapons: Object.values(player.weapons).map((weapon) => weapon.name)
        }))
      : []
  });
});
