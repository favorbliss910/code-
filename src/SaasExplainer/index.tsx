import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { inter } from "../ThumbnailPromo/fonts";

// 5-second SaaS explainer sample. "YourApp" and all copy are placeholders.
export const SAAS_EXPLAINER_DURATION = 150;

const BG = "#F5F6FB";
const INK = "#14152B";
const MUTED = "#6B6E8A";
const BRAND = "#5B5BF7";
const BRAND_SOFT = "#ECECFE";
const GREEN = "#16B37E";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Cursor path and click timing, in frames.
const CLICK = 72;

const useSpring = (delay: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Copy: React.FC = () => {
  const pill = useSpring(0);
  const title = useSpring(8);
  const sub = useSpring(18);
  const cta = useSpring(110, 12);
  const rise = (v: number) => ({
    opacity: v,
    transform: `translateY(${(1 - v) * 30}px)`,
  });
  return (
    <div
      style={{
        width: 640,
        display: "flex",
        flexDirection: "column",
        gap: 32,
        fontFamily: inter,
      }}
    >
      <div
        style={{
          ...rise(pill),
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 20px 10px 12px",
          borderRadius: 999,
          background: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(20,21,43,0.08)",
          fontWeight: 700,
          fontSize: 28,
          color: INK,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${BRAND}, #9B6BFF)`,
          }}
        />
        YourApp
      </div>
      <div
        style={{
          ...rise(title),
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 1.02,
          letterSpacing: -2,
          color: INK,
        }}
      >
        Reports in <span style={{ color: BRAND }}>one click.</span>
      </div>
      <div
        style={{ ...rise(sub), fontSize: 36, lineHeight: 1.35, color: MUTED }}
      >
        Your product’s one-line value proposition goes here.
      </div>
      <div
        style={{
          opacity: cta,
          transform: `scale(${0.8 + cta * 0.2})`,
          transformOrigin: "left center",
          alignSelf: "flex-start",
          marginTop: 8,
          padding: "22px 40px",
          borderRadius: 16,
          background: INK,
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: 32,
        }}
      >
        Start free trial →
      </div>
    </div>
  );
};

const BARS = [0.42, 0.58, 0.5, 0.72, 0.64, 0.86, 0.95];

const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = useSpring(4, 18);
  const pressed = interpolate(
    frame,
    [CLICK - 2, CLICK, CLICK + 6],
    [1, 0.94, 1],
    clamp,
  );
  const toast = spring({
    frame: frame - (CLICK + 28),
    fps,
    config: { damping: 14 },
  });
  const total = Math.round(
    interpolate(frame, [CLICK + 4, CLICK + 40], [0, 1284], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  );

  return (
    <div
      style={{
        width: 980,
        height: 660,
        borderRadius: 24,
        background: "#FFFFFF",
        boxShadow: "0 40px 100px rgba(20,21,43,0.16)",
        overflow: "hidden",
        fontFamily: inter,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 120}px) rotateY(${(1 - enter) * -12}deg)`,
        position: "relative",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 56,
          background: "#F0F1F7",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 22px",
        }}
      >
        {["#FF6159", "#FFBD2E", "#28C941"].map((c) => (
          <div
            key={c}
            style={{ width: 14, height: 14, borderRadius: 7, background: c }}
          />
        ))}
        <div
          style={{
            marginLeft: 24,
            height: 30,
            width: 360,
            borderRadius: 8,
            background: "#FFFFFF",
            color: MUTED,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
          }}
        >
          app.yourapp.com/reports
        </div>
      </div>

      <div style={{ display: "flex", height: 604 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 190,
            background: "#FAFAFD",
            borderRight: "1px solid #EEEEF5",
            padding: "28px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {["Overview", "Reports", "Customers", "Settings"].map((item) => (
            <div
              key={item}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 18,
                fontWeight: 600,
                color: item === "Reports" ? BRAND : MUTED,
                background: item === "Reports" ? BRAND_SOFT : "transparent",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Main panel */}
        <div
          style={{
            flex: 1,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: INK }}>
              Weekly report
            </div>
            <div
              style={{
                padding: "14px 24px",
                borderRadius: 12,
                background: BRAND,
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 20,
                transform: `scale(${pressed})`,
                boxShadow:
                  frame >= CLICK
                    ? `0 0 0 ${interpolate(frame, [CLICK, CLICK + 14], [0, 18], clamp)}px rgba(91,91,247,${interpolate(frame, [CLICK, CLICK + 14], [0.35, 0], clamp)})`
                    : "none",
              }}
            >
              Generate report
            </div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <StatCard
              label="Tasks completed"
              value={total.toLocaleString("en-US")}
            />
            <StatCard
              label="Time saved"
              value={
                frame > CLICK + 4
                  ? `${Math.round((total / 1284) * 12)} hrs`
                  : "0 hrs"
              }
            />
          </div>

          {/* Chart */}
          <div
            style={{
              flex: 1,
              borderRadius: 16,
              border: "1px solid #EEEEF5",
              padding: "24px 28px",
              display: "flex",
              alignItems: "flex-end",
              gap: 22,
            }}
          >
            {BARS.map((h, i) => {
              const grow = spring({
                frame: frame - (CLICK + 6 + i * 4),
                fps,
                config: { damping: 14 },
              });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${Math.max(4, h * 100 * grow)}%`,
                    borderRadius: 8,
                    background: i === BARS.length - 1 ? BRAND : "#C9C9FB",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 28,
          padding: "16px 22px",
          borderRadius: 14,
          background: INK,
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: toast,
          transform: `translateY(${(1 - toast) * 30}px)`,
        }}
      >
        <span style={{ color: GREEN, fontSize: 24 }}>●</span> Report ready
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  readonly label: string;
  readonly value: string;
}> = ({ label, value }) => (
  <div
    style={{
      flex: 1,
      borderRadius: 16,
      border: "1px solid #EEEEF5",
      padding: "18px 24px",
    }}
  >
    <div style={{ fontSize: 17, color: MUTED, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 44, color: INK, fontWeight: 800, marginTop: 4 }}>
      {value}
    </div>
  </div>
);

// Pointer that glides onto the "Generate report" button and clicks it.
const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [30, CLICK - 4], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(move, [0, 1], [1500, 1700]);
  const y = interpolate(move, [0, 1], [900, 340]);
  const press = interpolate(
    frame,
    [CLICK - 2, CLICK, CLICK + 6],
    [1, 0.82, 1],
    clamp,
  );
  const opacity = interpolate(
    frame,
    [26, 34, CLICK + 30, CLICK + 40],
    [0, 1, 1, 0],
    clamp,
  );
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `scale(${press})`,
        transformOrigin: "top left",
        filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))",
      }}
    >
      <path
        d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.3 L18 13.3 Z"
        fill={INK}
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const SaasExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow push-in over the whole clip.
  const zoom = interpolate(frame, [0, SAAS_EXPLAINER_DURATION], [1, 1.04]);
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 80% 20%, ${BRAND_SOFT}, transparent 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 90,
          transform: `scale(${zoom})`,
          perspective: 1600,
        }}
      >
        <Copy />
        <Dashboard />
      </AbsoluteFill>
      <Cursor />
    </AbsoluteFill>
  );
};
