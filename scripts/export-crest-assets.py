from pathlib import Path
from PIL import Image, ImageChops, ImageEnhance

source = Path('/home/ubuntu/webdev-static-assets/fortrex-refined-crest-logo.png')
out = Path('/home/ubuntu/webdev-static-assets')
out.mkdir(parents=True, exist_ok=True)
img = Image.open(source).convert('RGBA')
# Remove the near-black presentation background while preserving the gold crest.
r, g, b, a = img.split()
luma = ImageChops.lighter(ImageChops.lighter(r, g), b)
alpha = luma.point(lambda value: 0 if value < 22 else min(255, int((value - 22) * 2.2)))
rgba = Image.merge('RGBA', (r, g, b, alpha))
bbox = rgba.getchannel('A').getbbox()
if bbox:
    rgba = rgba.crop(bbox)
pad = max(rgba.width, rgba.height) // 5
square = Image.new('RGBA', (max(rgba.width, rgba.height) + pad * 2,) * 2, (0, 0, 0, 0))
square.alpha_composite(rgba, ((square.width - rgba.width) // 2, (square.height - rgba.height) // 2))
square.save(out / 'fortrex-crest-transparent.png')
app = square.resize((512, 512), Image.Resampling.LANCZOS)
app.save(out / 'fortrex-app-icon.png')
favicon = square.resize((64, 64), Image.Resampling.LANCZOS)
favicon.save(out / 'fortrex-favicon.png')
social = square.resize((1024, 1024), Image.Resampling.LANCZOS)
social.save(out / 'fortrex-social-avatar.png')
print('Exported:', 'fortrex-crest-transparent.png', 'fortrex-app-icon.png', 'fortrex-favicon.png', 'fortrex-social-avatar.png')
