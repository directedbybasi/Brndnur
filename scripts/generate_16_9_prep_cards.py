import os
from PIL import Image

def generate_prep_cards():
    im1 = Image.open(r'C:\Users\user\.gemini\antigravity-ide\brain\90f9ec95-9190-4593-8a7e-8f53f833ddd3\.user_uploaded\media_1792691768662.jpg').convert('RGB')
    im2 = Image.open(r'C:\Users\user\.gemini\antigravity-ide\brain\90f9ec95-9190-4593-8a7e-8f53f833ddd3\.user_uploaded\media_1792694436034.png').convert('RGB')

    # Target 16:9 resolution: 640x360
    TARGET_W = 640
    TARGET_H = 360

    # Clean crops strictly within photo area, stopping well above the circular badge (y < 605 in im1, y < 475 in im2)
    crop_defs = [
        ('brand-logo', im1, 56, 480, 272, 480 + int(216 * 9 / 16)),
        ('products', im1, 291, 480, 505, 480 + int(214 * 9 / 16)),
        ('applicant', im1, 521, 480, 735, 480 + int(214 * 9 / 16)),
        ('business-info', im1, 753, 480, 969, 480 + int(216 * 9 / 16)),
        ('existing-tm', im2, 516, 348, 734, 348 + int(218 * 9 / 16)),
        ('deadlines', im2, 752, 348, 970, 348 + int(218 * 9 / 16)),
    ]

    out_dir = 'public/assets'
    os.makedirs(out_dir, exist_ok=True)

    for name, src, x1, y1, x2, y2 in crop_defs:
        crp = src.crop((x1, y1, x2, y2))
        # High quality Lanczos resize to exact 16:9
        retina = crp.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)
        out_path = os.path.join(out_dir, f'prep-card-{name}.webp')
        retina.save(out_path, 'WEBP', quality=95)
        print(f'Generated {out_path}: {retina.size}, aspect ratio={retina.width/retina.height:.4f}')

if __name__ == '__main__':
    generate_prep_cards()
