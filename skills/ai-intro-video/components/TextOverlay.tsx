import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { TextItem } from "./types";
import { theme } from "./theme";

interface TextOverlayProps {
  item: TextItem;
  startFrame: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ item, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const durationInFrames = item.duration * fps;

  if (localFrame < 0 || localFrame >= durationInFrames) {
    return null;
  }

  // 动画进度
  const animationDuration = 0.5 * fps;
  const enterProgress = interpolate(localFrame, [0, animationDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exitProgress = interpolate(
    localFrame,
    [durationInFrames - animationDuration, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(enterProgress, exitProgress);

  // 样式配置
  const getTextStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      fontFamily: theme.font.sans,
      color: item.color || theme.colors.ink,
      textShadow: "none",
      padding: "18px 28px",
      borderRadius: 0,
      background: theme.colors.paperLight,
      borderLeft: `6px solid ${item.color || theme.colors.coral}`,
      maxWidth: "80%",
      textAlign: "center",
    };

    switch (item.style) {
      case "title":
        return { ...baseStyle, fontFamily: theme.font.display, fontSize: item.fontSize || 80, fontWeight: 700 };
      case "subtitle":
        return { ...baseStyle, fontSize: item.fontSize || 56, fontWeight: 500 };
      case "highlight":
        return {
          ...baseStyle,
          fontSize: item.fontSize || 64,
          fontWeight: 700,
          color: item.color || theme.colors.coral,
          background: "transparent",
          textShadow: "none",
          padding: "20px 40px",
          borderLeft: "none",
          borderTop: `2px solid ${item.color || theme.colors.coral}`,
        };
      case "keyword":
        return {
          ...baseStyle,
          fontSize: item.fontSize || 72,
          fontWeight: 700,
          color: item.color || theme.colors.coral,
          background: theme.colors.paperLight,
          textShadow: "none",
          padding: "24px 48px",
          border: `1px solid ${item.color || theme.colors.coral}`,
        };
      case "emphasis":
        return {
          ...baseStyle,
          fontSize: item.fontSize || 68,
          fontWeight: 700,
          color: item.color || theme.colors.coral,
          textShadow: "none",
          background: theme.colors.paperLight,
        };
      case "caption":
        return { ...baseStyle, fontSize: item.fontSize || 42, fontWeight: 400 };
      default:
        return baseStyle;
    }
  };

  // 位置配置
  const getPositionStyle = (): React.CSSProperties => {
    const positions: Record<string, React.CSSProperties> = {
      top: { top: "10%", left: "50%", transform: "translateX(-50%)" },
      bottom: { bottom: "10%", left: "50%", transform: "translateX(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "top-left": { top: "10%", left: "5%" },
      "top-right": { top: "10%", right: "5%" },
      "bottom-left": { bottom: "10%", left: "5%" },
      "bottom-right": { bottom: "10%", right: "5%" },
    };
    return positions[item.position] || positions.bottom;
  };

  // 动画效果
  let animationTransform = "";
  let animationScale = 1;

  if (item.animation === "slideUp") {
    const slideOffset = interpolate(enterProgress, [0, 1], [30, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animationTransform = `translateY(${slideOffset}px)`;
  } else if (item.animation === "popIn") {
    animationScale = interpolate(enterProgress, [0, 0.5, 1], [0, 1.2, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      },
    });
  } else if (item.animation === "pulse") {
    // 脉冲效果：持续缩放
    const pulseProgress = (localFrame % (fps * 1.5)) / (fps * 1.5);
    animationScale = interpolate(pulseProgress, [0, 0.5, 1], [1, 1.1, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  const positionStyle = getPositionStyle();
  const baseTransform = positionStyle.transform || "";

  return (
    <AbsoluteFill style={{ pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "absolute",
          ...positionStyle,
          ...getTextStyle(),
          opacity,
          transform: `${baseTransform} ${animationTransform} scale(${animationScale})`,
        }}
      >
        {item.content}
      </div>
    </AbsoluteFill>
  );
};
