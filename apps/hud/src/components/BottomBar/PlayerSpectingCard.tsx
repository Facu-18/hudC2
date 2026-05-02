import type { Player, PlayerWeapon } from "@cs2-hud/types";
import { PlayerHP } from "./PlayerHP";
import { getEquipmentIconPath, WeaponIcon } from "./WeaponIcon";

interface PlayerSpectingCardProps {
  player: Player;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

function getTheme(team: Player["team"]) {
  if (team === "CT") {
    return {
      baseBg: "#1e90ff",
      nameBg: "rgba(4,14,30,0.98)",
      iconCellBg: "#0a1f3c",
      numCellBg: "#061429",
      accentColor: "#1e90ff",
      accentGlow: "rgba(30,144,255,0.35)",
      moneyColor: "#ffd700",
      fallbackImage: "/players/ct.png",
    };
  }
  return {
    baseBg: "#ff6600",
    nameBg: "rgba(16,6,0,0.98)",
    iconCellBg: "#3a1500",
    numCellBg: "#250d00",
    accentColor: "#ff6600",
    accentGlow: "rgba(255,102,0,0.35)",
    moneyColor: "#ffd700",
    fallbackImage: "/players/tt.png",
  };
}

function getPlayerImage(player: Player) {
  return `${serverUrl}/assets/players/${player.steamId}`;
}

function CrosshairIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
      <line x1="12" y1="1" x2="12" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="18" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SkullIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10C28 10 13 26 13 46c0 13 7 24 18 30v10c0 3 2 5 5 5h28c3 0 5-2 5-5V76c11-6 18-17 18-30C87 26 72 10 50 10z" />
      <circle cx="36" cy="46" r="9" fill="white" />
      <circle cx="64" cy="46" r="9" fill="white" />
      <rect x="38" y="72" width="8" height="12" rx="2" fill="white" />
      <rect x="54" y="72" width="8" height="12" rx="2" fill="white" />
    </svg>
  );
}

function UtilityOverlay({ player }: { player: Player }) {
  const grenades = Object.values(player.weapons)
    .filter((w) =>
      w.type.toLowerCase().includes("grenade") ||
      w.name.includes("grenade") ||
      w.name.includes("molotov")
    )
    .slice(0, 4);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
      {grenades.map((w, i) => (
        <img
          key={`${w.name}-${i}`}
          src={getEquipmentIconPath(w.name)}
          alt={w.name.replace("weapon_", "")}
          style={{ height: 28, width: 28, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.92 }}
        />
      ))}
    </div>
  );
}

function AmmoDisplay({ weapon }: { weapon?: PlayerWeapon }) {
  if (!weapon || weapon.ammo_clip_max <= 0) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 4,
        fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
        lineHeight: 1,
        color: "#fff",
      }}
    >
      <span style={{ fontSize: 22, fontWeight: 700 }}>{weapon.ammo_clip}</span>
      <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.55 }}>/ {weapon.ammo_reserve}</span>
    </div>
  );
}

