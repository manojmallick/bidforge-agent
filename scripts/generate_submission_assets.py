from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "submission-assets"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


def rounded(draw: ImageDraw.ImageDraw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def gradient(size, top, bottom):
    img = Image.new("RGB", size, top)
    px = img.load()
    h = size[1]
    for y in range(h):
        t = y / max(h - 1, 1)
        color = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(size[0]):
            px[x, y] = color
    return img


def make_background():
    w, h = 1920, 720
    img = gradient((w, h), (248, 251, 255), (236, 244, 250)).convert("RGBA")
    draw = ImageDraw.Draw(img)

    # Subtle brand bands.
    draw.polygon([(1180, 0), (1920, 0), (1920, 720), (1360, 720)], fill=(12, 110, 100, 24))
    draw.polygon([(1450, 0), (1920, 0), (1920, 470), (1600, 620)], fill=(112, 80, 220, 28))
    for x in range(0, w, 64):
        draw.line([(x, 0), (x - 320, h)], fill=(14, 43, 58, 5), width=1)

    # Main copy block.
    draw.text((120, 92), "BidForge Agent", font=font(78, True), fill=(18, 32, 48))
    draw.text((124, 184), "Agentic RFP Command Center", font=font(38, False), fill=(16, 109, 98))
    draw.text((124, 240), "Requirements, proposal drafts, risks, approvals,", font=font(28), fill=(76, 88, 104))
    draw.text((124, 280), "ROI, and audit-ready governance.", font=font(28), fill=(76, 88, 104))

    chips = ["RFP Intake", "Compliance Matrix", "Risk Register", "SME Routing", "Judge Report", "ROI"]
    start_x = 124
    y = 346
    for index, chip in enumerate(chips):
        if index == 3:
            y += 68
            start_x = 124
        x = start_x
        tw = draw.textbbox((0, 0), chip, font=font(22, True))[2]
        rounded(draw, (x, y, x + tw + 42, y + 54), 18, (255, 255, 255, 230), (198, 216, 226), 2)
        draw.ellipse((x + 17, y + 20, x + 27, y + 30), fill=(16, 109, 98))
        draw.text((x + 34, y + 15), chip, font=font(22, True), fill=(28, 43, 58))
        start_x += tw + 62

    # Product dashboard panel.
    panel = Image.new("RGBA", (760, 500), (255, 255, 255, 0))
    p = ImageDraw.Draw(panel)
    rounded(p, (0, 0, 760, 500), 28, (255, 255, 255, 242), (195, 210, 222), 2)
    p.rectangle((0, 0, 760, 72), fill=(248, 251, 255, 255))
    p.text((32, 23), "RFP-742-B", font=font(24, True), fill=(16, 109, 98))
    p.text((152, 23), "Analysis in progress", font=font(22), fill=(74, 86, 102))
    p.rounded_rectangle((590, 18, 712, 54), radius=18, fill=(237, 250, 247), outline=(133, 220, 204))
    p.text((618, 26), "Score 84", font=font(18, True), fill=(13, 110, 99))

    cards = [
        ("Requirements", "84", "92% covered"),
        ("Open risks", "17", "5 need approval"),
        ("Hours saved", "135", "73% faster"),
        ("Automation", "5m", "active cadence"),
    ]
    cx, cy = 34, 104
    for i, (label, value, note) in enumerate(cards):
        bx = cx + (i % 2) * 350
        by = cy + (i // 2) * 124
        rounded(p, (bx, by, bx + 318, by + 96), 18, (248, 252, 253), (210, 222, 231), 2)
        p.text((bx + 22, by + 17), label, font=font(18, True), fill=(76, 88, 104))
        p.text((bx + 22, by + 43), value, font=font(34, True), fill=(12, 110, 100))
        p.text((bx + 92, by + 54), note, font=font(17), fill=(98, 111, 128))

    # Compliance rows.
    row_y = 370
    for i, (name, owner, status) in enumerate(
        [
            ("EU data residency", "Legal", "Needs SME"),
            ("24x7 support", "Delivery", "Verified"),
            ("Incident response", "Security", "Pending"),
        ]
    ):
        y0 = row_y + i * 38
        p.line((34, y0, 724, y0), fill=(224, 232, 238), width=1)
        p.text((48, y0 + 10), name, font=font(16, True), fill=(32, 46, 62))
        p.text((326, y0 + 10), owner, font=font(16), fill=(84, 96, 112))
        badge = (590, y0 + 7, 706, y0 + 31)
        color = (255, 246, 222) if status != "Verified" else (225, 250, 240)
        text_color = (152, 90, 20) if status != "Verified" else (12, 110, 100)
        p.rounded_rectangle(badge, radius=12, fill=color)
        p.text((badge[0] + 15, y0 + 10), status, font=font(14, True), fill=text_color)

    # Soft shadow and placement.
    shadow = Image.new("RGBA", panel.size, (0, 0, 0, 0))
    s = ImageDraw.Draw(shadow)
    rounded(s, (0, 0, 760, 500), 28, (15, 35, 50, 55))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    img.alpha_composite(shadow, (1038, 136))
    img.alpha_composite(panel, (1020, 116))

    # Small brand mark in the corner.
    draw.rounded_rectangle((124, 552, 366, 624), radius=24, fill=(11, 31, 47, 235))
    draw.text((160, 570), "B", font=font(34, True), fill=(120, 232, 218))
    draw.text((204, 574), "Human-approved", font=font(22, True), fill=(245, 250, 252))

    img.convert("RGB").save(OUT / "bidforge-background.png", quality=95)


def make_logo():
    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle((26, 26, 486, 486), radius=128, fill=(10, 31, 48))
    draw.rounded_rectangle((48, 48, 464, 464), radius=108, outline=(112, 232, 218), width=8)

    # Abstract forged shield/check mark.
    draw.polygon([(256, 100), (374, 148), (354, 316), (256, 406), (158, 316), (138, 148)], fill=(20, 119, 109))
    draw.polygon([(256, 128), (344, 164), (330, 300), (256, 366), (182, 300), (168, 164)], fill=(237, 250, 247))
    draw.line((188, 254, 240, 306, 330, 210), fill=(15, 132, 120), width=30, joint="curve")

    draw.text((196, 176), "B", font=font(132, True), fill=(16, 43, 60))
    draw.arc((124, 124, 388, 388), 210, 328, fill=(115, 82, 220), width=20)
    draw.arc((124, 124, 388, 388), 28, 146, fill=(120, 232, 218), width=20)

    img.save(OUT / "bidforge-logo.png")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    make_background()
    make_logo()
    print(f"Generated assets in {OUT}")
