# 场景时长验证与修复标准流程

## 概览

**目的**: 确保每个场景的时长足够容纳完整的配音,避免口播被截断。验证结果必须用于自动修复项目代码,不是交给用户手动判断。

**执行时机**: Remotion 项目代码生成后、用户预览前（必须执行）。

**重要性**: ⚠️ 跳过此步骤会导致用户看到配音被截断的问题,严重影响视频质量。发现问题后只报告不修复同样视为未完成。

---

## 一、问题说明

### 1.1 为什么会出现时长不匹配？

在生成分镜脚本时,场景时长是**估算**的:
- 基于口播文字长度估算
- 基于平均语速估算（约3-4字/秒）
- 基于内容类型经验值

但实际配音时长会受多种因素影响:
- edge-tts 的实际语速
- 句子间的停顿
- 语气词和语调变化
- 标点符号的停顿时长

**结果**: 实际配音时长可能比估算时长长 10%-30%。

### 1.2 问题表现

- **配音被截断**: 场景结束时,最后几个字没有播放完
- **用户体验差**: 信息不完整,观众困惑
- **需要返工**: 必须修复后重新渲染

---

## 二、验证流程

### 2.1 生成配音和 VTT 字幕

执行项目中的配音生成脚本:

```bash
cd {项目目录}
bash scripts/generate-voiceovers.sh
```

生成的文件:
- `public/audio/*.mp3` - 配音文件
- `public/audio/*.vtt` - 字幕文件（包含精确时间戳）

### 2.2 提取配音实际时长

VTT 文件包含精确的时间戳,最后一个时间戳就是配音结束时间。

**VTT 示例**:
```
1
00:00:00,100 --> 00:00:03,925
报告提出了一个核心概念，叫超级个体。

2
00:00:03,875 --> 00:00:05,687
什么是超级个体？

3
00:00:05,687 --> 00:00:07,250
有四个特征。
```

最后一个时间戳 `00:00:07,250` 表示配音时长为 **7.25秒**。

### 2.3 自动化验证脚本

创建验证脚本 `verify-durations.py`:

```python
#!/usr/bin/env python3
# verify-durations.py - 场景时长验证脚本

import re
import os

# 配置区域 - 根据实际项目修改
vtt_files = {
    'brand-intro': 'public/audio/brand-intro.vtt',
    'scene3': 'public/audio/scene3.vtt',
    'scene4': 'public/audio/scene4.vtt',
    'scene5': 'public/audio/scene5.vtt',
    'scene6': 'public/audio/scene6.vtt',
    'scene7': 'public/audio/scene7.vtt',
    'scene8': 'public/audio/scene8.vtt',
    'scene9': 'public/audio/scene9.vtt',
}

# 当前场景时长配置（从代码中读取）
current_durations = {
    'brand-intro': 3,
    'scene3': 10,
    'scene4': 15,
    'scene5': 25,
    'scene6': 20,
    'scene7': 20,
    'scene8': 15,
    'scene9': 11,
}

def parse_time(time_str):
    """将 HH:MM:SS.mmm 或 HH:MM:SS,mmm 转换为秒"""
    time_str = time_str.replace(',', '.')
    parts = time_str.split(':')
    h, m = int(parts[0]), int(parts[1])
    s_parts = parts[2].split('.')
    s, ms = int(s_parts[0]), int(s_parts[1])
    return h * 3600 + m * 60 + s + ms / 1000

def analyze_durations():
    print("=" * 70)
    print("场景时长验证报告")
    print("=" * 70)
    
    issues = []
    
    for name, filepath in vtt_files.items():
        if not os.path.exists(filepath):
            print(f"\n⚠️  {name}: VTT文件不存在")
            continue
            
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 找到所有时间戳
            times = re.findall(r'(\d{2}:\d{2}:\d{2}[,.]\d{3})', content)
            if not times:
                print(f"\n⚠️  {name}: 无法解析时间戳")
                continue
                
            # 最后一个时间戳是结束时间
            end_time = parse_time(times[-1])
            current = current_durations.get(name, 0)
            
            # 建议时长 = 实际配音时长 + 2秒缓冲
            suggested = int(end_time) + 2
            
            # 判断状态
            if current >= end_time + 1:
                status = "✅ OK"
            else:
                status = "❌ 不足"
                issues.append({
                    'name': name,
                    'current': current,
                    'actual': end_time,
                    'suggested': suggested
                })
            
            print(f"\n{name}:")
            print(f"  当前场景时长: {current}秒")
            print(f"  实际配音时长: {end_time:.2f}秒")
            print(f"  建议场景时长: {suggested}秒")
            print(f"  状态: {status}")
            
        except Exception as e:
            print(f"\n❌ {name}: 解析失败 - {e}")
    
    print("\n" + "=" * 70)
    
    if issues:
        print(f"⚠️  发现 {len(issues)} 个时长不足的场景:")
        print("=" * 70)
        for issue in issues:
            diff = issue['suggested'] - issue['current']
            print(f"  {issue['name']:15} {issue['current']:2}秒 → {issue['suggested']:2}秒  "
                  f"(+{diff}秒, 配音{issue['actual']:.1f}秒)")
        print("\n⚠️  请立即修复这些场景的时长!")
        return False
    else:
        print("✅ 所有场景时长充足,无需修复")
        return True

if __name__ == '__main__':
    success = analyze_durations()
    exit(0 if success else 1)
```

