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

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function parseGameState(payload: GsiPayload): GameState {
  const allplayers = Object.fromEntries(
    Object.entries(record(payload.allplayers)).map(([steamId, rawPlayer]) => {
      const player = record(rawPlayer);
      const state = record(player.state);
      const matchStats = record(player.match_stats);

      return [
      steamId,
      {
        steamId,
        name: text(player.name, "Unknown"),
        team: pick<TeamSide>(player.team, ["CT", "T"], "CT"),
        state: {
          health: num(state.health, 0),
          armor: num(state.armor, 0),
          helmet: state.helmet === true,
          money: num(state.money, 0),
          equip_value: num(state.equip_value, 0)
        },
        match_stats: {
          kills: num(matchStats.kills, 0),
          deaths: num(matchStats.deaths, 0),
          assists: num(matchStats.assists, 0),
          adr: num(matchStats.adr, 0)
        },
        weapons: Object.fromEntries(
          Object.entries(record(player.weapons)).map(([slot, rawWeapon]) => {
            const weapon = record(rawWeapon);

            return [
              slot,
              {
                name: text(weapon.name, "weapon_knife"),
                type: text(weapon.type, "Knife"),
                state: pick<WeaponState>(weapon.state, weaponStates, "holstered"),
                ammo_clip: num(weapon.ammo_clip, 0),
                ammo_clip_max: num(weapon.ammo_clip_max, 0),
                ammo_reserve: num(weapon.ammo_reserve, 0)
              }
            ];
          })
        ),
        position: text(player.position),
        forward: text(player.forward)
      }
    ];
    })
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
    phaseCountdown: payload.phase_countdowns
      ? {
          phase: text(payload.phase_countdowns.phase),
          phaseEndsIn: text(payload.phase_countdowns.phase_ends_in, "0")
        }
      : undefined,
    allplayers,
    observedPlayerSteamId: text(payload.player?.steamid) || undefined,
    bomb: {
      state: pick<BombState>(payload.bomb?.state, bombStates, "none"),
      countdown: text(payload.bomb?.countdown, "0"),
      player: text(payload.bomb?.player)
    },
    grenades: Object.fromEntries(
      Object.entries(record(payload.grenades)).map(([id, rawGrenade]) => {
        const grenade = record(rawGrenade);

        return [
          id,
          {
            owner: text(grenade.owner),
            type: pick<GrenadeType>(grenade.type, grenadeTypes, "smoke"),
            lifetime: text(grenade.lifetime, "0")
          }
        ];
      })
    ),
    updatedAt: new Date().toISOString()
  };
}
