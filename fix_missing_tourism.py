
import os
import sys
import importlib

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
from backend import etl_tourism

RAW_WEATHER_DIR = os.path.join('backend', 'data', 'raw_weather')
TOURISM_DIR = os.path.join('backend', 'data', 'tourism')

def get_slug_from_filename(filename):
    # cancun-mx_raw.json -> cancun-mx
    return filename.replace('_raw.json', '')

def sync_tourism_data():
    print("🔍 AUDIT: Checking for mismatch between Weather and Tourism data...")

    # 1. Get all cities that have weather data (Source of Truth)
    if not os.path.exists(RAW_WEATHER_DIR):
        print("❌ Raw weather directory not found!")
        return

    weather_files = [f for f in os.listdir(RAW_WEATHER_DIR) if f.endswith('_raw.json')]
    weather_slugs = set(get_slug_from_filename(f) for f in weather_files)
    
    print(f"✅ Found {len(weather_slugs)} cities with cached weather data.")

    # 2. Check which ones are missing tourism data
    missing_slugs = []
    
    # Ensure tourism dir exists
    if not os.path.exists(TOURISM_DIR):
        os.makedirs(TOURISM_DIR)

    for slug in weather_slugs:
        tourism_path = os.path.join(TOURISM_DIR, f"{slug}_tourism.json")
        if not os.path.exists(tourism_path):
            missing_slugs.append(slug)

    if not missing_slugs:
        print("✅ GREAT NEWS: All weather cities have corresponding tourism data! No action needed.")
        return

    print(f"⚠️  Files missing in /tourism: {len(missing_slugs)}")
    for s in missing_slugs:
        print(f"   ❌ {s}")

    # 3. Filter valid locations from config
    # We can only process cities that are defined in config (need metadata)
    valid_to_process = []
    for slug in missing_slugs:
        if slug in config.LOCATIONS:
            valid_to_process.append(slug)
        else:
            print(f"⚠️  Skipping {slug} because it is NOT in config.py (orphan file?)")

    if not valid_to_process:
        print("No valid cities to process.")
        return

    # 4. Patch and Run Tourism ETL
    print(f"\n🚀 Starting Tourism ETL for {len(valid_to_process)} missing cities...")
    
    # Patch config to process ONLY missing cities
    filtered_locations = {k: v for k, v in config.LOCATIONS.items() if k in valid_to_process}
    
    # Apply patch to modules
    config.LOCATIONS = filtered_locations
    if hasattr(etl_tourism, 'LOCATIONS'): etl_tourism.LOCATIONS = filtered_locations
    if hasattr(etl_tourism, 'config'): etl_tourism.config.LOCATIONS = filtered_locations

    # Execute
    try:
        etl_tourism.main()
        print("\n✅ Synchronization complete.")
    except Exception as e:
        print(f"\n❌ Error during execution: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    sync_tourism_data()
