#!/bin/bash
# 批量生成配音文件
# 用法: ./generate-voiceovers.sh <voice_name> <output_dir>
# 示例: ./generate-voiceovers.sh zh-CN-YunxiNeural public/audio

set -e

# 默认参数
VOICE="${1:-zh-CN-YunxiNeural}"
OUTPUT_DIR="${2:-public/audio}"

# 检查 edge-tts 是否安装
if ! command -v edge-tts &> /dev/null; then
    echo "错误: edge-tts 未安装"
    echo "运行: pip3 install edge-tts"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

echo "使用语音: $VOICE"
echo "输出目录: $OUTPUT_DIR"
echo "================================"

# 检查是否存在 voiceover-scripts.txt
if [ ! -f "voiceover-scripts.txt" ]; then
    echo "错误: 找不到 voiceover-scripts.txt 文件"
    echo "请创建该文件，每行一个场景的配音文本"
    echo ""
    echo "格式示例:"
    echo "Scene1: 今天介绍的技能是 Brainstorming。"
    echo "Scene2: 它是一个帮助你把想法变成完整方案的协作工具..."
    exit 1
fi

# 读取文件并生成配音
scene_num=1
while IFS= read -r line; do
    # 跳过空行和注释
    if [[ -z "$line" ]] || [[ "$line" =~ ^# ]]; then
        continue
    fi

    # 提取场景编号和文本
    if [[ "$line" =~ ^Scene([0-9]+):\ (.+)$ ]]; then
        num="${BASH_REMATCH[1]}"
        text="${BASH_REMATCH[2]}"

        echo "生成 Scene${num} 配音..."
        edge-tts --voice "$VOICE" \
                 --text "$text" \
                 --write-media "$OUTPUT_DIR/scene${num}.mp3" \
                 --write-subtitles "$OUTPUT_DIR/scene${num}.vtt"

        echo "✓ Scene${num} 完成"
    fi
done < voiceover-scripts.txt

echo "================================"
echo "所有配音生成完成！"
echo ""
echo "下一步:"
echo "1. 运行 python3 scripts/get-audio-duration.py 获取时长"
echo "2. 根据输出更新场景时长配置"