### 2.4 执行验证

```bash
python3 verify-durations.py
```

**输出示例**:
```
======================================================================
场景时长验证报告
======================================================================

brand-intro:
  当前场景时长: 3秒
  实际配音时长: 3.45秒
  建议场景时长: 5秒
  状态: ❌ 不足

scene3:
  当前场景时长: 10秒
  实际配音时长: 13.65秒
  建议场景时长: 15秒
  状态: ❌ 不足

scene8:
  当前场景时长: 15秒
  实际配音时长: 14.80秒
  建议场景时长: 16秒
  状态: ❌ 不足

======================================================================
⚠️  发现 3 个时长不足的场景:
======================================================================
  brand-intro      3秒 → 5秒   (+2秒, 配音3.5秒)
  scene3          10秒 → 15秒  (+5秒, 配音13.7秒)
  scene8          15秒 → 16秒  (+1秒, 配音14.8秒)

⚠️  请立即修复这些场景的时长!
```

---

## 三、修复流程

### 3.0 自动修复原则

时长验证失败时,agent 必须自行修复项目代码:

- 不要只向用户汇报哪些场景不足。
- 不要询问用户是否要把 6 秒改成 12 秒；这是质量门禁,应自动修复。
- 修复目标使用 `ceil(实际配音时长 + 2秒) * fps`。
- 修改场景时长后,同步更新总帧数、背景音乐淡出点、Root Composition 时长等派生配置。
- 修复完成后重新运行验证脚本和 `npx tsc --noEmit`。
- 只有所有场景通过验证后,才能启动预览、渲染或宣称交付完成。

### 3.1 修复步骤概览

1. 更新场景时长配置
2. 重新计算总帧数
3. 更新 Root.tsx 总时长
4. 更新背景音乐淡出点（如果有）
5. 验证 TypeScript 编译
6. 重新预览验证

### 3.2 详细修复步骤

#### 步骤1: 更新场景时长

**文件**: `src/SupermanVideo.tsx` (或主视频组件)

**修改前**:
```typescript
const durations = {
  cover: 1 * fps,        // 1秒 = 30帧
  brandIntro: 3 * fps,   // 3秒 = 90帧  ❌ 不足
  scene3: 10 * fps,      // 10秒 = 300帧 ❌ 不足
  scene4: 15 * fps,      // 15秒 = 450帧
  // ...
  scene8: 15 * fps,      // 15秒 = 450帧 ❌ 不足
  // ...
};
```

