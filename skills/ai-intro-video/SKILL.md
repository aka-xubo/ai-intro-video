---
name: ai-intro-video
description: >-
  AI 视频内容生成工具，支持两种模式：(1) AI 生成模式：将素材转化为口播文案、分镜脚本、Remotion 视频项目和发布文案；(2) 真人视频模式：为用户录制的口播视频添加字幕、截图、重点文字并生成发布文案。使用此技能当用户提到制作视频、生成视频、视频文案、分镜脚本、口播稿、视频简介、发布文案或真人视频后期处理。
---

# AI 视频内容生成工具

## 概览

这是一个视频内容生成工具，支持两种制作模式：

### 模式 A：AI 生成模式（原有）
将任意 AI 相关素材转化为视频的口播文案与分镜脚本。核心是"内容共创"而非"自动生成"——AI 消化素材后与用户讨论打磨，确认后再生成产出。

**适用场景**：
- 快速内容生成
- 纯知识讲解
- 概念科普
- 没有录制设备或时间

### 模式 B：真人视频模式（新增）
为用户录制的口播视频添加品牌元素、字幕、截图和重点文字。基于 Remotion 叠加视觉元素，增强表达效果。

**适用场景**：
- 个人观点表达
- 重要内容讲解
- 需要真人出镜
- 对口播语气有特殊要求

品牌元素由用户提供或按需配置；未提供时使用中性片头、封面和片尾。

---

## 如何选择模式？

**用户已录制视频** → 使用**真人视频模式**
- 直接询问："你已经录制好视频了吗？"
- 如果是，跳转到真人视频工作流

**用户提供素材/想法** → 使用 **AI 生成模式**
- 按照内容共创工作流进行

---

## AI 生成模式 — 内容共创工作流

这是本技能的核心流程，每次生成视频都要遵循。

### 第一步：接收素材

用户可以提供任意形式的输入：
- 一篇文章或博客链接
- 自己写的随笔、笔记
- 一段想法或观点
- 一个 AI 技术主题关键词
- 多个素材的组合

### 第二步：AI 消化理解

读完素材后，完成以下工作：

1. **提炼核心观点**：用一两句话总结"我理解你想表达的是..."
2. **寻找爆点**：从素材中找到最有传播力的角度。短视频的爆点是让观众前3秒不划走、看完想转发的关键。用以下五个维度筛选：
   - **反常识/认知冲突**："你以为 XX 是这样的，其实不是" — 打破预期最容易抓注意力
   - **具体数字/对比**："3秒生成一张图"比"很快"有力10倍 — 抽象概念要落到可感知的数字
   - **跟"我"有关**：观众只关心跟自己有关的事，"帮你每天省2小时"比"这个技术很厉害"有效
   - **情绪共鸣**：痛点共鸣（"你是不是也..."）、惊喜感（"我发现了..."）、适度焦虑（"如果你还不知道..."，慎用）
   - **争议/选择**：有态度的观点天然有传播力，"我觉得 A 比 B 好"比"各有优劣"强得多
   向用户明确说出你找到的爆点是什么，以及为什么觉得它有传播力。
3. **判断内容类型**：根据素材特征推荐最适合的类型（读取 [references/02-templates.md](references/02-templates.md) 了解五种类型的详细模板和对应的爆点策略）
4. **确定视觉风格**：默认使用 `warm-editorial-proof`，即暖纸编辑风主体 + 深色品牌片头片尾。只有用户明确指定其他视觉方向时才切换 preset（读取 [references/13-visual-style-presets.md](references/13-visual-style-presets.md)）
5. **评估目标受众**：判断内容更适合技术人群还是非技术人群
6. **发表看法**：对素材内容提出自己的理解、补充或不同角度的思考。要真诚，不是敷衍附和。如果觉得某个角度更适合短视频表达，直接说。
7. **提出确认问题**：针对不明确的地方提问，一次不超过 3 个问题

