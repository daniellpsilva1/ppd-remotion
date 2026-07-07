import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, t } from "../brand";

type Shot = { x: number; y: number; intensity: number; delay: number };

/** Normalized coords within singles court (0–1) */
const SHOTS: Shot[] = [
  { x: 0.22, y: 0.18, intensity: 0.9, delay: t(0) },
  { x: 0.78, y: 0.15, intensity: 0.7, delay: t(8) },
  { x: 0.48, y: 0.42, intensity: 0.5, delay: t(16) },
  { x: 0.72, y: 0.38, intensity: 0.85, delay: t(24) },
  { x: 0.28, y: 0.72, intensity: 0.6, delay: t(32) },
  { x: 0.55, y: 0.28, intensity: 0.95, delay: t(40) },
  { x: 0.82, y: 0.65, intensity: 0.75, delay: t(48) },
  { x: 0.35, y: 0.55, intensity: 0.55, delay: t(56) },
];

type TennisCourtProps = {
  width?: number;
  height?: number;
  showHeatmap?: boolean;
  heatmapStartFrame?: number;
  /** Delay ball trails and shot dots until the court is fully on screen */
  animationStartFrame?: number;
};

const SURROUND = "#1B4332";
const COURT_BLUE = "#3C638E";
const LINE = "#FFFFFF";

export const TennisCourt: React.FC<TennisCourtProps> = ({
  width = 440,
  height = 954,
  showHeatmap = true,
  heatmapStartFrame = 60,
  animationStartFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pad = 20;
  const courtW = width - pad * 2;
  const courtH = height - pad * 2;
  const singlesInset = courtW * (4.5 / 36);
  const serviceDist = courtH * (18 / 78);

  const left = pad;
  const right = pad + courtW;
  const top = pad;
  const bottom = pad + courtH;
  const singlesL = left + singlesInset;
  const singlesR = right - singlesInset;
  const netY = top + courtH / 2;
  const serviceTop = top + serviceDist;
  const serviceBottom = bottom - serviceDist;
  const centerX = left + courtW / 2;

  const toPixel = (sx: number, sy: number) => ({
    x: singlesL + sx * (singlesR - singlesL),
    y: top + sy * courtH,
  });

  const heatmapOpacity = showHeatmap
    ? interpolate(frame, [heatmapStartFrame, heatmapStartFrame + 40], [0, 0.65], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <radialGradient id="heatGradient">
          <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Surround */}
      <rect x={0} y={0} width={width} height={height} rx={12} fill={SURROUND} />

      {/* Doubles court surface */}
      <rect x={left} y={top} width={courtW} height={courtH} fill={COURT_BLUE} />

      {/* Singles alleys (slightly darker green tint on sides) */}
      <rect x={left} y={top} width={singlesInset} height={courtH} fill={SURROUND} opacity={0.35} />
      <rect x={singlesR} y={top} width={singlesInset} height={courtH} fill={SURROUND} opacity={0.35} />

      {/* Heatmap */}
      {showHeatmap &&
        SHOTS.map((shot, i) => {
          const { x: cx, y: cy } = toPixel(shot.x, shot.y);
          const r = 50 + shot.intensity * 35;
          return (
            <circle
              key={`heat-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="url(#heatGradient)"
              opacity={heatmapOpacity * shot.intensity}
            />
          );
        })}

      {/* Court lines */}
      <rect x={left} y={top} width={courtW} height={courtH} fill="none" stroke={LINE} strokeWidth={2.5} />
      <line x1={singlesL} y1={top} x2={singlesL} y2={bottom} stroke={LINE} strokeWidth={2} />
      <line x1={singlesR} y1={top} x2={singlesR} y2={bottom} stroke={LINE} strokeWidth={2} />
      <line x1={left} y1={netY} x2={right} y2={netY} stroke={LINE} strokeWidth={4} />
      <line x1={singlesL} y1={serviceTop} x2={singlesR} y2={serviceTop} stroke={LINE} strokeWidth={2} />
      <line x1={singlesL} y1={serviceBottom} x2={singlesR} y2={serviceBottom} stroke={LINE} strokeWidth={2} />
      <line x1={centerX} y1={serviceTop} x2={centerX} y2={serviceBottom} stroke={LINE} strokeWidth={2} />
      {/* Center marks on baselines — vertical ticks inward from baseline */}
      <line x1={centerX} y1={top} x2={centerX} y2={top + 10} stroke={LINE} strokeWidth={2.5} />
      <line x1={centerX} y1={bottom - 10} x2={centerX} y2={bottom} stroke={LINE} strokeWidth={2.5} />

      {/* Ball trajectories */}
      {SHOTS.slice(0, -1).map((shot, i) => {
        const next = SHOTS[i + 1];
        const p1 = toPixel(shot.x, shot.y);
        const p2 = toPixel(next.x, next.y);
        const midX = (p1.x + p2.x) / 2;
        const midY = Math.min(p1.y, p2.y) - 35;
        const path = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
        const drawProgress = interpolate(
          frame,
          [
            animationStartFrame + next.delay - 5,
            animationStartFrame + next.delay + 12,
          ],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );

        return (
          <path
            key={`trail-${i}`}
            d={path}
            fill="none"
            stroke="#ffffff88"
            strokeWidth={2}
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - drawProgress)}
            strokeLinecap="round"
          />
        );
      })}

      {/* Shot dots */}
      {SHOTS.map((shot, i) => {
        const scale = spring({
          frame: frame - animationStartFrame - shot.delay,
          fps,
          config: { damping: 12, stiffness: 200 },
        });
        const { x: cx, y: cy } = toPixel(shot.x, shot.y);
        const ripple = interpolate(frame - animationStartFrame - shot.delay, [0, 20], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <g key={`shot-${i}`} opacity={scale}>
            <circle
              cx={cx}
              cy={cy}
              r={10 + ripple * 18}
              fill="none"
              stroke={brand.colors.primary}
              strokeWidth={1.5}
              opacity={(1 - ripple) * 0.6}
            />
            <circle cx={cx} cy={cy} r={10} fill={brand.colors.primary} />
            <circle cx={cx} cy={cy} r={5} fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
};
