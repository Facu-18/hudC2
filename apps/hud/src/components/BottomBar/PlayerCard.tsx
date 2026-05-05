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
      nameBg: "rgba(6,20,41,0.98)",
      iconCellBg: "rgba(10,31,60,0.95)",
      numCellBg: "rgba(6,20,41,0.95)",
      moneyBg: "rgba(10,26,50,0.95)",
      moneyText: "#ffd700",
      accentColor: "#1e90ff",
      accentGlow: "rgba(30,144,255,0.28)",
      accentSoft: "rgba(30,144,255,0.14)",
      accentDark: "#061429",
      fallbackImage: "/players/ct.png",
    };
  }
  return {
    baseBg: "#ff6600",
    nameBg: "rgba(20,8,0,0.98)",
    iconCellBg: "rgba(58,21,0,0.95)",
    numCellBg: "rgba(37,13,0,0.95)",
    moneyBg: "rgba(46,16,0,0.95)",
    moneyText: "#ffd700",
    accentColor: "#ff6600",
    accentGlow: "rgba(255,102,0,0.28)",
    accentSoft: "rgba(255,102,0,0.14)",
    accentDark: "#250d00",
    fallbackImage: "/players/tt.png",
  };
}

function getPlayerImage(player: Player) {
  const version = Math.floor(Date.now() / 15000);
  return `${serverUrl}/assets/players/${encodeURIComponent(player.steamId)}?v=${version}`;
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

function UtilityStrip({ player }: { player: Player }) {
  const grenades = Object.values(player.weapons)
    .filter((w) =>
      w.type.toLowerCase().includes("grenade") ||
      w.name.includes("grenade") ||
      w.name.includes("molotov")
    )
    .slice(0, 3);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {grenades.map((w, i) => (
        <img
          key={`${w.name}-${i}`}
          src={getEquipmentIconPath(w.name)}
          alt={w.name.replace("weapon_", "")}
          style={{
            height: 16,
            width: 16,
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  );
}

// ─── Compact PlayerCard ────────────────────────────────────────────────────────
//
// Layout (bottom → top, absolute positioning):
//   STATS_H  (24px) — K / D / $
//   NAME_H   (26px) — accent bar + player name
//   EQUIP_H  (30px) — weapon icon (left) + grenade icons (right)
//   PHOTO_H  (132px) — player photo + HP overlay + armor icon
//   OVERFLOW (36px)  — head overflows above the visible card body
//
export function PlayerCard({ player }: PlayerCardProps) {
  if (player.state.health <= 0) return null;

  const theme = getTheme(player.team);
  const activeWeapon = Object.values(player.weapons).find((w) => w.state === "active");

  const CARD_W   = 118;
  const PHOTO_H  = 116;
  const EQUIP_H  = 26;
  const NAME_H   = 22;
  const STATS_H  = 22;
  const OVERFLOW = 24;

  const equipBottom = STATS_H + NAME_H;                        // 50
  const photoBottom = STATS_H + NAME_H + EQUIP_H;             // 80
  const TOTAL_H  = PHOTO_H + EQUIP_H + NAME_H + STATS_H;      // 212

  const hp = Math.max(0, Math.min(100, player.state.health));
  const hpColor = hp > 60 ? "#22cc44" : hp > 30 ? "#e6c020" : "#cc2222";

  return (
    <div
      style={{
        width: CARD_W,
        height: TOTAL_H + OVERFLOW,
        position: "relative",
        filter: `drop-shadow(0 0 12px ${theme.accentGlow}) drop-shadow(0 8px 18px rgba(0,0,0,0.5))`,
      }}
    >
      {/* ── Chamfered corner clip (mirrors PlayerSpectingCard language) ── */}
      {/* Applied to the main body (everything below OVERFLOW) via an inner wrapper */}
      <div
        style={{
          position: "absolute",
          top: OVERFLOW,
          left: 0,
          right: 0,
          bottom: 0,
          clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
          overflow: "hidden",
          // Inset glow matching the speccing card style
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 28px ${theme.accentSoft}`,
        }}
      >
        {/* ── Photo area ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            // height covers from top of body down to equipBottom from the bottom of the body
            bottom: equipBottom,
            background: `linear-gradient(180deg, ${theme.baseBg}dd 0%, ${theme.accentDark} 100%)`,
            overflow: "hidden",
          }}
        >
          <img
            src={getPlayerImage(player)}
            alt={player.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 18%",
              transform: "scale(1.04)",
              filter: "contrast(1.06) saturate(1.08)",
            }}
            onError={(e) => { e.currentTarget.src = theme.fallbackImage; }}
          />
          {/* Heavy vignette at the bottom — makes HP number and equip strip legible */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 38%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.78) 100%)",
            }}
          />
          {/* Left team-color edge stripe */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: 3,
              background: `linear-gradient(180deg, ${theme.accentColor} 0%, ${theme.accentColor}55 100%)`,
            }}
          />
        </div>

        {/* ── Top accent bar (3px) ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.accentColor} 0%, ${theme.accentColor}88 100%)`,
          }}
        />

        {/* ── Armor icon — top-right corner ── */}
        {player.state.armor > 0 && (
          <div
            style={{
              position: "absolute",
              top: 6,
              right: 16, // offset left of chamfered corner
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <img
              src={player.state.helmet ? "/equipment/armor_helmet.svg" : "/equipment/armor.svg"}
              alt="Armor"
              style={{
                height: 15,
                width: 15,
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.75,
              }}
            />
          </div>
        )}

        {/* ── HP number — bottom-right of photo, with semi-transparent pill background ── */}
        <div
          style={{
            position: "absolute",
            bottom: equipBottom + 6,
            right: 6,
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            background: "rgba(0,0,0,0.45)",
            borderRadius: 3,
            padding: "1px 4px",
          }}
        >
          <span
            style={{
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              fontSize: 27,
              fontWeight: 700,
              lineHeight: 1,
              color: "#ffffff",
              textShadow: `0 2px 10px rgba(0,0,0,0.9), 0 0 8px ${hpColor}60`,
              letterSpacing: "-0.02em",
            }}
          >
            {player.state.health}
          </span>
        </div>

        {/* ── HP bar — 4px strip at photo bottom edge ── */}
        <div
          style={{
            position: "absolute",
            bottom: equipBottom,
            left: 0,
            right: 0,
            height: 4,
            background: "rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${hp}%`,
              background: `linear-gradient(90deg, ${hpColor}cc, ${hpColor})`,
              boxShadow: `0 0 8px ${hpColor}`,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        </div>

        {/* ── Equipment strip — weapon icon LEFT (bigger), grenades RIGHT ── */}
        <div
          style={{
            position: "absolute",
            bottom: NAME_H + STATS_H,
            left: 0,
            right: 0,
            height: EQUIP_H,
            background: "rgba(4,4,12,0.97)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingLeft: 7,
            paddingRight: 6,
          }}
        >
          <WeaponIcon
            weaponName={activeWeapon?.name}
            className="h-[16px] w-[56px] object-contain brightness-0 invert"
          />
          <UtilityStrip player={player} />
        </div>

        {/* ── Name bar — with left accent stripe ── */}
        <div
          style={{
            position: "absolute",
            bottom: STATS_H,
            left: 0,
            right: 0,
            height: NAME_H,
            backgroundColor: theme.nameBg,
            borderTop: `1px solid ${theme.accentColor}22`,
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Left accent stripe */}
          <div
            style={{
              flexShrink: 0,
              width: 3,
              alignSelf: "stretch",
              background: theme.accentColor,
            }}
          />
          <span
            style={{
              marginLeft: 6,
              marginRight: 5,
              color: "#f0f4ff",
              fontSize: 12,
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
        </div>

        {/* ── Stats row — K / D / $ ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: STATS_H,
            display: "flex",
          }}
        >
          {/* Kill icon cell */}
          <div
            style={{
              width: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.iconCellBg,
              color: `${theme.accentColor}cc`,
              borderTop: `1px solid ${theme.accentColor}18`,
            }}
          >
            <CrosshairIcon size={11} />
          </div>
          {/* Kill count */}
          <div
            style={{
              width: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.numCellBg,
              borderTop: `1px solid rgba(255,255,255,0.04)`,
            }}
          >
            <span
              style={{
                color: "#fff",
                 fontSize: 12,
                fontWeight: 700,
                fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
                lineHeight: 1,
              }}
            >
              {player.match_stats.kills}
            </span>
          </div>
          {/* Death icon cell */}
          <div
            style={{
              width: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.iconCellBg,
              color: "rgba(255,255,255,0.4)",
              borderTop: `1px solid rgba(255,255,255,0.03)`,
            }}
          >
            <SkullIcon size={11} />
          </div>
          {/* Death count */}
          <div
            style={{
              width: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.numCellBg,
              borderTop: `1px solid rgba(255,255,255,0.04)`,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
                lineHeight: 1,
              }}
            >
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
              borderLeft: `1px solid rgba(255,215,0,0.10)`,
              borderTop: `1px solid rgba(255,215,0,0.08)`,
              gap: 1,
            }}
          >
            <span
              style={{
                color: theme.moneyText,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
                textShadow: `0 0 8px ${theme.moneyText}80`,
                lineHeight: 1,
              }}
            >
              ${player.state.money}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