### 第三步：讨论共创

可能来回多轮，围绕以下方面讨论：
- **观点打磨**：补充、修正、深化核心观点
- **表达方式**：用什么类比、什么故事更容易被理解
- **内容取舍**：短视频信息密度有限，哪些必须保留
- **情绪基调**：轻松科普、严肃分析、个人感悟等

讨论原则：AI 要有自己的判断，但最终决策权在用户手上。讨论要高效，如果用户想法已经很清晰，快速确认即可。

### 第四步：确认方向

讨论达成一致后，输出确认摘要：

```
📋 内容确认
- 主题：{主题}
- 类型：{内容类型}
- 核心观点：{一句话}
- 爆点：{最有传播力的角度 + 属于哪种爆点类型}
- 目标受众：{受众}
- 视觉风格：{visualStyle + 选择理由}
- 预估时长：{时长范围}
- 情绪基调：{基调}
```

用户确认后进入生成阶段。

### 第五步：生成产出

自动创建 `{主题关键词}-video/` 目录，生成：
- **口播文案.md**：按场景分段的完整口播文字
- **分镜脚本.md**：时长、画面元素、动效、字幕等完整信息
  - 必须包含 `visualStyle`、色板、字体层级、布局原则、Lottie/插画/截图使用策略
- **发布文案.md**：适配发布平台的标题、简介、开源地址/行动引导和话题标签

生成时需要读取以下参考文件：
- [references/03-branding.md](references/03-branding.md) — 片头、片尾与封面的通用品牌规范
- [references/04-copywriting.md](references/04-copywriting.md) — 字幕、配音、背景音乐、序号指示器的技术规范
- [references/05-remotion.md](references/05-remotion.md) — Remotion 视频制作最佳实践（实现代码时查阅）
- [references/10-content-safe-area.md](references/10-content-safe-area.md) — 内容安全区、字幕预算、字幕遮挡防范规范（生成分镜和代码时必须查阅）
- [references/11-visual-frame-review.md](references/11-visual-frame-review.md) — 使用 Chrome Headless Shell 抽帧检查视觉效果，并自动修复文字、动画、排版问题
- [references/12-lottie-motion.md](references/12-lottie-motion.md) — 使用 @remotion/lottie 时的语义匹配、接入方式、抽帧检查和自动优化规则
- [references/13-visual-style-presets.md](references/13-visual-style-presets.md) — 视觉风格选择层；根据内容类型选择色调、排版、插画/Lottie、截图和动画风格
- [references/14-publishing-copy.md](references/14-publishing-copy.md) — 视频发布文案的生成规则、平台适配和交付模板

**序号指示器规范**：当场景包含有序列表内容（"第一、第二、第三..."或"01、02、03..."）时，必须在右上角显示固定的序号和标题指示器，让观众清楚知道"现在在第几步，还有几步"。详见 [references/04-copywriting.md](references/04-copywriting.md) 的"序号指示器规范"章节。

**字幕安全规范**：每个镜头必须标注字幕策略（`bottom-caption` / `top-caption` / `side-caption` / `compact-caption` / `keyword-only`），并保证字幕最多 2 行、主体关键内容不进入字幕预留区。详见 [references/10-content-safe-area.md](references/10-content-safe-area.md)。

**Lottie 动画规范**：只有当动画能帮助观众理解当前口播内容时才使用 Lottie。先判断内容类型、口播落点和视觉主体，再选择语义匹配的 Lottie 动效；禁止添加纯装饰、抢主体或遮挡字幕的动画。详见 [references/12-lottie-motion.md](references/12-lottie-motion.md)。

**视觉风格规范**：生成分镜和 Remotion 代码前，在 `分镜脚本.md` 中写明 `visualStyle`。未收到明确视觉要求时固定使用 `warm-editorial-proof`：暖纸纹理、宋体大标题、等宽英文标签、珊瑚结论色、低圆角或无圆角信息块、顶部阶段进度条，以及克制的内容驱动动画。只有用户明确指定其他风格时才切换 preset。详见 [references/13-visual-style-presets.md](references/13-visual-style-presets.md)。

