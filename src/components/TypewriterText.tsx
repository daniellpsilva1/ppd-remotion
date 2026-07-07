import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";

type TypewriterTextProps = {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
};

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.8,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(
    text.length,
    Math.floor(elapsed * charsPerFrame),
  );
  const displayText = text.slice(0, visibleChars);
  const showCursor = visibleChars < text.length && Math.floor(frame / 15) % 2 === 0;

  return (
    <span
      style={{
        color: brand.colors.textLight,
        fontFamily: "Inter, sans-serif",
        ...style,
      }}
    >
      {displayText}
      {showCursor && (
        <span style={{ color: brand.colors.accent, opacity: 0.8 }}>|</span>
      )}
    </span>
  );
};

export const FadeInText: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame = 0, duration = 20, style }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [20, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "Inter, sans-serif",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
