"""
Batch converter: PNG → WebP for all hero images
Optimizes file size while maintaining quality
"""

from PIL import Image
import os
from pathlib import Path

def convert_png_to_webp(input_dir="public/images", quality=80):
    """Convert all PNG hero images to WebP format"""
    
    input_path = Path(input_dir)
    
    # Find all hero PNG images
    png_files = list(input_path.glob("*-hero.png"))
    
    if not png_files:
        print("❌ No PNG hero images found")
        return
    
    print(f"Found {len(png_files)} PNG hero images")
    print("=" * 60)
    
    total_saved = 0
    converted_count = 0
    
    for png_file in png_files:
        # Skip if WebP already exists
        webp_file = png_file.with_suffix('.webp')
        
        if webp_file.exists():
            # print(f"⏩ Skipping {png_file.name} (WebP already exists)")
            continue
        
        try:
            with Image.open(png_file) as img:
                # Convert RGBA to RGB if necessary
                if img.mode == 'RGBA':
                    # Create white background
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if too large (optimize for web)
                max_width = 1920
                if img.width > max_width:
                    ratio = max_width / img.width
                    new_height = int(img.height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                
                # Save as WebP
                img.save(webp_file, "WEBP", quality=quality, method=6)
            
            # Calculate size reduction
            original_size_kb = png_file.stat().st_size / 1024
            new_size_kb = webp_file.stat().st_size / 1024
            saved_kb = original_size_kb - new_size_kb
            reduction_pct = (saved_kb / original_size_kb) * 100
            
            total_saved += saved_kb
            converted_count += 1
            
            print(f"✅ {png_file.name}")
            print(f"   {original_size_kb:.0f} KB → {new_size_kb:.0f} KB (-{reduction_pct:.1f}%)")
            
        except Exception as e:
            print(f"❌ Error converting {png_file.name}: {e}")
    
    print("=" * 60)
    print(f"✅ Converted: {converted_count}/{len(png_files)} images")
    print(f"💾 Total saved: {total_saved/1024:.2f} MB")
    print(f"📊 Average reduction: {(total_saved/(converted_count*1024))*100:.1f}%")
    
    # Suggest next steps
    print("\n📋 NEXT STEPS:")
    print("1. Update CityHero.tsx to use .webp for all cities")
    print("2. Test images load correctly")
    print("3. (Optional) Delete original .png files to save space")

if __name__ == "__main__":
    print("=" * 60)
    print("🎨 HERO IMAGE OPTIMIZER - PNG → WebP")
    print("=" * 60)
    print()
    
    convert_png_to_webp()