### 第六步：生成配音并验证时长 ⚠️ **关键步骤**

**这是确保视频质量的关键步骤，必须执行！**

生成 Remotion 项目代码后，立即执行配音生成和时长验证：

#### 6.1 生成配音文件

使用 edge-tts 生成所有场景的配音和 VTT 字幕：

```bash
# 在项目目录中执行配音生成脚本
bash scripts/generate-voiceovers.sh
```

#### 6.2 验证场景时长（自动化脚本）

**必须执行此验证**，确保每个场景的时长足够容纳完整的配音。验证的目的不是把问题报告给用户，而是驱动自动修复。

优先运行 bundled script 获取音频实际时长和推荐帧数：

```bash
python3 scripts/get-audio-duration.py public/audio
```

如果项目使用 VTT 字幕作为精确时长来源，按 [references/09-duration-verification.md](references/09-duration-verification.md) 的流程创建项目级 `verify-durations.py`，并用实际场景时长配置执行校验。

**自动修复门禁**：
- 如果任一场景 `场景展示时长 < 口播实际时长 + 1秒`，必须立即修改对应场景的 `durationInFrames` / `durations` 配置。
- 推荐修复目标是 `ceil(口播实际时长 + 2秒) * fps`，不要只刚好卡住音频尾帧。
- 修复场景时长后，必须同步更新 `Root.tsx` 的总 `durationInFrames`、主视频组件中的总帧数、背景音乐淡出点等依赖总时长的配置。
- 修复后必须重新运行时长验证和 TypeScript 检查。
- 禁止只把“某场景时长不足”的检查结果告诉用户后停止；只有用户明确要求“只检查不改”时才允许只报告。
- 最终交付前，必须确认所有口播完整播放，才能提示用户预览或渲染。

#### 6.3 修复时长不足的场景

如果验证发现时长不足，立即修复，不要把修复决策交给用户：

**修复步骤**：

1. **更新场景时长** (`src/SupermanVideo.tsx` 或主视频组件):
   ```typescript
   const durations = {
     brandIntro: 5 * fps,   // 修改为建议时长
     scene3: 15 * fps,      // 修改为建议时长
     // ... 其他场景
   };
   ```

2. **重新计算总时长**:
   ```typescript
   // 计算所有场景时长总和
   const totalFrames = Object.values(durations).reduce((a, b) => a + b, 0);
   const totalSeconds = totalFrames / fps;
   ```

3. **更新 Root.tsx 总帧数**:
   ```typescript
   <Composition
     id="VideoName"
     component={VideoComponent}
     durationInFrames={totalFrames}  // 使用新的总帧数
     fps={30}
   />
   ```

4. **更新背景音乐淡出点**（如果有背景音乐）:
   ```typescript
   const totalFrames = 新的总帧数;  // 更新此值
   const fadeOutStart = totalFrames - (2 * fps);
   ```

5. **验证修复**:
   ```bash
   npx tsc --noEmit  # 验证 TypeScript 无错误
   ```

#### 6.4 修复原则

- **最小缓冲**: 场景时长 = 配音时长 + 1秒（最少）
- **推荐缓冲**: 场景时长 = 配音时长 + 2秒（推荐）
- **舒适缓冲**: 场景时长 = 向上取整到5的倍数（如14.8秒 → 15秒或17秒）

**常见问题**：
- ❌ 配音被截断 → 场景时长不足
- ❌ 场景结束时有长时间静音 → 场景时长过长（可接受，但不够优雅）
- ✅ 配音刚好讲完，有1-2秒缓冲 → 完美

