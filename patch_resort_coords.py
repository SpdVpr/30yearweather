
import os

CONFIG_PATH = os.path.join('backend', 'config.py')

def patch_resorts():
    print(f"Reading {CONFIG_PATH}...")
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!")
        return
    
    replacements = [
        # Phuket: City -> Patong Beach (West Coast, tourist hub)
        ("'lat': 7.8804, 'lon': 98.3923", "'lat': 7.8960, 'lon': 98.2950"),
        # Las Palmas: North City -> Maspalomas (South, sunny tourist hub)
        ("'lat': 28.1248, 'lon': -15.43", "'lat': 27.7606, 'lon': -15.5860")
    ]
    
    updated = False
    for old_str, new_str in replacements:
        if old_str in content:
            content = content.replace(old_str, new_str)
            print(f"✅ Replaced coords: {old_str} -> {new_str}")
            updated = True
        else:
            print(f"⚠️ Could not find exact string: {old_str}")
            # Try looser match for Las Palmas (maybe float formatting differs)
            if "28.1248" in old_str and "28.1248" in content:
                 # Regex fallback?
                 import re
                 if "phuket" in old_str.lower():
                     content = re.sub(r"'lat':\s*7\.8804,\s*'lon':\s*98\.3923", "'lat': 7.8960, 'lon': 98.2950", content)
                     print("✅ Replaced Phuket via Regex")
                     updated = True
                 elif "las-palmas" in old_str.lower():
                     content = re.sub(r"'lat':\s*28\.1248,\s*'lon':\s*-15\.43", "'lat': 27.7606, 'lon': -15.5860", content)
                     print("✅ Replaced Las Palmas via Regex")
                     updated = True

    if updated:
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print("💾 Config saved.")
    else:
        print("No changes made.")

if __name__ == "__main__":
    patch_resorts()
