import React from "react";
import { anton, inter } from "./fonts";

export type ThumbnailSubject = "person" | "product";

type Props = {
  readonly subject: ThumbnailSubject;
  // 0 = plain "before" version, 1 = finished "after" version.
  readonly boldness: number;
  readonly headline: string;
  readonly width: number;
};

const PersonShape: React.FC<{ fill: string }> = ({ fill }) => (
  <>
    <circle cx="0" cy="-95" r="62" fill={fill} />
    <path
      d="M -150 160 C -150 40, -90 -20, 0 -20 C 90 -20, 150 40, 150 160 Z"
      fill={fill}
    />
  </>
);

const ProductShape: React.FC<{ fill: string; lid: string }> = ({
  fill,
  lid,
}) => (
  <>
    <rect x="-110" y="-120" width="220" height="270" rx="18" fill={fill} />
    <rect x="-110" y="-150" width="220" height="50" rx="12" fill={lid} />
  </>
);

const Subject: React.FC<{
  subject: ThumbnailSubject;
  fill: string;
  accent: string;
}> = ({ subject, fill, accent }) =>
  subject === "person" ? (
    <PersonShape fill={fill} />
  ) : (
    <ProductShape fill={fill} lid={accent} />
  );

// One 16:9 thumbnail drawn as SVG. The plain and bold versions are stacked
// and cross-faded so `boldness` can animate the makeover.
export const Thumbnail: React.FC<Props> = ({
  subject,
  boldness,
  headline,
  width,
}) => {
  const height = (width * 9) / 16;
  const gradientId = `bg-${subject}`;
  const burstId = `burst-${subject}`;
  const hot = subject === "person";
  const colors = hot
    ? { from: "#FF3B5C", to: "#FF9F1C", subject: "#2B2D42", accent: "#FFD400" }
    : { from: "#00C2FF", to: "#7B2FF7", subject: "#FF7A00", accent: "#FFD400" };

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        overflow: "hidden",
        position: "relative",
        boxShadow: `0 30px 80px rgba(0,0,0,${0.35 + boldness * 0.3})`,
      }}
    >
      {/* Plain version */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <rect width="1280" height="720" fill="#A3A3A3" />
        <g transform="translate(640 470)">
          <Subject subject={subject} fill="#8A8A8A" accent="#7A7A7A" />
        </g>
        <text
          x="60"
          y="110"
          fill="#6E6E6E"
          fontFamily={inter}
          fontSize="54"
          fontWeight="400"
        >
          {headline.toLowerCase()}
        </text>
      </svg>

      {/* Bold version */}
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: boldness,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.from} />
            <stop offset="1" stopColor={colors.to} />
          </linearGradient>
          <radialGradient id={burstId} cx="0.72" cy="0.6" r="0.6">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1280" height="720" fill={`url(#${gradientId})`} />
        <rect width="1280" height="720" fill={`url(#${burstId})`} />
        <g
          transform={
            hot
              ? `translate(1010 ${600 - boldness * 20}) scale(1.35)`
              : `translate(920 ${470 - boldness * 20}) scale(1.25)`
          }
        >
          {/* White cutout outline, then the subject on top */}
          <g
            stroke="#FFFFFF"
            strokeWidth="26"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.45))" }}
          >
            <Subject subject={subject} fill="#FFFFFF" accent="#FFFFFF" />
          </g>
          <Subject
            subject={subject}
            fill={colors.subject}
            accent={colors.accent}
          />
        </g>
        <text
          x="60"
          y="300"
          fill={colors.accent}
          stroke="#111111"
          strokeWidth="14"
          paintOrder="stroke"
          fontFamily={anton}
          fontSize="150"
          style={{ textTransform: "uppercase" }}
        >
          {headline.split(" ").slice(0, 2).join(" ")}
        </text>
        <text
          x="60"
          y="460"
          fill="#FFFFFF"
          stroke="#111111"
          strokeWidth="14"
          paintOrder="stroke"
          fontFamily={anton}
          fontSize="150"
          style={{ textTransform: "uppercase" }}
        >
          {headline.split(" ").slice(2).join(" ")}
        </text>
      </svg>
    </div>
  );
};
