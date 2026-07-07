import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

type CellStatus = "ready" | "caution" | "risk";

const GRID: CellStatus[][] = [
  ["ready", "ready", "caution", "ready", "ready"],
  ["caution", "ready", "ready", "risk", "ready"],
  ["ready", "ready", "caution", "ready", "caution"],
  ["ready", "risk", "ready", "ready", "ready"],
];

const statusColors: Record<CellStatus, string> = {
  ready: brand.colors.ready,
  caution: brand.colors.caution,
  risk: brand.colors.risk,
};

const statusLabels: Record<CellStatus, string> = {
  ready: "Push",
  caution: "Monitor",
  risk: "Rest",
};

type ReadinessGridProps = {
  cellSize?: number;
  nameColumnWidth?: number;
  startFrame?: number;
};

export const ReadinessGrid: React.FC<ReadinessGridProps> = ({
  cellSize = 88,
  nameColumnWidth = 120,
  startFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gap = 10;
  const athleteNames = ["Martí", "Sofia", "Leo", "Emma"];
  const labelSize = cellSize >= 100 ? 14 : 13;
  const nameSize = cellSize >= 100 ? 17 : 16;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${nameColumnWidth}px repeat(5, ${cellSize}px)`,
        gap,
        alignItems: "center",
      }}
    >
      <div />
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
        const headerReveal = spring({
          frame: frame - startFrame - i * 2,
          fps,
          config: { damping: 200 },
        });
        return (
          <div
            key={day}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: brand.colors.textMuted,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              opacity: headerReveal,
            }}
          >
            {day}
          </div>
        );
      })}

      {GRID.map((row, rowIdx) => (
        <React.Fragment key={`row-${rowIdx}`}>
          <div
            style={{
              fontSize: nameSize,
              fontWeight: 600,
              color: brand.colors.textLight,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {athleteNames[rowIdx]}
          </div>
          {row.map((status, colIdx) => {
            const cellDelay = startFrame + (rowIdx * 5 + colIdx) * 3;
            const reveal = spring({
              frame: frame - cellDelay,
              fps,
              config: { damping: 20, stiffness: 120 },
            });
            const isRisk = status === "risk";
            const pulse = isRisk
              ? 1 + Math.sin(frame * 0.15 + rowIdx + colIdx) * 0.03
              : 1;
            const glow = isRisk
              ? interpolate(Math.sin(frame * 0.12 + rowIdx + colIdx), [-1, 1], [0.3, 0.7])
              : 0;

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 12,
                  background: `${statusColors[status]}22`,
                  border: `2px solid ${statusColors[status]}88`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `translateY(${interpolate(reveal, [0, 1], [10, 0])}px) scale(${interpolate(reveal, [0, 1], [0.9, 1]) * pulse})`,
                  opacity: reveal,
                  boxShadow: isRisk
                    ? `0 0 ${20 * glow}px ${statusColors[status]}66`
                    : "none",
                }}
              >
                <span
                  style={{
                    fontSize: labelSize,
                    fontWeight: 600,
                    color: statusColors[status],
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {statusLabels[status]}
                </span>
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