**验证清单**：
- [ ] 所有配音文件已生成（MP3 + VTT）
- [ ] 运行时长验证脚本
- [ ] 已自动修复所有时长不足的场景
- [ ] 更新总帧数和淡出点
- [ ] TypeScript 编译通过
- [ ] 预览验证所有口播完整播放

**重要提示**：此步骤是在 Remotion 项目代码生成后、用户预览前必须执行的。跳过此步骤会导致用户看到配音被截断的问题。

### 第六点二步：验证字幕文本一致性 ⚠️ **关键步骤**

**这是确保字幕与语音匹配的关键步骤,必须执行!**

生成配音和 VTT 后,立即验证字幕数据文本:

#### 6.2.1 读取所有 VTT 文件

```bash
cd {项目目录}
for vtt in public/audio/*.vtt; do
  echo "=== $(basename $vtt) ==="
  cat "$vtt"
  echo ""
done
```

#### 6.2.2 提取并验证字幕文本

从每个 VTT 文件中提取:
- 每一句的准确文本 (一个字都不能改)
- 每一句的开始和结束时间戳
- 验证时间戳格式和连续性

#### 6.2.3 生成字幕数据代码

创建或更新 `src/utils/parseVTT.ts`:
- 字幕文本必须从 VTT 文件逐字复制
- 不能根据分镜脚本推测或编造内容
- 时间戳必须与 VTT 精确匹配
- 使用 `staticFile()` 引用所有静态资源(音频、图片等)

**正确示例**:
```typescript
import { staticFile } from 'remotion';

export const vttSubtitles = {
  scene6: [
    // 文本从 VTT 逐字复制,不是自己编的!
    { text: '数据很有意思。', startTime: 0.1, endTime: 1.737 },
    { text: '高分用户,每次提问能触发12个操作...', startTime: 1.687, endTime: 7.262 },
  ],
}

// 场景组件中使用 staticFile()
<Audio src={staticFile('audio/scene6.mp3')} />
<!-- Add a user-provided logo or image only when requested. -->
```

**错误示例**:
```typescript
// ❌ 根据主题推测的内容
{ text: '研究测试了3个真实工作任务', ... }

// ❌ 使用绝对路径
<Audio src="/audio/scene6.mp3" />  // 会导致 404
```

**验证清单**:
- [ ] 已读取所有 VTT 文件的实际内容
- [ ] 字幕数据文本与 VTT 文件逐字匹配
- [ ] 时间戳与 VTT 文件精确匹配
- [ ] 没有自己编造或推测的内容
- [ ] 所有静态资源使用 `staticFile()` 引用

**关键原则**:
- VTT 文件是唯一的真实来源
- 分镜脚本只是参考,实际配音可能有差异
- 必须以最终生成的 VTT 为准
- 验证而不是假设

### 第六点五步：验证字幕安全区 ⚠️ **关键步骤**

**这是防止字幕遮挡主体内容的关键步骤，必须执行！**

在配音和 VTT 字幕生成后，运行字幕安全区检查：

```bash
python3 ../ai-intro-video/scripts/check-subtitle-safe-area.py src public/audio
```

如果脚本输出风险，立即修复：

1. **字幕过长**：把长 segment 拆成两个连续短 segment，或压缩字幕文案。字幕最多 2 行。
2. **主体过低**：将流程图、卡片、截图、人物、结论大字等主体内容上移；默认 1080×1920 竖屏要求主体底边不进入 `Y >= 1450` 区域。
3. **无法上移**：切换字幕策略为 `top-caption`、`side-caption`、`compact-caption` 或 `keyword-only`。
4. **不要只靠透明度**：降低透明度不能算修复，字幕和主体内容必须都能独立读清。

修复后再次运行检查，并在 Remotion Studio 中逐场景预览确认。

### 第六点六步：抽帧检查视觉效果并自动优化 ⚠️ **关键步骤**

**这是防止画面粗糙、文字遮挡、排版失衡、动画状态异常的关键步骤，必须执行！**

