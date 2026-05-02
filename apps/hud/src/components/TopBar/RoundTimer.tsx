interface RoundTimerProps {
  phase: string;
  round: number;
  mapName: string;
}

export function RoundTimer({ phase, round, mapName }: RoundTimerProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 240,
        height: 80,
        background: "rgba(5,5,10,0.92)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)",
        position: "relative",
        overflow: "hidden",
        gap: 0,
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, #1e90ff 35%, #ffffff33 50%, #ff6600 65%, transparent 100%)",
        }}
      />

      {/* Map name */}
      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          color: "#1e90ff",
          lineHeight: 1,
          paddingBottom: 6,
        }}
      >
        {mapName}
      </span>

      {/* Separator */}
      <div
        style={{
          width: 160,
          height: 1,
          background: "rgba(255,255,255,0.1)",
          marginBottom: 6,
        }}
      />

      {/* Phase */}
      <span
        style={{
          fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
          fontSize: 28,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "#f0f4ff",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {phase}
      </span>

      {/* Round number */}
      <span
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 10,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.38)",
          lineHeight: 1,
        }}
      >
        Round {round + 1}
      </span>
    </div>
  );
}
