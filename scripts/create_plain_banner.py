from PIL import Image, ImageFilter

def create_plain_banner():
    # Load original cropped banner
    img = Image.open('public/assets/prep-hero-banner.webp').convert('RGB')
    w, h = img.size
    
    # We want to identify text pixels and replace them with the pristine background gradient.
    # The text is strictly contained within: x in [50, 465], y in [95, 345]
    # Outside of this bounding box, the image is 100% text-free.
    
    # Let's inspect the pristine background:
    # From x=0 to x=360, the background is solid navy: rgb(17, 34, 56) with subtle lighting variation.
    # From x=360 to x=480, it smoothly transitions from navy to the desk tones.
    
    # We can detect text pixels because:
    # In x in [50, 465], y in [95, 345]:
    # Text pixels have much higher brightness than the dark background.
    # Specifically, text colors:
    # 1. White text: R, G, B > 120
    # 2. Gold text: R > 120, G > 90, B > 20, R > B + 40
    # 3. Soft ivory paragraph: R, G, B > 95
    # The background in this region has R < 70, G < 70, B < 80.
    
    out = img.copy()
    
    # Create a mask of text pixels
    mask = Image.new('L', (w, h), 0)
    for y in range(95, 345):
        for x in range(50, 470):
            r, g, b = img.getpixel((x, y))
            # Test if pixel is text
            is_text = False
            # White / bright ivory
            if r > 85 and g > 85 and b > 90:
                is_text = True
            # Gold
            elif r > 85 and g > 65 and (r - b) > 30:
                is_text = True
            # Anti-aliased text fringe
            elif (r + g + b) > 180 and x < 420:
                is_text = True
            elif (r + g + b) > 220 and x < 465:
                is_text = True
                
            if is_text:
                mask.putpixel((x, y), 255)
                
    # Dilate mask slightly by 2 pixels to cover anti-aliased font edges
    dilated_mask = mask.filter(ImageFilter.MaxFilter(5))
    
    # For inpainting:
    # For x < 350: background is smooth gradient from (17, 34, 56)
    # For x >= 350: we can interpolate vertically from above (y=80..95) and below (y=345..360)
    # where the background is completely free of text!
    
    for y in range(95, 345):
        for x in range(50, 470):
            if dilated_mask.getpixel((x, y)) > 0:
                if x <= 340:
                    # Solid / very subtle smooth navy
                    # Small vertical gradient from y=85 to y=355
                    top_p = img.getpixel((x, 85))
                    bot_p = img.getpixel((x, 350))
                    factor = (y - 85) / (350 - 85)
                    r = int(top_p[0] + (bot_p[0] - top_p[0]) * factor)
                    g = int(top_p[1] + (bot_p[1] - top_p[1]) * factor)
                    b = int(top_p[2] + (bot_p[2] - top_p[2]) * factor)
                    out.putpixel((x, y), (r, g, b))
                else:
                    # Vertical interpolation between clean top sample and clean bottom sample
                    top_samples = [img.getpixel((x, cy)) for cy in range(80, 92) if dilated_mask.getpixel((x, cy)) == 0]
                    bot_samples = [img.getpixel((x, cy)) for cy in range(348, 360) if dilated_mask.getpixel((x, cy)) == 0]
                    
                    if not top_samples:
                        top_samples = [img.getpixel((x, 80))]
                    if not bot_samples:
                        bot_samples = [img.getpixel((x, 355))]
                        
                    tr = sum(s[0] for s in top_samples) / len(top_samples)
                    tg = sum(s[1] for s in top_samples) / len(top_samples)
                    tb = sum(s[2] for s in top_samples) / len(top_samples)
                    
                    br = sum(s[0] for s in bot_samples) / len(bot_samples)
                    bg = sum(s[1] for s in bot_samples) / len(bot_samples)
                    bb = sum(s[2] for s in bot_samples) / len(bot_samples)
                    
                    factor = (y - 86) / (354 - 86)
                    r = int(tr + (br - tr) * factor)
                    g = int(tg + (bg - tg) * factor)
                    b = int(tb + (bb - tb) * factor)
                    out.putpixel((x, y), (r, g, b))
                    
    # Now smooth the inpainted area with a subtle box blur on the mask edges to eliminate any seam
    smoothed = out.filter(ImageFilter.GaussianBlur(1.2))
    final = img.copy()
    for y in range(h):
        for x in range(w):
            m = dilated_mask.getpixel((x, y))
            if m > 0:
                final.putpixel((x, y), smoothed.getpixel((x, y)))
                
    final.save('public/assets/prep-hero-plain.webp', 'WEBP', quality=95)
    print("Successfully created public/assets/prep-hero-plain.webp")

if __name__ == '__main__':
    create_plain_banner()
