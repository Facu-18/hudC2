import type { Player } from "@cs2-hud/types";
import { getEquipmentIconPath, WeaponIcon } from "./WeaponIcon";

interface PlayerCardProps {
  player: Player;
  variant?: "compact" | "featured";
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

// ─── Theme ───────────────────────────────────────────────────────────────────
// Colors extracted from the Figma Frame 3 design:
//  base      → bright-blue main background
//  nameBg    → black name bar
//  iconCell  → darker-blue for icon cells in stats row
//  numCell   → mid-blue for number cells in stats row
//  moneyBg   → same bright-blue as base for the money cell
//  moneyText → retro green
function getTheme(team: Player["team"]) {
  if (team === "CT") {
    return {
      baseBg: "#3D7EFF",        // bright blue background
      nameBg: "#000000",        // black name bar
      iconCellBg: "#1A3A6E",    // dark blue – icon cells
      numCellBg: "#0F2147",     // darker blue – number cells
      moneyBg: "#3D7EFF",       // same as base – money cell bg
      moneyText: "#00FF41",     // retro green
      fallbackImage: "/players/ct.png",
    };
  }
  return {
    baseBg: "#FF6B2B",          // orange background
    nameBg: "#000000",
    iconCellBg: "#7B2A00",
    numCellBg: "#4A1800",
    moneyBg: "#FF6B2B",
    moneyText: "#00FF41",
    fallbackImage: "/players/tt.png",
  };
}

function getPlayerImage(player: Player) {
  return `${serverUrl}/assets/players/${player.steamId}`;
}

// Crosshair icon (SVG)
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

// Skull icon (SVG – more accurate skull shape)
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

// Utility grenades row
function UtilityIcons({ player, compact = false }: { player: Player; compact?: boolean }) {
  const utility = Object.values(player.weapons)
    .filter((w) => w.name !== "weapon_knife")
    .filter((w) =>
      w.type.toLowerCase().includes("grenade") ||
      w.name.includes("grenade") ||
      w.name.includes("molotov")
    )
    .slice(0, compact ? 3 : 4);

  const size = compact ? "h-7 w-7" : "h-10 w-10";
  const gap = compact ? "gap-1" : "gap-2";

  return (
    <div className={`flex items-center ${gap}`}>
      {utility.map((w, i) => (
        <img
          key={`${w.name}-${i}`}
          src={getEquipmentIconPath(w.name)}
          alt={w.name.replace("weapon_", "")}
          className={`${size} object-contain brightness-0 invert`}
        />
      ))}
    </div>
  );
}

// ─── Featured card (observed / center player) ─────────────────────────────────
// Matches Figma Frame 3 exactly:
//  • Blue rect fills the card body
//  • Player image is taller than the card – head overflows above the top edge
//  • Utility icons + armor at the bottom of the blue area (left & right)
//  • Weapon left, HP number right, both sitting on the very bottom of the blue area
//  • Black name bar below
//  • Stats row with alternating dark cells at the very bottom
function FeaturedCard({ player, theme }: { player: Player; theme: ReturnType<typeof getTheme> }) {
  const activeWeapon = Object.values(player.weapons).find((w) => w.state === "active");

  // Card body dimensions (blue area + name bar + stats row, no overflow)
  const CARD_W = 310;
  const BLUE_H = 320;   // blue photo area
  const NAME_H = 52;    // black name bar
  const STATS_H = 52;   // stats row
  const TOTAL_H = BLUE_H + NAME_H + STATS_H;
  const OVERFLOW = 120; // how far the image spills above the blue area

  return (
    // Outer wrapper must be tall enough to show the overflowing image
    <div
      style={{ width: CARD_W, height: TOTAL_H + OVERFLOW, position: "relative" }}
    >
      {/* ── Blue background (card body, bottom-aligned) ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H,
          left: 0,
          right: 0,
          height: BLUE_H,
          backgroundColor: theme.baseBg,
        }}
      />

      {/* ── Player image (overflows above the blue area) ── */}
      <img
        src={getPlayerImage(player)}
        alt={player.name}
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H,
          left: "50%",
          transform: "translateX(-50%)",
          height: BLUE_H + OVERFLOW,
          maxWidth: "none",
          objectFit: "contain",
          zIndex: 10,
        }}
        onError={(e) => { e.currentTarget.src = theme.fallbackImage; }}
      />

