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
  const displayTime = Number.isFinite(seconds) ? Math.ceil(seconds).toString() : bomb.countdown;

  // Color shifts from orange → red as time runs out
  const isUrgent = Number.isFinite(seconds) && seconds < 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 158,
        left: "50%",
        transform: "translateX(-50%)",
        width: 520,
        height: 34,
        background: "rgba(12,4,4,0.86)",
        border: "1px solid rgba(255,80,40,0.28)",
        boxShadow: "0 8px 22px rgba(0,0,0,0.45), 0 0 18px rgba(255,60,30,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 12px",
        overflow: "hidden",
        clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
        animation: "fadeInDown 250ms ease-out forwards",
      }}
    >
      {/* Label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: isUrgent ? "#ff2222" : "#ff5a2a",
            boxShadow: "0 0 10px rgba(255,60,30,0.8)",
            animation: "blinkDot 0.8s step-end infinite",
          }}
        />
        <span
          style={{
            fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "rgba(255,210,190,0.92)",
            lineHeight: 1,
          }}
        >
          Bomb
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "relative",
          flex: 1,
          height: 6,
          background: "rgba(0,0,0,0.6)",
          overflow: "hidden",
          borderRadius: 999,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: isUrgent ? "linear-gradient(90deg, #ff2222, #ff6a00)" : "linear-gradient(90deg, #ff5a2a, #ffc04d)",
            boxShadow: "0 0 10px rgba(255,80,40,0.65)",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* Countdown */}
      <span
        style={{
          minWidth: 42,
          textAlign: "right",
          fontFamily: "Rajdhani, 'Arial Black', Arial, sans-serif",
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1,
          color: isUrgent ? "#ff4444" : "#ffffff",
          textShadow: isUrgent ? "0 0 14px rgba(255,68,68,0.8)" : "0 2px 8px rgba(0,0,0,0.6)",
          animation: isUrgent ? "urgencyPulse 0.5s ease-in-out infinite" : "none",
        }}
      >
        {displayTime}s
      </span>
    </div>
  );
}
