# 精华内容提取与确认流程

## 概览

在真人视频模式中，识别和固定视频中的精华/金句/重点是提升传播力的关键。本文档定义了系统化的提取、确认和固化流程。

**适用场景**：
- 真人口播视频后期处理
- 需要添加重点文字标注
- 需要配合截图展示核心观点
- 优化视频传播效果

---

## 工作流程

### 第一步：自动提取候选金句

在生成字幕后，AI 自动分析字幕文本，识别潜在的精华内容。

#### 识别维度

使用以下五个维度筛选候选金句：

1. **反常识/认知冲突** 🔄
   - 特征：打破预期、颠覆认知
   - 关键词：`其实`、`实际上`、`你以为...但是`、`并不是`
   - 示例："你以为 AI 只能生成文字，其实它已经能写代码了"

2. **具体数字/对比** 📊
   - 特征：量化数据、前后对比
   - 关键词：数字、`提升`、`降低`、`从...到...`、百分比
   - 示例："这个功能能帮你每天省 2 小时"

3. **跟"我"有关** 👤
   - 特征：与观众切身利益相关
   - 关键词：`你`、`帮你`、`让你`、`为你`、`你的`
   - 示例："如果你还在手动处理数据，这个工具能解放你"

4. **情绪共鸣** 💡
   - 特征：痛点、惊喜、焦虑、共鸣
   - 关键词：`发现`、`没想到`、`原来`、`竟然`、`是不是也`
   - 示例："我测试了 100 次发现，90% 的人都不知道这个功能"

5. **争议/选择** ⚖️
   - 特征：有态度的观点、明确的选择
   - 关键词：`我觉得`、`更好`、`不如`、`应该`、`建议`
   - 示例："我觉得 A 比 B 更适合新手"

#### 自动提取算法

```python
# 伪代码示例
def extract_highlights(subtitles):
    candidates = []
    
    for segment in subtitles:
        score = 0
        reasons = []
        
        # 检查反常识
        if contains_keywords(segment, ["其实", "实际上", "并不是"]):
            score += 3
            reasons.append("认知冲突")
        
        # 检查数字对比
        if contains_numbers(segment) or contains_comparison(segment):
            score += 2
            reasons.append("数据对比")
        
        # 检查与观众相关
        if contains_keywords(segment, ["你", "帮你", "让你"]):
            score += 2
            reasons.append("与观众相关")
        
        # 检查情绪词
        if contains_emotion_words(segment):
            score += 2
            reasons.append("情绪共鸣")
        
        # 检查观点性
        if contains_opinion_words(segment):
            score += 1
            reasons.append("有态度")
        
        if score >= 3:
            candidates.append({
                "time": segment.start_time,
                "text": segment.text,
                "score": score,
                "reasons": reasons
            })
    
    return sorted(candidates, key=lambda x: x["score"], reverse=True)
```

### 第二步：结构化呈现

将提取的候选金句以结构化方式呈现给用户：

```
🎯 识别到以下精华内容（按重要性排序）：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1️⃣ [00:15-00:18] 评分: ⭐⭐⭐⭐⭐ (5分)
   "这个功能能帮你每天省 2 小时"
   
   📌 识别原因:
   • 数据对比 — 具体数字 "2 小时"
   • 与观众相关 — "帮你"
   
   💡 建议处理:
   • 视觉样式: keyword (金色关键词)
   • 重点文字: "每天省 2 小时"
   • 配合元素: 可添加时钟图标或对比截图
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2️⃣ [01:23-01:27] 评分: ⭐⭐⭐⭐ (4分)
   "很多人以为 AI 只能生成文字，其实它已经能写代码了"
   
   📌 识别原因:
   • 认知冲突 — "以为...其实"
   • 与观众相关 — "很多人"
   
   💡 建议处理:
   • 视觉样式: emphasis (强调)
   • 重点文字: "AI 已经能写代码"
   • 配合元素: 代码截图
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3️⃣ [02:45-02:49] 评分: ⭐⭐⭐ (3分)
   "我测试了 100 次发现，这个方法成功率最高"
   
   📌 识别原因:
   • 数据对比 — "100 次"
   • 情绪共鸣 — "发现"
   
   💡 建议处理:
   • 视觉样式: keyword
   • 重点文字: "100 次测试"
   • 配合元素: 测试结果截图
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 统计:
• 共识别 3 个高质量精华内容
• 建议保留 2-3 个（避免信息过载）
• 预计增加 30-50% 的观众留存率

❓ 请确认:
1. 以上哪些是你想强调的重点？
2. 是否有遗漏的重要观点？
3. 文字表述是否需要调整？
```

