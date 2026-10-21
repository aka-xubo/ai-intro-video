# Lottie 语义动画与 Remotion 接入

## 目标

使用 `@remotion/lottie` 时,动画必须服务内容理解和口播节奏。不要因为有 Lottie 就加动画;只有当动画能帮助观众更快理解当前信息、状态变化、结构关系或情绪落点时才使用。

## 什么时候使用 Lottie

优先用于这些场景:

- **品牌识别**: 片头/片尾的 logo、IP 角色、频道标识轻量动效。
- **状态变化**: 加载、生成、连接、完成、失败、警告、确认。
- **流程节点**: 输入、处理、工具调用、输出、反馈、迭代。
- **小图标语义**: AI、搜索、对话、数据、自动化、协作、提醒。
- **转场提示**: 章节切换、步骤推进、观点反转。
- **背景辅助**: 很克制的动态纹理或轻量粒子,不能抢主体。

避免用于这些场景:

- 大段文字动画: 优先用 React/CSS,更可控。
- 精确逐字字幕同步: 优先用字幕组件和 frame-based 文本动画。
- 复杂数据图表: 优先用 React/SVG/Canvas。
- 画面已经很满的场景: 不要再加装饰性 Lottie。
- 无明确语义的动效: 删除或改为更轻的 CSS 动画。

## 内容语义匹配

先判断当前场景的信息类型,再选择动画:

| 内容类型 | 动画语义 | 示例 |
|---------|---------|------|
| 概念解释 | 结构展开、节点连接、层级拆解 | Agent: 输入 -> 推理 -> 工具调用 -> 输出 |
| 对比内容 | 左右切换、差异高亮、天平/分叉 | 传统搜索 vs AI 搜索 |
| 步骤教程 | 编号推进、进度条、卡片逐步点亮 | 第一步/第二步/第三步 |
| 观点结论 | 聚焦、放大、锁定、盖章、定格 | "真正变化的是工作流" |
| 风险问题 | 警示、断裂、红色标记、卡顿 | 口播未完但时间轴截断 |
| 增长趋势 | 曲线、上升、时间线推进 | AI 工具成熟度提升 |

每个 Lottie 都要能回答: 它在帮观众理解什么?

## 匹配口播节奏

动画必须跟着口播落点走:

1. 口播提出问题: 出现疑问、冲突结构或空状态。
2. 口播解释原因: 拆解流程、连接节点或展开层级。
3. 口播列举步骤: 每讲一点亮一个,不要一次全亮。
4. 口播给出结论: 动画收束、放大、定格。
5. 口播转场: 使用轻量过渡,不要抢主信息。

如果动画和当前口播没有明确对应关系,不要使用。

## 安装依赖

在生成的 Remotion 项目中安装:

```bash
npm install @remotion/lottie lottie-web
```

如果项目锁定了 Remotion 精确版本,`@remotion/lottie` 应尽量使用相同版本。例如项目使用 Remotion `4.0.473`:

```bash
npm install @remotion/lottie@4.0.473 lottie-web
```

## 资产放置

把 Lottie JSON 放在项目的 `public/lottie/` 中:

```text
public/
└── lottie/
    ├── ai-spark.json
    ├── workflow-nodes.json
    └── success-check.json
```

命名要表达语义,不要使用 `animation1.json`、`effect.json` 这类不可维护名称。

## Remotion 接入模板

优先使用 `staticFile()` + `fetch()` + `delayRender()` 加载 JSON,避免渲染时资源还没准备好。

```tsx
import React, {useEffect, useState} from "react";
import {AbsoluteFill, Sequence, cancelRender, continueRender, delayRender, staticFile} from "remotion";
import {Lottie} from "@remotion/lottie";

type SemanticLottieProps = {
  src: string;
  startFrame?: number;
  endFrame?: number;
  opacity?: number;
};

export const SemanticLottie: React.FC<SemanticLottieProps> = ({
  src,
  startFrame = 0,
  endFrame,
  opacity = 1,
}) => {
  const [handle] = useState(() => delayRender(`Loading Lottie ${src}`));
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    fetch(staticFile(src))
      .then((response) => response.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((error) => cancelRender(error));
  }, [handle, src]);

  if (!animationData) {
    return null;
  }

  const content = (
    <AbsoluteFill style={{pointerEvents: "none", opacity}}>
      <Lottie animationData={animationData} />
    </AbsoluteFill>
  );

  if (endFrame === undefined) {
    return <Sequence from={startFrame}>{content}</Sequence>;
  }

  return (
    <Sequence from={startFrame} durationInFrames={Math.max(1, endFrame - startFrame)}>
      {content}
    </Sequence>
  );
};
```

使用示例:

```tsx
<SemanticLottie
  src="lottie/workflow-nodes.json"
  startFrame={45}
  endFrame={150}
  opacity={0.85}
/>
```

## 实现规则

- Lottie 默认作为辅助层,不要盖住字幕和主体。
- 用 `pointerEvents: "none"` 防止影响预览交互。
- 限制容器尺寸和位置,不要让 Lottie 全屏铺开后干扰阅读。
- 用 `startFrame` / `endFrame` 控制出现时机,使其匹配口播。
- 对循环动画要克制,不要全场景持续高频运动。
- 如果 Lottie 中的文字不可控或语言不匹配,不要使用该素材。
- 如果中间帧抽到不可读、重叠、遮挡主体的状态,必须调整位置、尺寸、时机或删除动画。

## 与视觉抽帧检查结合

使用 Lottie 的场景必须额外抽取这些帧:

1. Lottie 出现前 5 帧。
2. Lottie 出现后 5 帧。
3. Lottie 动画中段。
4. Lottie 收束/消失前 5 帧。
5. 场景结束前 0.5 秒。

检查重点:

- 动画是否和当前口播语义一致。
- 动画是否遮挡字幕、主体、截图或结论文字。
- 动画是否抢走观众注意力。
- 动画中间态是否可读、稳定、没有尴尬重叠。
- 动画是否影响画面品牌一致性。

发现问题后必须自动修复并重新抽帧,不要只报告。

## 常见修复

- 抢主体: 降低 opacity、缩小尺寸、移动到边缘或删除。
- 遮挡字幕: 改到上方/侧边,或缩短出现时间。
- 动画太慢: 缩短展示区间,只保留关键状态。
- 动画太快: 延长稳定停留帧,减少大幅移动。
- 语义不匹配: 换素材或改用 React/CSS 动画。
- 抽帧中间态混乱: 错开 Lottie 与文字/截图入场时机。

## 交付标准

使用 Lottie 的项目交付前必须满足:

- Lottie 素材有明确语义用途。
- Lottie 出现时机与口播落点一致。
- 关键帧抽帧检查通过。
- 没有遮挡字幕、主体或关键文字。
- TypeScript 编译通过。
