import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

type Point = { x: number; y: number };

const buildSmoothPath = (points: Point[]): string => {
  if (points.length === 0) {
    return "";
  }
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
};

const sampleSmoothPath = (points: Point[], samplesPerSegment = 12): Point[] => {
  if (points.length === 0) {
    return [];
  }
  if (points.length === 1) {
    return [points[0]];
  }

  const sampled: Point[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    for (let step = 1; step <= samplesPerSegment; step++) {
      const t = step / samplesPerSegment;
      const mt = 1 - t;
      sampled.push({
        x:
          mt ** 3 * p1.x +
          3 * mt ** 2 * t * cp1x +
          3 * mt * t ** 2 * cp2x +
          t ** 3 * p2.x,
        y:
          mt ** 3 * p1.y +
          3 * mt ** 2 * t * cp1y +
          3 * mt * t ** 2 * cp2y +
          t ** 3 * p2.y,
      });
    }
  }

  return sampled;
};

const getPathLength = (sampled: Point[]): number => {
  let length = 0;
  for (let i = 1; i < sampled.length; i++) {
    const dx = sampled[i].x - sampled[i - 1].x;
    const dy = sampled[i].y - sampled[i - 1].y;
    length += Math.hypot(dx, dy);
  }
  return length;
};

const getPointAtProgress = (sampled: Point[], progress: number): Point => {
  if (sampled.length === 0) {
    return { x: 0, y: 0 };
  }
  if (sampled.length === 1 || progress <= 0) {
    return sampled[0];
  }
  if (progress >= 1) {
    return sampled[sampled.length - 1];
  }

  const target = getPathLength(sampled) * progress;
  let walked = 0;

  for (let i = 1; i < sampled.length; i++) {
    const dx = sampled[i].x - sampled[i - 1].x;
    const dy = sampled[i].y - sampled[i - 1].y;
    const segment = Math.hypot(dx, dy);

    if (walked + segment >= target) {
      const t = (target - walked) / segment;
      return {
        x: sampled[i - 1].x + dx * t,
        y: sampled[i - 1].y + dy * t,
      };
    }

    walked += segment;
  }

  return sampled[sampled.length - 1];
};

type AnimatedLineChartProps = {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  label?: string;
  startFrame?: number;
  fill?: boolean;
};

export const AnimatedLineChart: React.FC<AnimatedLineChartProps> = ({
  data,
  color = brand.colors.primary,
  width = 280,
  height = 100,
  label,
  startFrame = 0,
  fill = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - startFrame,
    fps,
    durationInFrames: 55,
    config: { damping: 200 },
  });

  const padding = 10;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points: Point[] = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * chartW;
    const y = padding + chartH - ((v - min) / range) * chartH;
    return { x, y };
  });

  const sampledPath = sampleSmoothPath(points);
  const pathLength = getPathLength(sampledPath);
  const linePath = buildSmoothPath(points);
  const fillPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : "";
  const clipId = `chart-clip-${label?.replace(/\s+/g, "-").toLowerCase() ?? "line"}-${startFrame}`;
  const revealWidth = padding + chartW * progress;
  const headPoint = getPointAtProgress(sampledPath, progress);

  const cardReveal = spring({
    frame: frame - startFrame + 5,
    fps,
    config: { damping: 200 },
  });

  const dotPulse = progress > 0 ? 1 + Math.sin(frame * 0.2) * 0.3 : 1;
  const showDot = progress > 0 && progress < 1.02;

  return (
    <div
      style={{
        width,
        height: height + (label ? 28 : 0),
        opacity: cardReveal,
        transform: `translateY(${interpolate(cardReveal, [0, 1], [12, 0])}px)`,
        background: "#ffffff06",
        borderRadius: 12,
        padding: "12px 8px 8px",
        border: `1px solid ${brand.colors.border}44`,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 13,
            color: brand.colors.textMuted,
            marginBottom: 8,
            paddingLeft: 4,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      )}
      <svg width={width - 16} height={height}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={revealWidth} height={height} />
          </clipPath>
        </defs>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={padding}
            y1={padding + chartH * pct}
            x2={width - padding - 16}
            y2={padding + chartH * pct}
            stroke={brand.colors.border}
            strokeWidth={0.5}
            opacity={0.4}
          />
        ))}
        {fill && fillPath && (
          <path
            d={fillPath}
            fill={`${color}33`}
            stroke="none"
            clipPath={`url(#${clipId})`}
          />
        )}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - progress)}
          />
        )}
        {showDot && (
          <>
            <circle
              cx={headPoint.x}
              cy={headPoint.y}
              r={8 * dotPulse}
              fill={`${color}33`}
            />
            <circle cx={headPoint.x} cy={headPoint.y} r={5} fill={color} />
          </>
        )}
      </svg>
    </div>
  );
};

export const AnimatedCounter: React.FC<{
  value: number;
  suffix?: string;
  startFrame?: number;
  duration?: number;
  color?: string;
  fontSize?: number;
}> = ({
  value,
  suffix = "",
  startFrame = 0,
  duration = 30,
  color = brand.colors.textLight,
  fontSize = 28,
}) => {
  const frame = useCurrentFrame();
  const current = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, value],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Math.round(current)}
      {suffix}
    </span>
  );
};
