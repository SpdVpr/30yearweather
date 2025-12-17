
import sys
import os
import importlib

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
from backend import etl_tourism

# List of new resort cities to prioritize
NEW_CITIES = [
    'cancun-mx', 'punta-cana-do', 'nassau-bs', 'san-juan-pr', 'montego-bay-jm',
    'palma-mallorca-es', 'nice-fr', 'dubrovnik-hr', 'santorini-gr', 'las-palmas-es',
    'reykjavik-is', 'queenstown-nz', 'innsbruck-at', 'interlaken-ch', 'whistler-ca',
    'bora-bora-pf', 'male-mv', 'ras-al-khaimah-ae', 'zanzibar-tz', 'cartagena-co'
]

def run_priority_tourism():
    print("🚀 STARTING PRIORITY TOURISM ETL (New Cities Only)")
    
    # Filter LOCATIONS
    filtered_locations = {k: v for k, v in config.LOCATIONS.items() if k in NEW_CITIES}
    
    # Patch config module
    config.LOCATIONS = filtered_locations
    
    # Patch etl_tourism module references
    if hasattr(etl_tourism, 'LOCATIONS'):
        etl_tourism.LOCATIONS = filtered_locations
        
    if hasattr(etl_tourism, 'config'):
        etl_tourism.config.LOCATIONS = filtered_locations

    print(f"📍 Processing {len(filtered_locations)} cities...")
    
    try:
        etl_tourism.main()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_priority_tourism()
