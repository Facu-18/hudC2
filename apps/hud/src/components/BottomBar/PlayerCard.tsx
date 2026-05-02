import type { Player } from "@cs2-hud/types";
import { getEquipmentIconPath, WeaponIcon } from "./WeaponIcon";

interface PlayerCardProps {
  player: Player;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

function getTheme(team: Player["team"]) {
  if (team === "CT") {
    return {
      baseBg: "#1e90ff",
      nameBg: "rgba(6,20,41,0.97)",
      iconCellBg: "#0a1f3c",
      numCellBg: "#061429",
      moneyBg: "#0d1e3a",
      moneyText: "#ffd700",
      accentColor: "#1e90ff",
      accentGlow: "rgba(30,144,255,0.22)",
      fallbackImage: "/players/ct.png",
    };
  }
  return {
    baseBg: "#ff6600",
    nameBg: "rgba(20,8,0,0.97)",
    iconCellBg: "#3a1500",
    numCellBg: "#250d00",
    moneyBg: "#2e1000",
    moneyText: "#ffd700",
    accentColor: "#ff6600",
    accentGlow: "rgba(255,102,0,0.22)",
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

// Small grenade icons for the equipment strip
function UtilityStrip({ player }: { player: Player }) {
  const grenades = Object.values(player.weapons)
    .filter((w) =>
      w.type.toLowerCase().includes("grenade") ||
      w.name.includes("grenade") ||
      w.name.includes("molotov")
    )
    .slice(0, 3);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {grenades.map((w, i) => (
        <img
          key={`${w.name}-${i}`}
          src={getEquipmentIconPath(w.name)}
          alt={w.name.replace("weapon_", "")}
          style={{ height: 15, width: 15, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }}
        />
      ))}
    </div>
  );
}

// ─── Compact card ─────────────────────────────────────────────────────────────
//
// Layout (from bottom up):
//   STATS_H  (20px) — K / D / $
//   NAME_H   (22px) — player name
//   EQUIP_H  (26px) — weapon icon (left) + grenade icons (right)  ← no more collision
//   PHOTO_H  (128px) — player image + HP overlay + armor overlay
//   OVERFLOW (36px)  — image head overflows above the card
//
export function PlayerCard({ player }: PlayerCardProps) {
  if (player.state.health <= 0) return null;

  const theme = getTheme(player.team);
  const activeWeapon = Object.values(player.weapons).find((w) => w.state === "active");

  const CARD_W  = 120;
  const PHOTO_H = 128;
  const EQUIP_H = 26;
  const NAME_H  = 22;
  const STATS_H = 20;
  const OVERFLOW = 36;
  // Positions from bottom of outer div
  const equipBottom = STATS_H + NAME_H;               // 42
  const photoBottom = STATS_H + NAME_H + EQUIP_H;     // 68
  const TOTAL_H = PHOTO_H + EQUIP_H + NAME_H + STATS_H; // 196

  const hp = Math.max(0, Math.min(100, player.state.health));
  const hpColor = hp > 60 ? "#22cc44" : hp > 30 ? "#e6c020" : "#cc2222";

  return (
    <div
      style={{
        width: CARD_W,
        height: TOTAL_H + OVERFLOW,
        position: "relative",
        filter: `drop-shadow(0 0 10px ${theme.accentGlow})`,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: OVERFLOW,
          left: 0,
          right: 0,
          height: 2,
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
          background: `linear-gradient(180deg, ${theme.baseBg}ee 0%, ${theme.baseBg}99 100%)`,
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

      {/* Armor icon — top-right of photo area */}
      {player.state.armor > 0 && (
        <img
          src={player.state.helmet ? "/equipment/armor_helmet.svg" : "/equipment/armor.svg"}
          alt="Armor"
          style={{
            position: "absolute",
            top: OVERFLOW + 5,
            right: 4,
            height: 14,
            width: 14,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: 0.8,
            zIndex: 20,
          }}
        />
      )}

      {/* HP number — bottom-right of photo area */}
      <span
        style={{
          position: "absolute",
          bottom: photoBottom + 5,
          right: 5,
          zIndex: 20,
          fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
          fontSize: 28,
          fontWeight: 700,
          lineHeight: 1,
          color: "#ffffff",
          textShadow: "1px 1px 8px rgba(0,0,0,0.85)",
          letterSpacing: "-0.01em",
        }}
      >
        {player.state.health}
      </span>

      {/* HP bar — 3px strip at the bottom edge of photo area */}
      <div
        style={{
          position: "absolute",
          bottom: photoBottom,
          left: 0,
          width: CARD_W,
          height: 3,
          background: "rgba(0,0,0,0.5)",
          zIndex: 26,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${hp}%`,
            background: hpColor,
            boxShadow: `0 0 6px ${hpColor}`,
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      </div>

      {/* ── Equipment strip — weapon LEFT, grenades RIGHT, no overlap ── */}
      <div
        style={{
          position: "absolute",
          bottom: equipBottom,
          left: 0,
          right: 0,
          height: EQUIP_H,
          background: "rgba(5,5,12,0.97)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: 5,
          paddingRight: 5,
          zIndex: 25,
        }}
      >
        <WeaponIcon
          weaponName={activeWeapon?.name}
          className="h-[15px] w-[52px] object-contain brightness-0 invert"
        />
        <UtilityStrip player={player} />
      </div>

      {/* Name bar */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H,
          left: 0,
          right: 0,
          height: NAME_H,
          backgroundColor: theme.nameBg,
          borderTop: "1px solid rgba(255,255,255,0.04)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 5,
          paddingRight: 5,
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            color: "#f0f4ff",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            lineHeight: 1,
          }}
        >
          {player.name}
        </span>
      </div>

      {/* Stats row — K / D / $ */}
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
        <div style={{ width: 22, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "rgba(255,255,255,0.5)" }}>
          <CrosshairIcon size={10} />
        </div>
        <div style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif" }}>
            {player.match_stats.kills}
          </span>
        </div>
        <div style={{ width: 22, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "rgba(255,255,255,0.5)" }}>
          <SkullIcon size={10} />
        </div>
        <div style={{ width: 26, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif" }}>
            {player.match_stats.deaths}
          </span>
        </div>
        {/* Money */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.moneyBg,
            borderLeft: "1px solid rgba(255,215,0,0.07)",
          }}
        >
          <span
            style={{
              color: theme.moneyText,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              textShadow: `0 0 6px ${theme.moneyText}70`,
            }}
          >
            ${player.state.money}
          </span>
        </div>
      </div>
    </div>
  );
}
