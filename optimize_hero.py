
from PIL import Image
import os

input_path = r"d:\historical-weather\public\images\hero1.jpeg"
output_path = r"d:\historical-weather\public\images\hero1-optimized.webp"

try:
    with Image.open(input_path) as img:
        # Resize if width > 1920
        if img.width > 1920:
            ratio = 1920 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((1920, new_height), Image.Resampling.LANCZOS)
            print(f"Resized to {1920}x{new_height}")

        # Save as optimized WebP
        img.save(output_path, "WEBP", quality=75, optimize=True)
        
    print(f"✅ Successfully optimized image to: {output_path}")
    
    # Check size reduction
    original_size = os.path.getsize(input_path) / 1024 / 1024
    new_size = os.path.getsize(output_path) / 1024 / 1024
    print(f"📉 Size reduced from {original_size:.2f} MB to {new_size:.2f} MB")

except Exception as e:
    print(f"❌ Error optimizing image: {e}")
