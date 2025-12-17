
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
from backend import etl

# List of new resort cities to prioritize
NEW_CITIES = [
    'cancun-mx', 'punta-cana-do', 'nassau-bs', 'san-juan-pr', 'montego-bay-jm',
    'palma-mallorca-es', 'nice-fr', 'dubrovnik-hr', 'santorini-gr', 'las-palmas-es',
    'reykjavik-is', 'queenstown-nz', 'innsbruck-at', 'interlaken-ch', 'whistler-ca',
    'bora-bora-pf', 'male-mv', 'ras-al-khaimah-ae', 'zanzibar-tz', 'cartagena-co'
]

def run_priority_etl():
    print("🚀 STARTING PRIORITY ETL (New Resort Cities Only)")
    
    # Filter LOCATIONS in config module (monkey patch)
    original_locations = config.LOCATIONS
    config.LOCATIONS = {k: v for k, v in original_locations.items() if k in NEW_CITIES}
    
    print(f"📍 Processing {len(config.LOCATIONS)} new cities...")
    
    # Run ETL main function
    # Check if etl.main accepts arguments or just runs
    # Assuming etl.py has a main() function or block
    
    try:
        etl.main()
    except Exception as e:
        print(f"❌ Error in ETL: {e}")
        # Print detailed traceback if possible?
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_priority_etl()
