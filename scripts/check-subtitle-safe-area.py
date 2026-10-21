#!/usr/bin/env python3
"""
Check subtitle length and low-positioned scene elements for Remotion videos.

Usage:
  python3 scripts/check-subtitle-safe-area.py src public/audio
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


DEFAULT_SRC_DIR = "src"
DEFAULT_SUBTITLE_DIR = "public/audio"
MAX_CHINESE_CHARS = 48
WARN_CHINESE_CHARS = 42
MIN_SAFE_BOTTOM = 470


def chinese_weight(text: str) -> int:
    """Approximate visual width for Chinese-heavy subtitles."""
    weight = 0
    for char in text.strip():
        if char.isspace():
            continue
        if "\u4e00" <= char <= "\u9fff":
            weight += 1
        else:
            weight += 0.5
    return int(weight)


def clean_subtitle_text(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def iter_subtitle_blocks(path: Path):
    content = path.read_text(encoding="utf-8", errors="ignore")
    blocks = re.split(r"\n\s*\n", content)
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip()]
        if not lines:
            continue
        text_lines = [
            line
            for line in lines
            if "-->" not in line and not line.upper().startswith("WEBVTT") and not line.isdigit()
        ]
        text = clean_subtitle_text(" ".join(text_lines))
        if text:
            yield text


def check_subtitles(subtitle_dir: Path) -> list[str]:
    issues: list[str] = []
    files = sorted(list(subtitle_dir.glob("*.vtt")) + list(subtitle_dir.glob("*.srt")))
    for path in files:
        for index, text in enumerate(iter_subtitle_blocks(path), start=1):
            score = chinese_weight(text)
            if score > MAX_CHINESE_CHARS:
                issues.append(
                    f"[subtitle:error] {path}:{index} 字幕过长，约 {score} 中文字宽：{text}"
                )
            elif score > WARN_CHINESE_CHARS:
                issues.append(
                    f"[subtitle:warn] {path}:{index} 接近 2 行上限，约 {score} 中文字宽：{text}"
                )
    return issues


def check_low_bottom(src_dir: Path) -> list[str]:
    issues: list[str] = []
    pattern = re.compile(r"bottom\s*:\s*(\d+)")
    for path in sorted(src_dir.glob("**/*.tsx")):
        if path.name.lower().startswith("animatedsubtitle"):
            continue
        for line_number, line in enumerate(path.read_text(encoding="utf-8", errors="ignore").splitlines(), start=1):
            match = pattern.search(line)
            if not match:
                continue
            value = int(match.group(1))
            if value < MIN_SAFE_BOTTOM:
                issues.append(
                    f"[layout:warn] {path}:{line_number} bottom={value} 小于 {MIN_SAFE_BOTTOM}，确认不是主体关键内容"
                )
    return issues


def main() -> int:
    src_dir = Path(sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC_DIR)
    subtitle_dir = Path(sys.argv[2] if len(sys.argv) > 2 else DEFAULT_SUBTITLE_DIR)

    all_issues: list[str] = []
    if src_dir.exists():
        all_issues.extend(check_low_bottom(src_dir))
    else:
        all_issues.append(f"[config:warn] 未找到源码目录：{src_dir}")

    if subtitle_dir.exists():
        all_issues.extend(check_subtitles(subtitle_dir))
    else:
        all_issues.append(f"[config:warn] 未找到字幕目录：{subtitle_dir}")

    if all_issues:
        print("字幕安全区检查发现风险：")
        for issue in all_issues:
            print(f"- {issue}")
        return 1

    print("字幕安全区检查通过：未发现低位主体内容或过长字幕。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
