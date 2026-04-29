import type { GsiPayload } from "../gsi/types.js";

const endpoint = process.env.GSI_URL ?? "http://localhost:3000/gsi";
const ctNames = ["KRYSTAL", "NOVA", "BISHOP", "VEX", "MIRAGE"];
const tNames = ["RAZE", "CIPHER", "EMBER", "SAINT", "KAI"];
const weapons = ["weapon_ak47", "weapon_awp", "weapon_m4a1_silencer", "weapon_deagle", "weapon_galilar"];

let round = 7;
let ctScore = 4;
let tScore = 3;
let tick = 0;

function player(steamId: string, name: string, team: "CT" | "T", index: number) {
  const damaged = Math.max(0, 100 - ((tick + index * 11) % 125));

  return {
    [steamId]: {
      name,
      team,
      state: {
        health: damaged,
        armor: damaged > 0 ? 100 - index * 8 : 0,
        money: 800 + index * 450,
        equip_value: 2600 + index * 350
      },
      match_stats: {
        kills: index + Math.floor(tick / 8),
        deaths: Math.floor(index / 2),
        assists: index % 3,
        adr: 72 + index * 5
      },
      weapons: {
        weapon_0: {
          name: weapons[(index + tick) % weapons.length],
          type: "Rifle",
          state: "active"
        }
      },
      position: `${index * 120}, ${team === "CT" ? 300 : -300}, 0`,
      forward: "0, 1, 0"
    }
  };
}

function payload(): GsiPayload {
  if (tick > 0 && tick % 20 === 0) {
    round += 1;
    if (tick % 40 === 0) ctScore += 1;
    else tScore += 1;
  }

  const allplayers = {
    ...Object.assign({}, ...ctNames.map((name, index) => player(`7656119CT${index}`, name, "CT", index))),
    ...Object.assign({}, ...tNames.map((name, index) => player(`7656119T${index}`, name, "T", index)))
  };

  return {
    map: {
      name: "de_mirage",
      phase: "live",
      round,
      team_ct: { score: ctScore, timeouts_remaining: 3 },
      team_t: { score: tScore, timeouts_remaining: 4 }
    },
    round: {
      phase: tick % 18 < 3 ? "freezetime" : tick % 18 > 14 ? "bomb" : "live",
      bomb: tick % 18 > 14 ? "planted" : "none"
    },
    allplayers,
    bomb: {
      state: tick % 18 > 14 ? "planted" : "carried",
      countdown: tick % 18 > 14 ? String(Math.max(0, 40 - (tick % 18) * 2)) : "0",
      player: "7656119T0"
    },
    grenades: {}
  };
}

async function send(): Promise<void> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload())
  });

  tick += 1;
  console.log(`POST ${endpoint} -> ${res.status}`);
}

setInterval(() => {
  send().catch((error) => console.error(error));
}, 1000);

send().catch((error) => console.error(error));
