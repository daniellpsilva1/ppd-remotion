/**
 * Brand tokens synced from courtviz integration artifacts.
 * Source: PeakPerformanceDataMarketing/courtviz/integration/brand.json
 * Regenerate: pnpm --filter @ppd/tokens build (in courtviz)
 */
export const brand = {
  name: "Peak Performance Data",
  tagline: "Unified athlete intelligence for tennis academies",
  website: "peakperformancedata.app",
  cta: "Request a demo",
  colors: {
    primary: "#2563EB",
    primaryBright: "#3B82F6",
    primaryDark: "#1D4ED8",
    marketing: "#0047FF",
    accent: "#10B981",
    accentDark: "#059669",
    violet: "#A855F7",
    violetDark: "#7C3AED",
    backgroundDark: "#0F172A",
    bodyBackground: "#0b1220",
    auroraIndigo: "#1e1b4b",
    auroraEmerald: "#064e3b",
    orbCyan: "#06B6D4",
    textLight: "#F8FAFC",
    textMuted: "#94A3B8",
    border: "#334155",
    chartPalette: ["#2563EB", "#10B981", "#A855F7", "#F59E0B", "#06B6D4", "#EC4899"],
    ready: "#10B981",
    caution: "#F59E0B",
    risk: "#EF4444",
  },
  fonts: {
    display: "Barlow Condensed",
    body: "Inter",
  },
} as const;

export const FPS = 30;
export const TOTAL_SECONDS = 45;
export const TOTAL_FRAMES = FPS * TOTAL_SECONDS; // 1350
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Scene lengths for 45s total (minus 6×15-frame transitions) */
export const sceneDurations = {
  hook: 147,
  problem: 176,
  wearables: 244,
  tennis: 270,
  coachIntel: 310,
  roles: 147,
  cta: 146,
} as const;

export const TRANSITION_FRAMES = 15;

/** Scale frame-based animation timings when adjusting total duration */
export const TIMING = 3 / 2;

export const t = (frames: number) => Math.round(frames * TIMING);
