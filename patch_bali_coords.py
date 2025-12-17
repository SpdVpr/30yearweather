
import os

CONFIG_PATH = os.path.join('backend', 'config.py')

def patch_balicoords():
    print(f"Reading {CONFIG_PATH}...")
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!")
        return

    # Old coordinates (Mengwi/Inland)
    old_str = "'lat': -8.4095, 'lon': 115.1889"
    # New coordinates (Kuta Beach - Coastal/Dry)
    new_str = "'lat': -8.7185, 'lon': 115.1686"
    
    if old_str in content:
        new_content = content.replace(old_str, new_str)
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Bali Coordinates updated to Kuta Beach (Coastal)!")
    else:
        print(f"⚠️ Could not find exact string: {old_str}")
        print("Maybe formatting differs? Trying regex/looser match...")
        # Check if numbers are there separately
        if "-8.4095" in content and "115.1889" in content:
             content = content.replace("-8.4095", "-8.7185")
             content = content.replace("115.1889", "115.1686")
             with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
                 f.write(content)
             print("✅ Coordinates updated via values replacement.")

if __name__ == "__main__":
    patch_balicoords()
