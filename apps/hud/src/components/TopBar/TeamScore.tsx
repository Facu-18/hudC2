interface TeamScoreProps {
  side: "CT" | "T";
  name: string;
  score: number;
  flipped?: boolean;
}

export function TeamScore({ side, name, score, flipped = false }: TeamScoreProps) {
  const isCT = side === "CT";

  const accentColor = isCT ? "#1e90ff" : "#ff6600";
  const accentGlow = isCT
    ? "0 0 20px rgba(30,144,255,0.35)"
    : "0 0 20px rgba(255,102,0,0.35)";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: flipped ? "row-reverse" : "row",
        alignItems: "stretch",
        width: 420,
        height: 72,
        background: "rgba(5,5,10,0.88)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4), ${accentGlow}`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Outer accent line — left edge for CT, right edge for T */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          [flipped ? "right" : "left"]: 0,
          width: 3,
          background: accentColor,
          zIndex: 10,
        }}
      />

      {/* Score block */}
      <div
        style={{
          flexShrink: 0,
          width: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${accentColor}cc 0%, ${accentColor}88 100%)`,
          position: "relative",
        }}
      >
        {/* Diagonal cut on the inner edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [flipped ? "left" : "right"]: -1,
            width: 18,
            background: "rgba(5,5,10,0.88)",
            clipPath: flipped
              ? "polygon(100% 0, 100% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 0 100%)",
          }}
        />
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 42,
            fontWeight: 700,
            lineHeight: 1,
            color: "#ffffff",
            textShadow: `0 2px 12px rgba(0,0,0,0.5)`,
            position: "relative",
            zIndex: 5,
            letterSpacing: "-0.02em",
          }}
        >
          {score}
        </span>
      </div>

      {/* Team info */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: flipped ? "0 20px 0 24px" : "0 24px 0 20px",
          alignItems: flipped ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 10,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: accentColor,
            lineHeight: 1,
            marginBottom: 5,
          }}
        >
          {side}
        </span>
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "#f0f4ff",
            lineHeight: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {name}
        </span>
      </div>
    </div>
  );
}
