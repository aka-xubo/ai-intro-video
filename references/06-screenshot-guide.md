# 截图展示指南

## 一、截图需求定义

### 1.1 在分镜脚本中标注截图

每个需要截图的场景，必须在分镜脚本中明确标注：

```markdown
## 场景3：功能展示（8秒）

**口播**：比如这个新功能，可以直接在界面上一键生成

**画面**：
- 主体：口播字幕
- [截图需求: Claude Code 的命令面板界面]
  - 文件路径：public/screenshots/claude-command-panel.png
  - 来源：官方文档截图
  - 关键区域：命令输入框 + 快捷键提示
  - 聚焦坐标：{ x: 30, y: 20, width: 40, height: 30 }
  - 展示时机：配合"一键生成"这句话
  - 放大需求：是
  - 时序：展示2秒 → 放大1秒 → 停留2秒 → 缩回1秒
```

### 1.2 截图标注规范

| 字段 | 说明 | 必填 |
|-----|------|------|
| 文件路径 | 截图在项目中的路径 | ✅ |
| 来源 | 截图来源（官网/产品/文档） | ✅ |
| 关键区域 | 需要重点展示的部分描述 | ✅ |
| 聚焦坐标 | 放大区域的坐标（百分比） | 如需放大则必填 |
| 展示时机 | 配合哪句口播 | ✅ |
| 放大需求 | 是否需要放大效果 | ✅ |
| 时序 | 动画时序安排 | 如需放大则必填 |

---

## 二、ZoomableScreenshot 组件使用

### 2.1 基础用法（无放大）

```typescript
import { ZoomableScreenshot } from "./ZoomableScreenshot";

<ZoomableScreenshot
  src="public/screenshots/example.png"
  timing={{
    showDuration: 3,    // 展示3秒
    zoomDuration: 0,    // 不放大
    holdDuration: 0,
  }}
/>
```

### 2.2 带聚焦放大

```typescript
<ZoomableScreenshot
  src="public/screenshots/claude-interface.png"
  focusArea={{
    x: 30,        // 左上角 x 坐标（百分比）
    y: 20,        // 左上角 y 坐标（百分比）
    width: 40,    // 区域宽度（百分比）
    height: 30,   // 区域高度（百分比）
  }}
  timing={{
    showDuration: 2,    // 完整展示2秒
    zoomDuration: 1,    // 放大动画1秒
    holdDuration: 2,    // 放大后停留2秒
    zoomOutDuration: 1, // 缩回1秒（可选）
  }}
  maxScale={2.5}        // 最大放大倍数（可选，默认2.5）
  showBorder={true}     // 显示聚焦边框（可选，默认true）
  blurBackground={false} // 虚化背景（可选，默认false）
/>
```

### 2.3 参数说明

#### FocusArea（聚焦区域）

```typescript
interface FocusArea {
  x: number;      // 区域左上角 x 坐标（百分比 0-100）
  y: number;      // 区域左上角 y 坐标（百分比 0-100）
  width: number;  // 区域宽度（百分比）
  height: number; // 区域高度（百分比）
}
```

**如何确定坐标？**
1. 在图片编辑软件中打开截图
2. 找到要聚焦的区域
3. 记录区域的左上角坐标和宽高
4. 转换为百分比：`百分比 = (像素值 / 图片总尺寸) × 100`

**示例**：
- 图片尺寸：1920x1080
- 聚焦区域：从 (576, 216) 开始，宽 768，高 324
- 转换：x = 576/1920×100 = 30%, y = 216/1080×100 = 20%, width = 40%, height = 30%

#### ZoomTiming（时序配置）

```typescript
interface ZoomTiming {
  showDuration: number;      // 完整截图展示时长（秒）
  zoomDuration: number;      // 放大动画时长（秒）
  holdDuration: number;      // 放大后停留时长（秒）
  zoomOutDuration?: number;  // 缩回动画时长（秒，可选）
}
```

