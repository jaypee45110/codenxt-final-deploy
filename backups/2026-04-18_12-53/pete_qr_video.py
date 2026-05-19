import math
import qrcode
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from moviepy import VideoClip

# === STARS ===
np.random.seed(42)
num_stars = 180
stars = []

# === KONFIG ===
qr_data = "https://codetone.codenxt.global/join/CT-3947?lang=en"
frame_path = "PeteA.png"
output_path = "pete_qr_wow.mp4"

duration = 10
fps = 30

# QR
qr_size = 140
center_x = 240
center_y = 241

# Glow / puls
base_glow_blur = 22
base_glow_strength = 1.15
pulse_scale_amount = 0.028
pulse_speed = 1.0
unlock_boost_start = 7.6
unlock_flash_strength = 0.22

# Bakgrunn større enn rammen
BG_W = 720
BG_H = 720

# === 1. GENERER QR ===
qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=1,
)
qr.add_data(qr_data)
qr.make(fit=True)

qr_img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")
qr_img = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)

# === 2. LAST RAMME ===
frame = Image.open(frame_path).convert("RGBA")
FW, FH = frame.size

frame_base_x = (BG_W - FW) // 2
frame_base_y = (BG_H - FH) // 2

# QR-plassering relativt til rammen
paste_x = frame_base_x + center_x - (qr_size // 2)
paste_y = frame_base_y + center_y - (qr_size // 2)

# === 3. GLOW-KILDE FRA RAMMEN ===
alpha = frame.getchannel("A")

# større arbeidsflate for glow så den ikke klippes
glow_pad = 120
glow_base = Image.new("L", (FW + glow_pad * 2, FH + glow_pad * 2), 0)
glow_base.paste(alpha, (glow_pad, glow_pad))

glow_mask = glow_base.filter(ImageFilter.GaussianBlur(base_glow_blur))
glow_color = Image.new("RGBA", glow_base.size, (86, 224, 255, 0))
glow_color.putalpha(glow_mask)

# === 4. STJERNER PÅ STØRRE BAKGRUNN ===
for _ in range(num_stars):
    stars.append({
        "x": np.random.randint(0, BG_W),
        "y": np.random.randint(0, BG_H),
        "size": int(np.random.choice([1, 1, 1, 2])),
        "phase": np.random.rand() * 2 * math.pi,
        "speed": np.random.uniform(0.5, 1.5),
    })


def make_frame(t: float):
    pulse = 0.5 + 0.5 * math.sin(2 * math.pi * pulse_speed * t)
    scale = 1.0 + pulse_scale_amount * pulse
    glow_strength = base_glow_strength + 0.25 * pulse

    unlock_progress = 0.0
    if t >= unlock_boost_start:
        unlock_progress = min(
            (t - unlock_boost_start) / (duration - unlock_boost_start),
            1.0,
        )

    flash = unlock_flash_strength * unlock_progress

    # Mørk nattebakgrunn
    canvas = Image.new("RGBA", (BG_W, BG_H), (5, 8, 14, 255))

    # Stjerner
    star_layer = Image.new("RGBA", (BG_W, BG_H), (0, 0, 0, 0))
    for s in stars:
        brightness = int(110 + 120 * (0.5 + 0.5 * math.sin(t * s["speed"] + s["phase"])))
        y = int((s["y"] + t * 4) % BG_H)

        for dx in range(s["size"]):
            for dy in range(s["size"]):
                px = s["x"] + dx
                py = y + dy
                if 0 <= px < BG_W and 0 <= py < BG_H:
                    star_layer.putpixel((px, py), (brightness, brightness, brightness, 255))

    canvas.alpha_composite(star_layer)

    # QR rent
    qr_layer = Image.new("RGBA", (BG_W, BG_H), (0, 0, 0, 0))
    qr_layer.alpha_composite(qr_img, (paste_x, paste_y))
    canvas.alpha_composite(qr_layer)

    # Glow skalert rundt rammen
    glow = glow_color.copy()
    enhancer = ImageEnhance.Brightness(glow)
    glow = enhancer.enhance(glow_strength + flash)

    glow_w, glow_h = glow.size
    glow_scaled_w = int(glow_w * scale)
    glow_scaled_h = int(glow_h * scale)
    glow_scaled = glow.resize((glow_scaled_w, glow_scaled_h), Image.Resampling.LANCZOS)

    glow_x = (BG_W - glow_scaled_w) // 2
    glow_y = (BG_H - glow_scaled_h) // 2
    canvas.alpha_composite(glow_scaled, (glow_x, glow_y))

    # Re-draw QR så den holder seg ren
    canvas.alpha_composite(qr_layer)

    # Ramme øverst
    frame_scaled_w = int(FW * scale)
    frame_scaled_h = int(FH * scale)
    frame_scaled = frame.resize((frame_scaled_w, frame_scaled_h), Image.Resampling.LANCZOS)

    frame_x = (BG_W - frame_scaled_w) // 2
    frame_y = (BG_H - frame_scaled_h) // 2
    canvas.alpha_composite(frame_scaled, (frame_x, frame_y))

    # Subtil unlock-boost
    if unlock_progress > 0:
        overlay_alpha = int(45 * unlock_progress)
        light_overlay = Image.new("RGBA", (BG_W, BG_H), (255, 255, 255, overlay_alpha))
        canvas.alpha_composite(light_overlay)

    return np.array(canvas.convert("RGB"))


clip = VideoClip(make_frame, duration=duration)
clip.write_videofile(
    output_path,
    fps=fps,
    codec="libx264",
    audio=False,
)

print("WOW-video klar:", output_path)