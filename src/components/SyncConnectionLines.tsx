import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";

type SyncConnectionLinesProps = {
  startFrame?: number;
};

const CONNECTIONS = [
  { x1: -130, y1: -90, x2: 0, y2: 0 },
  { x1: 130, y1: -90, x2: 0, y2: 0 },
  { x1: 0, y1: 120, x2: 0, y2: 0 },
];

export const SyncConnectionLines: React.FC<SyncConnectionLinesProps> = ({
  startFrame = 55,
}) => {
  const frame = useCurrentFrame();

  return (
    <svg
      style={{
        position: "absolute",
        width: 420,
        height: 420,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {CONNECTIONS.map((line, i) => {
        const progress = interpolate(
          frame,
          [startFrame + i * 8, startFrame + i * 8 + 25],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const cx = 210;
        const cy = 210;
        const x1 = cx + line.x1 * progress;
        const y1 = cy + line.y1 * progress;
        const dashOffset = frame * 2 + i * 20;

        return (
          <g key={i} opacity={progress}>
            <line
              x1={x1}
              y1={y1}
              x2={cx}
              y2={cy}
              stroke={brand.colors.accent}
              strokeWidth={2}
              strokeDasharray="8 6"
              strokeDashoffset={-dashOffset}
              opacity={0.7}
            />
            {/* Pulse dot traveling along line */}
            <circle
              cx={interpolate(progress, [0, 1], [x1, cx])}
              cy={interpolate(progress, [0, 1], [y1, cy])}
              r={4}
              fill={brand.colors.accent}
              opacity={0.9}
            />
          </g>
        );
      })}
    </svg>
  );
};
