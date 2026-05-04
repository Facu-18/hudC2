export interface GsiPayload {
  auth?: {
    token?: string;
  };
  player?: {
    steamid?: string;
    name?: string;
    observer_slot?: number;
  };
  map?: {
    name?: string;
    phase?: string;
    round?: number;
    team_ct?: { score?: number; timeouts_remaining?: number };
    team_t?: { score?: number; timeouts_remaining?: number };
  };
  round?: {
    phase?: string;
    bomb?: string;
  };
  phase_countdowns?: {
    phase?: string;
    phase_ends_in?: string;
  };
  allplayers?: Record<string, GsiPlayerPayload>;
  bomb?: {
    state?: string;
    countdown?: string;
    player?: string;
  };
  grenades?: Record<string, {
    owner?: string;
    type?: string;
    lifetime?: string;
  }>;
}

export interface GsiPlayerPayload {
  name?: string;
  team?: string;
  state?: {
    health?: number;
    armor?: number;
    helmet?: boolean;
    money?: number;
    equip_value?: number;
  };
  match_stats?: {
    kills?: number;
    deaths?: number;
    assists?: number;
    adr?: number;
  };
  weapons?: Record<string, {
    name?: string;
    type?: string;
    state?: string;
    ammo_clip?: number;
    ammo_clip_max?: number;
    ammo_reserve?: number;
  }>;
  position?: string;
  forward?: string;
}
