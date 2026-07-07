import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

type StatChipProps = {
  label: string;
  value: string;
  color?: string;
  delay?: number;
  slideFrom?: "left" | "right" | "bottom";
};

export const StatChip: React.FC<StatChipProps> = ({
  label,
  value,
  color = brand.colors.primary,
  delay = 0,
  slideFrom = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  const offset = interpolate(enter, [0, 1], [slideFrom === "right" ? 40 : slideFrom === "left" ? -40 : 0, 0]);
  const yOffset = interpolate(enter, [0, 1], [slideFrom === "bottom" ? 30 : 0, 0]);

  return (
    <div
      style={{
        background: `${color}18`,
        border: `1px solid ${color}55`,
        borderRadius: 14,
        padding: "18px 24px",
        transform: `translate(${offset}px, ${yOffset}px) scale(${enter})`,
        opacity: enter,
        minWidth: 140,
        boxShadow: `0 4px 20px ${color}22`,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: brand.colors.textMuted,
          fontFamily: "Inter, sans-serif",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: brand.colors.textLight,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
};