      {/* ── Overlay: utility icons + armor ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H + 56,
          left: 16,
          right: 16,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <UtilityIcons player={player} />
        {player.state.armor > 0 && (
          <img
            src={player.state.helmet ? "/equipment/armor_helmet.svg" : "/equipment/armor.svg"}
            alt="Armor"
            style={{ height: 52, width: 52, objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        )}
      </div>

      {/* ── Overlay: active weapon (left) + HP (right) ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H + 6,
          left: 12,
          right: 12,
          zIndex: 20,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <WeaponIcon weaponName={activeWeapon?.name} className="h-14 w-44 object-contain brightness-0 invert" />
        <span
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 80,
            fontWeight: 900,
            lineHeight: 1,
            color: "#FFFFFF",
            textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            letterSpacing: "-2px",
          }}
        >
          {player.state.health}
        </span>
      </div>

      {/* ── Name bar (black) ── */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H,
          left: 0,
          right: 0,
          height: NAME_H,
          backgroundColor: theme.nameBg,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "Arial Black, Arial, sans-serif",
          }}
        >
          {player.name}
        </span>
      </div>

      {/* ── Stats row ── */}
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
        {/* Crosshair icon cell */}
        <div style={{ width: 56, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "white" }}>
          <CrosshairIcon size={28} />
        </div>
        {/* Kills number cell */}
        <div style={{ width: 64, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#FFFFFF", fontSize: 30, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
            {player.match_stats.kills}
          </span>
        </div>
        {/* Skull icon cell */}
        <div style={{ width: 56, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "white" }}>
          <SkullIcon size={28} />
        </div>
        {/* Deaths number cell */}
        <div style={{ width: 64, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#FFFFFF", fontSize: 30, fontWeight: 700, fontFamily: "Arial, sans-serif" }}>
            {player.match_stats.deaths}
          </span>
        </div>
        {/* Money cell – flex-1 fills remaining width */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.moneyBg }}>
          <span
            style={{
              color: theme.moneyText,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.15em",
              textShadow: `0 0 8px ${theme.moneyText}`,
            }}
          >
            {player.state.money}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Compact card (non-observed players) ─────────────────────────────────────
function CompactCard({ player, theme }: { player: Player; theme: ReturnType<typeof getTheme> }) {
  const activeWeapon = Object.values(player.weapons).find((w) => w.state === "active");

  const CARD_W = 148;
  const BLUE_H = 170;
  const NAME_H = 28;
  const STATS_H = 28;
  const OVERFLOW = 50;
  const TOTAL_H = BLUE_H + NAME_H + STATS_H;

  return (
    <div style={{ width: CARD_W, height: TOTAL_H + OVERFLOW, position: "relative" }}>
      {/* Blue background */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H,
          left: 0,
          right: 0,
          height: BLUE_H,
          backgroundColor: theme.baseBg,
        }}
      />

      {/* Player image */}
      <img
        src={getPlayerImage(player)}
        alt={player.name}
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H,
          left: "50%",
          transform: "translateX(-50%)",
          height: BLUE_H + OVERFLOW,
          maxWidth: "none",
          objectFit: "contain",
          zIndex: 10,
        }}
        onError={(e) => { e.currentTarget.src = theme.fallbackImage; }}
      />

      {/* Utility + armor */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H + 30,
          left: 6,
          right: 6,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <UtilityIcons player={player} compact />
        {player.state.armor > 0 && (
          <img
            src={player.state.helmet ? "/equipment/armor_helmet.svg" : "/equipment/armor.svg"}
            alt="Armor"
            style={{ height: 24, width: 24, objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
        )}
      </div>

      {/* Weapon + HP */}
      <div
        style={{
          position: "absolute",
          bottom: STATS_H + NAME_H + 4,
          left: 6,
          right: 6,
          zIndex: 20,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <WeaponIcon weaponName={activeWeapon?.name} className="h-8 w-20 object-contain brightness-0 invert" />
        <span
          style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 38,
            fontWeight: 900,
            lineHeight: 1,
            color: "#FFFFFF",
            textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          {player.state.health}
        </span>
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
          display: "flex",
          alignItems: "center",
          paddingLeft: 8,
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "Arial Black, Arial, sans-serif",
          }}
        >
          {player.name}
        </span>
      </div>

      {/* Stats row */}
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
        <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "white" }}>
          <CrosshairIcon size={14} />
        </div>
        <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700 }}>{player.match_stats.kills}</span>
        </div>
        <div style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.iconCellBg, color: "white" }}>
          <SkullIcon size={14} />
        </div>
        <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.numCellBg }}>
          <span style={{ color: "#FFFFFF", fontSize: 15, fontWeight: 700 }}>{player.match_stats.deaths}</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.moneyBg }}>
          <span
            style={{
              color: theme.moneyText,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "'Courier New', Courier, monospace",
              letterSpacing: "0.1em",
              textShadow: `0 0 6px ${theme.moneyText}`,
            }}
          >
            {player.state.money}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function PlayerCard({ player, variant = "compact" }: PlayerCardProps) {
  const theme = getTheme(player.team);

  if (variant === "featured") {
    return <FeaturedCard player={player} theme={theme} />;
  }

  return <CompactCard player={player} theme={theme} />;
}
