interface PlayerHPProps {
  health: number;
  armor: number;
}

export function PlayerHP({ health, armor }: PlayerHPProps) {
  const hp = Math.max(0, Math.min(100, health));
  const ar = Math.max(0, Math.min(100, armor));

  const hpColor =
    hp > 60 ? "#22cc44" :
    hp > 30 ? "#e6c020" :
              "#cc2222";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {/* Health bar + value */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.55)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${hp}%`,
              background: hpColor,
              boxShadow: `0 0 8px ${hpColor}80`,
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: hpColor,
            lineHeight: 1,
            minWidth: 26,
            textAlign: "right",
            textShadow: `0 0 8px ${hpColor}60`,
          }}
        >
          {health}
        </span>
      </div>

      {/* Armor bar */}
      {armor > 0 && (
        <div style={{ height: 2, background: "rgba(0,0,0,0.5)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${ar}%`,
              background: "rgba(100,170,255,0.85)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}
