
import os
import sys

# Logic used in previous migration
def clean_slug(old_slug):
    parts = old_slug.split('-')
    # Heuristic: If last part is 2 letters (country code), remove it.
    if len(parts) > 1 and len(parts[-1]) == 2:
        return "-".join(parts[:-1])
    return old_slug

IMAGES_DIR = os.path.join('public', 'images')

def migrate_images():
    print(f"📂 Scanning {IMAGES_DIR} for images to rename...")
    if not os.path.exists(IMAGES_DIR):
        print("❌ Images directory not found!")
        return

    count = 0
    skips = 0
    
    for filename in os.listdir(IMAGES_DIR):
        if not filename.endswith(('.png', '.webp', '.jpg', '.jpeg')):
            continue
            
        # Expected format: {slug}-hero.{ext}
        if "-hero" not in filename:
            continue
            
        # Extract base slug (everything before -hero)
        # e.g. "sydney-au-hero.webp" -> "sydney-au"
        base_slug = filename.rsplit("-hero", 1)[0]
        
        new_slug = clean_slug(base_slug)
        
        if new_slug != base_slug:
            new_filename = filename.replace(base_slug, new_slug, 1) # Replace first occurrence
            
            src = os.path.join(IMAGES_DIR, filename)
            dst = os.path.join(IMAGES_DIR, new_filename)
            
            # Safety check: Prevent renaming 'new-york-us' if 'new-york' logic fails?
            # 'new-york' -> 'new' (wrong)
            # clean_slug('new-york') -> 'new-york' (correct)
            # clean_slug('new-york-us') -> 'new-york' (correct)
            
            print(f"🔄 Renaming: {filename} -> {new_filename}")
            
            try:
                if os.path.exists(dst):
                    # Destination exists. Maybe we ran this partially? Or collision?
                    # If we have sydney.webp (old) and sydney-au.webp (new to be renamed to sydney.webp)
                    # We should overwrite.
                    os.remove(dst)
                    
                os.rename(src, dst)
                count += 1
            except Exception as e:
                print(f"❌ Error renaming {filename}: {e}")
        else:
            skips += 1

    print(f"✅ Migration Complete. Renamed {count} images. Skipped {skips} (already clean or no match).")

if __name__ == "__main__":
    migrate_images()
