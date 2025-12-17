
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
from backend import etl

RAW_MARINE_DIR = os.path.join('backend', 'data', 'raw_marine')

def check_marine_data():
    print("🌊 MARINE DATA AUDIT")
    print("====================")
    
    # 1. Identify Coastal Cities
    coastal_cities = {slug: data for slug, data in config.LOCATIONS.items() if data.get('is_coastal')}
    print(f"ℹ️  Coastal cities in config: {len(coastal_cities)}")
    
    # 2. Check files
    if not os.path.exists(RAW_MARINE_DIR):
        os.makedirs(RAW_MARINE_DIR)
        
    missing_marine = []
    
    for slug in coastal_cities.keys():
        path = os.path.join(RAW_MARINE_DIR, f"{slug}_marine.json")
        if not os.path.exists(path):
            missing_marine.append(slug)
    
    if not missing_marine:
        print("✅ SUPER! All coastal cities have marine data.")
        return

    print(f"⚠️  Detailed Audit - Missing Marine Data: {len(missing_marine)}")
    for s in missing_marine:
        print(f"   ❌ {s}")
        
    # 3. FIX: Run ETL for missing cities
    print(f"\n🚀 Running Priority Fix for {len(missing_marine)} cities...")
    
    # Filter config
    filtered_locations = {k: v for k, v in config.LOCATIONS.items() if k in missing_marine}
    config.LOCATIONS = filtered_locations
    if hasattr(etl, 'LOCATIONS'): etl.LOCATIONS = filtered_locations
    if hasattr(etl, 'config'): etl.config.LOCATIONS = filtered_locations
    
    # Force regeneration by deleting invalid outputs
    count_deleted = 0
    for slug in missing_marine:
        final_json = os.path.join('public', 'data', f'{slug}.json')
        if os.path.exists(final_json):
            os.remove(final_json)
            count_deleted += 1
            
    if count_deleted > 0:
        print(f"   🗑️  Deleted {count_deleted} incomplete output files to ensure Marine data is merged.")
    
    try:
        etl.main()
        print("\n✅ Marine Fix Complete.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_marine_data()