在时长和字幕安全区通过后，使用当前机器上的 Chrome Headless Shell 渲染关键帧截图，逐场景检查视觉效果：

```bash
CHROME_HEADLESS_SHELL="{当前机器上 Chrome Headless Shell 的路径}"
npx remotion still <entry> <composition-id> out/visual-check/frame-0000.png \
  --frame=0 \
  --browser-executable="$CHROME_HEADLESS_SHELL" \
  --overwrite
```

具体抽帧策略、检查标准和修复循环见 [references/11-visual-frame-review.md](references/11-visual-frame-review.md)。

**自动修复门禁**：
- 如果截图中出现文字重叠、文字出界、主体被字幕遮挡、关键内容太小、对比度不足、画面空白、资产缺失、动画中间态不合理、排版失衡等问题，必须立即修改对应场景代码。
- 修复后必须重新抽取同一批关键帧复查。
- 禁止只把“视觉存在问题”的检查结果告诉用户后停止；只有用户明确要求“只检查不改”时才允许只报告。
- 最终交付前，必须确认关键帧视觉效果通过检查，才能提示用户预览或渲染。

### 特殊情况

- **素材信息不足**（如只给了"聊聊 RAG"）：先分享自己的理解，提出 2-3 个切入角度让用户选择
- **素材信息过多**（如一篇长文）：提炼 3-5 个关键点，建议哪些适合短视频，必要时建议拆成系列
- **用户想法已经很成熟**：快速确认，直接进入生成阶段

### 第七步：创建 Remotion 项目并预览

在修复完所有时长、字幕安全区和视觉抽帧问题后，告知用户可以预览：

```bash
cd {项目目录}
npm start  # 启动 Remotion Studio
```

用户可以在 http://localhost:3000 预览视频效果。

视频完成或用户要求发布时，按 [references/14-publishing-copy.md](references/14-publishing-copy.md) 生成并保存 `发布文案.md`。发布文案必须延续视频的核心论点，不能只把口播摘要机械缩短；用户提供项目或开源地址时必须纳入文案，不得自行编造链接。

---

## 支持的内容类型

| 类型 | 时长 | 适用场景 |
|-----|------|---------|
| 概念科普 | 30-60秒 | 解释 AI 概念/术语/原理 |
| 工具介绍 | 45-90秒 | 介绍 AI 工具/产品 |
| 技术对比 | 45-90秒 | 对比 AI 技术/工具/方案 |
| 趋势分析 | 60-120秒 | 分析 AI 行业新闻/趋势 |
| 个人心得 | 30-90秒 | 分享对 AI 的思考/感悟 |

每种类型的详细文案结构、视觉风格和口播风格见 [references/02-templates.md](references/02-templates.md)。

---

## 参考文件索引

| 文件 | 内容 | 何时读取 |
|-----|------|---------|
| [references/02-templates.md](references/02-templates.md) | 内容类型模板 | 第二步判断内容类型时 |
| [references/03-branding.md](references/03-branding.md) | 通用品牌与视觉规范 | 第五步生成片头/片尾/封面时 |
| [references/04-copywriting.md](references/04-copywriting.md) | 口播文案与音视频规范 | 第五步生成文案和分镜时 |
| [references/05-remotion.md](references/05-remotion.md) | Remotion 视频制作最佳实践 | 实现视频代码时 |
| [references/06-screenshot-guide.md](references/06-screenshot-guide.md) | 截图展示指南与 ZoomableScreenshot 组件 | 分镜脚本中需要截图时 |
| [references/07-live-video-mode.md](references/07-live-video-mode.md) | 真人视频模式制作指南 | 使用真人视频模式时 |
| [references/08-highlight-extraction.md](references/08-highlight-extraction.md) | 精华内容提取与确认流程 | 真人视频模式第四步 |
| [references/09-duration-verification.md](references/09-duration-verification.md) | 场景时长验证与修复标准流程 | 第六步配音生成后必须执行 |
| [references/10-content-safe-area.md](references/10-content-safe-area.md) | 内容安全区与字幕遮挡防范 | 生成分镜、实现字幕、预览前验证时 |
| [references/11-visual-frame-review.md](references/11-visual-frame-review.md) | 抽帧视觉检查与自动优化 | 时长和字幕安全区通过后、预览/渲染前 |
| [references/12-lottie-motion.md](references/12-lottie-motion.md) | Lottie 语义动画与 Remotion 接入 | 设计动效、实现 @remotion/lottie、抽帧检查动画时 |
| [references/13-visual-style-presets.md](references/13-visual-style-presets.md) | 默认暖纸编辑风与可选视觉 preset | 生成分镜和 Remotion 代码前 |
| [references/14-publishing-copy.md](references/14-publishing-copy.md) | 标题、简介、链接、行动引导与话题标签 | 视频完成或准备发布时 |

