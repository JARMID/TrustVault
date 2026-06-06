# -*- coding: utf-8 -*-
"""
Generate chapter cover banners matching the user's ch4_cover.png reference:
- Dark green gradient (radial), edge-to-edge, no white borders
- Compact landscape (1024x500) — same style, half the height
- Bold white chapter title, mint green subtitle, thin green line
"""
from PIL import Image, ImageDraw, ImageFont
import math

WIDTH, HEIGHT = 1024, 500

def radial_gradient(draw, cx, cy, radius, c_inner, c_outer):
    """Draw a radial gradient by filling pixel rows."""
    for y in range(HEIGHT):
        for x in range(WIDTH):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            t = min(dist / radius, 1.0)
            r = int(c_inner[0] + (c_outer[0] - c_inner[0]) * t)
            g = int(c_inner[1] + (c_outer[1] - c_inner[1]) * t)
            b = int(c_inner[2] + (c_outer[2] - c_inner[2]) * t)
            draw.point((x, y), fill=(r, g, b))

def fast_gradient(img):
    """Fast vertical + horizontal gradient blend matching ch4 reference."""
    from PIL import ImageFilter
    pixels = img.load()
    # Colors sampled from the ch4_cover reference
    c_dark  = (8, 28, 28)     # Dark corners
    c_mid   = (18, 50, 48)    # Center-ish
    c_light = (28, 70, 65)    # Bottom center highlight
    
    for y in range(HEIGHT):
        for x in range(WIDTH):
            # Vertical component: darker at top, slightly lighter at bottom center
            vy = y / HEIGHT
            # Horizontal component: darker at edges, lighter at center
            hx = abs(x - WIDTH / 2) / (WIDTH / 2)
            
            # Blend: center-bottom is lightest
            t_center = (1 - hx) * vy  # max at bottom-center
            t_dark = hx * 0.5 + (1 - vy) * 0.3  # edges and top are darker
            
            r = int(c_dark[0] + (c_light[0] - c_dark[0]) * t_center + (c_mid[0] - c_dark[0]) * (1 - t_dark) * 0.3)
            g = int(c_dark[1] + (c_light[1] - c_dark[1]) * t_center + (c_mid[1] - c_dark[1]) * (1 - t_dark) * 0.3)
            b = int(c_dark[2] + (c_light[2] - c_dark[2]) * t_center + (c_mid[2] - c_dark[2]) * (1 - t_dark) * 0.3)
            
            r = max(0, min(255, r))
            g = max(0, min(255, g))
            b = max(0, min(255, b))
            pixels[x, y] = (r, g, b)

def create_banner(chapter_num, subtitle, output_path):
    img = Image.new('RGB', (WIDTH, HEIGHT), (10, 30, 30))
    fast_gradient(img)
    draw = ImageDraw.Draw(img)
    
    # Fonts - try bold system fonts
    try:
        font_title = ImageFont.truetype("arialbd.ttf", 72)
        font_sub = ImageFont.truetype("arial.ttf", 36)
    except:
        try:
            font_title = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 72)
            font_sub = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 36)
        except:
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
    
    # Chapter title
    title = f"CHAPITRE {chapter_num}"
    bbox = draw.textbbox((0, 0), title, font=font_title)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (WIDTH - tw) / 2
    ty = HEIGHT / 2 - th - 30
    draw.text((tx, ty), title, fill=(255, 255, 255), font=font_title)
    
    # Green line
    line_y = ty + th + 25
    draw.line([(WIDTH/2 - 80, line_y), (WIDTH/2 + 80, line_y)], fill=(60, 200, 160), width=3)
    
    # Subtitle
    bbox2 = draw.textbbox((0, 0), subtitle, font=font_sub)
    sw = bbox2[2] - bbox2[0]
    sx = (WIDTH - sw) / 2
    sy = line_y + 25
    draw.text((sx, sy), subtitle, fill=(80, 210, 170), font=font_sub)
    
    img.save(output_path, quality=95)
    print(f"Created {output_path} ({WIDTH}x{HEIGHT})")

if __name__ == "__main__":
    create_banner("I",   "Étude Préalable",                     r"D:\TrustDesk\memoire_assets\ch1_cover.png")
    create_banner("II",  "Analyse et Spécification des Besoins", r"D:\TrustDesk\memoire_assets\ch2_cover.png")
    create_banner("III", "Conception",                           r"D:\TrustDesk\memoire_assets\ch3_cover.png")
    print("All banners generated.")
