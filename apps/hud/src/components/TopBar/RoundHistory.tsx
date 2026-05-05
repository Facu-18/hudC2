interface RoundHistoryProps {
  ctScore: number;
  tScore: number;
}

export function RoundHistory({ ctScore, tScore }: RoundHistoryProps) {
  const total = Math.min(12, ctScore + tScore);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 20,
        gap: 3,
        padding: "0 4px",
      }}
    >
      {Array.from({ length: 12 }).map((_, index) => {
        const won = index < total;
        const isCT = index < ctScore;

        // Half-time divider between round 11 and 12 (0-indexed)
        const showDivider = index === 6;

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {/* Half-time divider */}
            {showDivider && (
              <div
                style={{
                  width: 1,
                  height: 14,
                  background: "rgba(255,255,255,0.25)",
                  marginRight: 1,
                }}
              />
            )}

            {/* Diamond pip */}
            <div
              style={{
                width: 10,
                height: 10,
                transform: "rotate(45deg)",
                borderRadius: 1,
                background: won
                  ? isCT
                    ? "#1e90ff"
                    : "#ff6600"
                  : "rgba(255,255,255,0.12)",
                boxShadow: won
                  ? isCT
                    ? "0 0 6px rgba(30,144,255,0.5)"
                    : "0 0 6px rgba(255,102,0,0.5)"
                  : "none",
                flexShrink: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
