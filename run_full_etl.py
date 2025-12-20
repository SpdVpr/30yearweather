
import sys
import os
import importlib

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from backend import config
from backend import etl

def run_full_etl():
    print("🚀 STARTING FULL ETL REGENERATION (ALL CITIES)")
    print("This will update Weather, Marine, Flights, and Health data for all locations.")
    
    # We DO NOT filter locations.
    print(f"📍 Processing ALL {len(config.LOCATIONS)} cities...")
    
    try:
        etl.main()
    except Exception as e:
        print(f"❌ Error in ETL: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    run_full_etl()
