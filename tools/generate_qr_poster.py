from PIL import Image, ImageDraw, ImageFont
import textwrap

QR_PATH = "admin-login-qr.jpg"
OUT_PATH = "qr-poster-a4.png"

# A4 at 300 DPI
PAGE_W, PAGE_H = 2480, 3508
BG_COLOR = "white"
TEXT = "Escaneie para preencher seus formulários com segurança e rapidez"

# Load QR
qr = Image.open(QR_PATH).convert("RGB")

# Resize QR to fit nicely on A4
qr_size = 1400
qr = qr.resize((qr_size, qr_size), Image.LANCZOS)

# Create canvas
canvas = Image.new("RGB", (PAGE_W, PAGE_H), BG_COLOR)

# Center QR
qr_x = (PAGE_W - qr_size) // 2
qr_y = 500
canvas.paste(qr, (qr_x, qr_y))

# Load font (fallback to default)
font_size = 80
try:
    font = ImageFont.truetype("arial.ttf", font_size)
except OSError:
    font = ImageFont.load_default()

# Wrap text if needed
max_text_width = PAGE_W - 300
lines = []
for line in textwrap.wrap(TEXT, width=40):
    lines.append(line)

# Measure and draw text centered
draw = ImageDraw.Draw(canvas)
line_spacing = 20
text_height = 0
line_sizes = []
for line in lines:
    bbox = draw.textbbox((0, 0), line, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    line_sizes.append((w, h))
    text_height += h
text_height += line_spacing * (len(lines) - 1)

text_y = qr_y + qr_size + 120
for i, line in enumerate(lines):
    w, h = line_sizes[i]
    text_x = (PAGE_W - w) // 2
    draw.text((text_x, text_y), line, fill="black", font=font)
    text_y += h + line_spacing

canvas.save(OUT_PATH, "PNG")
print(f"Saved {OUT_PATH}")
