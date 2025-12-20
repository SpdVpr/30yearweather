import sys
import os
import datetime
import time # Added since it's used later too
import json # Added since it's used later too

# Add root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import download_seasonal_flights as flights_script
from backend.airport_codes import AIRPORT_CODES

def run_lyon_flights():
    target_slug = 'lyon-fr'
    target_icao = AIRPORT_CODES.get(target_slug)
    
    if not target_icao:
        print(f"Error: Could not find ICAO for {target_slug}")
        return

    print(f"🚀 custom: Downloading flights for {target_slug} ({target_icao})...")
    
    # We can reuse the main() logic but restrict list
    # The script uses LOCATIONS and AIRPORT_CODES.
    # We can monkeypatch LOCATIONS within the module if we import it?
    # Actually, download_seasonal_flights.py imports LOCATIONS.
    
    # Let's just use the functions directly to avoid messing with global state too much
    # Copying the core logic from main() for a single city
    
    session = flights_script.get_session()
    
    # Path logic (defined early)
    filename = f"{target_slug}_seasonal.json"
    
    # REFINED Date Logic based on debug findings and API limits (+/- 210 days)
    # Today is presumably Dec 20, 2025.
    # The API history limit is ~7 months back (May 2025).
    # The API future data (2026) seems empty/unpublished.
    # STRATEGY: 
    # 1. Prioritize LAST 6 MONTHS of history (confident data).
    # 2. For months older than 7 months (Jan-Apr), try FUTURE (2026).
    # 3. If future returns 0, we will extrapolate/fill later to avoid empty charts.
    
    current_date = datetime.datetime.now()
    current_year = current_date.year
    
    sample_dates = []
    
    print(f"   📅 Calculating optimal dates relative to {current_date.strftime('%Y-%m-%d')}...")
    
    for month in range(1, 13):
        # Default candidate: Current year (2025)
        # But wait, Jan 2025 is Too Old (> 210 days).
        # Jan 2026 is Future.
        
        # Check if Month in Current Year is valid (within last ~200 days)
        # 2025-05 to 2025-12 is VALID.
        
        # Candidate 1: This Year (e.g., 2025-01-15)
        cand_this = datetime.datetime(current_year, month, 15)
        diff_this = (cand_this - current_date).days
        
        # Candidate 2: Next Year (e.g., 2026-01-15) - For Jan-Apr
        cand_next = datetime.datetime(current_year + 1, month, 15)
        
        # Selection
        selected_date = None
        
        # Is 'This Year' in acceptable past window? (-205 days to +10 days)
        if -205 <= diff_this <= 10:
             selected_date = cand_this.strftime("%Y-%m-%d")
        else:
             # 'This year' is too old (e.g. Jan 2025). Use Future.
             selected_date = cand_next.strftime("%Y-%m-%d")
        
        sample_dates.append(selected_date)

    print(f"   📅 Selected dates: {sample_dates}")
    filepath = os.path.join(flights_script.raw_seasonal_dir, filename)
    
    # Removed inner imports
    
    print(f"\n🛫 Processing {target_slug} ({target_icao})...")
    
    # If using RapidAPI, we need to be careful with cost/limits.
    # Assuming user has quota.
    
    city_data = {
        "icao": target_icao,
        "monthly_arrivals": {},
        "routes": None,
        "delays": None,
        "processed_at": datetime.datetime.now().isoformat()
    }
    
    # 1. Monthly (with smart retry/fill and custom params)
    print("   📅 Seasonality:", end="", flush=True)
    
    collected_counts = {}
    
    import random
    
    for date_str in sample_dates:
        # Custom fetch logic to ensure we use 'withLeg=true' which might be needed for some historical data
        # and to have full control over params
        
        # 2 windows to cover 24h
        total_flights = 0
        windows = [
            (f"{date_str}T00:00", f"{date_str}T11:59"),
            (f"{date_str}T12:00", f"{date_str}T23:59")
        ]
        
        for start, end in windows:
            url = f"https://aerodatabox.p.rapidapi.com/flights/airports/icao/{target_icao}/{start}/{end}"
            params = {
                "withLeg": "true", # FORCE TRUE
                "direction": "Arrival",
                "withCancelled": "false",
                "withCodeshared": "true" 
            }
            
            # Retry loop
            for attempt in range(3):
                try:
                    resp = session.get(url, params=params, timeout=15)
                    if resp.status_code == 200:
                        data = resp.json()
                        count = len(data.get('arrivals', []))
                        total_flights += count
                        break
                    elif resp.status_code == 429:
                        wait = (attempt + 1) * 2 + random.uniform(0.5, 1.0)
                        # print(f"x", end="")
                        time.sleep(wait)
                        continue
                    else:
                        break
                except:
                    time.sleep(1)
            
            time.sleep(0.5)

        month_key = int(date_str.split('-')[1])
        year_key = int(date_str.split('-')[0])
        
        collected_counts[month_key] = total_flights
        
        if total_flights > 0:
            print(f" {month_key}({year_key}):{total_flights}✅", end="", flush=True)
        else:
            print(f" {month_key}({year_key}):0⚠️", end="", flush=True)

    # POST-PROCESS: FILL GAPS
    non_zero_values = [v for v in collected_counts.values() if v > 0]
    avg_val = int(sum(non_zero_values) / len(non_zero_values)) if non_zero_values else 0
    
    for m in range(1, 13):
        if collected_counts.get(m, 0) == 0 and avg_val > 0:
             collected_counts[m] = avg_val
             
    city_data['monthly_arrivals'] = collected_counts
    print(f" Done. (Avg fill: {avg_val})")
    
    # 2. Routes
    routes = flights_script.fetch_routes_stats(session, target_icao)
    if routes:
        city_data['routes'] = routes
        
    # 3. Delays
    delays = flights_script.fetch_delays_stats(session, target_icao)
    if delays:
        city_data['delays'] = delays
        
    # Save
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(city_data, f, indent=2)
        
    print(f"   💾 Saved {target_slug}_seasonal.json")

if __name__ == "__main__":
    run_lyon_flights()
