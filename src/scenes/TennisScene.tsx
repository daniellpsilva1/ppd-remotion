import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { SceneLayout } from "../components/SceneTitle";
import { StatChip } from "../components/StatChip";
import { TennisCourt } from "../components/TennisCourt";
import { brand, t, TRANSITION_FRAMES } from "../brand";

export const TennisScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const courtEnter = spring({
    frame: frame - t(12),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  /** Wait for scene fade + court settle before ball trails animate */
  const courtAnimationStart = TRANSITION_FRAMES + t(22);

  const courtZoom = interpolate(courtEnter, [0, 1], [0.85, 1]);
  const courtRotate = interpolate(courtEnter, [0, 1], [-3, 0]);

  const statsDelay = 60;

  const statsPanel = spring({
    frame: frame - t(35) - statsDelay,
    fps,
    config: { damping: 200 },
  });

  const scanLine = interpolate(frame, [t(60), t(120)], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <AbsoluteFill>
        <SceneLayout title="SwingVision match analytics + live scorekeeping">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 480px",
              gap: 64,
              width: "100%",
              maxWidth: 1680,
              alignItems: "center",
            }}
          >
            {/* Court — dominant left panel */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  transform: `scale(${courtZoom}) rotate(${courtRotate}deg)`,
                  opacity: courtEnter,
                  position: "relative",
                  filter: `drop-shadow(0 24px 48px rgba(0,0,0,0.5))`,
                }}
              >
                <TennisCourt
                  width={440}
                  height={820}
                  heatmapStartFrame={t(45)}
                  animationStartFrame={courtAnimationStart}
                />
                {/* Scan line overlay */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${scanLine}%`,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${brand.colors.accent}88, transparent)`,
                    boxShadow: `0 0 20px ${brand.colors.accent}`,
                    opacity: scanLine > 0 && scanLine < 100 ? 0.8 : 0,
                  }}
                />
              </div>
            </div>

            {/* Stats panel — right column, 2x2 grid */}
            <div
              style={{
                opacity: statsPanel,
                transform: `translateX(${interpolate(statsPanel, [0, 1], [40, 0])}px)`,
                display: "flex",
                flexDirection: "column",
                gap: 24,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                <StatChip label="Serve %" value="68%" color={brand.colors.primary} delay={t(50) + statsDelay} slideFrom="right" />
                <StatChip label="Winners" value="24" color={brand.colors.accent} delay={t(62) + statsDelay} slideFrom="right" />
                <StatChip label="Avg Rally" value="4.2" color={brand.colors.violet} delay={t(74) + statsDelay} slideFrom="right" />
                <StatChip label="1st Serve In" value="72%" color={brand.colors.chartPalette[3]} delay={t(86) + statsDelay} slideFrom="right" />
              </div>

              <div
                style={{
                  padding: "24px 28px",
                  background: `linear-gradient(135deg, ${brand.colors.primary}18, ${brand.colors.violet}12)`,
                  border: `1px solid ${brand.colors.primary}44`,
                  borderRadius: 16,
                  opacity: spring({
                    frame: frame - t(100) - statsDelay,
                    fps,
                    config: { damping: 200 },
                  }),
                  transform: `scale(${spring({
                    frame: frame - t(100) - statsDelay,
                    fps,
                    config: { damping: 14, stiffness: 160 },
                  })})`,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: brand.colors.textMuted,
                    fontFamily: "Inter, sans-serif",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                  }}
                >
                  Live Score
                </div>
                <div
                  style={{
                    fontSize: 42,
                    fontWeight: 700,
                    color: brand.colors.textLight,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: 2,
                  }}
                >
                  6-4 · 3-2
                </div>
              </div>
            </div>
          </div>
        </SceneLayout>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