**修改后**:
```typescript
const durations = {
  cover: 1 * fps,        // 1秒 = 30帧
  brandIntro: 5 * fps,   // 5秒 = 150帧 ✅ (配音3.5秒)
  scene3: 15 * fps,      // 15秒 = 450帧 ✅ (配音13.7秒)
  scene4: 15 * fps,      // 15秒 = 450帧
  // ...
  scene8: 17 * fps,      // 17秒 = 510帧 ✅ (配音14.8秒)
  // ...
};
```

**注释说明**: 建议在修改后的时长后添加注释,注明实际配音时长,方便后续维护。

#### 步骤2: 计算新的总帧数

```javascript
// 使用 Node.js 快速计算
const durations = {
  cover: 1 * 30,
  brandIntro: 5 * 30,    // 修改后
  scene3: 15 * 30,       // 修改后
  scene4: 15 * 30,
  scene5: 25 * 30,
  scene6: 20 * 30,
  scene7: 20 * 30,
  scene8: 17 * 30,       // 修改后
  scene9: 11 * 30,
  brandOutro: 3 * 30,
};

const totalFrames = Object.values(durations).reduce((a, b) => a + b, 0);
const totalSeconds = totalFrames / 30;

console.log('新的总帧数:', totalFrames);
console.log('新的总时长:', totalSeconds, '秒');
```

**输出**:
```
新的总帧数: 3960
新的总时长: 132 秒
```

#### 步骤3: 更新 Root.tsx

**文件**: `src/Root.tsx`

**修改前**:
```typescript
<Composition
  id="SupermanVideo"
  component={SupermanVideo}
  durationInFrames={3690}  // 旧的总帧数 ❌
  fps={30}
  width={1920}
  height={1080}
/>
```

**修改后**:
```typescript
<Composition
  id="SupermanVideo"
  component={SupermanVideo}
  durationInFrames={3960}  // 新的总帧数 ✅
  fps={30}
  width={1920}
  height={1080}
/>
```

#### 步骤4: 更新背景音乐淡出点

**文件**: `src/SupermanVideo.tsx` (或主视频组件)

**修改前**:
```typescript
const totalFrames = 3690;  // 旧的总帧数 ❌
const fadeOutStart = totalFrames - (2 * fps);
```

**修改后**:
```typescript
const totalFrames = 3960;  // 新的总帧数 ✅
const fadeOutStart = totalFrames - (2 * fps);
```

#### 步骤5: 验证编译

```bash
npx tsc --noEmit
```

**预期输出**: 无错误,无警告。

#### 步骤6: 重新预览

Remotion Studio 会自动热更新,刷新浏览器查看修复效果。

逐个检查之前标记为"不足"的场景,确认配音完整播放。

---

## 四、修复原则

### 4.1 时长缓冲策略

| 缓冲策略 | 计算公式 | 适用场景 |
|---------|---------|----------|
| **最小缓冲** | 配音时长 + 1秒 | 紧凑视频,追求精简 |
| **推荐缓冲** | 配音时长 + 2秒 | 标准做法,平衡体验 ✅ |
| **舒适缓冲** | 向上取整到5的倍数 | 长视频,舒适节奏 |

**示例**:
- 配音 3.5秒:
  - 最小: 5秒 (3.5 + 1.5)
  - 推荐: 5秒 (3.5 + 2 = 5.5 → 5)
  - 舒适: 5秒 (向上取整)

- 配音 13.7秒:
  - 最小: 15秒 (13.7 + 1.3)
  - 推荐: 16秒 (13.7 + 2 = 15.7 → 16)
  - 舒适: 15秒 (向上取整)

- 配音 14.8秒:
  - 最小: 16秒 (14.8 + 1.2)
  - 推荐: 17秒 (14.8 + 2 = 16.8 → 17) ✅
  - 舒适: 15秒或20秒

**推荐**: 使用"推荐缓冲"策略,既保证配音完整,又避免过长的静音。

### 4.2 特殊情况处理

#### 情况1: 场景包含多个子场景

如 Scene5 (超级个体四大特征):
- 引入 (5秒)
- 特征1 (5秒)
- 特征2 (5秒)
- 特征3 (5秒)
- 特征4 (5秒)
- **总计**: 25秒

