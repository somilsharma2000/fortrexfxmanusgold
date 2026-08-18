from PIL import Image, ImageFilter
import numpy as np
from pathlib import Path

src = Path('/home/ubuntu/upload/fortrex-translucent-crown_a4b0355a.png')
out = Path('/home/ubuntu/webdev-static-assets/fortrex-crown-clean.png')
out.parent.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert('RGBA')
a = np.asarray(img).copy()
r, g, b, alpha = [a[:, :, i].astype(np.float32) for i in range(4)]

# Chroma-key the neon green background, retaining dark obsidian and metallic crown pixels.
green_strength = g - np.maximum(r, b)
ratio = g / np.maximum(np.maximum(r, b), 1.0)
mask = ((green_strength > 18) & (ratio > 1.14)) | ((g > 125) & (green_strength > 10) & (ratio > 1.08))

# Softly remove near-green edge pixels to prevent a green halo around the crown.
soft = np.clip((green_strength - 4) / 28.0, 0.0, 1.0)
soft = np.where(ratio > 1.03, soft, 0.0)
new_alpha = np.where(mask, 0.0, alpha * (1.0 - soft * 0.72))

a[:, :, 3] = np.clip(new_alpha, 0, 255).astype(np.uint8)
# Neutralize residual green in semi-transparent edge pixels.
edge = a[:, :, 3] < 245
edge_green = edge & (g > r * 1.03) & (g > b * 1.03)
a[:, :, 1] = np.where(edge_green, np.minimum(g, (r * 1.08 + b * 0.08)), g).astype(np.uint8)

Image.fromarray(a, 'RGBA').save(out, optimize=True)
print(out)
