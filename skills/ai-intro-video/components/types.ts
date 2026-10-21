export interface VideoConfig {
  video: {
    source: string;
    duration: number; // 秒
  };
  timeline: TimelineItem[];
}

export type TimelineItem = ScreenshotItem | TextItem | HighlightItem;

export interface BaseTimelineItem {
  type: string;
  startTime: number; // 秒
  duration: number; // 秒
}

export interface ScreenshotItem extends BaseTimelineItem {
  type: "screenshot";
  src: string;
  position: "center" | "top-right" | "top-left" | "bottom-right" | "bottom-left" | "full" | "right-panel" | "left-panel" | "top-banner" | "bottom-banner";
  size?: "small" | "medium" | "large" | "full"; // 控制截图大小
  animation?: {
    enter?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "zoomIn";
    exit?: "fadeOut" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "zoomOut";
    zoom?: {
      enabled: boolean;
      focusArea: FocusArea;
      timing: ZoomTiming;
      maxScale?: number;
      showBorder?: boolean;
    };
  };
}

export interface TextItem extends BaseTimelineItem {
  type: "text";
  content: string;
  style: "subtitle" | "title" | "highlight" | "caption" | "keyword" | "emphasis";
  position: "top" | "bottom" | "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  animation?: "slideUp" | "fadeIn" | "typewriter" | "popIn" | "pulse";
  fontSize?: number;
  color?: string;
}

export interface HighlightItem extends BaseTimelineItem {
  type: "highlight";
  area: { x: number; y: number; width: number; height: number };
  effect: "glow" | "border" | "blur-background" | "spotlight";
  color?: string;
}

export interface FocusArea {
  x: number; // 百分比 0-100
  y: number;
  width: number;
  height: number;
}

export interface ZoomTiming {
  showDuration: number; // 完整展示时长
  zoomDuration: number; // 放大动画时长
  holdDuration: number; // 放大后停留时长
  zoomOutDuration?: number; // 缩回时长
}
