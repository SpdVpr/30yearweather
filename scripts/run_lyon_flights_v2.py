import requests
import json
import datetime
import os
import time
import random

# CONFIG
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('RAPIDAPI_KEY')
HOST = "aerodatabox.p.rapidapi.com"
TARGET_SLUG = "lyon-fr"
TARGET_ICAO = "LFLL"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "backend", "data", "raw_flights_seasonal")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, f"{TARGET_SLUG}_seasonal.json")

def get_session():
    s = requests.Session()
    s.headers.update({
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": HOST
    })
    return s

def fetch_flights_for_date(session, date_str):
    total_flights = 0
    # Split day into 2 windows to respect response limits and cover full day
    windows = [
        (f"{date_str}T00:00", f"{date_str}T11:59"),
        (f"{date_str}T12:00", f"{date_str}T23:59")
    ]
    
    for start, end in windows:
        url = f"https://aerodatabox.p.rapidapi.com/flights/airports/icao/{TARGET_ICAO}/{start}/{end}"
        params = {
            "withLeg": "true",
            "direction": "Arrival",
            "withCancelled": "false",
            "withCodeshared": "true" 
        }
        
        for attempt in range(3):
            try:
                resp = session.get(url, params=params, timeout=15)
                if resp.status_code == 200:
                    data = resp.json()
                    count = len(data.get('arrivals', []))
                    total_flights += count
                    # print(f".", end="", flush=True)
                    break 
                elif resp.status_code == 429:
                    print("x", end="", flush=True)
                    time.sleep(2)
                    continue
                else:
                    print(f"E{resp.status_code}", end="", flush=True)
                    break
            except Exception as e:
                print(f"!", end="", flush=True)
                time.sleep(1)
        
        time.sleep(0.5)
        
    return total_flights

def main():
    print(f"🚀 Starting Standalone Flight Fetch for {TARGET_SLUG} ({TARGET_ICAO})")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    session = get_session()
    
    # 1. Calculate Target Dates
    # Prefer recent past (last 6 months) -> current year
    # Fallback to near future -> next year
    current_date = datetime.datetime.now()
    current_year = current_date.year
    
    selected_dates = {} # month_int -> "YYYY-MM-DD"
    
    print("   📅 Calculating optimized dates...")
    for month in range(1, 13):
        # Candidate 1: This Year (e.g. 2025-01-15)
        d_this = datetime.datetime(current_year, month, 15)
        delta_this = (d_this - current_date).days
        
        # Candidate 2: Next Year (e.g. 2026-01-15)
        d_next = datetime.datetime(current_year + 1, month, 15)
        
        # Check if 'this year' is reachable in history (approx -210 days limit)
        # We give a buffer, say -200 days.
        if -200 <= delta_this <= 365:
             # It's in the past 6 months OR in the future of this year
             selected_dates[month] = d_this.strftime("%Y-%m-%d")
        else:
             # Too old, use next year
             selected_dates[month] = d_next.strftime("%Y-%m-%d")
    
    print(f"   Sample dates: {list(selected_dates.values())}")
    
    # 2. Fetch Data
    print("   📡 Fetching monthly data...")
    monthly_arrivals = {}
    
    for month in range(1, 13):
        date_str = selected_dates[month]
        print(f"      Month {month} ({date_str}): ", end="", flush=True)
        
        count = fetch_flights_for_date(session, date_str)
        monthly_arrivals[month] = count
        
        if count > 0:
            print(f" {count} arrivals ✅")
        else:
            print(f" 0 arrivals ⚠️")
            
        time.sleep(1.0) # Be nice to API

    # 3. Gap Filling (Simple Average)
    # If we have SOME data, fill the 0s with average
    non_zeros = [v for v in monthly_arrivals.values() if v > 0]
    if non_zeros:
        avg = int(sum(non_zeros) / len(non_zeros))
        print(f"   🔧 Filling gaps with average: {avg}")
        for m in range(1, 13):
            if monthly_arrivals[m] == 0:
                monthly_arrivals[m] = avg
    else:
        print("   ❌ No data found at all. Cannot fill gaps.")

    # 4. Fetch Routes (Top Destinations)
    print("   🛣️ Fetching top routes...")
    routes_url = f"https://aerodatabox.p.rapidapi.com/airports/icao/{TARGET_ICAO}/stats/routes/daily"
    routes_data = None
    try:
        resp = session.get(routes_url, timeout=15)
        if resp.status_code == 200:
            routes_data = resp.json()
            print(f"      ✅ Found {len(routes_data.get('routes', []))} top routes")
        else:
            print(f"      ⚠️ Failed to fetch routes: {resp.status_code}")
    except Exception as e:
        print(f"      ❌ Error fetching routes: {e}")
        
    time.sleep(1.0)
    
    # 5. Fetch Delays (Current Status)
    print("   ⏱️ Fetching delay statistics...")
    delays_url = f"https://aerodatabox.p.rapidapi.com/airports/icao/{TARGET_ICAO}/delays"
    delays_data = None
    try:
        resp = session.get(delays_url, timeout=15)
        if resp.status_code == 200:
            delays_data = resp.json()
            print(f"      ✅ Found delay stats")
        else:
             print(f"      ⚠️ Failed to fetch delays: {resp.status_code}")
    except Exception as e:
         print(f"      ❌ Error fetching delays: {e}")

    # 6. Save
    result = {
        "icao": TARGET_ICAO,
        "monthly_arrivals": monthly_arrivals,
        "routes": routes_data, 
        "delays": delays_data,
        "processed_at": datetime.datetime.now().isoformat()
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
        
    print(f"   💾 Saved to {OUTPUT_FILE}")
    print("DONE")

if __name__ == "__main__":
    main()
