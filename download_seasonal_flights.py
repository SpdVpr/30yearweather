
import os
import json
import time
import datetime
import requests
import random
from dotenv import load_dotenv

# Setup environment
base_dir = os.path.dirname(os.path.abspath(__file__))
# Load .env (handle root vs backend path)
load_dotenv(os.path.join(base_dir, '.env'))

RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
if not RAPIDAPI_KEY:
    RAPIDAPI_KEY = "5de5692f22msh01fc088bbb2705bp1fa920jsn526e9d191954" # Fallback from working script

RAPIDAPI_HOST = "aerodatabox.p.rapidapi.com"

# Create data directory
raw_seasonal_dir = os.path.join(base_dir, 'backend', 'data', 'raw_flights_seasonal')
os.makedirs(raw_seasonal_dir, exist_ok=True)

# Imports
try:
    from backend.config import LOCATIONS
    from backend.airport_codes import AIRPORT_CODES
except ImportError:
    import sys
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from config import LOCATIONS
    from airport_codes import AIRPORT_CODES

def get_session():
    s = requests.Session()
    s.headers.update({
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST
    })
    return s

def calculate_optimal_dates():
    """
    Calculate the best dates to fetch for monthly seasonality.
    Strategy: 
    - Prioritize the LAST 6-7 MONTHS of history (reliable data).
    - Use future dates (Next Year) only for months that are too old to be in history limit.
    - API limit is approx +/- 210 days.
    """
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
             
    print(f"   📅 Target dates determined: {list(selected_dates.values())}")
    return selected_dates

def fetch_daily_flights(session, icao, date_str):
    """Fetch flights for a single day (Morning + Evening windows)"""
    total_flights = 0
    
    # 2 windows to cover 24h
    windows = [
        (f"{date_str}T00:00", f"{date_str}T11:59"),
        (f"{date_str}T12:00", f"{date_str}T23:59")
    ]
    
    for start, end in windows:
        url = f"https://aerodatabox.p.rapidapi.com/flights/airports/icao/{icao}/{start}/{end}"
        params = {
            "withLeg": "true", # Crucial for some airports/historical data
            "direction": "Arrival",
            "withCancelled": "false",
            "withCodeshared": "true" 
        }
        
        # Retry loop for Rate Limits
        max_retries = 3
        for attempt in range(max_retries):
            try:
                resp = session.get(url, params=params, timeout=15)
                
                if resp.status_code == 200:
                    data = resp.json()
                    total_flights += len(data.get('arrivals', []))
                    break # Success
                    
                elif resp.status_code == 429:
                    wait_time = (attempt + 1) * 2 + random.uniform(0.5, 1.5)
                    # print(f"x", end="", flush=True) 
                    time.sleep(wait_time)
                    continue
                    
                else:
                    # Other errors (404, 500) - log and skip window
                    # print(f"E{resp.status_code}", end="", flush=True)
                    break
                    
            except Exception as e:
                # print(f"!", end="", flush=True)
                time.sleep(2)
        
        # Courtesy sleep between windows
        time.sleep(0.8) 
            
    return total_flights

def fetch_routes_stats(session, icao):
    """Fetch popular routes statistics"""
    url = f"https://aerodatabox.p.rapidapi.com/airports/icao/{icao}/stats/routes/daily"
    try:
        time.sleep(1.0)
        resp = session.get(url, timeout=10)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return None

def fetch_delays_stats(session, icao):
    """Fetch current delay stats (snapshot)"""
    url = f"https://aerodatabox.p.rapidapi.com/airports/icao/{icao}/delays"
    try:
        time.sleep(1.0)
        resp = session.get(url, timeout=10)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return None

def main():
    print("🚀 Starting ROBUST Seasonal Flight Data Download...")
    
    if not RAPIDAPI_KEY:
        print("❌ RAPIDAPI_KEY not found!")
        return

    # Filter cities with airports
    cities = [items for items in LOCATIONS.items() if items[0] in AIRPORT_CODES]
    print(f"ℹ️  Processing {len(cities)} cities using smart date selection.")

    session = get_session()
    
    # Calculate global dates (assuming all cities share same "relative now")
    selected_dates = calculate_optimal_dates()
    
    for slug, config in cities:
        icao = AIRPORT_CODES[slug]
        filename = f"{slug}_seasonal.json"
        filepath = os.path.join(raw_seasonal_dir, filename)
        
        # Skip if full data already exists (unless forced)
        if os.path.exists(filepath):
            # Check if it has data (size > 1KB?)
            if os.path.getsize(filepath) > 500:
                print(f"⏭️  Skipping {slug} - Already done.")
                continue
            
        print(f"\n🛫 Processing {slug} ({icao})...")
        city_data = {
            "icao": icao,
            "monthly_arrivals": {},
            "routes": None,
            "delays": None,
            "processed_at": datetime.datetime.now().isoformat()
        }
        
        # 1. Fetch Monthly Seasonality
        print("   📅 Seasonality:", end="", flush=True)
        monthly_arrivals = {}
        
        for month in range(1, 13):
            date_str = selected_dates[month]
            count = fetch_daily_flights(session, icao, date_str)
            monthly_arrivals[month] = count
            
            if count > 0:
                print(f" {month}:✅", end="", flush=True)
            else:
                print(f" {month}:⚠️", end="", flush=True)
                
            # Extra sleep to rate limit
            time.sleep(0.5) 
            
        # Gap Filling
        non_zeros = [v for v in monthly_arrivals.values() if v > 0]
        if non_zeros:
            avg_val = int(sum(non_zeros) / len(non_zeros))
            for m in range(1, 13):
                if monthly_arrivals[m] == 0:
                    monthly_arrivals[m] = avg_val
            print(f" (Filled gaps with avg: {avg_val})")
        else:
            print(" (No data found!)")
            
        city_data['monthly_arrivals'] = monthly_arrivals
        
        # 2. Fetch Routes
        print("   🛣️  Fetching top routes...")
        routes = fetch_routes_stats(session, icao)
        if routes:
            city_data['routes'] = routes
            print(f"      ✅ Found {len(routes.get('routes', []))} routes")
            
        # 3. Fetch Delays
        print("   ⏱️  Fetching delays...")
        delays = fetch_delays_stats(session, icao)
        if delays:
            city_data['delays'] = delays
            
        # Save
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(city_data, f, indent=2)
            
        print(f"   💾 Saved {slug}_seasonal.json")
        
        # Sleep between cities
        time.sleep(2)

    print("\n🎉 All seasonal data downloaded successfully!")

if __name__ == "__main__":
    main()
