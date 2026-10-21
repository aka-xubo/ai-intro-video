# 真人视频模式 — 制作指南

## 概览

真人视频模式适用于你自己录制口播视频的场景。与 AI 生成模式不同，这种模式以你的真人视频为基础，通过 Remotion 叠加截图、文字、品牌元素来增强视觉效果。

**适用场景**：
- 个人观点表达
- 重要内容讲解
- 需要真人出镜的内容
- 对口播语气有特殊要求的内容

---

## 制作流程

### 第一步：录制口播视频

**录制要求**：
- 分辨率：建议 1280x720 或更高
- 格式：MP4 或 MOV
- 时长：建议 1-5 分钟（短视频最佳）
- 背景：简洁，避免杂乱
- 光线：充足，面部清晰
- 音频：清晰，无杂音

**录制技巧**：
- 提前准备大纲，但不要背稿（自然表达更好）
- 分段录制，每段 30-60 秒
- 预留截图展示的时间点（稍作停顿）
- 重点内容可以重复强调

### 第二步：提取音频并生成字幕

使用 Whisper 自动生成字幕：

```bash
# 1. 提取音频
ffmpeg -i your-video.mov -vn -acodec aac -b:a 128k audio.aac

# 2. 生成字幕（需要先安装 whisper）
pip install openai-whisper

# 3. 运行 Whisper
whisper audio.aac --language zh --model base --output_format srt --output_dir ./
```

**模型选择**：
- `tiny`：最快，准确度较低
- `base`：平衡（推荐）
- `small`：较准确
- `medium`：很准确，较慢
- `large`：最准确，很慢

### 第三步：解析字幕生成配置

使用 `parse_srt.py` 脚本：

```bash
python3 scripts/parse_srt.py audio.srt video-config-auto.json
```

这会生成一个包含所有字幕的配置文件，每条字幕都会显示在底部。

### 第四步：标注重点和添加截图

编辑 `video-config.json`，添加：

**1. 截图展示**

```json
{
  "type": "screenshot",
  "startTime": 10,
  "duration": 6,
  "src": "screenshot.png",
  "position": "right-panel",
  "size": "medium",
  "animation": {
    "enter": "slideLeft",
    "exit": "fadeOut"
  }
}
```

**截图位置选项**（避免遮挡人脸）：
- `right-panel`：右侧面板（推荐）
- `left-panel`：左侧面板
- `top-banner`：顶部横幅
- `bottom-banner`：底部横幅
- `top-right`、`top-left`、`bottom-right`、`bottom-left`：四个角落

**2. 重点文字**

```json
{
  "type": "text",
  "startTime": 15,
  "duration": 3,
  "content": "核心观点",
  "style": "keyword",
  "position": "bottom",
  "animation": "popIn",
  "fontSize": 75
}
```

**文字样式**：
- `keyword`：纸白底 + 珊瑚或当前语义色描边（用于核心概念）
- `emphasis`：纸白底 + 珊瑚强调（用于重要观点）
- `highlight`：宋体大字 + 珊瑚结论线（用于章节标题）
- `subtitle`：普通字幕（跟随口播）

**文字位置**：
- `bottom`：底部（推荐，不遮挡）
- `top`：顶部
- `center`：中间（仅用于章节标题）

### 第五步：添加封面和片尾

项目模板已包含封面和片尾组件，会自动添加：
- **封面**（1秒）：可选品牌标识 + 主题文字
- **片尾**（3秒）：简洁、与内容匹配的结束语

**自定义封面主题**：

编辑 `src/components/Cover.tsx`，修改主题文字：

```tsx
<div>
  为什么各大厂商
  <br />
  都在做 CLI？
</div>
```

优先突出本期主题；品牌元素仅在用户提供或指定时使用。

### 第六步：预览和调整

```bash
npm start
```

在 Remotion Studio 中：
- 拖动时间轴查看每个时间点
- 调整截图出现时机
- 调整文字显示时长
- 检查是否遮挡人脸

### 第七步：渲染输出

```bash
npm run build
# 或使用指定的 Chrome
npx remotion render Video out/video.mp4 \
  --browser-executable=/path/to/chrome-headless-shell
```

---

## 配置文件详解

### 基础结构

```json
{
  "video": {
    "source": "your-video.mov",
    "duration": 120
  },
  "timeline": [
    // 字幕、截图、重点文字
  ]
}
```

### Timeline 元素类型

#### 1. 截图 (screenshot)

```json
{
  "type": "screenshot",
  "startTime": 10,
  "duration": 6,
  "src": "image.png",
  "position": "right-panel",
  "size": "medium",
  "animation": {
    "enter": "slideLeft",
    "exit": "fadeOut",
    "zoom": {
      "enabled": true,
      "focusArea": { "x": 30, "y": 20, "width": 40, "height": 30 },
      "timing": {
        "showDuration": 2,
        "zoomDuration": 1,
        "holdDuration": 2,
        "zoomOutDuration": 1
      },
      "maxScale": 2.5
    }
  }
}
```

