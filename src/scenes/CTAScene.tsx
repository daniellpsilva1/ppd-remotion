import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AuroraBackground } from "../components/AuroraBackground";
import { brand, t } from "../brand";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - t(5),
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const glowPulse = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1]);

  const headlineReveal = spring({
    frame: frame - t(18),
    fps,
    config: { damping: 200 },
  });

  const buttonPulse = 1 + Math.sin(frame * 0.15) * 0.04 * interpolate(frame, [t(35), t(80)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaReveal = spring({
    frame: frame - t(45),
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <AuroraBackground intensity={1.3} />
      {/* Radial spotlight */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, ${brand.colors.primary}22 0%, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: -50,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${brand.colors.primary}33 0%, transparent 70%)`,
              transform: `scale(${glowPulse})`,
            }}
          />
          <Img
            src={staticFile("ppd-logo-512.png")}
            style={{
              width: 140,
              height: 140,
              transform: `scale(${logoScale})`,
              borderRadius: 28,
              boxShadow: `0 0 ${56 * glowPulse}px ${brand.colors.primary}66`,
              position: "relative",
            }}
          />
        </div>

        <div
          style={{
            opacity: headlineReveal,
            transform: `translateY(${interpolate(headlineReveal, [0, 1], [24, 0])}px)`,
            fontFamily: "Inter, sans-serif",
            fontSize: 56,
            fontWeight: 700,
            color: brand.colors.textLight,
            letterSpacing: -1.5,
          }}
        >
          Elevate your tennis.
        </div>

        <div
          style={{
            opacity: headlineReveal,
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            color: brand.colors.accent,
            fontWeight: 500,
          }}
        >
          {brand.website}
        </div>

        <div
          style={{
            opacity: ctaReveal,
            transform: `scale(${buttonPulse}) translateY(${interpolate(ctaReveal, [0, 1], [16, 0])}px)`,
            background: `linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.primaryDark})`,
            borderRadius: 16,
            padding: "20px 56px",
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#fff",
            boxShadow: `0 12px 40px ${brand.colors.primary}77`,
            marginTop: 8,
          }}
        >
          {brand.cta}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
