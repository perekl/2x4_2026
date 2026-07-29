#!/usr/bin/env python3
"""
Auto-crop sprite sheets with checkerboard (or solid gray) backgrounds.

Usage:
  1. Place source sheets in public/assets/source/:
       - cutouts-sheet.png  (photorealistic Bob & Perek cutouts)
       - posters-sheet.png    (movie poster style sheet)
  2. Run: python3 scripts/crop_sprites.py
     Or:  npm run crop-assets

Sprites are detected by finding foreground bounding boxes, sorted top-to-left,
then mapped to names from scripts/sprite-manifest.json.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image
    import numpy as np
except ImportError:
    print("Installing dependencies...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "numpy", "-q"])
    from PIL import Image
    import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "public" / "assets" / "source"
MANIFEST_PATH = Path(__file__).resolve().parent / "sprite-manifest.json"
PADDING = 8
MIN_SPRITE_SIZE = 60


def is_background(rgba: np.ndarray, tolerance: int = 35) -> np.ndarray:
    """Return boolean mask where True = background (checkerboard or transparent)."""
    if rgba.shape[-1] == 4:
        alpha = rgba[..., 3]
        transparent = alpha < 20
    else:
        transparent = np.zeros(rgba.shape[:2], dtype=bool)

    rgb = rgba[..., :3].astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]

    # Near-gray (checkerboard cells)
    grayish = (np.abs(r - g) < tolerance) & (np.abs(g - b) < tolerance)
    light_gray = grayish & (r > 100) & (r < 240)

    # Very dark border areas
    very_dark = (r < 30) & (g < 30) & (b < 30)

    return transparent | light_gray | very_dark


def find_sprite_boxes(img: Image.Image) -> list[tuple[int, int, int, int]]:
    """Find bounding boxes of non-background regions using flood-fill labeling."""
    rgba = np.array(img.convert("RGBA"))
    h, w = rgba.shape[:2]
    bg = is_background(rgba)

    visited = np.zeros((h, w), dtype=bool)
    boxes: list[tuple[int, int, int, int]] = []

    def flood(y: int, x: int) -> tuple[int, int, int, int] | None:
        stack = [(y, x)]
        min_y = max_y = y
        min_x = max_x = x
        count = 0

        while stack:
            cy, cx = stack.pop()
            if cy < 0 or cy >= h or cx < 0 or cx >= w:
                continue
            if visited[cy, cx] or bg[cy, cx]:
                continue
            visited[cy, cx] = True
            count += 1
            min_y = min(min_y, cy)
            max_y = max(max_y, cy)
            min_x = min(min_x, cx)
            max_x = max(max_x, cx)
            stack.extend([(cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)])

        if count < MIN_SPRITE_SIZE * MIN_SPRITE_SIZE // 4:
            return None
        bw = max_x - min_x
        bh = max_y - min_y
        if bw < MIN_SPRITE_SIZE or bh < MIN_SPRITE_SIZE:
            return None
        return (min_x, min_y, max_x + 1, max_y + 1)

    for y in range(h):
        for x in range(w):
            if not visited[y, x] and not bg[y, x]:
                box = flood(y, x)
                if box:
                    boxes.append(box)

    # Sort top-to-bottom, then left-to-right (with row tolerance)
    boxes.sort(key=lambda b: (b[1] // 80, b[0]))
    return boxes


def crop_and_save(sheet_path: Path, output_dir: Path, names: list[str]) -> list[str]:
    img = Image.open(sheet_path).convert("RGBA")
    boxes = find_sprite_boxes(img)

    print(f"  Found {len(boxes)} sprites in {sheet_path.name}")
    print(f"  Manifest expects {len(names)} names")

    if len(boxes) < len(names):
        print(f"  WARNING: fewer sprites detected than manifest entries.")
        print(f"  Detected boxes will be saved; extra manifest names skipped.")

    saved: list[str] = []
    count = min(len(boxes), len(names))

    for i in range(count):
        x1, y1, x2, y2 = boxes[i]
        x1 = max(0, x1 - PADDING)
        y1 = max(0, y1 - PADDING)
        x2 = min(img.width, x2 + PADDING)
        y2 = min(img.height, y2 + PADDING)

        cropped = img.crop((x1, y1, x2, y2))

        # Make checkerboard background transparent
        data = np.array(cropped)
        bg_mask = is_background(data)
        data[bg_mask, 3] = 0
        cropped = Image.fromarray(data)

        out_path = output_dir / names[i]
        out_path.parent.mkdir(parents=True, exist_ok=True)
        cropped.save(out_path, "PNG")
        saved.append(str(out_path.relative_to(ROOT)))
        print(f"    ✓ {names[i]}")

    if len(boxes) > len(names):
        print(f"  NOTE: {len(boxes) - len(names)} extra sprites detected but not named.")
        for j in range(len(names), len(boxes)):
            x1, y1, x2, y2 = boxes[j]
            extra_name = f"_extra_{j - len(names) + 1}.png"
            cropped = img.crop((x1, y1, x2, y2))
            out_path = output_dir / "_extras" / extra_name
            out_path.parent.mkdir(parents=True, exist_ok=True)
            cropped.save(out_path, "PNG")
            print(f"    → saved extra to {out_path.relative_to(ROOT)}")

    return saved


def main() -> int:
    if not MANIFEST_PATH.exists():
        print(f"Manifest not found: {MANIFEST_PATH}")
        return 1

    manifest = json.loads(MANIFEST_PATH.read_text())
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)

    missing = []
    for sheet_name in manifest:
        if not (SOURCE_DIR / sheet_name).exists():
            missing.append(sheet_name)

    if missing:
        print("Source sprite sheets not found in public/assets/source/:")
        for m in missing:
            print(f"  - {m}")
        print()
        print("Please add your combined sprite sheet images there, then re-run.")
        print("Expected files:")
        print("  public/assets/source/cutouts-sheet.png  — photorealistic cutouts")
        print("  public/assets/source/posters-sheet.png    — movie poster style")
        return 1

    print("Cropping sprites...\n")

    for sheet_name, config in manifest.items():
        sheet_path = SOURCE_DIR / sheet_name
        output_dir = ROOT / config["outputDir"]
        names = [s["name"] for s in config["sprites"]]
        print(f"Processing {sheet_name}:")
        crop_and_save(sheet_path, output_dir, names)
        print()

    # Create convenience symlinks / copies for primary site assets
    aliases = {
        "public/assets/suspects/bob-full.png": "public/assets/suspects/bob-golf.png",
        "public/assets/suspects/perek-full.png": "public/assets/suspects/perek-golf.png",
        "public/assets/courtroom/judge.png": "public/assets/suspects/bob-judge.png",
        "public/assets/courtroom/attorney.png": "public/assets/suspects/perek-attorney.png",
    }

    print("Setting primary asset aliases:")
    for dest, src in aliases.items():
        src_path = ROOT / src
        dest_path = ROOT / dest
        if src_path.exists():
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            # Copy (not symlink) for deployment compatibility
            import shutil
            shutil.copy2(src_path, dest_path)
            print(f"  ✓ {dest} ← {src}")
        else:
            print(f"  ✗ {src} not found, skipping {dest}")

    print("\nDone! Assets ready in public/assets/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