**参数说明**：
- `startTime`：开始时间（秒）
- `duration`：持续时间（秒）
- `src`：图片文件名（放在 `public/` 目录）
- `position`：位置（见上文）
- `size`：`small` | `medium` | `large` | `full`
- `animation.zoom`：可选的缩放聚焦效果

#### 2. 文字 (text)

```json
{
  "type": "text",
  "startTime": 15,
  "duration": 3,
  "content": "文字内容",
  "style": "keyword",
  "position": "bottom",
  "animation": "popIn",
  "fontSize": 75,
  "color": "#fbbf24"
}
```

**参数说明**：
- `style`：`keyword` | `emphasis` | `highlight` | `subtitle`
- `position`：`bottom` | `top` | `center` | `top-left` 等
- `animation`：`popIn` | `pulse` | `slideUp` | `fadeIn`
- `fontSize`：可选，覆盖默认字号
- `color`：可选，覆盖默认颜色

---

## 最佳实践

### 1. 截图使用

**时机**：
- 在口播提到具体工具/产品时展示
- 在需要视觉证明时展示
- 避免在情绪表达时插入（会分散注意力）

**位置**：
- 优先使用 `right-panel` 或 `left-panel`
- 避免使用 `center`（会遮挡人脸）
- 多张截图连续出现时，保持位置一致

**时长**：
- 简单截图：3-5 秒
- 复杂截图：5-8 秒
- 带缩放的截图：6-10 秒

### 2. 重点文字

**原则**：
- 少即是多：每分钟 2-3 个重点即可
- 与口播同步：文字出现时正好在说这句话
- 层次分明：关键词用 `keyword`，章节用 `highlight`

**避免**：
- 不要把所有口播都变成文字
- 不要在中间位置放太多文字（遮挡人脸）
- 不要使用过多动画效果（眼花缭乱）

### 3. 字幕处理

**自动生成的字幕**：
- 通常很准确，但需要人工校对
- 检查专业术语（如 "CLI"、"API" 等）
- 检查标点符号

**字幕显示**：
- 底部字幕：跟随口播，自然流畅
- 不要显示所有字幕（信息过载）
- 可以只在关键句显示字幕

### 4. 视觉层次

**推荐布局**：
- **底部**：字幕 + 关键词
- **右侧/左侧**：截图
- **顶部**：强调文字（序号、要点）
- **中间**：章节标题（偶尔使用）

---

## 常见问题

### Q1: 字幕识别不准确怎么办？

**A**: 
1. 使用更大的 Whisper 模型（`medium` 或 `large`）
2. 确保音频清晰，无背景噪音
3. 手动编辑生成的 SRT 文件
4. 在配置文件中直接修改 `content` 字段

### Q2: 截图遮挡了人脸怎么办？

**A**: 
- 使用 `right-panel` 或 `left-panel` 位置
- 调整 `size` 为 `small` 或 `medium`
- 避免使用 `center` 位置

### Q3: 如何确定截图的最佳时机？

**A**: 
1. 在 Remotion Studio 中播放视频
2. 找到口播提到相关内容的时间点
3. 在该时间点前 0.5-1 秒插入截图
4. 持续到口播结束后 1-2 秒

### Q4: 重点文字太多会怎样？

**A**: 
- 信息过载，观众无法聚焦
- 建议：每分钟 2-3 个重点文字
- 原则：只标注最核心的观点

### Q5: 如何混合使用 TTS 和真人视频？

**A**: 
暂不支持，但可以：
1. 分别制作两段视频
2. 用视频编辑软件拼接
3. 或者在 Remotion 中创建多个 Sequence

---

## 工具和脚本

### parse_srt.py

自动解析 SRT 字幕文件，生成配置文件。

**用法**：
```bash
python3 scripts/parse_srt.py input.srt output.json
```

**输出**：
- 自动生成所有字幕的配置
- 每条字幕显示在底部
- 需要手动添加截图和重点文字

### create-live-video.sh

快速创建真人视频项目。

**用法**：
```bash
./scripts/create-live-video.sh my-video
```

**功能**：
- 创建项目目录
- 复制模板文件
- 安装依赖
- 生成示例配置

---

## 与 AI 生成模式的对比

| 特性 | AI 生成模式 | 真人视频模式 |
|-----|------------|------------|
| 素材来源 | TTS 配音 | 真人录制 |
| 制作速度 | 快（自动化） | 中（需录制） |
| 个性化 | 低 | 高 |
| 适用场景 | 知识讲解 | 个人观点 |
| 配置方式 | 分镜脚本 | video-config.json |
| 品牌元素 | ✅ 共享 | ✅ 共享 |
| 组件库 | ✅ 共享 | ✅ 共享 |

---

## 下一步

1. 查看 [references/06-screenshot-guide.md](06-screenshot-guide.md) 了解截图最佳实践
2. 查看 [references/04-copywriting.md](04-copywriting.md) 了解文字规范
3. 查看 [references/03-branding.md](03-branding.md) 了解品牌设计

---

**文档版本**: v1.0 | **最后更新**: 2026-05-02 | **适用于**: Remotion 4.x
