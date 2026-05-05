import type { Player, PlayerWeapon } from "@cs2-hud/types";
import type { ReactNode } from "react";
import { getEquipmentIconPath, WeaponIcon } from "./WeaponIcon";

interface PlayerSpectingCardProps {
  player: Player;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

function getPlayerImage(player: Player) {
  const version = Math.floor(Date.now() / 15000);
  return `${serverUrl}/assets/players/${encodeURIComponent(player.steamId)}?v=${version}`;
}

function getTheme(team: Player["team"]) {
  if (team === "CT") {
    return {
      bg: "rgba(4,14,30,0.98)",
      panel: "rgba(7,25,50,0.94)",
      accent: "#1e90ff",
      accentSoft: "rgba(30,144,255,0.26)",
      accentDark: "#061429",
      fallbackImage: "/players/ct.png"
    };
  }

  return {
    bg: "rgba(20,8,0,0.98)",
    panel: "rgba(44,16,0,0.94)",
    accent: "#ff6600",
    accentSoft: "rgba(255,102,0,0.28)",
    accentDark: "#250d00",
    fallbackImage: "/players/tt.png"
  };
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

function UtilityRow({ player }: { player: Player }) {
  const grenades = Object.values(player.weapons)
    .filter((weapon) =>
      weapon.type.toLowerCase().includes("grenade") ||
      weapon.name.includes("grenade") ||
      weapon.name.includes("molotov")
    )
    .slice(0, 4);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {grenades.map((weapon, index) => (
        <img
          key={`${weapon.name}-${index}`}
          src={getEquipmentIconPath(weapon.name)}
          alt={weapon.name.replace("weapon_", "")}
          style={{ height: 18, width: 18, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.86 }}
        />
      ))}
    </div>
  );
}

function AmmoDisplay({ weapon }: { weapon?: PlayerWeapon }) {
  if (!weapon || weapon.ammo_clip_max <= 0) return <span style={{ opacity: 0.4 }}>--</span>;

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif" }}>
      <span style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{weapon.ammo_clip}</span>
      <span style={{ color: "rgba(255,255,255,0.48)", fontSize: 14, fontWeight: 700 }}>/ {weapon.ammo_reserve}</span>
    </div>
  );
}

function StatBlock({ label, value, icon, valueSize = 22 }: { label: string; value: string | number; icon?: ReactNode; valueSize?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        padding: "0 8px",
        overflow: "hidden",
      }}
    >
      <div style={{ height: 14, color: "rgba(255,255,255,0.46)", display: "flex", alignItems: "center" }}>{icon}</div>
      <span style={{ color: "#fff", fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif", fontSize: valueSize, fontWeight: 700, lineHeight: 1, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {value}
      </span>
      <span style={{ color: "rgba(255,255,255,0.38)", fontSize: 8, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

export function PlayerSpectingCard({ player }: PlayerSpectingCardProps) {
  if (player.state.health <= 0) return null;

  const theme = getTheme(player.team);
  const activeWeapon = Object.values(player.weapons).find((weapon) => weapon.state === "active");
  const hp = Math.max(0, Math.min(100, player.state.health));
  const hpColor = hp > 60 ? "#22cc44" : hp > 30 ? "#e6c020" : "#cc2222";

  return (
    <div
      style={{
        position: "relative",
        width: 390,
        height: 238,
        marginBottom: 0,
        filter: `drop-shadow(0 0 26px ${theme.accentSoft}) drop-shadow(0 14px 24px rgba(0,0,0,0.55))`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${theme.bg} 0%, rgba(4,4,10,0.98) 48%, ${theme.panel} 100%)`,
          borderTop: `3px solid ${theme.accent}`,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 0 42px ${theme.accentSoft}`,
          clipPath: "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 160,
            background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accentDark} 100%)`,
            overflow: "hidden"
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
              transform: "scale(1.03)",
              filter: "contrast(1.05) saturate(1.05)"
            }}
            onError={(event) => { event.currentTarget.src = theme.fallbackImage; }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.46) 100%)" }} />
          <span
            style={{
              position: "absolute",
              right: 10,
              bottom: 66,
              color: "#fff",
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              fontSize: 50,
              fontWeight: 700,
              lineHeight: 1,
              textShadow: "0 3px 14px rgba(0,0,0,0.9)"
            }}
          >
            {player.state.health}
          </span>
        </div>

        <div style={{ position: "absolute", left: 170, right: 14, top: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: theme.accent, fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Observing {player.team}
          </span>
          <UtilityRow player={player} />
        </div>

        <div style={{ position: "absolute", left: 170, right: 16, top: 38 }}>
          <div
            style={{
              color: "#fff",
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              fontSize: 34,
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "0.04em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "uppercase",
              whiteSpace: "nowrap"
            }}
          >
            {player.name}
          </div>
        </div>

        <div style={{ position: "absolute", left: 170, right: 16, top: 88, height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <WeaponIcon weaponName={activeWeapon?.name} className="h-[28px] w-[140px] object-contain brightness-0 invert" />
          <AmmoDisplay weapon={activeWeapon} />
        </div>

        <div style={{ position: "absolute", left: 170, right: 16, top: 146 }}>
          <div style={{ height: 5, background: "rgba(0,0,0,0.55)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${hp}%`, background: hpColor, boxShadow: `0 0 10px ${hpColor}` }} />
          </div>
          {player.state.armor > 0 && (
            <div style={{ height: 3, marginTop: 5, background: "rgba(0,0,0,0.45)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.max(0, Math.min(100, player.state.armor))}%`, background: "rgba(100,170,255,0.9)" }} />
            </div>
          )}
        </div>

        <div style={{ position: "absolute", left: 160, right: 0, bottom: 0, height: 56, display: "flex", justifyContent: "flex-end", background: "rgba(3,3,8,0.72)" }}>
          <StatBlock label="K" value={player.match_stats.kills} icon={<CrosshairIcon size={13} />} />
          <StatBlock label="D" value={player.match_stats.deaths} icon={<SkullIcon size={13} />} />
          <StatBlock label="ADR" value={Math.round(player.match_stats.adr)} />
          <StatBlock label="Cash" value={`$${player.state.money}`} valueSize={14} />
        </div>
      </div>
    </div>
  );
}
