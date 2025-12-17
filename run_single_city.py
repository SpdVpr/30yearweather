
import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
import backend.etl as etl

# Target city
TARGET_CITY = 'bali'

if TARGET_CITY in config.LOCATIONS:
    print(f"🎯 Targeting specific city: {TARGET_CITY}")
    # CRITICAL: We must patch the LOCATIONS variable inside the 'etl' module itself,
    # because 'from backend.config import LOCATIONS' created a local reference in etl.py
    etl.LOCATIONS = {TARGET_CITY: config.LOCATIONS[TARGET_CITY]}
else:
    print(f"⚠️ City '{TARGET_CITY}' not found in config keys!")
    sys.exit(1)

if __name__ == "__main__":
    # Force delete the output file to ensure run
    output_path = os.path.join('public', 'data', f'{TARGET_CITY}.json')
    if os.path.exists(output_path):
        print(f"🗑️ Deleting existing {output_path} to force re-calculation...")
        os.remove(output_path)
    
    print("🚀 Starting ETL for single city...")
    etl.main()
