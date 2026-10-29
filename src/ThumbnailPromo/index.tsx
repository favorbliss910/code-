import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { anton, inter } from "./fonts";
import { Thumbnail } from "./Thumbnail";

const BG = "#0B0B12";
const YELLOW = "#FFD400";
const PINK = "#FF3B5C";

// Scene lengths in frames at 30 fps. Adjust these to match the voiceover.
export const SCENES = {
  hook: 180,
  plain: 120,
  reveal: 90,
  second: 90,
  bold: 120,
  pitch: 270,
  cta: 180,
} as const;

export const THUMBNAIL_PROMO_DURATION = Object.values(SCENES).reduce(
  (a, b) => a + b,
  0,
);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14 } });
};

const Line: React.FC<{
  readonly children: React.ReactNode;
  readonly delay?: number;
  readonly size?: number;
  readonly color?: string;
  readonly font?: string;
}> = ({ children, delay = 0, size = 84, color = "#FFFFFF", font = inter }) => {
  const enter = useEnter(delay);
  return (
    <div
      style={{
        fontFamily: font,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.1,
        color,
        textAlign: "center",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 40}px)`,
      }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{ readonly text: string; readonly color: string }> = ({
  text,
  color,
}) => (
  <div
    style={{
      fontFamily: inter,
      fontWeight: 800,
      fontSize: 34,
      letterSpacing: 6,
      color: BG,
      background: color,
      padding: "8px 22px",
      borderRadius: 10,
    }}
  >
    {text}
  </div>
);

// A feed of plain thumbnails scrolling past, all blending together.
const Feed: React.FC = () => {
  const frame = useCurrentFrame();
  const shades = ["#3A3A44", "#45454F", "#33333C", "#4C4C56"];
  return (
    <AbsoluteFill
      style={{
        flexDirection: "row",
        gap: 40,
        padding: "0 60px",
        opacity: 0.55,
        filter: "blur(2px)",
      }}
    >
      {[0, 1, 2, 3].map((col) => (
        <div
          key={col}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 40,
            transform: `translateY(${-((frame * (6 + col)) % 420) - col * 120}px)`,
          }}
        >
          {new Array(6).fill(0).map((_, i) => (
            <div key={i}>
              <div
                style={{
                  aspectRatio: "16 / 9",
                  borderRadius: 18,
                  background: shades[(i + col) % shades.length],
                }}
              />
              <div
                style={{
                  height: 18,
                  width: "80%",
                  marginTop: 16,
                  borderRadius: 9,
                  background: "#2A2A33",
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Feed />
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        background:
          "radial-gradient(circle, rgba(11,11,18,0.85) 30%, rgba(11,11,18,0.3) 80%)",
      }}
    >
      <Line size={96}>Your video could be amazing…</Line>
      <Line delay={70} size={72} color="#C9C9D6">
        but if the thumbnail doesn’t stop the scroll,
      </Line>
      <Line delay={115} size={130} color={PINK} font={anton}>
        NOBODY CLICKS.
      </Line>
    </AbsoluteFill>
  </AbsoluteFill>
);

const Plain: React.FC = () => {
  const enter = useEnter(0);
  return (
    <AbsoluteFill
      style={{ background: BG, justifyContent: "center", alignItems: "center" }}
    >
      <div style={{ position: "absolute", top: 70 }}>
        <Line size={72}>So watch this.</Line>
      </div>
      <div style={{ transform: `scale(${0.8 + enter * 0.2})`, opacity: enter }}>
        <Thumbnail
          subject="person"
          boldness={0}
          headline="Watch this now"
          width={1100}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 70,
          display: "flex",
          gap: 60,
        }}
      >
        <Line delay={35} size={56} color="#9A9AAA">
          Plain subject…
        </Line>
        <Line delay={70} size={56} color="#9A9AAA">
          plain background…
        </Line>
      </div>
    </AbsoluteFill>
  );
};

// Before → after makeover of one thumbnail.
const Makeover: React.FC<{
  readonly subject: "person" | "product";
  readonly headline: string;
  readonly caption: string;
  readonly startsBold: number;
}> = ({ subject, headline, caption, startsBold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - startsBold,
    fps,
    config: { damping: 9 },
  });
  const boldness = interpolate(
    frame,
    [startsBold, startsBold + 8],
    [0, 1],
    clamp,
  );
  const flash = interpolate(
    frame,
    [startsBold, startsBold + 3, startsBold + 12],
    [0, 0.7, 0],
    clamp,
  );
  return (
    <AbsoluteFill
      style={{ background: BG, justifyContent: "center", alignItems: "center" }}
    >
      <div style={{ position: "absolute", top: 70 }}>
        <Line size={72}>{caption}</Line>
      </div>
      <div style={{ transform: `scale(${1 + pop * 0.08})` }}>
        <Thumbnail
          subject={subject}
          boldness={boldness}
          headline={headline}
          width={1100}
        />
      </div>
      <div style={{ position: "absolute", bottom: 80 }}>
        <Label
          text={boldness < 0.5 ? "BEFORE" : "AFTER"}
          color={boldness < 0.5 ? "#9A9AAA" : YELLOW}
        />
      </div>
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Bold: React.FC = () => {
  const words: [string, string, number][] = [
    ["BOLD.", YELLOW, 0],
    ["BRIGHT.", PINK, 22],
    ["IMPOSSIBLE TO IGNORE.", "#FFFFFF", 44],
  ];
  return (
    <AbsoluteFill
      style={{ background: BG, justifyContent: "center", alignItems: "center" }}
    >
      {words.map(([word, color, delay]) => (
        <Slam key={word} delay={delay} color={color}>
          {word}
        </Slam>
      ))}
    </AbsoluteFill>
  );
};

const Slam: React.FC<{
  readonly children: string;
  readonly delay: number;
  readonly color: string;
}> = ({ children, delay, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 11 } });
  return (
    <div
      style={{
        fontFamily: anton,
        fontSize: 170,
        lineHeight: 1.05,
        color,
        opacity: frame >= delay ? 1 : 0,
        transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

const FEATURES = [
  "Clean cutouts",
  "Eye-catching text",
  "Color grading that pops",
  "High-resolution files",
  "Fast delivery",
  "Revisions until you love it",
];

const Pitch: React.FC = () => (
  <AbsoluteFill
    style={{
      background: BG,
      padding: "90px 140px",
      gap: 50,
      justifyContent: "center",
    }}
  >
    <Line size={76}>
      I design custom YouTube thumbnails
      <br />
      <span style={{ color: YELLOW }}>built to get clicks.</span>
    </Line>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "34px 80px",
        marginTop: 20,
      }}
    >
      {FEATURES.map((feature, i) => (
        <Feature key={feature} text={feature} delay={80 + i * 25} />
      ))}
    </div>
  </AbsoluteFill>
);

const Feature: React.FC<{ readonly text: string; readonly delay: number }> = ({
  text,
  delay,
}) => {
  const enter = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        opacity: enter,
        transform: `translateX(${(1 - enter) * -60}px)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: YELLOW,
          color: BG,
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${enter})`,
        }}
      >
        ✓
      </div>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 54,
          color: "#FFFFFF",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const button = useEnter(45);
  // The button "gets pressed" when the voiceover says "Hit order".
  const press = interpolate(frame, [75, 80, 88], [1, 0.9, 1], clamp);
  const pulse = 1 + Math.sin(frame / 6) * 0.02 * button;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 60%, #2A1030, ${BG} 70%)`,
        justifyContent: "center",
        alignItems: "center",
        gap: 70,
      }}
    >
      <Line size={88}>
        Your next video{" "}
        <span style={{ color: YELLOW }}>deserves to be seen.</span>
      </Line>
      <div
        style={{
          fontFamily: anton,
          fontSize: 110,
          color: "#FFFFFF",
          background: `linear-gradient(135deg, ${PINK}, #FF9F1C)`,
          padding: "20px 90px",
          borderRadius: 999,
          boxShadow: `0 20px 60px rgba(255,59,92,0.5)`,
          opacity: button,
          transform: `scale(${button * press * pulse})`,
        }}
      >
        ORDER NOW
      </div>
      <Line delay={95} size={64} color="#C9C9D6">
        Let’s make it happen.
      </Line>
    </AbsoluteFill>
  );
};

export const ThumbnailPromo: React.FC = () => {
  const order: [keyof typeof SCENES, React.ReactNode][] = [
    ["hook", <Hook key="hook" />],
    ["plain", <Plain key="plain" />],
    [
      "reveal",
      <Makeover
        key="reveal"
        subject="person"
        headline="Watch this now"
        caption="Now look at it."
        startsBold={0}
      />,
    ],
    [
      "second",
      <Makeover
        key="second"
        subject="product"
        headline="Top 5 tips"
        caption="And this one."
        startsBold={30}
      />,
    ],
    ["bold", <Bold key="bold" />],
    ["pitch", <Pitch key="pitch" />],
    ["cta", <Cta key="cta" />],
  ];

  let from = 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {order.map(([name, scene]) => {
        const start = from;
        from += SCENES[name];
        return (
          <Sequence
            key={name}
            name={name}
            from={start}
            durationInFrames={SCENES[name]}
          >
            {scene}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
