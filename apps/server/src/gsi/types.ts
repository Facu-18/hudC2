export interface GsiPayload {
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
  }>;
  position?: string;
  forward?: string;
}
