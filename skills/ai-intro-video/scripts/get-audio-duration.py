#!/usr/bin/env python3
"""
获取音频文件时长并计算对应的帧数

用法:
    python3 get-audio-duration.py [audio_directory]

示例:
    python3 get-audio-duration.py ../brainstorming-video/public/audio
    python3 get-audio-duration.py  # 默认使用 public/audio
"""

import math
import os
import sys

def get_audio_duration(audio_dir, fps=30, buffer_seconds=2):
    """
    获取指定目录下所有音频文件的时长

    Args:
        audio_dir: 音频文件目录
        fps: 帧率（默认30fps）
        buffer_seconds: 每段推荐预留缓冲秒数（默认2秒）
    """
    if not os.path.exists(audio_dir):
        print(f"错误: 目录不存在 - {audio_dir}")
        return

    # 查找所有 scene*.mp3 文件
    audio_files = sorted([f for f in os.listdir(audio_dir) if f.startswith('scene') and f.endswith('.mp3')])

    if not audio_files:
        print(f"错误: 在 {audio_dir} 中没有找到 scene*.mp3 文件")
        return

    print(f"音频文件时长分析 (FPS: {fps})")
    print("=" * 60)

    total_duration = 0
    total_frames = 0
    total_recommended_frames = 0

    for filename in audio_files:
        file_path = os.path.join(audio_dir, filename)
        try:
            audio = MP3(file_path)
            duration = audio.info.length
            frames = math.ceil(duration * fps)
            recommended_seconds = math.ceil(duration + buffer_seconds)
            recommended_frames = recommended_seconds * fps

            # 提取场景编号
            scene_num = filename.replace('scene', '').replace('.mp3', '')

            print(f"Scene{scene_num}: {duration:.2f}s = {frames} frames")

            total_duration += duration
            total_frames += frames
            total_recommended_frames += recommended_frames

        except Exception as e:
            print(f"错误: 无法读取 {filename} - {e}")

    print("=" * 60)
    print(f"总时长: {total_duration:.2f}s = {total_frames} frames")
    print()
    print(f"建议的场景时长配置 (每段 +{buffer_seconds}s 缓冲):")
    print("-" * 60)

    for filename in audio_files:
        file_path = os.path.join(audio_dir, filename)
        try:
            audio = MP3(file_path)
            duration = audio.info.length
            recommended_seconds = math.ceil(duration + buffer_seconds)
            frames = recommended_seconds * fps
            scene_num = filename.replace('scene', '').replace('.mp3', '')

            print(f"const scene{scene_num}Duration = {frames}; // 配音 {duration:.2f}秒，建议 {recommended_seconds}秒")

        except Exception as e:
            pass

    print()
    print(f"Root.tsx 总时长配置:")
    print(f"durationInFrames={{{total_recommended_frames}}}")

if __name__ == "__main__":
    # 获取音频目录参数
    if len(sys.argv) > 1:
        audio_dir = sys.argv[1]
    else:
        # 默认目录
        audio_dir = "public/audio"

    # 检查 mutagen 是否安装
    try:
        from mutagen.mp3 import MP3
    except ImportError:
        print("错误: 需要安装 mutagen 库")
        print("运行: pip3 install mutagen")
        sys.exit(1)

    get_audio_duration(audio_dir)
