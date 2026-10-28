"""Render English store screenshots from the unmodified app captures."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
SETS = (
    (
        "APP STORE · IPHONE",
        ROOT / "app-store/screenshots/draft-simulator/iphone/en-US",
        ROOT / "app-store/screenshots/designed/iphone/en-US",
        (1206, 2622),
        False,
    ),
    (
        "APP STORE · IPAD",
        ROOT / "app-store/screenshots/draft-simulator/ipad/en-US",
        ROOT / "app-store/screenshots/designed/ipad/en-US",
        (2064, 2752),
        True,
    ),
    (
        "GOOGLE PLAY · PHONE",
        ROOT / "google-play/screenshots/phone/en-US",
        ROOT / "google-play/screenshots/designed/phone/en-US",
        (1080, 1920),
        False,
    ),
)
HEADLINES = {
    "01-map.png": ("Map your Japan", "journey"),
    "02-prefecture.png": ("Track each", "prefecture"),
    "03-flags.png": ("Explore 47", "prefecture flags"),
    "04-settings.png": ("Keep progress", "on your device"),
}
PREVIEW_PATH = ROOT / "store-screenshots-preview-en-US.png"
FONT_PATH = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
BACKGROUND = "#203A47"
TEXT = "#FFFDF7"
ACCENT = "#E4B65D"


def render(
    source_path: Path,
    destination_path: Path,
    lines: tuple[str, str],
    target_size: tuple[int, int],
    tablet: bool,
) -> None:
    with Image.open(source_path) as original:
        screenshot = original.convert("RGB")

    width, height = target_size
    canvas = Image.new("RGB", target_size, BACKGROUND)
    draw = ImageDraw.Draw(canvas)

    label_font = ImageFont.truetype(str(FONT_PATH), round(width * 0.032))
    headline_size = round(width * (0.055 if tablet else 0.070))
    headline_font = ImageFont.truetype(str(FONT_PATH), headline_size)
    left = round(width * 0.10)
    right = width - left

    draw.text((left, round(height * 0.039)), "JAPANEX", font=label_font, fill=ACCENT)
    headline_lines = (" ".join(lines),) if tablet else lines
    line_start = round(height * (0.083 if tablet else 0.079))
    line_step = round(height * 0.038)
    for index, line in enumerate(headline_lines):
        if draw.textbbox((0, 0), line, font=headline_font)[2] > right - left:
            raise ValueError(f"Headline is too wide for {source_path.name}: {line}")
        draw.text((left, line_start + index * line_step), line, font=headline_font, fill=TEXT)

    scale = height * 0.80 / screenshot.height
    scaled_size = (round(screenshot.width * scale), round(screenshot.height * scale))
    if scaled_size[0] > width * 0.82:
        raise ValueError(f"Screenshot is too wide for {target_size}: {source_path}")
    screenshot = screenshot.resize(scaled_size, Image.Resampling.LANCZOS)
    screenshot_x = (width - scaled_size[0]) // 2
    screenshot_y = round(height * 0.175)
    corner_radius = round(width * 0.026)

    mask = Image.new("L", scaled_size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, scaled_size[0] - 1, scaled_size[1] - 1),
        radius=corner_radius,
        fill=255,
    )

    shadow = Image.new("RGBA", target_size, (0, 0, 0, 0))
    shadow_mask = Image.new("L", target_size, 0)
    shadow_mask.paste(mask, (screenshot_x, screenshot_y + round(height * 0.006)))
    shadow.putalpha(shadow_mask.filter(ImageFilter.GaussianBlur(round(width * 0.018))))
    shadow_rgb = Image.new("RGB", target_size, "#1D2D39")
    canvas.paste(shadow_rgb, (0, 0), shadow.getchannel("A").point(lambda alpha: round(alpha * 0.18)))
    canvas.paste(screenshot, (screenshot_x, screenshot_y), mask)

    destination_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination_path, format="PNG", optimize=True)


def main() -> None:
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Required font not found: {FONT_PATH}")

    for _, source_dir, destination_dir, target_size, tablet in SETS:
        for filename, lines in HEADLINES.items():
            render(source_dir / filename, destination_dir / filename, lines, target_size, tablet)
            print(destination_dir / filename)

    preview = Image.new("RGB", (1000, 1420), "#FFFFFF")
    preview_draw = ImageDraw.Draw(preview)
    preview_font = ImageFont.truetype(str(FONT_PATH), 25)
    for row, (label, _, destination_dir, _, _) in enumerate(SETS):
        top = (20, 565, 940)[row]
        preview_draw.text((20, top), label, font=preview_font, fill="#1D2D39")
        for column, filename in enumerate(HEADLINES):
            with Image.open(destination_dir / filename) as image:
                thumbnail = image.copy()
            thumbnail.thumbnail((225, 500), Image.Resampling.LANCZOS)
            preview.paste(thumbnail, (20 + column * 245, top + 44))
    preview.save(PREVIEW_PATH, format="PNG", optimize=True)
    print(PREVIEW_PATH)


if __name__ == "__main__":
    main()
