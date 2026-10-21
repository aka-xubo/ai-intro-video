import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Img, staticFile } from "remotion";
import { ScreenshotItem } from "./types";
import { theme } from "./theme";

interface ScreenshotOverlayProps {
  item: ScreenshotItem;
  startFrame: number;
}

export const ScreenshotOverlay: React.FC<ScreenshotOverlayProps> = ({ item, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const durationInFrames = item.duration * fps;

  if (localFrame < 0 || localFrame >= durationInFrames) {
    return null;
  }

  // 入场动画
  const enterDuration = 0.5 * fps;
  const enterProgress = interpolate(localFrame, [0, enterDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 出场动画
  const exitDuration = 0.5 * fps;
  const exitProgress = interpolate(
    localFrame,
    [durationInFrames - exitDuration, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(enterProgress, exitProgress);

  // 位置计算
  const getPositionStyle = (): React.CSSProperties => {
    const size = item.size || "medium";
    const sizeConfig = {
      small: { maxWidth: "30%", maxHeight: "30%" },
      medium: { maxWidth: "50%", maxHeight: "50%" },
      large: { maxWidth: "70%", maxHeight: "70%" },
      full: { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" }
    };

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      objectFit: "contain",
      borderRadius: "4px",
      border: `1px solid ${theme.colors.line}`,
      boxShadow: "none",
      ...sizeConfig[size],
    };

    const positions: Record<string, React.CSSProperties> = {
      center: { ...baseStyle, top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
      "top-right": { ...baseStyle, top: "8%", right: "3%", maxWidth: "35%", maxHeight: "35%" },
      "top-left": { ...baseStyle, top: "8%", left: "3%", maxWidth: "35%", maxHeight: "35%" },
      "bottom-right": { ...baseStyle, bottom: "8%", right: "3%", maxWidth: "35%", maxHeight: "35%" },
      "bottom-left": { ...baseStyle, bottom: "8%", left: "3%", maxWidth: "35%", maxHeight: "35%" },
      "right-panel": { ...baseStyle, top: "50%", right: "2%", transform: "translateY(-50%)", width: "35%", maxWidth: "35%", height: "auto", maxHeight: "80%" },
      "left-panel": { ...baseStyle, top: "50%", left: "2%", transform: "translateY(-50%)", width: "35%", maxWidth: "35%", height: "auto", maxHeight: "80%" },
      "top-banner": { ...baseStyle, top: "5%", left: "50%", transform: "translateX(-50%)", width: "80%", maxWidth: "80%", height: "auto", maxHeight: "25%" },
      "bottom-banner": { ...baseStyle, bottom: "5%", left: "50%", transform: "translateX(-50%)", width: "80%", maxWidth: "80%", height: "auto", maxHeight: "25%" },
      full: { ...baseStyle, width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%", borderRadius: "0" },
    };

    return positions[item.position] || baseStyle;
  };

  // 缩放动画
  let scale = 1;
  if (item.animation?.zoom?.enabled) {
    const { timing } = item.animation.zoom;
    const showFrames = timing.showDuration * fps;
    const zoomFrames = timing.zoomDuration * fps;
    const holdFrames = timing.holdDuration * fps;
    const zoomOutFrames = (timing.zoomOutDuration || 0) * fps;

    if (localFrame < showFrames) {
      scale = 1;
    } else if (localFrame < showFrames + zoomFrames) {
      scale = interpolate(
        localFrame,
        [showFrames, showFrames + zoomFrames],
        [1, item.animation.zoom.maxScale || 2.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    } else if (localFrame < showFrames + zoomFrames + holdFrames) {
      scale = item.animation.zoom.maxScale || 2.5;
    } else if (zoomOutFrames > 0) {
      scale = interpolate(
        localFrame,
        [showFrames + zoomFrames + holdFrames, showFrames + zoomFrames + holdFrames + zoomOutFrames],
        [item.animation.zoom.maxScale || 2.5, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Img
        src={staticFile(item.src)}
        style={{
          ...getPositionStyle(),
          opacity,
          transform: `${getPositionStyle().transform || ""} scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
