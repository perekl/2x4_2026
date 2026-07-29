#!/usr/bin/env python3
"""
Crop Bob & Perek sprite sheets into individual transparent PNGs.

Expects source files in public/assets/source/ (any of these names):
  - cutouts-sheet.png / ChatGPT Image*.png (combined cutouts + posters)
  - posters-sheet.png / second ChatGPT Image*.png (additional poses)
"""

from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path

try:
    from PIL import Image
    import numpy as np
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "numpy", "-q"])
    from PIL import Image
    import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SOURCE_DIR = ROOT / "public" / "assets" / "source"
MANIFEST_PATH = Path(__file__).resolve().parent / "sprite-manifest.json"
PADDING = 8
MIN_SIZE = 70


def is_background(rgba: np.ndarray, tolerance: int = 35) -> np.ndarray:
    if rgba.shape[-1] == 4:
        transparent = rgba[..., 3] < 20
    else:
        transparent = np.zeros(rgba.shape[:2], dtype=bool)

    rgb = rgba[..., :3].astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    grayish = (np.abs(r - g) < tolerance) & (np.abs(g - b) < tolerance)
    light_gray = grayish & (r > 90) & (r < 245)
    very_dark = (r < 25) & (g < 25) & (b < 25)
    return transparent | light_gray | very_dark


def trim_to_content(img: Image.Image, min_size: int = MIN_SIZE) -> Image.Image | None:
    arr = np.array(img.convert("RGBA"))
    fg = ~is_background(arr)
    if not fg.any():
        return None
    ys, xs = np.where(fg)
    x1 = max(0, xs.min() - PADDING)
    x2 = min(arr.shape[1], xs.max() + PADDING + 1)
    y1 = max(0, ys.min() - PADDING)
    y2 = min(arr.shape[0], ys.max() + PADDING + 1)
    if x2 - x1 < min_size or y2 - y1 < min_size:
        return None
    data = arr[y1:y2, x1:x2].copy()
    data[~fg[y1:y2, x1:x2], 3] = 0
    return Image.fromarray(data)


def grid_cells(img: Image.Image, cols: int, rows: int, region: tuple[int, int, int, int]) -> list[Image.Image]:
    x0, y0, x1, y1 = region
    cropped = img.crop((x0, y0, x1, y1))
    w, h = cropped.size
    cw, ch = w // cols, h // rows
    cells = []
    for r in range(rows):
        for c in range(cols):
            cells.append(cropped.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)))
    return cells


def save_cell(cell: Image.Image, dest: Path, crop_frac: tuple[float, float, float, float] | None = None) -> bool:
    """crop_frac: (x0, y0, x1, y1) as fractions 0-1 within cell"""
    if crop_frac:
        w, h = cell.size
        fx0, fy0, fx1, fy1 = crop_frac
        cell = cell.crop((int(w * fx0), int(h * fy0), int(w * fx1), int(h * fy1)))
    trimmed = trim_to_content(cell)
    if not trimmed:
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    trimmed.save(dest, "PNG")
    return True


def find_source_files() -> tuple[Path, Path | None]:
    """Return (combined_sheet, supplemental_sheet)."""
    pngs = sorted(SOURCE_DIR.glob("*.png"))
    if not pngs:
        raise FileNotFoundError(f"No PNG files in {SOURCE_DIR}")

    combined = None
    supplemental = None

    for p in pngs:
        name = p.name.lower()
        if "cutouts" in name or "sheet-1" in name:
            combined = p
        elif "posters" in name or "sheet-2" in name:
            supplemental = p

    if combined is None:
        # Pick widest image as combined (1536x1024), tallest as supplemental
        by_size = sorted(pngs, key=lambda p: Image.open(p).size[0], reverse=True)
        combined = by_size[0]
        supplemental = by_size[1] if len(by_size) > 1 else None

    return combined, supplemental


