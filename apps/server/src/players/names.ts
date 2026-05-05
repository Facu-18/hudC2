import fs from "node:fs";
import path from "node:path";
import type { GameState } from "@cs2-hud/types";
import { Router } from "express";
import { emitGameState, getLatestGameState } from "../socket/socket.js";

const uploadRoot = path.resolve(process.cwd(), "uploads");
const playerNamesFile = path.join(uploadRoot, "player-names.json");
const safeIdPattern = /^[a-zA-Z0-9_-]+$/;
const maxNameLength = 24;

let playerNamesCache: Record<string, string> | undefined;

function ensureUploadRoot(): void {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

function readPlayerNames(): Record<string, string> {
  if (playerNamesCache) {
    return playerNamesCache;
  }

  try {
    const raw = fs.readFileSync(playerNamesFile, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    playerNamesCache = typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? Object.fromEntries(
          Object.entries(parsed).filter((entry): entry is [string, string] =>
            safeIdPattern.test(entry[0]) && typeof entry[1] === "string" && entry[1].trim().length > 0
          )
        )
      : {};
  } catch {
    playerNamesCache = {};
  }

  return playerNamesCache;
}

function writePlayerNames(names: Record<string, string>): void {
  ensureUploadRoot();
  playerNamesCache = names;
  fs.writeFileSync(playerNamesFile, `${JSON.stringify(names, null, 2)}\n`);
}

function reemitLatestGameState(): void {
  const latest = getLatestGameState();
  if (latest) {
    emitGameState(applyPlayerNames(latest));
  }
}

function param(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeName(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, maxNameLength) : "";
}

export function getPlayerNames(): Record<string, string> {
  return { ...readPlayerNames() };
}

export function applyPlayerNames(gameState: GameState): GameState {
  const playerNames = readPlayerNames();
  if (Object.keys(playerNames).length === 0) {
    return gameState;
  }

  return {
    ...gameState,
    allplayers: Object.fromEntries(
      Object.entries(gameState.allplayers).map(([steamId, player]) => [
        steamId,
        playerNames[steamId] ? { ...player, name: playerNames[steamId] } : player
      ])
    )
  };
}

export const playerNamesRouter = Router();

playerNamesRouter.get("/players/names", (_req, res) => {
  res.json(getPlayerNames());
});

playerNamesRouter.put("/players/:id/name", (req, res) => {
  const id = param(req.params.id);
  const name = normalizeName((req.body as { name?: unknown }).name);

  if (!safeIdPattern.test(id)) {
    res.status(400).json({ error: "Invalid player id. Use only letters, numbers, underscores, and hyphens." });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "Missing player name" });
    return;
  }

  const playerNames = readPlayerNames();
  playerNames[id] = name;
  writePlayerNames(playerNames);
  reemitLatestGameState();

  res.json({ id, name });
});

playerNamesRouter.delete("/players/:id/name", (req, res) => {
  const id = param(req.params.id);

  if (!safeIdPattern.test(id)) {
    res.status(400).json({ error: "Invalid player id. Use only letters, numbers, underscores, and hyphens." });
    return;
  }

  const playerNames = readPlayerNames();
  delete playerNames[id];
  writePlayerNames(playerNames);
  reemitLatestGameState();

  res.status(204).send();
});
