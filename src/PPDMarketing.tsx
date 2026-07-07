import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  FPS,
  HEIGHT,
  TOTAL_FRAMES,
  TRANSITION_FRAMES,
  WIDTH,
  sceneDurations,
} from "./brand";
import { CTAScene } from "./scenes/CTAScene";
import { CinematicOverlay } from "./components/CinematicOverlay";
import { CoachIntelScene } from "./scenes/CoachIntelScene";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RolesScene } from "./scenes/RolesScene";
import { TennisScene } from "./scenes/TennisScene";
import { WearablesScene } from "./scenes/WearablesScene";

loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

const MusicTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const volume = interpolate(
    frame,
    [0, 15, TOTAL_FRAMES - 60, TOTAL_FRAMES],
    [0, 0.35, 0.35, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Audio
      src={staticFile("music.mp3")}
      volume={volume}
      startFrom={0}
    />
  );
};

export const PPDMarketing: React.FC = () => {
  const transitionTiming = linearTiming({ durationInFrames: TRANSITION_FRAMES });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1220" }}>
      <MusicTrack />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={sceneDurations.hook}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.problem}>
          <ProblemScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.wearables}>
          <WearablesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.tennis}>
          <TennisScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.coachIntel}>
          <CoachIntelScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.roles}>
          <RolesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />
        <TransitionSeries.Sequence durationInFrames={sceneDurations.cta}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <CinematicOverlay />
    </AbsoluteFill>
  );
};

export const ppdMarketingConfig = {
  id: "PPDMarketing" as const,
  component: PPDMarketing,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
};
