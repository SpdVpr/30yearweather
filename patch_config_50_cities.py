"""
Patch script to add 50 new cities to backend/config.py and backend/airport_codes.py
"""

import os
import re
import shutil
from datetime import datetime

# Import the new cities data
from add_50_new_cities import NEW_CITIES, AIRPORT_CODES_NEW

def patch_config():
    """Add new cities to config.py LOCATIONS dict"""
    config_path = os.path.join(os.getcwd(), 'backend', 'config.py')
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = config_path.replace('.py', f'_backup_{timestamp}.py')
    shutil.copy2(config_path, backup_path)
    print(f"✅ Created backup: {backup_path}")
    
    with open(config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the end of LOCATIONS dict
    # Look for pattern: LOCATIONS = { ... }
    # We'll find the last closing } that corresponds to LOCATIONS
    
    # Count how many cities are already there
    existing_slugs = re.findall(r"'([a-z\-]+)':\s*\{", content)
    print(f"ℹ️  Found {len(existing_slugs)} existing cities in config.py")
    
    # Generate new cities code
    new_cities_code = "\n    # ========== NEW CITIES (50) - Added " + datetime.now().strftime("%Y-%m-%d") + " ==========\n"
    
    for slug, city_config in NEW_CITIES.items():
        if slug not in existing_slugs:
            new_cities_code += f"    '{slug}': {{\n"
            new_cities_code += f'        "name": "{city_config["name"]}",\n'
            new_cities_code += f'        "country": "{city_config["country"]}",\n'
            new_cities_code += f'        "lat": {city_config["lat"]},\n'
            new_cities_code += f'        "lon": {city_config["lon"]},\n'
            new_cities_code += f'        "is_coastal": {city_config["is_coastal"]},\n'
            new_cities_code += f'        "timezone": "{city_config["timezone"]}",\n'
            new_cities_code += f'        "desc": "{city_config["desc"]}"\n'
            new_cities_code += f"    }},\n"
        else:
            print(f"   ⏭️  Skipping {slug} - already exists")
    
    # Find the position to insert - before the closing }
    # Look for "LOCATIONS = {" and find its matching }
    match = re.search(r'LOCATIONS\s*=\s*\{', content)
    if not match:
        print("❌ Could not find LOCATIONS in config.py!")
        return False
    
    # Find the last entry in LOCATIONS dict and insert after it
    # Strategy: Find the last "}," pattern before the end of LOCATIONS
    
    # We'll insert before the final closing }
    # Count braces to find the right position
    start_pos = match.end()
    brace_count = 1
    insert_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start=start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                insert_pos = i
                break
    
    # Insert new cities before the closing }
    new_content = content[:insert_pos] + new_cities_code + content[insert_pos:]
    
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Added new cities to config.py")
    return True

def patch_airport_codes():
    """Add new airport codes to airport_codes.py"""
    airport_path = os.path.join(os.getcwd(), 'backend', 'airport_codes.py')
    
    # Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = airport_path.replace('.py', f'_backup_{timestamp}.py')
    shutil.copy2(airport_path, backup_path)
    print(f"✅ Created backup: {backup_path}")
    
    with open(airport_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get existing codes
    existing_slugs = re.findall(r"'([a-z\-]+)':\s*'", content)
    print(f"ℹ️  Found {len(existing_slugs)} existing airport codes")
    
    # Generate new codes
    new_codes = "\n    # ========== NEW AIRPORT CODES (50) - Added " + datetime.now().strftime("%Y-%m-%d") + " ==========\n"
    
    for slug, icao in AIRPORT_CODES_NEW.items():
        if slug not in existing_slugs:
            new_codes += f"    '{slug}': '{icao}',\n"
        else:
            print(f"   ⏭️  Skipping {slug} - already exists")
    
    # Find AIRPORT_CODES dict and insert before closing }
    match = re.search(r'AIRPORT_CODES\s*=\s*\{', content)
    if not match:
        print("❌ Could not find AIRPORT_CODES in airport_codes.py!")
        return False
    
    start_pos = match.end()
    brace_count = 1
    insert_pos = start_pos
    
    for i, char in enumerate(content[start_pos:], start=start_pos):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                insert_pos = i
                break
    
    new_content = content[:insert_pos] + new_codes + content[insert_pos:]
    
    with open(airport_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Added new airport codes to airport_codes.py")
    return True

def main():
    print("=" * 60)
    print("🚀 PATCHING CONFIG FILES WITH 50 NEW CITIES")
    print("=" * 60)
    
    success1 = patch_config()
    success2 = patch_airport_codes()
    
    if success1 and success2:
        print("\n" + "=" * 60)
        print("✅ ALL PATCHES APPLIED SUCCESSFULLY!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Run: python download_health_cdc.py")
        print("2. Run: python download_seasonal_flights.py") 
        print("3. Run: python backend/etl.py")
        print("4. Run: python backend/etl_tourism.py")
    else:
        print("\n❌ Some patches failed. Check errors above.")

if __name__ == "__main__":
    main()
