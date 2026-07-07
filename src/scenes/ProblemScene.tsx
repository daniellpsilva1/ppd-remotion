import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { brand } from "../brand";

const FRAGMENTS = [
  {
    label: "Wearables",
    fromX: -520,
    fromY: -280,
    x: -300,
    y: -130,
    rot: -12,
    delay: 0,
    accent: brand.colors.primary,
  },
  {
    label: "Fitness tests",
    fromX: 520,
    fromY: -240,
    x: 320,
    y: -90,
    rot: 10,
    delay: 4,
    accent: brand.colors.accent,
  },
  {
    label: "Match stats",
    fromX: -480,
    fromY: 320,
    x: -240,
    y: 150,
    rot: 8,
    delay: 8,
    accent: brand.colors.violet,
  },
  {
    label: "Spreadsheets",
    fromX: 500,
    fromY: 360,
    x: 280,
    y: 170,
    rot: -9,
    delay: 12,
    accent: brand.colors.chartPalette[3],
  },
];

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pullProgress = spring({
    frame: frame - 60,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const subtitleReveal = spring({
    frame: frame - 110,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 900,
            height: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {FRAGMENTS.map((frag, i) => {
            const flyIn = spring({
              frame: frame - frag.delay,
              fps,
              config: { damping: 14, stiffness: 160 },
            });

            const scatterX = interpolate(flyIn, [0, 1], [frag.fromX, frag.x]);
            const scatterY = interpolate(flyIn, [0, 1], [frag.fromY, frag.y]);
            const scatterRot = interpolate(flyIn, [0, 1], [frag.rot * 2, frag.rot]);

            const x = interpolate(pullProgress, [0, 1], [scatterX, 0]);
            const y = interpolate(pullProgress, [0, 1], [scatterY, 0]);
            const rot = interpolate(pullProgress, [0, 1], [scatterRot, 0]);

            const bobX = Math.sin(frame * 0.06 + i * 1.7) * 8 * (1 - pullProgress);
            const bobY = Math.cos(frame * 0.05 + i * 2.1) * 10 * (1 - pullProgress);

            const opacity = interpolate(pullProgress, [0.65, 1], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={frag.label}
                style={{
                  position: "absolute",
                  transform: `translate(${x + bobX}px, ${y + bobY}px) rotate(${rot}deg)`,
                  opacity: pullProgress > 0.65 ? opacity : flyIn,
                  background: "linear-gradient(160deg, #F1F5F9, #E2E8F0)",
                  border: "1px solid #CBD5E1",
                  borderRadius: 18,
                  padding: "18px 28px 18px 24px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: brand.colors.backgroundDark,
                  boxShadow:
                    "0 10px 36px rgba(15, 23, 42, 0.14), 0 2px 10px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 28,
                    borderRadius: 4,
                    background: frag.accent,
                    flexShrink: 0,
                    boxShadow: `0 0 12px ${frag.accent}66`,
                  }}
                />
                {frag.label}
              </div>
            );
          })}

          <div
            style={{
              transform: `scale(${pullProgress})`,
              opacity: pullProgress,
              background: `linear-gradient(135deg, ${brand.colors.primary}44, ${brand.colors.violet}33)`,
              border: `2px solid ${brand.colors.primary}`,
              borderRadius: 24,
              padding: "36px 64px",
              boxShadow: `0 0 ${60 * pullProgress}px ${brand.colors.primary}55`,
            }}
          >
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 44,
                fontWeight: 700,
                color: brand.colors.textLight,
                textAlign: "center",
              }}
            >
              One platform
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 48,
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            color: brand.colors.textMuted,
            opacity: subtitleReveal,
            transform: `translateY(${interpolate(subtitleReveal, [0, 1], [20, 0])}px)`,
          }}
        >
          Stop juggling fragmented tools
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
