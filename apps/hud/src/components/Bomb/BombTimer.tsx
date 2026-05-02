import type { Bomb } from "@cs2-hud/types";

interface BombTimerProps {
  bomb: Bomb;
}

export function BombTimer({ bomb }: BombTimerProps) {
  if (bomb.state !== "planted") {
    return null;
  }

  const seconds = Number.parseFloat(bomb.countdown);
  const pct = Number.isFinite(seconds) ? Math.max(0, Math.min(100, (seconds / 40) * 100)) : 0;
  const displayTime = Number.isFinite(seconds) ? seconds.toFixed(1) : bomb.countdown;

  // Color shifts from orange → red as time runs out
  const isUrgent = Number.isFinite(seconds) && seconds < 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 144,
        left: "50%",
        transform: "translateX(-50%)",
        width: 320,
        background: "rgba(18,3,3,0.96)",
        boxShadow: "0 0 32px rgba(255,34,34,0.5), 0 0 64px rgba(255,34,34,0.2), 0 8px 24px rgba(0,0,0,0.7)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "fadeInDown 250ms ease-out forwards",
      }}
    >
      {/* Top alert bar */}
      <div
        style={{
          height: 3,
          background: "#ff2222",
          animation: "bombPulse 1s ease-out infinite",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px 8px",
        }}
      >
        {/* Left: label + blinking indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Blinking dot */}
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#ff2222",
              animation: "blinkDot 0.8s step-end infinite",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "rgba(255,180,180,0.9)",
              lineHeight: 1,
            }}
          >
            Bomb Planted
          </span>
        </div>

        {/* Right: countdown */}
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1,
            color: isUrgent ? "#ff4444" : "#ffffff",
            letterSpacing: "-0.02em",
            textShadow: isUrgent
              ? "0 0 20px rgba(255,68,68,0.8)"
              : "0 2px 8px rgba(0,0,0,0.6)",
            animation: isUrgent ? "urgencyPulse 0.5s ease-in-out infinite" : "none",
            display: "inline-block",
          }}
        >
          {displayTime}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 5,
          background: "rgba(0,0,0,0.6)",
          margin: "0 16px 12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #ff2222 0%, #ff5500 100%)",
            boxShadow: "0 0 8px rgba(255,34,34,0.6)",
            transition: "width 0.1s linear",
          }}
        />
      </div>
    </div>
  );
}
