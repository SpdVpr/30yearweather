
import os
import json
import time
import requests
import random
from dotenv import load_dotenv
import datetime

# Setup
base_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(base_dir, '.env'))

RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
RAPIDAPI_HOST = "aerodatabox.p.rapidapi.com"
raw_seasonal_dir = os.path.join(base_dir, 'backend', 'data', 'raw_flights_seasonal')

try:
    from backend.airport_codes import AIRPORT_CODES
    from backend.config import LOCATIONS
except ImportError:
    import sys
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from airport_codes import AIRPORT_CODES
    from config import LOCATIONS

def get_session():
    s = requests.Session()
    s.headers.update({
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    })
    return s

def fetch_daily_flights(session, icao, date_str):
    total_flights = 0
    windows = [
        (f"{date_str}T00:00", f"{date_str}T11:59"),
        (f"{date_str}T12:00", f"{date_str}T23:59")
    ]
    for start, end in windows:
        url = f"https://aerodatabox.p.rapidapi.com/flights/airports/icao/{icao}/{start}/{end}"
        params = {"withLeg": "false", "direction": "Arrival", "withCancelled": "false", "withCodeshared": "true"}
        for attempt in range(3):
            try:
                resp = session.get(url, params=params, timeout=15)
                if resp.status_code == 200:
                    data = resp.json()
                    total_flights += len(data.get('arrivals', []))
                    break
                elif resp.status_code == 429:
                    time.sleep(2 + attempt)
                    continue
                else:
                    break
            except:
                time.sleep(1)
        time.sleep(0.5)
    return total_flights

def main():
    print("🚀 Starting SEASONAL REPAIR (Filling Jan-May with 2026 data)...")
    if not RAPIDAPI_KEY: return

    session = get_session()
    
    # We want to check all downloaded files
    for filename in os.listdir(raw_seasonal_dir):
        if not filename.endswith("_seasonal.json"): continue
        
        filepath = os.path.join(raw_seasonal_dir, filename)
        slug = filename.replace("_seasonal.json", "")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        monthly_arrivals = data.get('monthly_arrivals', {})
        icao = data.get('icao')
        
        # Check if we have zeros in first 5 months
        needs_repair = False
        repaired_months = []
        
        # We check months 1 to 5. If 0, we try to fetch 2026.
        for m in range(1, 6):
            month_key = str(m) # JSON keys are strings
            if month_key not in monthly_arrivals:
                # Try int key
                month_key = m
            
            # Count check
            count = monthly_arrivals.get(str(m)) or monthly_arrivals.get(m, 0)
            
            if count == 0:
                # Try to fetch for 2026
                date_str = f"2026-{m:02d}-15"
                print(f"   🔧 Repairing {slug} Month {m} using {date_str}...", end="", flush=True)
                
                new_count = fetch_daily_flights(session, icao, date_str)
                
                if new_count > 0:
                    monthly_arrivals[str(m)] = new_count
                    print(f" ✅ Found {new_count}")
                    needs_repair = True
                    repaired_months.append(m)
                else:
                    print(f" ❌ Still 0")
                    time.sleep(1)
        
        if needs_repair:
            data['monthly_arrivals'] = monthly_arrivals
            data['repaired'] = True
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"   💾 Saved updates for {slug}")
        else:
            # print(f"   ok {slug}")
            pass

    print("🎉 Repair Complete!")

if __name__ == "__main__":
    main()
