import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FloatingParticles } from "./FloatingParticles";
import { brand } from "../brand";

export const AuroraBackground: React.FC<{ intensity?: number }> = ({
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 20;
  const drift2 = Math.cos(frame / 45) * 15;

  return (
    <AbsoluteFill
      style={{
        background: brand.colors.bodyBackground,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at ${50 + drift * 0.3}% 20%, ${brand.colors.auroraIndigo}88 0%, transparent 70%)`,
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 50% at ${30 - drift * 0.2}% 80%, ${brand.colors.auroraEmerald}66 0%, transparent 65%)`,
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${70 + drift2 * 0.4}% 50%, ${brand.colors.orbCyan}22 0%, transparent 40%)`,
          opacity: intensity,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent 0%, ${brand.colors.backgroundDark}55 100%)`,
        }}
      />
      <FloatingParticles />
      {/* Subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${brand.colors.border}11 1px, transparent 1px),
            linear-gradient(90deg, ${brand.colors.border}11 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: interpolate(frame, [0, 30], [0, 0.35], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
