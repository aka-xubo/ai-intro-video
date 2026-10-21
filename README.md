# AI Intro Video

一个面向 AI 视频创作的 Codex Skill。它把文章、链接、笔记或主题想法整理成可执行的视频方案，也支持对已经录制好的真人视频进行字幕、截图和重点文字处理。

## 功能

- **AI 生成模式**：从素材提炼观点、寻找传播切入点，生成口播文案、分镜脚本和发布文案。
- **真人视频模式**：解析录制视频的字幕，提取重点内容，叠加字幕、截图和重点文字。
- **Remotion 工作流**：提供组件示例、视觉规范和实现建议，方便继续生成视频项目。
- **质量检查**：覆盖音频时长、字幕文本、安全区和关键帧视觉检查。
- **可配置品牌**：不绑定任何个人、组织或账号；可以使用你自己的品牌素材，也可以保持中性视觉。

## 使用方式

将本仓库作为 Codex Skill 使用，确保技能目录根部包含 `SKILL.md`。触发请求可以是：

- “把这篇文章做成一个短视频”
- “帮我写一个 AI 工具介绍视频的口播稿和分镜”
- “我已经录好视频了，帮我加字幕和截图”
- “把这个主题整理成 Remotion 视频项目”

技能会先判断你是否已经有录制好的视频：

- 已有视频：进入真人视频模式。
- 只有素材、链接或想法：进入 AI 生成模式。

## AI 生成模式流程

1. 提供文章、链接、笔记、主题或多个素材。
2. 技能提炼核心观点，判断内容类型，分析受众并提出传播切入点。
3. 共同确定观点、表达方式、内容取舍、视觉风格和时长。
4. 确认后生成：
   - `口播文案.md`
   - `分镜脚本.md`
   - `发布文案.md`
   - 可选的 Remotion 项目文件
5. 生成配音和字幕后，检查音频时长、字幕一致性、字幕安全区和视觉关键帧。

## 真人视频模式流程

1. 提供视频文件路径、主题和需要展示的截图。
2. 使用 Whisper 提取字幕，生成基础配置。
3. 确认金句、重点文字和截图位置。
4. 创建 `video-config.json`，再用 Remotion 叠加视觉元素。
5. 完成字幕安全区和关键帧检查后预览或渲染。

## 目录结构

```text
.
├── SKILL.md                         # Skill 主说明和工作流
├── components/                      # 可复用的 Remotion 组件
├── references/                      # 内容、视觉、字幕和验证规范
└── scripts/                         # 配音、字幕和时长检查脚本
```

## 辅助脚本

脚本位于 `scripts/`，常用命令如下：

```bash
# 生成配音和 VTT 字幕
./scripts/generate-voiceovers.sh zh-CN-YunxiNeural public/audio

# 计算音频时长和推荐帧数
python3 scripts/get-audio-duration.py public/audio

# 解析 SRT 并生成基础配置
python3 scripts/parse_srt.py audio.srt video-config.json

# 检查字幕长度和主体安全区
python3 scripts/check-subtitle-safe-area.py src public/audio
```

## 依赖

根据使用的工作流安装对应工具：

- [Remotion](https://www.remotion.dev/)：视频项目和渲染。
- `edge-tts`：生成配音和 VTT 字幕。
- `mutagen`：读取音频时长。
- [Whisper](https://github.com/openai/whisper)：真人视频字幕提取。
- Chrome Headless Shell：Remotion 抽帧和渲染时使用。请使用当前平台可用的浏览器路径，或在视频项目中运行 `npx remotion browser ensure`。

示例安装：

```bash
pip3 install edge-tts mutagen openai-whisper
```

## 品牌和素材

本项目不附带个人头像、固定身份、社交账号或未授权音乐。品牌名称、Logo、配色、片头片尾文案和背景音乐由使用者自行提供，并确保拥有相应使用权。

未提供品牌规范时，技能默认使用 `warm-editorial-proof` 视觉预设：暖纸背景、清晰的中文标题层级、克制的内容驱动动画和安全字幕区。

## 参考文档

- [内容模板](references/02-templates.md)
- [通用品牌规范](references/03-branding.md)
- [Remotion 实现规范](references/05-remotion.md)
- [真人视频模式](references/07-live-video-mode.md)
- [时长验证](references/09-duration-verification.md)
- [字幕安全区](references/10-content-safe-area.md)
- [视觉抽帧检查](references/11-visual-frame-review.md)
- [视觉风格预设](references/13-visual-style-presets.md)

## 开源说明

这是一个可复用的 Skill 源码仓库。使用、修改和再发布时，请同时遵守其中依赖项目、字体、音频、图片和第三方服务的许可条款。
