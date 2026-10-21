#!/usr/bin/env python3
"""
解析 SRT 字幕文件并生成 Remotion 配置
"""
import json
import re
import sys

def parse_srt(srt_file):
    """解析 SRT 文件"""
    with open(srt_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # SRT 格式：序号 \n 时间轴 \n 文本 \n 空行
    pattern = r'(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n(.*?)(?=\n\n|\Z)'
    matches = re.findall(pattern, content, re.DOTALL)

    subtitles = []
    for match in matches:
        index, start, end, text = match
        start_sec = time_to_seconds(start)
        end_sec = time_to_seconds(end)
        text = text.strip().replace('\n', ' ')

        subtitles.append({
            'index': int(index),
            'start': start_sec,
            'end': end_sec,
            'duration': end_sec - start_sec,
            'text': text
        })

    return subtitles

def time_to_seconds(time_str):
    """将 SRT 时间格式转换为秒"""
    # 格式: 00:00:05,120 -> 5.12
    h, m, s = time_str.split(':')
    s, ms = s.split(',')
    return int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000

def generate_config(subtitles, output_file):
    """生成 video-config.json"""

    # 基础配置
    config = {
        "video": {
            "source": "12345.mov",
            "duration": int(subtitles[-1]['end']) + 5 if subtitles else 255
        },
        "timeline": []
    }

    # 为每个字幕生成文字配置
    for sub in subtitles:
        config['timeline'].append({
            "type": "text",
            "startTime": round(sub['start'], 2),
            "duration": round(sub['duration'], 2),
            "content": sub['text'],
            "style": "subtitle",
            "position": "bottom",
            "animation": "fadeIn"
        })

    # 保存配置
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

    print(f"✅ 配置文件已生成: {output_file}")
    print(f"📝 共 {len(subtitles)} 条字幕")
    print(f"⏱️  视频时长: {config['video']['duration']} 秒")

def print_subtitles(subtitles):
    """打印字幕内容供用户查看"""
    print("\n" + "="*60)
    print("字幕内容预览:")
    print("="*60)
    for sub in subtitles[:20]:  # 只显示前20条
        print(f"\n[{format_time(sub['start'])} - {format_time(sub['end'])}]")
        print(f"{sub['text']}")

    if len(subtitles) > 20:
        print(f"\n... 还有 {len(subtitles) - 20} 条字幕 ...")
    print("="*60 + "\n")

def format_time(seconds):
    """格式化时间显示"""
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 parse_srt.py <srt文件路径> [输出配置文件]")
        sys.exit(1)

    srt_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'video-config-auto.json'

    print(f"📖 正在解析字幕文件: {srt_file}")
    subtitles = parse_srt(srt_file)

    print_subtitles(subtitles)

    generate_config(subtitles, output_file)

    print("\n💡 下一步:")
    print("1. 查看生成的配置文件")
    print("2. 根据口播内容添加截图")
    print("3. 标注重点文字")