**验证方法**:
- VTT 显示总配音时长: 23.93秒
- 场景总时长: 25秒
- **结论**: ✅ 充足 (25 > 23.93 + 1)

**注意**: 不需要验证每个子场景,只需验证整个场景的总时长。

#### 情况2: 配音时长远小于场景时长

如 Scene7 (从个体到团队):
- 场景时长: 20秒
- 配音时长: 13.16秒
- 差距: 6.84秒

**判断**: ✅ 可接受,但不够优雅。

**可选优化**:
- 保持 20秒 - 留出时间展示流程图动画
- 或缩短到 15秒 - 更紧凑,但需确认动画时长足够

**原则**: 如果场景有复杂动画或视觉元素需要展示,可保留较长时长。

#### 情况3: 片头/片尾特殊处理

**片头 (BrandIntro)**:
- 通常有固定的品牌动画
- 配音时长: 3.45秒
- 建议场景时长: 5秒 (留出动画完整展示时间)

**片尾 (BrandOutro)**:
- 通常无配音或配音很短
- 主要展示品牌元素和引导关注
- 固定 3秒通常足够

---

## 五、常见问题

### Q1: 为什么不在生成分镜脚本时就准确估算?

**答**: edge-tts 的实际语速无法提前精确预测,只能在配音生成后通过 VTT 获取准确时长。

### Q2: 可以手动估算,不用脚本吗?

**答**: 不推荐。手动估算容易出错,且当场景较多(8-10个)时工作量大。自动化脚本准确且快速。

### Q3: 修复后还需要重新生成配音吗?

**答**: 不需要。配音文件不变,只是调整场景的容器时长。

### Q4: 如果配音时长超出很多怎么办?

**答**: 
1. **首选**: 调整场景时长 (推荐)
2. **备选**: 精简口播文案,重新生成配音
3. **避免**: 直接截断配音

### Q5: 总时长变化会影响其他场景吗?

**答**: 不会。每个场景的 `durationInFrames` 独立控制。只需更新:
- 场景自身的时长
- Root.tsx 的总时长
- 背景音乐淡出点

---

## 六、验证清单

完成修复后,使用此清单验证:

- [ ] 运行 `python3 verify-durations.py`,输出 "✅ 所有场景时长充足"
- [ ] 运行 `npx tsc --noEmit`,无 TypeScript 错误
- [ ] Root.tsx 的 `durationInFrames` 已更新
- [ ] 背景音乐淡出点已更新 (如果有背景音乐)
- [ ] Remotion Studio 预览,逐场景检查配音完整播放
- [ ] 记录总时长变化,更新 README.md 中的视频时长说明

---

## 七、自动化建议

### 7.1 集成到工作流

建议在 `package.json` 中添加脚本:

```json
{
  "scripts": {
    "verify": "python3 verify-durations.py",
    "voiceover": "bash scripts/generate-voiceovers.sh && npm run verify"
  }
}
```

使用:
```bash
npm run voiceover  # 生成配音并自动验证
```

### 7.2 Git Hook 集成

在 `.git/hooks/pre-commit` 中添加:

```bash
#!/bin/bash
if [ -f verify-durations.py ]; then
    python3 verify-durations.py || {
        echo "⚠️  场景时长验证失败,必须自动修复后再提交"
        exit 1
    }
fi
```

---

## 八、总结

### 核心要点

1. **必须执行**: 配音生成后,预览前必须验证时长
2. **使用脚本**: 自动化验证,准确快速
3. **自动修复**: 发现问题立即修改项目时长配置,不要只报告
4. **推荐缓冲**: 场景时长 = 配音时长 + 2秒
5. **全面验证**: 修复后运行完整检查清单

### 质量保证

遵循此流程可确保:
- ✅ 所有配音完整播放
- ✅ 无信息截断
- ✅ 用户体验流畅
- ✅ 无需返工修复

---

**文档版本**: v1.0  
**最后更新**: 2026-06-07  
**适用于**: Remotion 4.x + edge-tts  
**维护者**: Claude Code
