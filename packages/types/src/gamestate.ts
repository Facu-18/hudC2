export type TeamSide = "CT" | "T";

export type MapPhase = "warmup" | "live" | "intermission" | "gameover";
export type RoundPhase = "freezetime" | "live" | "over" | "bomb";
export type RoundBombState = "planted" | "exploded" | "defused" | "none";
export type BombState = "carried" | "planted" | "defused" | "exploded" | "dropped" | "none";
export type WeaponState = "active" | "holstered" | "reloading";
export type GrenadeType = "inferno" | "smoke" | "flashbang" | "frag" | "decoy";

export interface TeamMapState {
  score: number;
  timeouts_remaining: number;
}

export interface GameMapState {
  name: string;
  phase: MapPhase;
  round: number;
  team_ct: TeamMapState;
  team_t: TeamMapState;
}

export interface GameRoundState {
  phase: RoundPhase;
  bomb: RoundBombState;
}

export interface PlayerState {
  health: number;
  armor: number;
  money: number;
  equip_value: number;
}

export interface PlayerMatchStats {
  kills: number;
  deaths: number;
  assists: number;
  adr: number;
}

export interface PlayerWeapon {
  name: string;
  type: string;
  state: WeaponState;
}

export interface Player {
  steamId: string;
  name: string;
  team: TeamSide;
  state: PlayerState;
  match_stats: PlayerMatchStats;
  weapons: Record<string, PlayerWeapon>;
  position: string;
  forward: string;
}

export interface Bomb {
  state: BombState;
  countdown: string;
  player: string;
}

export interface Grenade {
  owner: string;
  type: GrenadeType;
  lifetime: string;
}

export interface GameState {
  map: GameMapState;
  round: GameRoundState;
  allplayers: Record<string, Player>;
  observedPlayerSteamId?: string;
  bomb: Bomb;
  grenades: Record<string, Grenade>;
  updatedAt: string;
}
