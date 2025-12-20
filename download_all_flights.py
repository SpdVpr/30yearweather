
import os
import json
import time
import datetime
from dotenv import load_dotenv

# Setup environment
base_dir = os.path.dirname(os.path.abspath(__file__))
# Correctly point to root .env
load_dotenv(os.path.join(base_dir, '.env'))
# Also try parent dir just in case
load_dotenv(os.path.join(os.path.dirname(base_dir), '.env'))

# Create data directory
raw_flights_dir = os.path.join(base_dir, 'backend', 'data', 'raw_flights')
os.makedirs(raw_flights_dir, exist_ok=True)

# Imports
try:
    from backend.config import LOCATIONS
except ImportError:
    # If running from root, add backend to path
    import sys
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from config import LOCATIONS

try:
    from backend.airport_codes import AIRPORT_CODES
    from backend.flights_commercial import fetch_flights_aerodatabox, analyze_flights_commercial
except ImportError:
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from airport_codes import AIRPORT_CODES
    from flights_commercial import fetch_flights_aerodatabox, analyze_flights_commercial

def main():
    print("🚀 Starting Batch Download of Flight Data...")
    
    # Check API Key
    if not os.getenv('RAPIDAPI_KEY'):
        print("❌ ERROR: RAPIDAPI_KEY not found in environment.")
        return

    today = datetime.datetime.now()
    
    # Estimate cost
    total_cities = len(LOCATIONS)
    # Filter cities that have airport codes
    cities_with_airports = [slug for slug in LOCATIONS.keys() if slug in AIRPORT_CODES]
    print(f"ℹ️  Found {len(cities_with_airports)} cities with mapped airports out of {total_cities}.")
    
    estimated_calls = len(cities_with_airports) * 2
    print(f"⚠️  Estimated API calls: {estimated_calls}. Limit is usually ~200/month for Free tier.")
    
    print("Continue? (y/n)")
    # For automation, we assume yes if running this script explicitly
    # But usually good to wait. We will proceed.
    
    successful = 0
    skipped = 0
    failed = 0
    
    for slug in cities_with_airports:
        icao = AIRPORT_CODES[slug]
        filename = f"{slug}_flights.json"
        filepath = os.path.join(raw_flights_dir, filename)
        
        if os.path.exists(filepath):
            print(f"⏭️  Skipping {slug} ({icao}) - Already downloaded.")
            skipped += 1
            continue
            
        print(f"📥 Fetching flights for {slug} ({icao})...")
        
        try:
            flights = fetch_flights_aerodatabox(icao, today)
            
            if flights is not None:
                # Analyze immediately
                stats = analyze_flights_commercial(flights)
                
                # Save raw struct (stats + list length? raw huge list might be big)
                # Let's save the stats AND the raw count/metadata, but maybe not 100kb of flight objects per city if we want to save space?
                # Actually, raw data is better for future.
                
                output_data = {
                    "date": today.strftime("%Y-%m-%d"),
                    "icao": icao,
                    "stats": stats,
                    "raw_flights_count": len(flights),
                    # "raw_data": flights # Uncomment if you want full huge dumps
                }
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(output_data, f, indent=2)
                
                print(f"   ✅ Saved {len(flights)} flights. Morning: {stats['morning_flights']}, Evening: {stats['evening_flights']}")
                successful += 1
            else:
                print(f"   ⚠️  No flights returned or error for {slug}")
                failed += 1
                
            # Be nice to API limits
            time.sleep(1)
            
        except Exception as e:
            print(f"   ❌ Critical error for {slug}: {e}")
            failed += 1

    print("-" * 30)
    print(f"🎉 Done! Success: {successful}, Skipped: {skipped}, Failed: {failed}")

if __name__ == "__main__":
    main()