### 第三步：用户确认与调整

与用户进行结构化对话：

#### 3.1 确认重点

```
请告诉我：
✅ 保留哪些精华内容？（输入序号，如 "1, 3"）
❌ 删除哪些？
➕ 是否有遗漏的重点？（提供时间点或文字）
```

#### 3.2 调整表述

对于用户确认的每个精华内容：

```
对于 [00:15] "这个功能能帮你每天省 2 小时"

1. 文字表述是否需要调整？
   当前: "每天省 2 小时"
   建议: 保持简洁，突出数字

2. 视觉呈现方式？
   • keyword (金色关键词，弹出) ← 推荐
   • emphasis (金色强调，脉冲)
   • highlight (大字标题)

3. 是否配合截图？
   • 是 → 请提供截图文件名
   • 否 → 仅文字强调
```

#### 3.3 补充遗漏

如果用户提出遗漏的重点：

```
用户: "02:10 那里我说的'三个关键步骤'也很重要"

AI 回应:
✅ 已添加到精华列表

[02:10-02:13] "三个关键步骤"
📌 类型: 结构化内容（序号列表）
💡 建议:
• 使用序号指示器（右上角固定显示）
• 每个步骤单独标注
• 配合 highlight 样式

是否需要为每个步骤添加独立的重点文字？
```

### 第四步：固化到配置

确认后，将精华内容写入 `video-config.json`：

```json
{
  "video": {
    "source": "your-video.mov",
    "duration": 180
  },
  "highlights": [
    {
      "id": "highlight-1",
      "startTime": 15,
      "endTime": 18,
      "originalText": "这个功能能帮你每天省 2 小时",
      "displayText": "每天省 2 小时",
      "type": "keyword",
      "reasons": ["数据对比", "与观众相关"],
      "score": 5,
      "visualConfig": {
        "style": "keyword",
        "position": "bottom",
        "animation": "popIn",
        "fontSize": 75,
        "color": "#fbbf24"
      },
      "screenshot": null
    },
    {
      "id": "highlight-2",
      "startTime": 83,
      "endTime": 87,
      "originalText": "很多人以为 AI 只能生成文字，其实它已经能写代码了",
      "displayText": "AI 已经能写代码",
      "type": "emphasis",
      "reasons": ["认知冲突", "与观众相关"],
      "score": 4,
      "visualConfig": {
        "style": "emphasis",
        "position": "bottom",
        "animation": "pulse",
        "fontSize": 70
      },
      "screenshot": {
        "src": "code-example.png",
        "position": "right-panel",
        "size": "medium",
        "startTime": 84,
        "duration": 6
      }
    }
  ],
  "timeline": [
    // 自动从 highlights 生成
  ]
}
```

### 第五步：自动生成 Timeline

根据 `highlights` 配置，自动生成 `timeline` 元素：

```javascript
// 伪代码
function generateTimeline(highlights) {
  const timeline = [];
  
  for (const highlight of highlights) {
    // 添加重点文字
    timeline.push({
      type: "text",
      startTime: highlight.startTime,
      duration: highlight.endTime - highlight.startTime,
      content: highlight.displayText,
      ...highlight.visualConfig
    });
    
    // 如果有配套截图，添加截图
    if (highlight.screenshot) {
      timeline.push({
        type: "screenshot",
        startTime: highlight.screenshot.startTime,
        duration: highlight.screenshot.duration,
        src: highlight.screenshot.src,
        position: highlight.screenshot.position,
        size: highlight.screenshot.size,
        animation: {
          enter: "slideLeft",
          exit: "fadeOut"
        }
      });
    }
  }
  
  return timeline;
}
```

---

## 最佳实践

### 1. 精华内容密度

**推荐频率**：
- 30-60 秒视频：1-2 个精华
- 60-120 秒视频：2-3 个精华
- 120-180 秒视频：3-4 个精华

**原则**：
- 少即是多，避免信息过载
- 每个精华间隔至少 15-20 秒
- 优先保留评分最高的

### 2. 文字表述优化

**简化原则**：
- 原文："这个功能能帮你每天省 2 小时"
- 重点文字："每天省 2 小时" ✅
- 避免："这个功能能帮你" ❌（太长）

**突出重点**：
- 保留核心数字、关键词
- 删除修饰词、连接词
- 控制在 8 个字以内

