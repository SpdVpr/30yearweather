
import sys
import os
import importlib

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
# Import etl module normally
from backend import etl

# List of new resort cities to prioritize
NEW_CITIES = [
    'cancun-mx', 'punta-cana-do', 'nassau-bs', 'san-juan-pr', 'montego-bay-jm',
    'palma-mallorca-es', 'nice-fr', 'dubrovnik-hr', 'santorini-gr', 'las-palmas-es',
    'reykjavik-is', 'queenstown-nz', 'innsbruck-at', 'interlaken-ch', 'whistler-ca',
    'bora-bora-pf', 'male-mv', 'ras-al-khaimah-ae', 'zanzibar-tz', 'cartagena-co'
]

def run_priority_etl():
    print("🚀 STARTING PRIORITY ETL V2 (Force New Cities)")
    
    # 1. Update config module
    original_locations = config.LOCATIONS.copy()
    filtered_locations = {k: v for k, v in original_locations.items() if k in NEW_CITIES}
    
    config.LOCATIONS = filtered_locations
    
    # 2. Update etl module if it imported LOCATIONS locally
    if hasattr(etl, 'LOCATIONS'):
        etl.LOCATIONS = filtered_locations
        print("✅ Patched etl.LOCATIONS")
        
    # 3. Just to be safe, patch config inside etl if it imported config
    if hasattr(etl, 'config'):
        etl.config.LOCATIONS = filtered_locations
        print("✅ Patched etl.config.LOCATIONS")

    print(f"📍 Processing ONLY {len(config.LOCATIONS)} new cities...")
    
    try:
        etl.main()
    except Exception as e:
        print(f"❌ Error in ETL: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_priority_etl()
