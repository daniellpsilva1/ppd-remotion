import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { ReadinessGrid } from "../components/ReadinessGrid";
import { SceneLayout } from "../components/SceneTitle";
import { TypewriterText } from "../components/TypewriterText";
import { brand, t } from "../brand";

const LEGEND = [
  { label: "Push", color: brand.colors.ready },
  { label: "Monitor", color: brand.colors.caution },
  { label: "Rest", color: brand.colors.risk },
];

export const CoachIntelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelEnter = spring({
    frame: frame - t(10),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const alertSlide = spring({
    frame: frame - t(70),
    fps,
    config: { damping: 200 },
  });

  const chatScale = spring({
    frame: frame - t(95),
    fps,
    config: { damping: 14, stiffness: 160 },
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <AbsoluteFill>
        <SceneLayout title="Know who to push, protect, or rest — with an AI assistant">
          <div
            style={{
              width: "100%",
              maxWidth: 1500,
              transform: `scale(${interpolate(panelEnter, [0, 1], [0.94, 1])})`,
              opacity: panelEnter,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 460px",
                gap: 0,
                background: "linear-gradient(145deg, #ffffff0a, #ffffff04)",
                border: `1px solid ${brand.colors.border}`,
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  padding: "32px 36px",
                  borderRight: `1px solid ${brand.colors.border}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: brand.colors.textLight,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Athlete Readiness Matrix
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    {LEGEND.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 4,
                            background: item.color,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 13,
                            color: brand.colors.textMuted,
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <ReadinessGrid startFrame={t(20)} cellSize={110} nameColumnWidth={130} />
              </div>

              <div
                style={{
                  padding: "32px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 24,
                  background: `${brand.colors.backgroundDark}66`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${interpolate(alertSlide, [0, 1], [60, 0])}px)`,
                    opacity: alertSlide,
                    background: `${brand.colors.risk}18`,
                    border: `1px solid ${brand.colors.risk}66`,
                    borderRadius: 16,
                    padding: "24px 28px",
                    boxShadow: `0 0 24px ${brand.colors.risk}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: brand.colors.risk,
                        boxShadow: `0 0 12px ${brand.colors.risk}`,
                      }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: brand.colors.risk,
                        fontFamily: "Inter, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                      }}
                    >
                      Injury Risk Alert
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      color: brand.colors.textLight,
                      fontFamily: "Inter, sans-serif",
                      lineHeight: 1.55,
                    }}
                  >
                    Leo: ACWR elevated + sleep debt. Recommend reduced load today.
                  </div>
                </div>

                <div
                  style={{
                    transform: `scale(${chatScale})`,
                    opacity: chatScale,
                    background: `linear-gradient(135deg, ${brand.colors.primary}28, ${brand.colors.violet}22)`,
                    border: `1px solid ${brand.colors.primary}55`,
                    borderRadius: 18,
                    padding: "28px 28px",
                    boxShadow: `0 8px 32px ${brand.colors.primary}22`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.violet})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        boxShadow: `0 4px 16px ${brand.colors.primary}55`,
                      }}
                    >
                      ✦
                    </div>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: brand.colors.textLight,
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      PPD AI Assistant
                    </span>
                  </div>
                  <div style={{ minHeight: 53 }}>
                    <TypewriterText
                      text="Sofia is fully recovered — good day for high-intensity drills."
                      startFrame={t(105)}
                      charsPerFrame={1.0}
                      style={{ fontSize: 17, lineHeight: 1.55, color: brand.colors.textLight }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SceneLayout>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