---

## 真人视频模式 — 工作流

当用户已经录制好口播视频时，使用此模式。

### 第一步：确认素材

询问用户：
- 视频文件路径
- 视频主题
- 是否需要添加截图
- 重点内容是什么

### 第二步：提取字幕

使用 Whisper 自动生成字幕：

```bash
# 提取音频
ffmpeg -i video.mov -vn -acodec aac audio.aac

# 生成字幕
whisper audio.aac --language zh --model base --output_format srt
```

### 第三步：解析配置

使用 `scripts/parse_srt.py` 生成基础配置：

```bash
python3 scripts/parse_srt.py audio.srt video-config.json
```

### 第四步：提取精华内容（新增）

**这是真人视频模式的核心步骤**，确保视频中的金句/重点被识别和固定。

使用 AI 自动分析字幕，识别精华内容：
- 反常识/认知冲突
- 具体数字/对比
- 与观众相关的内容
- 情绪共鸣点
- 有态度的观点

以结构化方式呈现给用户确认：
- 每个候选金句的评分和原因
- 建议的视觉呈现方式
- 是否配合截图

用户确认后，固化到 `video-config.json` 的 `highlights` 字段。

**详细流程**：参见 [references/08-highlight-extraction.md](references/08-highlight-extraction.md)

### 第五步：标注重点

基于确认的精华内容，与用户讨论：
- 重点文字的表述优化
- 截图的位置（避免遮挡人脸）
- 视觉样式的选择

### 第六步：生成配置

创建完整的 `video-config.json`，包含：
- 封面（1秒）
- 字幕（跟随口播）
- 精华内容（从 highlights 自动生成）
- 截图（右侧面板或其他位置）
- 重点文字（关键词、强调、高亮）
- 片尾（3秒）

### 第七步：创建项目

使用模板创建 Remotion 项目：
- 复制默认视觉组件（theme, PaperBackground, EditorialFrame, StageProgress, Cover, Ending）
- 按需复制叠加组件（ScreenshotOverlay, TextOverlay）
- 配置视频源和时长
- 设置品牌元素

**详细指南**：参见 [references/07-live-video-mode.md](references/07-live-video-mode.md)

---

## 品牌资产

- **品牌资产**：仅使用用户提供或明确指定的素材
- **背景音乐**：按需使用用户提供或获准使用的音频
- **渲染浏览器**：使用当前平台的 Chrome Headless Shell，可通过 `npx remotion browser ensure` 安装
- **辅助脚本**：`scripts/`（配音生成、音频时长计算等）

## 可选模板

当用户需要制作技能介绍系列内容时，根据用户提供的系列名称、品牌素材和链接定制模板，详见 [references/03-branding.md](references/03-branding.md)。

---

**文档版本**: v3.0 | **最后更新**: 2026-05-02 | **适用于**: Remotion 4.x | **新增**: 真人视频模式
