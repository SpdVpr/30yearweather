
import os
import json
import re
from timezonefinder import TimezoneFinder

# Explicit paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'backend', 'config.py')
PUBLIC_DATA_DIR = os.path.join(BASE_DIR, 'public', 'data')

# Import config manually or parsing to avoid import errors if env is messy
# Using direct read/write of config file to inject timezones
# And loading LOCATIONS to iterate.

# Let's import LOCATIONS using sys.path hack
import sys
sys.path.append(os.path.join(BASE_DIR, 'backend'))
from config import LOCATIONS

def main():
    print("🌍 Fix Timezones & Update Meta...")
    tf = TimezoneFinder()
    
    updated_count = 0
    config_updates = {} # slug -> timezone

    # 1. Identify missing timezones
    for slug, data in LOCATIONS.items():
        if 'timezone' not in data:
            lat = data['lat']
            lon = data['lon']
            try:
                tz = tf.timezone_at(lng=lon, lat=lat)
                if tz:
                    print(f"   🕒 Found timezone for {slug}: {tz}")
                    config_updates[slug] = tz
                else:
                    print(f"   ⚠️ Could not find timezone for {slug}")
            except Exception as e:
                print(f"   ❌ Error finding timezone for {slug}: {e}")

    if not config_updates:
        print("✅ No missing timezones found!")
        return

    # 2. Update config.py (Text processing to preserve structure)
    print("💾 Updating backend/config.py...")
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_lines = []
    lines = content.splitlines()
    for line in lines:
        stripped = line.strip()
        # Check if this line defines a city dict start: 'slug': {
        match = re.search(r"^'([\w-]+)':\s*\{(.*)\},?", stripped)
        if match:
            slug = match.group(1)
            if slug in config_updates:
                if "'timezone'" not in line and '"timezone"' not in line:
                    # Inject timezone at the end of the dict
                    tz = config_updates[slug]
                    # Find last closing brace
                    last_brace = line.rfind('}')
                    if last_brace != -1:
                        prefix = line[:last_brace]
                        suffix = line[last_brace:]
                        # Add timezone. Note: simplistic injection, assumes oneline or clean structure
                        new_line = f"{prefix}, 'timezone': '{tz}'{suffix}"
                        new_lines.append(new_line)
                        continue
        new_lines.append(line)
        
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        f.write("\n".join(new_lines))
    print("✅ Config updated.")

    # 3. Update existing JSON files in public/data
    print("📂 Updating public/data JSON files...")
    for slug, tz in config_updates.items():
        json_path = os.path.join(PUBLIC_DATA_DIR, f"{slug}.json")
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Update meta
                if 'meta' not in data: data['meta'] = {}
                data['meta']['timezone'] = tz
                
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"   ✅ Updated {slug}.json")
                updated_count += 1
            except Exception as e:
                print(f"   ❌ Failed to update JSON for {slug}: {e}")
        else:
             print(f"   ⚠️ JSON for {slug} not found (ETL not run yet?)")

    print(f"\n🎉 Finished! Updated {updated_count} cities.")

if __name__ == "__main__":
    main()
