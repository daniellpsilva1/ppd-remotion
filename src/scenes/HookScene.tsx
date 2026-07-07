import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { TypewriterText } from "../components/TypewriterText";
import { brand, t } from "../brand";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const glowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.5, 1]);

  return (
    <AbsoluteFill>
      <AuroraBackground intensity={1.1} />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -40,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${brand.colors.primary}${Math.round(glowPulse * 40).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
            }}
          />
          <Img
            src={staticFile("ppd-logo-512.png")}
            style={{
              width: 160,
              height: 160,
              transform: `scale(${logoScale})`,
              borderRadius: 32,
              boxShadow: `0 0 ${60 * glowPulse}px ${brand.colors.primary}66`,
              position: "relative",
            }}
          />
        </div>
        <div style={{ textAlign: "center", maxWidth: 960, padding: "0 40px" }}>
          <TypewriterText
            text={brand.tagline}
            startFrame={t(22)}
            charsPerFrame={0.9}
            style={{
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: -0.5,
            }}
          />
        </div>
        <div
          style={{
            fontSize: 20,
            color: brand.colors.textMuted,
            fontFamily: "Inter, sans-serif",
            opacity: spring({
              frame: frame - t(55),
              fps,
              config: { damping: 200 },
            }),
            transform: `translateY(${interpolate(
              spring({ frame: frame - t(55), fps, config: { damping: 200 } }),
              [0, 1],
              [16, 0],
            )}px)`,
          }}
        >
          {brand.name}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
