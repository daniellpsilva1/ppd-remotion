import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand } from "../brand";

type SceneTitleProps = {
  children: React.ReactNode;
  startFrame?: number;
  subtitle?: string;
};

export const SceneTitle: React.FC<SceneTitleProps> = ({
  children,
  startFrame = 5,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
  });

  const lineWidth = interpolate(reveal, [0, 1], [0, 100], {
    extrapolateRight: "clamp",
  });

  const shimmer = interpolate(frame % 90, [0, 90], [-100, 200]);

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: subtitle ? 12 : 0,
        transform: `translateY(${interpolate(reveal, [0, 1], [24, 0])}px)`,
        opacity: reveal,
      }}
    >
      <h2
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 38,
          fontWeight: 700,
          color: brand.colors.textLight,
          letterSpacing: -0.5,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {children}
      </h2>
      <div
        style={{
          position: "relative",
          height: 3,
          width: `${lineWidth}%`,
          maxWidth: 280,
          margin: "16px auto 0",
          borderRadius: 2,
          overflow: "hidden",
          background: `linear-gradient(90deg, transparent, ${brand.colors.primary}, ${brand.colors.accent}, transparent)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent ${shimmer - 20}%, rgba(255,255,255,0.6) ${shimmer}%, transparent ${shimmer + 20}%)`,
          }}
        />
      </div>
      {subtitle && (
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 18,
            color: brand.colors.textMuted,
            margin: "12px 0 0",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const SceneLayout: React.FC<{
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: string;
}> = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "48px 72px 56px",
        boxSizing: "border-box",
      }}
    >
      {title && (
        <SceneTitle subtitle={subtitle}>{title}</SceneTitle>
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