### 3. 视觉样式选择

| 内容类型 | 推荐样式 | 动画效果 | 使用场景 |
|---------|---------|---------|---------|
| 数字/数据 | keyword | popIn | 具体数据、量化指标 |
| 核心观点 | emphasis | pulse | 重要结论、关键发现 |
| 章节标题 | highlight | slideUp | 结构化内容的分段 |
| 专业术语 | keyword | fadeIn | 技术名词、概念解释 |

### 4. 截图配合策略

**何时添加截图**：
- ✅ 提到具体工具/产品界面
- ✅ 需要视觉证明的数据
- ✅ 代码示例、配置示例
- ❌ 纯观点表达（分散注意力）
- ❌ 情绪性内容（破坏氛围）

**截图时机**：
- 在口播提到相关内容前 0.5 秒出现
- 持续到口播结束后 1-2 秒
- 与重点文字同步出现

---

## 常见问题

### Q1: 如何判断一个句子是否值得标注？

**A**: 使用"3 秒测试"：
1. 如果观众只看这一句话，能否理解核心价值？
2. 这句话是否让人想截图/转发？
3. 删掉这句话，视频传播力是否下降？

如果 3 个问题都是"是"，那就值得标注。

### Q2: 精华内容太多怎么办？

**A**: 优先级排序：
1. 保留评分最高的（5 分 > 4 分 > 3 分）
2. 保留与主题最相关的
3. 保留最容易传播的（数字、对比）
4. 删除重复表达的

### Q3: 用户提出的重点与 AI 识别的不一致？

**A**: **用户优先**：
- AI 识别是辅助，不是决策
- 用户最了解自己想表达什么
- 如果用户坚持某个点，即使评分低也要保留
- 但可以建议优化表述方式

### Q4: 如何处理序号列表内容？

**A**: 使用序号指示器：
```json
{
  "type": "sequence-indicator",
  "items": [
    { "number": 1, "title": "第一步" },
    { "number": 2, "title": "第二步" },
    { "number": 3, "title": "第三步" }
  ],
  "position": "top-right",
  "highlightCurrent": true
}
```

详见 [references/04-copywriting.md](04-copywriting.md) 的"序号指示器规范"。

### Q5: 精华内容与字幕冲突怎么办？

**A**: 层次分明：
- **底部**：字幕（跟随口播，小字）
- **底部偏上**：重点文字（金色，大字）
- **顶部/侧边**：截图、序号指示器

确保重点文字在字幕上方，视觉层次清晰。

---

## 工具和脚本

### extract_highlights.py

自动提取精华内容的 Python 脚本。

**用法**：
```bash
python3 scripts/extract_highlights.py audio.srt highlights.json
```

**输出**：
- 候选金句列表（JSON 格式）
- 每个候选的评分和原因
- 建议的视觉配置

### validate_highlights.py

验证精华内容配置的合理性。

**用法**：
```bash
python3 scripts/validate_highlights.py video-config.json
```

**检查项**：
- 精华密度是否合理（每分钟 1-2 个）
- 时间间隔是否足够（至少 15 秒）
- 文字长度是否合适（8 字以内）
- 是否有重叠的时间段

---

## 与其他文档的关系

| 文档 | 关系 |
|-----|------|
| [07-live-video-mode.md](07-live-video-mode.md) | 本文档是真人视频模式的子流程 |
| [04-copywriting.md](04-copywriting.md) | 提供文字样式和动画规范 |
| [06-screenshot-guide.md](06-screenshot-guide.md) | 提供截图配合策略 |
| [02-templates.md](02-templates.md) | 提供爆点识别维度 |

---

## 流程图

```
录制视频
   ↓
提取字幕 (Whisper)
   ↓
【自动提取候选金句】
   ├─ 反常识检测
   ├─ 数字对比检测
   ├─ 观众相关检测
   ├─ 情绪词检测
   └─ 观点性检测
   ↓
【结构化呈现】
   ├─ 评分排序
   ├─ 原因说明
   └─ 视觉建议
   ↓
【用户确认】
   ├─ 保留/删除
   ├─ 调整表述
   └─ 补充遗漏
   ↓
【固化到配置】
   ├─ highlights 字段
   └─ 自动生成 timeline
   ↓
预览调整
   ↓
渲染输出
```

---

**文档版本**: v1.0 | **最后更新**: 2026-05-02 | **适用于**: 真人视频模式
