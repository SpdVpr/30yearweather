
import os
import sys

def patch_etl_strict():
    file_path = 'backend/etl.py'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to remove the fallback logic.
    # The current code block for flight pressure looks like:
    
    # ...
    #             if total_flights > 1000: flight_pressure_score = 100
    #             ...
    #             print(f"   ✈️  Flight Pressure (Peak): ...")
    #
    #    # Fallback to Phase 1 file if seasonal missing
    #    elif os.path.exists(daily_file):
    #         ...
    
    # Strategy: Find the start of the block and replace the WHOLE block with the Strict version.
    
    start_marker = "        # 6b. Seasonal Flight Pressure (Phase 2 - Ultra Tier)"
    end_marker = "        # Structure final data (NEW)"
    
    parts = content.split(start_marker)
    if len(parts) < 2:
        print("Error: content split failed")
        return
    
    pre = parts[0]
    post = parts[1]
    
    if end_marker not in post:
        print("Error: End marker not found")
        return
        
    post_parts = post.split(end_marker)
    remaining = end_marker + post_parts[1]
    
    # New Strict Logic (No Fallback)
    new_logic = '''
        # 6b. Seasonal Flight Pressure (Phase 2 - Ultra Tier)
        print("   ✈️  Loading seasonal flight analytics...")
        flight_data = None
        
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            seasonal_file = os.path.join(base_dir, 'data', 'raw_flights_seasonal', f"{slug}_seasonal.json")
            
            seasonality = {}
            total_flights_peak = 0
            routes_summary = []
            delay_stats = {}
            
            if os.path.exists(seasonal_file):
                 with open(seasonal_file, 'r', encoding='utf-8') as f:
                     s_json = json.load(f)
                     
                 # 1. Seasonality
                 monthly_counts = s_json.get('monthly_arrivals', {})
                 # Convert keys to int just in case
                 seasonality = {int(k): v for k, v in monthly_counts.items()}
                 
                 if seasonality:
                     total_flights_peak = max(seasonality.values()) if seasonality else 0
                     
                 # 2. Routes (Top 5)
                 raw_routes = s_json.get('routes', [])
                 if raw_routes:
                     # Structure: [{'destination': {'code': 'LHR', 'name': 'Heathrow'}, 'dailyAverage': 15.5}, ...]
                     # API structure might vary, let's correspond to what AeroDataBox returns for "routes/daily"
                     # Usually it is a list of objects.
                     # Let's handle generic list
                     sorted_routes = sorted(raw_routes, key=lambda x: x.get('averageDailyFlights', 0), reverse=True)
                     for r in sorted_routes[:5]:
                         airport = r.get('destinationAirport', {})
                         name = airport.get('name', 'Unknown')
                         iata = airport.get('iata', '')
                         routes_summary.append(f"{name} ({iata})")
                         
                 # 3. Delays
                 raw_delays = s_json.get('delays', {})
                 # Structure: {'departures': {'medianDelay': 'PT5M', ...}, 'arrivals': ...}
                 # We parse ISO8601 duration (PT5M) or just take delayIndex
                 if raw_delays:
                     arr_delays = raw_delays.get('arrivals', {})
                     delay_stats = {
                         "median_delay": arr_delays.get('medianDelay', 'N/A'),
                         "cancelled_percent": arr_delays.get('cancelled', 0),
                         "delay_index": arr_delays.get('delayIndex', 'N/A')
                     }

                 if total_flights_peak > 0:
                     # Calculate Pressure Score based on PEAK monthly traffic (normalized to daily avg)
                     
                     # Score Calculation
                     flight_pressure_score = 0
                     if total_flights_peak > 1000: flight_pressure_score = 100
                     elif total_flights_peak > 600: flight_pressure_score = 80 + (total_flights_peak-600)/20
                     elif total_flights_peak > 300: flight_pressure_score = 60 + (total_flights_peak-300)/15
                     elif total_flights_peak > 100: flight_pressure_score = 40 + (total_flights_peak-100)/10
                     elif total_flights_peak > 50: flight_pressure_score = 20 + (total_flights_peak-50)/2.5
                     else: flight_pressure_score = max(0, total_flights_peak / 2.5)
                     
                     flight_pressure_score = int(round(min(100, flight_pressure_score)))
                     
                     flight_data = {
                         "source": "seasonal",
                         "peak_daily_arrivals": total_flights_peak,
                         "pressure_score": flight_pressure_score,
                         "seasonality": seasonality, # Dict {1: 150, 2: 140...}
                         "top_routes": routes_summary,
                         "delays": delay_stats,
                         "icao": s_json.get('icao')
                     }
                     print(f"   ✈️  Flight Pressure (Peak): {flight_pressure_score}/100 ({total_flights_peak} daily)")
            
        except Exception as e:
            print(f"   ⚠️  Failed to load flight data: {e}")

'''
    
    final_content = pre + new_logic + remaining
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print("Successfully patched backend/etl.py (STRICT Seasonal Mode)")

if __name__ == "__main__":
    patch_etl_strict()