def crop_combined_sheet(path: Path, manifest: dict) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    mid = w // 2

    cutout_names = [s["name"] for s in manifest["cutouts-sheet.png"]["sprites"]]
    poster_names = [s["name"] for s in manifest["posters-sheet.png"]["sprites"]]

    # Left: photorealistic cutouts (4x4)
    left_cells = grid_cells(img, 4, 4, (10, 55, mid - 10, h - 10))
    print(f"  Cutouts: {len(left_cells)} cells -> {len(cutout_names)} names")

    # Per-cell crop adjustments for cells with stacked sprites
    cell_crops: dict[int, tuple[float, float, float, float]] = {
        4: (0, 0, 1, 0.55),    # bob expression top
        5: (0, 0, 1, 0.6),     # bob maniac top
        7: (0.45, 0, 1, 1),    # bob mugshot right portion
        8: (0, 0.45, 1, 1),    # perek golf bottom
        9: (0, 0.5, 0.55, 1),  # perek scribe bottom-left
        12: (0, 0, 1, 0.55),   # perek expression top
        14: (0, 0, 1, 0.55),   # perek pacifier top
    }

    out_dir = ROOT / "public" / "assets"
    for i, name in enumerate(cutout_names):
        frac = cell_crops.get(i)
        cell = left_cells[i] if i < len(left_cells) else None
        if cell is None:
            print(f"    ✗ missing cell for {name}")
            continue
        if save_cell(cell, out_dir / name, frac):
            print(f"    ✓ {name}")
        else:
            print(f"    ✗ empty {name}")

    # Right: movie posters (3x4, skip header)
    right_cells = grid_cells(img, 3, 4, (mid + 5, 95, w - 5, h - 10))
    poster_dir = ROOT / "public" / "assets" / "posters"
    for i, name in enumerate(poster_names):
        if i >= len(right_cells):
            break
        fname = Path(name).name
        if save_cell(right_cells[i], poster_dir / fname):
            print(f"    ✓ posters/{fname}")
        else:
            print(f"    ✗ empty posters/{fname}")


def crop_supplemental_sheet(path: Path) -> dict[str, Path]:
    """3x4 grid on supplemental sheet — returns map of role -> saved path."""
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    cells = grid_cells(img, 3, 4, (0, 0, w, h))

    roles = {
        0: "suspects/bob-judge.png",
        1: "suspects/bob-golf.png",
        2: "suspects/perek-attorney.png",
        5: "suspects/bob-mugshot.png",
        6: "suspects/bob-mugshot-alt.png",
        7: "suspects/perek-mugshot.png",
        10: "suspects/perek-inmate.png",
        11: "misc/wanted-poster.png",
    }

    saved: dict[str, Path] = {}
    out_dir = ROOT / "public" / "assets"
    for idx, rel in roles.items():
        if idx >= len(cells):
            continue
        dest = out_dir / rel
        if save_cell(cells[idx], dest):
            saved[rel] = dest
            print(f"    ✓ {rel} (supplemental cell {idx})")
    return saved


def apply_aliases() -> None:
    aliases = {
        "suspects/bob-full.png": "suspects/bob-golf.png",
        "suspects/perek-full.png": "suspects/perek-golf.png",
        "courtroom/judge.png": "suspects/bob-judge.png",
        "courtroom/attorney.png": "suspects/perek-attorney.png",
    }
    assets = ROOT / "public" / "assets"
    print("\n  Primary aliases:")
    for dest, src in aliases.items():
        src_path = assets / src
        dest_path = assets / dest
        if src_path.exists():
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src_path, dest_path)
            print(f"    ✓ {dest} ← {src}")
        else:
            print(f"    ✗ {src} missing")


def main() -> int:
    if not MANIFEST_PATH.exists():
        print(f"Manifest not found: {MANIFEST_PATH}")
        return 1

    manifest = json.loads(MANIFEST_PATH.read_text())
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)

    try:
        combined, supplemental = find_source_files()
    except FileNotFoundError as e:
        print(e)
        return 1

    print(f"Combined sheet: {combined.name}")
    print("Cropping cutouts + posters...")
    crop_combined_sheet(combined, manifest)

    if supplemental:
        print(f"\nSupplemental sheet: {supplemental.name}")
        print("Cropping hero poses...")
        crop_supplemental_sheet(supplemental)

    apply_aliases()

    # Cleanup temp preview dirs
    for d in [ROOT / "public" / "assets" / "_preview", ROOT / "public" / "assets" / "_preview2"]:
        if d.exists():
            shutil.rmtree(d)

    print("\nDone! Assets in public/assets/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
