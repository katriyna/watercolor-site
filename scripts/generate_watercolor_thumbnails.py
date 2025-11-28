#!/usr/bin/env python3
import argparse
import sys
import json
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTS = {".png"}

def detect_image_color(im: Image.Image) -> str:
    default_color = "#000000"

    try:
        src_w, src_h = im.size
        if src_w == 0 or src_h == 0:
            return default_color

        # Work on a copy; composite over white to remove alpha influence
        work = im
        if work.mode != "RGBA":
            try:
                work = work.convert("RGBA")
            except Exception:
                work = work.convert("RGB").convert("RGBA")

        if "A" in work.getbands():
            bg = Image.new("RGBA", work.size, (255, 255, 255, 255))
            alpha = work.getchannel("A")
            bg.paste(work, mask=alpha)
            work_rgb = bg.convert("RGB")
        else:
            work_rgb = work.convert("RGB")

        # Downscale for speed/stability
        target_w = 64
        target_h = max(1, round(work_rgb.height * (target_w / max(1, work_rgb.width))))
        small = work_rgb.resize((target_w, target_h), resample=Image.Resampling.BILINEAR)

        # Quantize to a small adaptive palette
        quant = small.convert("P", palette=Image.ADAPTIVE, colors=8)
        palette = quant.getpalette()[:256 * 3]
        hist = quant.histogram()

        # Sort palette indices by frequency
        indices = [i for i in range(256) if hist[i] > 0]
        indices.sort(key=lambda i: hist[i], reverse=True)

        def idx_to_rgb(i: int) -> tuple[int, int, int]:
            base = i * 3
            if base + 2 < len(palette):
                return palette[base], palette[base + 1], palette[base + 2]
            return (255, 255, 255)

        def is_near_white(rgb: tuple[int, int, int]) -> bool:
            r, g, b = rgb
            return r >= 200 and g >= 200 and b >= 200

        for i in indices:
            rgb = idx_to_rgb(i)
            if not is_near_white(rgb):
                return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

        if indices:
            rgb = idx_to_rgb(indices[0])
            return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

        return default_color
    except Exception:
        # Be conservative on errors
        return default_color

def process_image_size(im: Image.Image, out_path: Path, target_width: int):
    src_w, src_h = im.size
    if src_w == 0 or src_h == 0:
        raise ValueError("Source image has invalid dimensions")
    target_height = max(1, round(src_h * (target_width / src_w)))
    thumb = im.resize((target_width, target_height), resample=Image.Resampling.LANCZOS)
    save_kwargs = {}
    thumb.save(out_path, **save_kwargs)
    print(f"Created thumbnail: {out_path}")



def write_result_metadata_as_json(src_dir: Path, results: list[dict]) -> None:
    # Wrap the results array into an object under the "images" property
    payload = {"images": results}
    jsonResult = json.dumps(payload, ensure_ascii=False)
    print(jsonResult)

    try:
        metadata_dir = src_dir / "metadata"
        metadata_dir.mkdir(parents=True, exist_ok=True)
        info_path = metadata_dir / "info.json"
        info_path.write_text(jsonResult, encoding="utf-8")
        print(f"Wrote metadata to: {info_path}")
    except Exception as e:
        print(f"Failed to write metadata file: {e}", file=sys.stderr)



def generate_thumbnails(dir: Path) -> int:
    src_dir = dir / "original"

    if not src_dir.exists() or not src_dir.is_dir():
        print(f"Source directory does not exist or is not a directory: {src_dir}", file=sys.stderr)
        return 0

    thumb_dir = dir / "thumbnails"
    thumb_dir.mkdir(parents=True, exist_ok=True)

    regular_dir = dir / "regular"
    regular_dir.mkdir(parents=True, exist_ok=True)

    count = 0
    results = []
    for entry in sorted(src_dir.iterdir()):
        if not entry.is_file():
            continue
        ext = entry.suffix.lower()
        if ext not in SUPPORTED_EXTS:
            continue

        try:
            with Image.open(entry) as im:
                main_color = detect_image_color(im)
                print(f"Detected main color for {entry.name}: {main_color}")
                process_image_size(im, thumb_dir / entry.name, 150)
                process_image_size(im, regular_dir / entry.name, 1200)
                results.append({
                    "id": entry.stem,
                    "color": main_color,
                    "thumbnailSrc": f"/watercolors/thumbnails/{entry.name}",
                    "regularSrc": f"/watercolors/regular/{entry.name}",
                    "src": f"/watercolors/{entry.name}"
                })
        except Exception as e:
            print(f"Failed to process {entry}: {e}", file=sys.stderr)

    # Output and write metadata via helper
    write_result_metadata_as_json(dir, results)
    return count


if __name__ == "__main__":
    count = generate_thumbnails(
        Path("../public/watercolors")
    )
    print(f"Total thumbnails created: {count}")
    raise SystemExit(0)
