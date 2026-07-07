import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 73.3) % 100,
  size: 2 + (i % 3),
  speed: 0.3 + (i % 5) * 0.1,
  opacity: 0.15 + (i % 4) * 0.08,
}));

export const FloatingParticles: React.FC<{ color?: string }> = ({
  color = brand.colors.orbCyan,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {PARTICLES.map((p) => {
        const y = (p.y + frame * p.speed * 0.08) % 110 - 5;
        const x = p.x + Math.sin(frame * 0.02 + p.id) * 2;
        const twinkle = interpolate(
          Math.sin(frame * 0.05 + p.id * 2),
          [-1, 1],
          [0.4, 1],
        );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity: p.opacity * twinkle,
              boxShadow: `0 0 ${p.size * 3}px ${color}`,
            }}
          />
        );
      })}
    </div>
  );
};
