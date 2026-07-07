import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { SceneLayout } from "../components/SceneTitle";
import { brand, t } from "../brand";

const ROLES = [
  { icon: "🎾", role: "Coach", benefit: "Roster intelligence", color: brand.colors.primary },
  { icon: "🏃", role: "Player", benefit: "Readiness tracking", color: brand.colors.accent },
  { icon: "👨‍👩‍👧", role: "Parent", benefit: "Progress visibility", color: brand.colors.violet },
  { icon: "🏛️", role: "Club Admin", benefit: "Academy operations", color: brand.colors.chartPalette[3] },
];

export const RolesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <AbsoluteFill>
        <SceneLayout title="Built for every role in your academy">
          <div
            style={{
              display: "flex",
              gap: 36,
              justifyContent: "center",
              width: "100%",
              maxWidth: 1600,
            }}
          >
            {ROLES.map((r, i) => {
              const enter = spring({
                frame: frame - t(12) - i * t(10),
                fps,
                config: { damping: 18, stiffness: 110 },
              });
              const fanAngle = (i - 1.5) * 3;
              const fanY = Math.abs(i - 1.5) * 16;
              const hover = 1 + Math.sin(frame * 0.06 + i * 1.5) * 0.02 * enter;
              const riseY = interpolate(enter, [0, 1], [50, 0]);
              const cardScale = interpolate(enter, [0, 1], [0.94, 1]);

              return (
                <div
                  key={r.role}
                  style={{
                    flex: 1,
                    maxWidth: 280,
                    transform: `scale(${cardScale * hover}) rotate(${fanAngle * enter}deg) translateY(${riseY + fanY * (1 - enter)}px)`,
                    opacity: enter,
                    background: `linear-gradient(160deg, ${r.color}18, #ffffff06)`,
                    border: `1px solid ${r.color}44`,
                    borderRadius: 20,
                    padding: "40px 32px",
                    textAlign: "center",
                    boxShadow: `0 16px 48px rgba(0,0,0,0.35), 0 0 24px ${r.color}11`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 48,
                      marginBottom: 20,
                      transform: `scale(${spring({
                        frame: frame - t(20) - i * t(10),
                        fps,
                        config: { damping: 12, stiffness: 200 },
                      })})`,
                    }}
                  >
                    {r.icon}
                  </div>
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 700,
                      color: brand.colors.textLight,
                      fontFamily: "Inter, sans-serif",
                      marginBottom: 10,
                    }}
                  >
                    {r.role}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: brand.colors.textMuted,
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {r.benefit}
                  </div>
                </div>
              );
            })}
          </div>
        </SceneLayout>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
