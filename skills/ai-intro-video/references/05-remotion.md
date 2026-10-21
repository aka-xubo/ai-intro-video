# Remotion 视频制作最佳实践

## 一、内容与叙事结构

### 1.1 场景逻辑顺序
**叙事三段论**:
- 先引出用户痛点（场景化）- 让观众产生共鸣
- 再展示具体问题（细节化）- 建立问题认知
- 最后提供解决方案（价值化）- 给出行动方向

**检查方法**:
- 将所有场景标题列出来，看是否形成清晰的故事线
- 问自己：如果去掉某个场景，故事是否还完整？

### 1.2 一个场景一个焦点
每个场景只传达一个核心信息。为每个场景写一句话总结，如果需要"和"、"以及"，说明焦点不清。

### 1.3 口播与视觉的一致性
口播说什么，画面就展示什么。逐帧对照口播文字和画面内容，如果口播在讲A，画面不应该出现B的任何元素。

### 1.4 措辞原则
- 避免绝对化表述（总是、从不、一定、必须）
- 使用温和、客观的语气（通常、往往、可能、建议）

### 1.5 关键信息的停留时间
| 信息类型 | 建议时长 |
|---------|---------|
| 简单文字（5-8字） | 2-3秒 |
| 复杂文字（15-20字） | 4-5秒 |
| URL/二维码 | 5-6秒 |
| 需要记忆的信息 | 至少6秒 |
| 结尾CTA | 6-8秒 |

宁可多停留，不要匆忙。

---

## 二、视觉设计系统

### 2.1 主题系统
```typescript
// theme.ts 推荐结构
export const colors = {
  paper: "#F3EDDC",
  paperLight: "#FFFDF8",
  ink: "#1D252C",
  muted: "#756F66",
  line: "#C9C1B2",
  coral: "#D85B3F",
  primary: "#397A64",
  primarySoft: "#E3EEE8",
  secondary: "#486A92",
  secondarySoft: "#E4EBF2",
  tertiary: "#765B8F",
  tertiarySoft: "#ECE6F0",
  brandDark: "#111722",
  brandGreen: "#66BB6A",
  brandYellow: "#FBBF24",
  white: "#FFFFFF",
};

export const typography = {
  display: 'Songti SC, STSong, SimSun, serif',
  sans: 'PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif',
  mono: 'SFMono-Regular, Menlo, Consolas, monospace',
};
```

### 2.2 颜色选择原则
- 主体默认使用暖纸 `#F3EDDC`，信息块使用纸白或语义浅色。
- 深墨文字与暖纸形成稳定高对比，不使用渐变文字。
- 珊瑚色只承担问题、判断和结论；绿、蓝、紫承担不同语义分组。
- 品牌绿和品牌黄只用于片头片尾、品牌名和少量品牌锚点。
- 深色渐变只用于品牌片头片尾，除非用户明确要求全片深色。

### 2.3 字体系统
**字号规范**（1080x1920）:
- 封面标题: 118-132px
- 场景主标题: 72-84px
- 卡片标题: 30-38px
- 正文: 24-34px
- 英文标签 / 编号 / 状态: 16-24px
- 字幕: 42-48px

**字体职责**: 中文大标题使用宋体族；正文使用黑体族；英文标签、编号、代码和状态使用等宽字体。

### 2.4 暖纸与编辑式信息块
```typescript
backgroundColor: "#FFFDF8",
borderLeft: "6px solid #397A64",
borderRadius: 0,
boxShadow: "none",
```

默认不使用玻璃拟态、大圆角、发光和浮动阴影。通过细分隔线、语义色边框、稳定网格和留白建立层级。

---

## 三、动画设计原则

### 3.1 动画价值层次
- **基础**（必须有）: 淡入淡出、位移、缩放
- **进阶**（提升专业度）: 多方向飞入、旋转配合位移、弹性效果
- **高级**（创造记忆点）: 复杂路径、多元素协同、物理模拟

### 3.2 缓动函数
**easeOutBack**（弹性）:
```typescript
easing: (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
```

**easeOutCubic**（平滑减速）:
```typescript
easing: (t) => 1 - Math.pow(1 - t, 3)
```

原则：避免线性动画，同类元素用相同缓动。

### 3.3 动画时长参考
- 微动画: 0.15-0.3秒
- 入场动画: 0.4-0.8秒
- 转场动画: 0.6-1.0秒
- 复杂动画: 1.0-2.0秒

