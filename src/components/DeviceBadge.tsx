import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

type DeviceBadgeProps = {
  logo: string;
  name: string;
  delay?: number;
  orbitAngle?: number;
  dockFrame?: number;
  dockX?: number;
  dockY?: number;
};

export const DeviceBadge: React.FC<DeviceBadgeProps> = ({
  logo,
  name,
  delay = 0,
  orbitAngle = 0,
  dockFrame = 60,
  dockX = 0,
  dockY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const orbitRadius = 200;
  const dockProgress = spring({
    frame: frame - dockFrame - delay,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  const orbitX =
    Math.cos((orbitAngle * Math.PI) / 180 + frame * 0.04) * orbitRadius;
  const orbitY =
    Math.sin((orbitAngle * Math.PI) / 180 + frame * 0.04) * orbitRadius * 0.55;

  const x = interpolate(dockProgress, [0, 1], [orbitX, dockX], {
    extrapolateRight: "clamp",
  });
  const y = interpolate(dockProgress, [0, 1], [orbitY, dockY], {
    extrapolateRight: "clamp",
  });

  const entryScale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const pulse =
    dockProgress > 0.9
      ? 1 + Math.sin((frame - dockFrame) * 0.2) * 0.04
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${x}px, ${y}px) scale(${entryScale * pulse})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          background: "#ffffff",
          border: `1px solid #E2E8F0`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow:
            dockProgress > 0.8
              ? `0 0 32px ${brand.colors.primary}44, 0 8px 24px rgba(0,0,0,0.25)`
              : "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <Img
          src={staticFile(logo)}
          style={{ width: 56, height: 56, objectFit: "contain" }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: brand.colors.textLight,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {name}
      </span>
    </div>
  );
};
