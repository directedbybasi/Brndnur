from PIL import Image

src = r'C:\Users\user\.gemini\antigravity-ide\brain\90f9ec95-9190-4593-8a7e-8f53f833ddd3\.user_uploaded\media_1792691768662.jpg'
img = Image.open(src)
w, h = img.size

# Let's crop the top banner
banner = img.crop((0, 0, w, 440))
banner.save('public/assets/prep-hero-banner.webp', 'WEBP', quality=90)

# Card 1 image:
c1 = img.crop((55, 480, 274, 646))
c1.save('public/assets/prep-card-brand-logo.webp', 'WEBP', quality=90)

# Card 2 image:
c2 = img.crop((289, 480, 506, 646))
c2.save('public/assets/prep-card-products.webp', 'WEBP', quality=90)

# Card 3 image:
c3 = img.crop((519, 480, 736, 646))
c3.save('public/assets/prep-card-applicant.webp', 'WEBP', quality=90)

# Card 4 image:
c4 = img.crop((752, 480, 971, 646))
c4.save('public/assets/prep-card-business-info.webp', 'WEBP', quality=90)

print("Crops created successfully:")
print("Banner:", banner.size)
print("Card 1:", c1.size, "Ratio:", c1.width/c1.height)
print("Card 2:", c2.size, "Ratio:", c2.width/c2.height)
print("Card 3:", c3.size, "Ratio:", c3.width/c3.height)
print("Card 4:", c4.size, "Ratio:", c4.width/c4.height)
