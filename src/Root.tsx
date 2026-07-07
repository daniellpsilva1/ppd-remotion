import "./index.css";
import { Composition } from "remotion";
import { ppdMarketingConfig } from "./PPDMarketing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={ppdMarketingConfig.id}
        component={ppdMarketingConfig.component}
        durationInFrames={ppdMarketingConfig.durationInFrames}
        fps={ppdMarketingConfig.fps}
        width={ppdMarketingConfig.width}
        height={ppdMarketingConfig.height}
      />
    </>
  );
};