// ─── PlayerSpectingCard ────────────────────────────────────────────────────────
//
// Layout (from bottom up):
//   STATS_H   (40px) — K / D / ADR / $
//   NAME_H    (48px) — player name + team side label
//   EQUIP_H   (36px) — active weapon icon + ammo
//   HPBARS_H  (18px) — PlayerHP (health + armor bars)
//   PHOTO_H  (280px) — player image + grenade overlay + HP number
//   OVERFLOW  (80px) — image head overflows above the card
//
export function PlayerSpectingCard({ player }: PlayerSpectingCardProps) {
  if (player.state.health <= 0) return null;

  const theme = getTheme(player.team);
  const activeWeapon = Object.values(player.weapons).find((w) => w.state === "active");

  const CARD_W   = 300;
  const PHOTO_H  = 280;
  const HPBARS_H = 18;
  const EQUIP_H  = 36;
  const NAME_H   = 48;
  const STATS_H  = 40;
  const OVERFLOW = 80;

  // Positions from bottom of the outer div
  const hpBarsBottom = STATS_H + NAME_H + EQUIP_H;           // 124
  const photoBottom  = STATS_H + NAME_H + EQUIP_H + HPBARS_H; // 142
  const TOTAL_H = PHOTO_H + HPBARS_H + EQUIP_H + NAME_H + STATS_H; // 422

  return (
    <div
      style={{
        width: CARD_W,
        height: TOTAL_H + OVERFLOW,
        position: "relative",
        // Strong glow that differentiates this from compact cards
        filter: `drop-shadow(0 0 32px ${theme.accentGlow}) drop-shadow(0 0 8px rgba(0,0,0,0.8))`,
      }}
    >
      {/* Thick top accent line */}
      <div
        style={{
          position: "absolute",
          top: OVERFLOW,
          left: 0,
          right: 0,
          height: 3,
          background: theme.accentColor,
          zIndex: 35,
        }}
      />

      {/* Photo area background */}
      <div
        style={{
          position: "absolute",
          bottom: photoBottom,
          left: 0,
          right: 0,
          height: PHOTO_H,
          background: `linear-gradient(180deg, ${theme.baseBg}f0 0%, ${theme.baseBg}88 70%, ${theme.baseBg}44 100%)`,
        }}
      />

      {/* Player image */}
      <img
        src={getPlayerImage(player)}
        alt={player.name}
        style={{
          position: "absolute",
          bottom: photoBottom,
          left: "50%",
          transform: "translateX(-50%)",
          height: PHOTO_H + OVERFLOW,
          maxWidth: CARD_W,
          objectFit: "contain",
          zIndex: 10,
        }}
        onError={(e) => { e.currentTarget.src = theme.fallbackImage; }}
      />

      {/* Utility grenades — top-left of photo area */}
      <div
        style={{
          position: "absolute",
          top: OVERFLOW + 12,
          left: 12,
          zIndex: 20,
        }}
      >
        <UtilityOverlay player={player} />
      </div>

      {/* Armor icon — top-right of photo area */}
      {player.state.armor > 0 && (
        <img
          src={player.state.helmet ? "/equipment/armor_helmet.svg" : "/equipment/armor.svg"}
          alt="Armor"
          style={{
            position: "absolute",
            top: OVERFLOW + 12,
            right: 12,
            height: 32,
            width: 32,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: 0.88,
            zIndex: 20,
          }}
        />
      )}

      {/* HP number — bottom-right of photo area, large and prominent */}
      <span
        style={{
          position: "absolute",
          bottom: photoBottom + 10,
          right: 14,
          zIndex: 20,
          fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
          fontSize: 72,
          fontWeight: 700,
          lineHeight: 1,
          color: "#ffffff",
          textShadow: "0 2px 16px rgba(0,0,0,0.8)",
          letterSpacing: "-0.02em",
        }}
      >
        {player.state.health}
      </span>

      {/* ── HP bars strip (PlayerHP) ── */}
      <div
        style={{
          position: "absolute",
          bottom: hpBarsBottom,
          left: 0,
          right: 0,
          height: HPBARS_H,
          background: "rgba(4,4,10,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          zIndex: 25,
        }}
      >
        <PlayerHP health={player.state.health} armor={player.state.armor} />
      </div>

      {/* ── Equipment strip — active weapon + ammo ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H,
          left: 0,
          right: 0,
          height: EQUIP_H,
          background: "rgba(6,6,14,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 14,
          paddingRight: 14,
          zIndex: 25,
        }}
      >
        <WeaponIcon
          weaponName={activeWeapon?.name}
          className="h-[22px] w-[120px] object-contain brightness-0 invert"
        />
        <AmmoDisplay weapon={activeWeapon} />
      </div>

      {/* ── Name bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H,
          left: 0,
          right: 0,
          height: NAME_H,
          backgroundColor: theme.nameBg,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          // Left color border = visual differentiator from compact cards
          borderLeft: `4px solid ${theme.accentColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 14,
          paddingRight: 14,
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            color: "#f0f4ff",
            fontSize: 30,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          {player.name}
        </span>
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: theme.accentColor,
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          {player.team}
        </span>
      </div>

      {/* ── Stats row — K / D / ADR / $ ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: STATS_H,
          display: "flex",
          zIndex: 30,
        }}
      >
        {/* Kills */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, gap: 1 }}>
          <CrosshairIcon size={14} />
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif", lineHeight: 1 }}>
            {player.match_stats.kills}
          </span>
        </div>
        {/* Deaths */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg, gap: 1 }}>
          <SkullIcon size={14} />
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif", lineHeight: 1 }}>
            {player.match_stats.deaths}
          </span>
        </div>
        {/* ADR */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, gap: 1, borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif" }}>
            ADR
          </span>
          <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif", lineHeight: 1 }}>
            {Math.round(player.match_stats.adr)}
          </span>
        </div>
        {/* Money */}
        <div
          style={{
            flex: 1.4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.numCellBg,
            borderLeft: "1px solid rgba(255,215,0,0.08)",
            gap: 1,
          }}
        >
          <span style={{ color: "rgba(255,215,0,0.45)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif" }}>
            CASH
          </span>
          <span
            style={{
              color: theme.moneyColor,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              textShadow: `0 0 10px ${theme.moneyColor}80`,
              lineHeight: 1,
            }}
          >
            ${player.state.money}
          </span>
        </div>
      </div>
    </div>
  );
}
