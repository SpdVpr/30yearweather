
import os
import sys
import re

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from backend import config

# Directories to process
DIRS_TO_RENAME = [
    os.path.join('backend', 'data', 'raw_weather'),
    os.path.join('backend', 'data', 'raw_marine'),
    os.path.join('backend', 'data', 'tourism'),
    os.path.join('public', 'data')
]

# Source file paths
CONFIG_PATH = os.path.join('backend', 'config.py')
DATA_TS_PATH = os.path.join('src', 'lib', 'data.ts')

def clean_slug(old_slug):
    """
    Removes the country code suffix.
    bali-id -> bali
    new-york-us -> new-york
    rio-de-janeiro-br -> rio-de-janeiro
    """
    # Split by dashes
    parts = old_slug.split('-')
    
    # Heuristic: If the last part is 2 letters, drop it.
    # Exception check: Is there any city name ending with 2 letter word effectively?
    # 'ras-al-khaimah-ae' -> 'ae' is country.
    # 'la-paz-bo' -> 'bo' is country.
    if len(parts) > 1 and len(parts[-1]) == 2:
        return "-".join(parts[:-1])
    
    return old_slug

def migrate():
    print("🚀 STARTING BIG SLUG MIGRATION...")
    
    # 1. Generate Mapping
    mapping = {}
    for old_slug in config.LOCATIONS.keys():
        new_slug = clean_slug(old_slug)
        if new_slug != old_slug:
            mapping[old_slug] = new_slug
    
    print(f"📋 Identified {len(mapping)} slugs to clean.")
    
    # 2. Rename Files in Directories
    print("\n📂 Renaming data files...")
    renamed_count = 0
    for folder in DIRS_TO_RENAME:
        if not os.path.exists(folder):
            continue
            
        files = os.listdir(folder)
        for filename in files:
            # Check if filename starts with an old slug
            # e.g. bali-id.json or bali-id_raw.json or bali-id_marine.json
            
            for old_slug, new_slug in mapping.items():
                if filename.startswith(old_slug):
                    # Be careful not to match substrings incorrectly (e.g. 'york' inside 'new-york')
                    # But since we iterate config keys, 'new-york-us' is specific.
                    
                    # We need to verify it's the slug part.
                    # Filename formats: {slug}.json, {slug}_raw.json, {slug}_marine.json, {slug}_tourism.json
                    
                    # Regex matching to ensure we replace only the slug prefix
                    if filename == f"{old_slug}.json" or filename.startswith(f"{old_slug}_"):
                        new_filename = filename.replace(old_slug, new_slug, 1)
                        src = os.path.join(folder, filename)
                        dst = os.path.join(folder, new_filename)
                        
                        try:
                            # If dst exists, remove it (overwrite logic)
                            if os.path.exists(dst):
                                os.remove(dst)
                            os.rename(src, dst)
                            renamed_count += 1
                        except Exception as e:
                            print(f"❌ Error renaming {filename}: {e}")
                        break # Found match, move to next file

    print(f"✅ Renamed {renamed_count} files across all data folders.")

    # 3. Update config.py
    print("\n🐍 Updating backend/config.py keys...")
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        config_content = f.read()
    
    # Perform string replacements for keys
    # We must be careful not to replace values like timezone names or URLs if they contain the slug.
    # LOCATIONS keys are usually quoted: 'bali-id':
    
    for old_slug, new_slug in mapping.items():
        # Replace key definition: 'bali-id':
        config_content = config_content.replace(f"'{old_slug}':", f"'{new_slug}':")
        config_content = config_content.replace(f'"{old_slug}":', f'"{new_slug}":')
    
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        f.write(config_content)
    print("✅ config.py updated.")

    # 4. Update src/lib/data.ts return array
    print("\n📜 Updating src/lib/data.ts...")
    if os.path.exists(DATA_TS_PATH):
        with open(DATA_TS_PATH, 'r', encoding='utf-8') as f:
            ts_content = f.read()
            
        for old_slug, new_slug in mapping.items():
            # In TS file strings are usually single quotes 'bali-id'
            ts_content = ts_content.replace(f"'{old_slug}'", f"'{new_slug}'")
            ts_content = ts_content.replace(f'"{old_slug}"', f'"{new_slug}"')
            
        with open(DATA_TS_PATH, 'w', encoding='utf-8') as f:
            f.write(ts_content)
        print("✅ src/lib/data.ts updated.")
    else:
        print("⚠️ src/lib/data.ts not found.")
        
    # 5. Update src/app/page.tsx (Homepage categories often have hardcoded slugs)
    PAGE_TSX_PATH = os.path.join('src', 'app', 'page.tsx')
    print("\n🏠 Updating src/app/page.tsx (Homepage slugs)...")
    if os.path.exists(PAGE_TSX_PATH):
        with open(PAGE_TSX_PATH, 'r', encoding='utf-8') as f:
            page_content = f.read()
            
        for old_slug, new_slug in mapping.items():
             page_content = page_content.replace(f"'{old_slug}'", f"'{new_slug}'")
             page_content = page_content.replace(f'"{old_slug}"', f'"{new_slug}"')

        with open(PAGE_TSX_PATH, 'w', encoding='utf-8') as f:
            f.write(page_content)
        print("✅ src/app/page.tsx updated.")

    print("\n🎉 MIGRATION COMPLETE! Restart your dev server.")

if __name__ == "__main__":
    migrate()
