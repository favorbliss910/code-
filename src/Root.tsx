import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { SAAS_EXPLAINER_DURATION, SaasExplainer } from "./SaasExplainer";
import { THUMBNAIL_PROMO_DURATION, ThumbnailPromo } from "./ThumbnailPromo";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        id="ThumbnailPromo"
        component={ThumbnailPromo}
        durationInFrames={THUMBNAIL_PROMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        // 9:16 version for TikTok, Reels and Shorts
        id="ThumbnailPromoVertical"
        component={ThumbnailPromo}
        durationInFrames={THUMBNAIL_PROMO_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="SaasExplainer"
        component={SaasExplainer}
        durationInFrames={SAAS_EXPLAINER_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
