# Skill 介绍视频 - 实用脚本

本目录包含用于视频制作的实用脚本。

## 脚本列表

### 1. get-audio-duration.py
获取音频文件时长，计算对应的帧数，并输出包含 2 秒缓冲的推荐场景时长。

**用法**:
```bash
# 使用默认目录 (public/audio)
python3 scripts/get-audio-duration.py

# 指定音频目录
python3 scripts/get-audio-duration.py ../brainstorming-video/public/audio
```

**输出示例**:
```
音频文件时长分析 (FPS: 30)
============================================================
Scene1: 4.44s = 133 frames
Scene2: 12.31s = 369 frames
Scene3: 8.38s = 251 frames
...
============================================================
总时长: 62.12s = 1861 frames

建议的场景时长配置:
------------------------------------------------------------
const scene1Duration = 133; // 4.44秒
const scene2Duration = 369; // 12.31秒
...

Root.tsx 总时长配置（含每段 2 秒缓冲）:
durationInFrames={2041}
```

**依赖**:
```bash
pip3 install mutagen
```

### 2. generate-voiceovers.sh
批量生成配音和 VTT 字幕文件。

**准备工作**:
1. 创建 `voiceover-scripts.txt` 文件
2. 每行格式：`Scene1: 配音文本内容`

**voiceover-scripts.txt 示例**:
```
Scene1: 今天介绍的技能是 Brainstorming。
Scene2: 它是一个帮助你把想法变成完整方案的协作工具。在你动手之前，它会通过对话的方式，一步步理解你要做什么、为什么做、怎么做最好。
Scene3: 有时候我们拿到一个任务就直接开干，结果发现方向不对，或者遗漏了重要的细节，又得返工。
```

**用法**:
```bash
# 使用默认语音和目录
./scripts/generate-voiceovers.sh

# 指定语音和输出目录
./scripts/generate-voiceovers.sh zh-CN-XiaoxiaoNeural public/audio
```

**依赖**:
```bash
pip3 install edge-tts
```

### 3. check-subtitle-safe-area.py
检查字幕是否过长，以及 Remotion 场景中是否存在过低的主体元素。

**用法**:
```bash
# 在视频项目目录中执行
python3 ../ai-intro-video/scripts/check-subtitle-safe-area.py src public/audio

# 如果脚本已复制到当前项目 scripts 目录
python3 scripts/check-subtitle-safe-area.py src public/audio
```

**检查内容**:
- VTT/SRT 字幕是否超过 2 行风险阈值
- TSX 中 `bottom` 值是否低于 250px
- 输出中标记为 `subtitle:error` 的字幕需要拆分或压缩
- 输出中标记为 `layout:warn` 的元素需要确认是否为主体关键内容

## 完整工作流程

### 步骤 1: 准备配音文本
创建 `voiceover-scripts.txt`，从场景文件中提取 Subtitle 文本：

```bash
# 自动提取（如果场景文件已存在）
grep -h "Subtitle text=" src/scenes/*.tsx | \
  sed 's/.*text="\(.*\)".*/\1/' | \
  awk '{print "Scene" NR ": " $0}' > voiceover-scripts.txt
```

### 步骤 2: 生成配音
```bash
./scripts/generate-voiceovers.sh zh-CN-YunxiNeural public/audio
```

### 步骤 3: 获取音频时长
```bash
python3 scripts/get-audio-duration.py
```

### 步骤 4: 更新场景时长
根据脚本输出，更新 `BrainstormingVideo.tsx` 和 `Root.tsx` 中的时长配置。

### 步骤 5: 检查字幕安全区
```bash
python3 ../ai-intro-video/scripts/check-subtitle-safe-area.py src public/audio
```

如果发现长字幕，先拆分字幕 segment；如果发现低位主体内容，优先上移主体内容或切换字幕策略。详细规则见 `references/10-content-safe-area.md`。

### 步骤 6: 添加配音到场景
在每个场景组件中添加：

```typescript
import { Audio } from "remotion";
import voiceover from "../../public/audio/scene1.mp3";

export const Scene1: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={voiceover} />
      {/* 其他内容 */}
    </AbsoluteFill>
  );
};
```

## 可用语音列表

查看所有可用的中文语音：
```bash
edge-tts --list-voices | grep "zh-CN"
```

**推荐语音**:
- `zh-CN-YunxiNeural`: 男声，活泼阳光（推荐）
- `zh-CN-XiaoxiaoNeural`: 女声，温暖
- `zh-CN-YunyangNeural`: 男声，专业可靠
- `zh-CN-YunjianNeural`: 男声，激情
- `zh-CN-XiaoyiNeural`: 女声，活泼

## 故障排除

### 问题：edge-tts 命令找不到
```bash
# 检查安装路径
pip3 show edge-tts

# 添加到 PATH（如果需要）
export PATH="$HOME/Library/Python/3.9/bin:$PATH"
```

### 问题：mutagen 模块找不到
```bash
pip3 install mutagen
```

### 问题：配音被截断
- 使用 `get-audio-duration.py` 检查实际音频时长
- 确保场景时长 ≥ 音频时长
- 更新 `BrainstormingVideo.tsx` 中的场景时长配置
