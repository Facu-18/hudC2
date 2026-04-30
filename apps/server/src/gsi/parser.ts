import type {
  BombState,
  GameState,
  GrenadeType,
  MapPhase,
  RoundBombState,
  RoundPhase,
  TeamSide,
  WeaponState
} from "@cs2-hud/types";
import type { GsiPayload } from "./types.js";

const mapPhases: MapPhase[] = ["warmup", "live", "intermission", "gameover"];
const roundPhases: RoundPhase[] = ["freezetime", "live", "over", "bomb"];
const roundBombStates: RoundBombState[] = ["planted", "exploded", "defused", "none"];
const bombStates: BombState[] = ["carried", "planted", "defused", "exploded", "dropped", "none"];
const weaponStates: WeaponState[] = ["active", "holstered", "reloading"];
const grenadeTypes: GrenadeType[] = ["inferno", "smoke", "flashbang", "frag", "decoy"];

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function num(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseGameState(payload: GsiPayload): GameState {
  const allplayers = Object.fromEntries(
    Object.entries(payload.allplayers ?? {}).map(([steamId, player]) => [
      steamId,
      {
        steamId,
        name: text(player.name, "Unknown"),
        team: pick<TeamSide>(player.team, ["CT", "T"], "CT"),
        state: {
          health: num(player.state?.health, 0),
          armor: num(player.state?.armor, 0),
          money: num(player.state?.money, 0),
          equip_value: num(player.state?.equip_value, 0)
        },
        match_stats: {
          kills: num(player.match_stats?.kills, 0),
          deaths: num(player.match_stats?.deaths, 0),
          assists: num(player.match_stats?.assists, 0),
          adr: num(player.match_stats?.adr, 0)
        },
        weapons: Object.fromEntries(
          Object.entries(player.weapons ?? {}).map(([slot, weapon]) => [
            slot,
            {
              name: text(weapon.name, "weapon_knife"),
              type: text(weapon.type, "Knife"),
              state: pick<WeaponState>(weapon.state, weaponStates, "holstered")
            }
          ])
        ),
        position: text(player.position),
        forward: text(player.forward)
      }
    ])
  );

  return {
    map: {
      name: text(payload.map?.name, "de_unknown"),
      phase: pick<MapPhase>(payload.map?.phase, mapPhases, "warmup"),
      round: num(payload.map?.round, 0),
      team_ct: {
        score: num(payload.map?.team_ct?.score, 0),
        timeouts_remaining: num(payload.map?.team_ct?.timeouts_remaining, 4)
      },
      team_t: {
        score: num(payload.map?.team_t?.score, 0),
        timeouts_remaining: num(payload.map?.team_t?.timeouts_remaining, 4)
      }
    },
    round: {
      phase: pick<RoundPhase>(payload.round?.phase, roundPhases, "freezetime"),
      bomb: pick<RoundBombState>(payload.round?.bomb, roundBombStates, "none")
    },
    allplayers,
    observedPlayerSteamId: text(payload.player?.steamid) || undefined,
    bomb: {
      state: pick<BombState>(payload.bomb?.state, bombStates, "none"),
      countdown: text(payload.bomb?.countdown, "0"),
      player: text(payload.bomb?.player)
    },
    grenades: Object.fromEntries(
      Object.entries(payload.grenades ?? {}).map(([id, grenade]) => [
        id,
        {
          owner: text(grenade.owner),
          type: pick<GrenadeType>(grenade.type, grenadeTypes, "smoke"),
          lifetime: text(grenade.lifetime, "0")
        }
      ])
    ),
    updatedAt: new Date().toISOString()
  };
}