### 3.4 强调动画
- 抖动：用于关键词，第一次8度第二次6度（递减）
- 脉冲：用于CTA，缩放幅度10%，1-2秒一次
- 一个场景最多强调1-2个元素

### 3.5 动画一致性
相同类型的元素使用相同的动画模式、时长、缓动函数和延迟间隔。

---

## 四、技术实现要点

### 4.1 时长配置
Root.tsx 定义总时长，场景组件定义各场景时长。两处必须同步。

```typescript
// Root.tsx
<Composition durationInFrames={totalFrames} fps={30} />

// 计算公式
总帧数 = (场景1秒数 + 场景2秒数 + ...) × fps
```

### 4.2 SVG ID 管理
SVG ID 是全局的，每个场景的 SVG 元素必须添加唯一前缀：
```typescript
<filter id="glow-scene2">...</filter>  // ✅
<filter id="glow">...</filter>          // ❌ 会冲突
```

### 4.3 帧计算最佳实践
```typescript
// ✅ 用 fps 乘法
const startFrame = fps * 0.5;

// ❌ 不要硬编码帧数
const startFrame = 15;

// 始终使用 clamp
extrapolateLeft: "clamp",
extrapolateRight: "clamp",
```

### 4.4 性能优化
- 使用 `interpolate` + `clamp` 而非手动条件判断
- 简化 SVG 路径，减少节点数
- 优先使用系统字体
- 用 `transform` 而非 `left/top`（避免重排）
- 条件渲染：`{frame > 30 && <Component />}`

### 4.5 调试技巧
```typescript
// 显示当前帧数（调试用）
<div style={{ position: "absolute", top: 10, left: 10 }}>
  Frame: {frame}
</div>
```

### 4.6 SceneIndex 组件（序号指示器）

当场景包含有序列表内容时，使用此组件在右上角显示固定的序号和标题。
新项目优先复制 skill 自带的 `components/theme.ts`、`PaperBackground.tsx`、`EditorialFrame.tsx` 和 `StageProgress.tsx`，再按内容扩展。下面的 `SceneIndex` 用于不需要整条阶段进度的局部列表。

```typescript
// SceneIndex.tsx
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface SceneIndexProps {
  current: number;   // 当前序号（从 1 开始）
  total: number;     // 总数
  title: string;     // 当前项标题（简短，不超过 10 字）
  color?: string;    // 当前语义色
}

export const SceneIndex: React.FC<SceneIndexProps> = ({ current, total, title, color = "#D85B3F" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterProgress = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        right: 60,
        background: "rgba(255, 253, 248, 0.82)",
        borderTop: `3px solid ${color}`,
        borderBottom: "1px solid #C9C1B2",
        borderRadius: 0,
        padding: "20px 28px",
        opacity: enterProgress,
        transform: `translateY(${interpolate(enterProgress, [0, 1], [-10, 0])}px)`,
        minWidth: 160,
        maxWidth: 320,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 38, fontWeight: 800, color, lineHeight: 1 }}>
          {String(current).padStart(2, "0")}
        </span>
        <span style={{ fontSize: 25, color: "#756F66", lineHeight: 1 }}>
          / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#1D252C",
          lineHeight: 1.3,
          maxWidth: 280,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </div>
    </div>
  );
};
```

**使用方式**：在 `AbsoluteFill` 内直接放置，无需额外定位：

```typescript
<AbsoluteFill style={{ ... }}>
  {/* 主体内容 */}
  <SceneIndex current={2} total={3} title="找用户数据" />
  <AnimatedSubtitle segments={[...]} />
</AbsoluteFill>
```

**切换序号时**：每个有序项对应一个独立的子场景（Scene2a、Scene2b...），各自传入对应的 `current` 值，入场动画自然实现切换效果。

---

## 五、工作流程

### 5.1 迭代顺序
1. **内容规划**：确定目标、设计叙事、撰写文案
2. **粗剪实现**：基础场景结构 + 简单动画 + 验证节奏
3. **视觉升级**：主题系统 + 统一颜色字体 + 视觉效果
4. **动画打磨**：高级动画 + 统一风格 + 强调动画
5. **整体审视**：完整播放 + 一致性检查 + 可读性测试

不要跳阶段。

### 5.2 质量检查清单

**品牌检查**:
- 封面是否突出本期主题？用户提供的品牌素材是否按要求呈现且没有遮挡？
- 片头和片尾是否符合用户提供的品牌规范与时长要求？

