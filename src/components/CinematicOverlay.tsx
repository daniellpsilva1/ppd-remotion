import { interpolate, useCurrentFrame } from "remotion";

/** Subtle cinematic vignette + occasional light sweep */
export const CinematicOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  const sweepX = interpolate(
    frame % 120,
    [0, 120],
    [-30, 130],
  );
  const sweepOpacity = interpolate(
    frame % 120,
    [0, 20, 100, 120],
    [0, 0.06, 0.06, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          zIndex: 50,
        }}
      />
      {/* Light sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: sweepOpacity,
          zIndex: 51,
          background: `linear-gradient(105deg, transparent ${sweepX - 8}%, rgba(255,255,255,0.12) ${sweepX}%, transparent ${sweepX + 8}%)`,
        }}
      />
    </>
  );
};
