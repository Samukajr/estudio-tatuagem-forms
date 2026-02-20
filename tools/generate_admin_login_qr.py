import qrcode
from PIL import Image

URL = "https://samukajr.github.io/estudio-tatuagem-forms/index.html"
QR_SIZE = 800
LOGO_PATH = "Logo-Preto.jpeg"
OUT_PATH = "admin-login-qr.jpg"

qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(URL)
qr.make(fit=True)

img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGB")
img_qr = img_qr.resize((QR_SIZE, QR_SIZE), Image.NEAREST)

logo = Image.open(LOGO_PATH).convert("RGB")
logo_size = int(QR_SIZE * 0.22)
logo = logo.resize((logo_size, logo_size), Image.LANCZOS)

padding = int(logo_size * 0.12)
bg_size = logo_size + padding * 2
bg = Image.new("RGB", (bg_size, bg_size), "white")
bg.paste(logo, (padding, padding))

pos = ((QR_SIZE - bg_size) // 2, (QR_SIZE - bg_size) // 2)
img_qr.paste(bg, pos)

img_qr.save(OUT_PATH, "JPEG", quality=95)
print(f"Saved {OUT_PATH}")
