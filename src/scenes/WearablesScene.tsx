import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCounter, AnimatedLineChart } from "../components/AnimatedLineChart";
import { AuroraBackground } from "../components/AuroraBackground";
import { DeviceBadge } from "../components/DeviceBadge";
import { SceneLayout } from "../components/SceneTitle";
import { SyncConnectionLines } from "../components/SyncConnectionLines";
import { brand } from "../brand";

const hrvData = [42, 48, 45, 52, 58, 55, 62, 68, 65, 72];
const sleepData = [6.2, 7.1, 6.8, 7.5, 7.2, 8.0, 7.8, 8.2, 7.9, 8.5];
const recoveryData = [55, 58, 52, 65, 70, 68, 75, 80, 78, 85];
const loadData = [320, 380, 350, 420, 400, 450, 430, 480, 460, 510];

/** Matches AnimatedLineChart progress spring durationInFrames */
const CHART_DRAW_FRAMES = 55;
/** Next chart begins 0.5s before the previous line finishes */
const CHART_OVERLAP_FRAMES = 15;
const CHART_STAGGER = CHART_DRAW_FRAMES - CHART_OVERLAP_FRAMES;
const FIRST_CHART_FRAME = 50;

export const WearablesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dashboardEnter = spring({
    frame: frame - 55,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const hubGlow = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 1],
  );

  const syncBar = spring({
    frame: frame - 100,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <AuroraBackground />
      <AbsoluteFill>
        <SceneLayout title="30+ physiology insights, auto-synced">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "420px 1fr",
              gap: 56,
              width: "100%",
              maxWidth: 1680,
              alignItems: "center",
            }}
          >
            {/* Device sync hub — centered in its column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 420,
                  height: 420,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Orbit ring */}
                <div
                  style={{
                    position: "absolute",
                    width: 380,
                    height: 380,
                    borderRadius: "50%",
                    border: `1px dashed ${brand.colors.primary}33`,
                    transform: `rotate(${frame * 0.3}deg)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    border: `1px solid ${brand.colors.accent}22`,
                    boxShadow: `0 0 ${40 * hubGlow}px ${brand.colors.primary}33`,
                  }}
                />
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 28,
                    background: `linear-gradient(135deg, ${brand.colors.primary}44, ${brand.colors.violet}33)`,
                    border: `2px solid ${brand.colors.primary}88`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: brand.colors.textLight,
                    boxShadow: `0 0 ${48 * hubGlow}px ${brand.colors.primary}55`,
                    zIndex: 2,
                  }}
                >
                  PPD
                </div>
                <DeviceBadge logo="garmin-logo.png" name="Garmin" delay={8} orbitAngle={0} dockFrame={45} dockX={-130} dockY={-90} />
                <DeviceBadge logo="whoop-logo.png" name="Whoop" delay={16} orbitAngle={120} dockFrame={45} dockX={130} dockY={-90} />
                <DeviceBadge logo="polar-logo.png" name="Polar" delay={24} orbitAngle={240} dockFrame={45} dockX={0} dockY={120} />
                <SyncConnectionLines startFrame={52} />
              </div>

              {/* Sync status */}
              <div
                style={{
                  opacity: syncBar,
                  transform: `translateY(${interpolate(syncBar, [0, 1], [16, 0])}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 24px",
                  borderRadius: 999,
                  background: `${brand.colors.accent}18`,
                  border: `1px solid ${brand.colors.accent}44`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: brand.colors.accent,
                    boxShadow: `0 0 12px ${brand.colors.accent}`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: brand.colors.textLight,
                  }}
                >
                  Live sync · Garmin · Whoop · Polar
                </span>
              </div>
            </div>

            {/* Dashboard — fills right column */}
            <div
              style={{
                transform: `translateX(${interpolate(dashboardEnter, [0, 1], [60, 0])}px) scale(${interpolate(dashboardEnter, [0, 1], [0.92, 1])})`,
                opacity: dashboardEnter,
                background: "linear-gradient(145deg, #ffffff0c, #ffffff04)",
                border: `1px solid ${brand.colors.border}`,
                borderRadius: 24,
                padding: "36px 40px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 28,
                  paddingBottom: 20,
                  borderBottom: `1px solid ${brand.colors.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 22,
                    fontWeight: 600,
                    color: brand.colors.textLight,
                  }}
                >
                  Physiology Dashboard
                </span>
                <AnimatedCounter
                  value={30}
                  suffix="+ charts"
                  startFrame={75}
                  color={brand.colors.accent}
                  fontSize={18}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 32,
                }}
              >
                <AnimatedLineChart
                  data={hrvData}
                  label="HRV (ms)"
                  color={brand.colors.primary}
                  width={360}
                  height={130}
                  startFrame={FIRST_CHART_FRAME}
                />
                <AnimatedLineChart
                  data={sleepData}
                  label="Sleep (hrs)"
                  color={brand.colors.violet}
                  width={360}
                  height={130}
                  startFrame={FIRST_CHART_FRAME + CHART_STAGGER}
                />
                <AnimatedLineChart
                  data={recoveryData}
                  label="Recovery %"
                  color={brand.colors.accent}
                  width={360}
                  height={130}
                  startFrame={FIRST_CHART_FRAME + CHART_STAGGER * 2}
                />
                <AnimatedLineChart
                  data={loadData}
                  label="Training Load"
                  color={brand.colors.chartPalette[3]}
                  width={360}
                  height={130}
                  startFrame={FIRST_CHART_FRAME + CHART_STAGGER * 3}
                />
              </div>
            </div>
          </div>
        </SceneLayout>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