**内容**: 场景顺序逻辑？一景一事？口播视觉一致？措辞精准？停留时间够？

**截图**（如有）:
- 分镜脚本中所有截图需求都已标注？
- 截图文件都已准备在 `public/screenshots/`？
- 截图分辨率符合要求（≥1920px）？
- 聚焦坐标准确（如需放大）？
- 展示时长与口播同步？

**视觉**: 是否默认采用 `warm-editorial-proof`？暖纸、宋体标题、等宽标签、语义色、细边线和稳定留白是否一致？是否避免无意义渐变、玻璃态、大圆角与发光？
**动画**: 同类一致？时长合适？缓动匹配？强调克制？
**技术**: 总时长正确？SVG ID 唯一？用了 clamp？fps 乘法？组件复用？

---

## 六、设计哲学

1. **少即是多**：删除所有不必要的装饰元素，留白是设计的一部分
2. **一致性胜过创意**：先建立一致性，再有选择地打破
3. **服务内容，而非炫技**：如果动画分散了注意力，就删掉它
4. **渐进增强**：先确保没有动画也能理解内容，再逐步增强
5. **专业度来自细节**：一致的间距（8/16/24/32px）、圆角（4/8/16px）、动画时长（0.4/0.6/0.8s）

---

## 七、实用工具与脚本

位于 `scripts/` 目录：

### get-audio-duration.py
获取音频时长并生成场景配置代码：
```bash
python3 scripts/get-audio-duration.py public/audio
```

### generate-voiceovers.sh
批量生成配音文件：
```bash
./scripts/generate-voiceovers.sh zh-CN-YunxiNeural public/audio
```

### voiceover-scripts.txt.example
配音文本模板，复制并修改为你的内容。

详细使用说明见 `scripts/README.md`。

---

## 八、截图展示最佳实践

### 8.1 使用 ZoomableScreenshot 组件

当需要展示产品截图、界面说明时，使用 `ZoomableScreenshot` 组件实现动态聚焦效果。

**基础用法**（无放大）:
```typescript
<ZoomableScreenshot
  src="public/screenshots/example.png"
  timing={{
    showDuration: 3,
    zoomDuration: 0,
    holdDuration: 0,
  }}
/>
```

**带聚焦放大**:
```typescript
<ZoomableScreenshot
  src="public/screenshots/interface.png"
  focusArea={{ x: 30, y: 20, width: 40, height: 30 }}
  timing={{
    showDuration: 2,    // 完整展示2秒
    zoomDuration: 1,    // 放大1秒
    holdDuration: 2,    // 停留2秒
    zoomOutDuration: 1, // 缩回1秒
  }}
  maxScale={2.5}
  showBorder={true}
/>
```

### 8.2 截图准备规范

- **分辨率**: 至少 1920px 宽
- **格式**: PNG（支持透明）或 JPG
- **存放位置**: `public/screenshots/`
- **命名规范**: `{主题}-{序号}-{描述}.png`

### 8.3 聚焦区域坐标

坐标使用百分比（0-100），表示相对于图片的位置：
- `x`: 区域左上角 x 坐标百分比
- `y`: 区域左上角 y 坐标百分比
- `width`: 区域宽度百分比
- `height`: 区域高度百分比

**计算方法**: `百分比 = (像素值 / 图片总尺寸) × 100`

### 8.4 时长建议

- 简单截图: 3-4秒
- 复杂截图: 5-6秒
- 带放大: 6-8秒（含动画）

详细使用指南见 [references/06-screenshot-guide.md](06-screenshot-guide.md)。

---

## 九、渲染输出

### 8.1 Chrome Headless Shell

Remotion 渲染需要 Chrome Headless Shell。它会自动下载特定版本（如 144.0.7559.20），但网络不稳定时下载会失败或中断。

**推荐做法**：用 `--browser-executable` 参数直接指定本地已有的 Chrome binary，完全绕过下载逻辑：

```bash
npx remotion render CreaoVideo out/video.mp4 \
  --browser-executable=/path/to/chrome-headless-shell
```

将 `--browser-executable` 指向当前机器上已安装的 Chrome Headless Shell，不要使用作者本机路径。

### 8.2 为什么不能直接把文件放到 node_modules/.remotion/

Remotion 会检查 `node_modules/.remotion/chrome-headless-shell/` 下的 zip 文件版本号，版本不匹配就会忽略并重新下载。`--browser-executable` 是唯一可靠的绕过方式。