**推荐时长**：ration`: 1.5-2.5秒（让观众先看到全貌）
- `zoomDuration`: 0.8-1.2秒（放大动画不宜过快或过慢）
- `holdDuration`: 2-4秒（根据细节复杂度调整）
- `zoomOutDuration`: 0.8-1.0秒（可选，如果后续还有内容）

#### 其他参数

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| maxScale | number | 2.5 | 最大放大倍数（1.5-3.0 合适） |
| blurBackground | boolean | false | 是否虚化非聚焦区域 |
| showBorder | boolean | true | 是否显示聚焦区域的黄色边框 |

---

## 三、完整场景示例

### 3.1 Scene 组件中使用

```typescript
import React from "react";
import { AbsoluteFill, Audio, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedSubtitle } from "./AnimatedSubtitle";
import { ZoomableScreenshot } from "./ZoomableScreenshot";
import { colors } from "./theme";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: colors.gradientBg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 背景音乐 */}
      <Audio src="public/audio/background-music.mp3" volume={0.3} />

      {/* 配音 */}
      <Audio src="public/audio/scene3-voiceover.mp3" />

      {/* 截图展示 */}
      <ZoomableScreenshot
        src="public/screenshots/claude-interface.png"
        focusArea={{
          x: 30,
          y: 20,
          width: 40,
          height: 30,
        }}
        timing={{
          showDuration: 2,
          zoomDuration: 1,
          holdDuration: 2,
          zoomOutDuration: 1,
        }}
        maxScale={2.5}
        showBorder={true}
      />

      {/* 字幕 */}
      <AnimatedSubtitle
        segments={[
          {
            text: "比如这个新功能，可以直接在界面上一键生成",
            startTime: 0,
            endTime: 3.5,
          },
        ]}
      />
    </AbsoluteFill>
  );
};
```

### 3.2 计算场景总时长

```typescript
// 场景总时长 = showDuration + zoomDuration + holdDuration + zoomOutDuration
const sceneDuration = 2 + 1 + 2 + 1; // = 6秒
const sceneDurationInFrames = sceneDuration * fps; // = 180帧 (@30fps)
```

---

## 四、截图准备规范

### 4.1 截图质量要求

| 项目 | 要求 |
|-----|------|
| 分辨率 | 至少 1920px 宽（与视频分辨率匹配） |
| 格式 | PNG（支持透明）或 JPG |
| 文件大小 | 单张不超过 2MB |
| 清晰度 | 高清，无模糊、无压缩失真 |
| 内容 | 无敏感信息、无个人隐私 |

### 4.2 截图命名规范

```
public/screenshots/
  ├── {主题}-{序号}-{描述}.png
  ├── claude-01-command-panel.png
  ├── claude-02-settings.png
  └── github-01-pr-interface.png
```

### 4.3 截图存放位置

```
{项目目录}/
  └── public/
      └── screenshots/
          ├── screenshot1.png
          ├── screenshot2.png
          └── ...
```

---

## 五、检查清单

### 5.1 内容检查

- [ ] 分镜脚本中所有截图需求都已标注完整
- [ ] 每个截图都有明确的展示时机和用途
- [ ] 需要放大的截图都标注了聚焦坐标

### 5.2 文件检查

- [ ] 所有截图文件都已准备并放在 `public/screenshots/` 目录
- [ ] 截图分辨率符合要求（≥1920px 宽）
- [ ] 截图清晰无模糊
- [ ] 文件路径与分镜脚本中标注的一致

### 5.3 代码检查

- [ ] Scene 组件中正确引入了 `ZoomableScreenshot`
- [ ] `src` 路径正确
- [ ] `focusArea` 坐标准确（如需放大）
- [ ] `timing` 时长与配音、字幕同步
- [ ] 场景总时长计算正确

### 5.4 效果检查

- [ ] 截图淡入自然
- [ ] 放大动画流畅（如有）
- [ ] 聚焦区域准确（如有）
- [ ] 停留时间足够让观众看清细节
- [ ] 与口播、字幕时机匹配

---

## 六、常见问题

### Q1: 如何确定聚焦区域的坐标？

**方法1：使用图片编辑软件**
1. 在 Photoshop/Figma/Sketch 中打开截图
2. 使用矩形选框工具框选要聚焦的区域
3. 查看选区的坐标和尺寸
4. 转换为百分比

**方法2：使用在线工具**
- 上传截图到 https://www.image-map.net/
- 框选区域，自动生成坐标
- 手动转换为百分比

### Q2: 放大倍数多少合适？

- **1.5-2.0x**：适合展示较大区域，如整个对话框
- **2.0-2.5x**：适合展示中等区域，如按钮组、表单
- **2.5-3.0x**：适合展示小细节，如单个按钮、图标

**原则**：放大后的区域应该占据画面的 60-80%，既能看清细节，又不会过于局促。

### Q3: 是否每个截图都需要放大？

**不需要**。只在以下情况使用放大：
- 截图中有需要特别强调的细节
- 文字或图标较小，不放大看不清
- 口播中明确提到"注意看这里"、"重点是"等

**简单展示**时，使用基础模式即可（`zoomDuration: 0`）。

### Q4: 截图展示时长多久合适？

**参考标准**：
- 简单截图（纯界面）：3-4秒
- 复杂截图（多信息）：5-6秒
- 带放大的截图：6-8秒（含放大动画）

**原则**：观众需要足够时间识别画面内容，宁可多停留，不要匆忙。

### Q5: 截图模糊怎么办？

**原因**：
1. 原始截图分辨率不够
2. 放大倍数过大
3. 截图时使用了缩放显示

**解决**：
1. 重新截取高分辨率截图（至少 1920px 宽）
2. 降低 `maxScale` 参数
3. 截图时使用 100% 显示比例

---

## 七、设计原则

1. **服务内容**：截图是为了辅助说明，不是为了炫技
2. **适度放大**：只放大真正需要强调的部分
3. **时机准确**：放大时机要与口播完美配合
4. **停留充分**：给观众足够时间看清细节
5. **过渡流畅**：动画要自然，不要突兀

---

**文档版本**: v1.0 | **最后更新**: 2026-04-26 | **适用于**: Remotion 4.x
