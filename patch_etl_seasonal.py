
import os
import sys

def patch_etl():
    file_path = 'backend/etl.py'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Target: The previous flight logic we added (Phase 1)
    # We will REPLACE it with Phase 2 logic.
    
    # Identify the block we added: "        # 6b. Flight Pressure (NEW!)"
    start_marker = "        # 6b. Flight Pressure (NEW!)"
    
    # If not found, look for where we inserted it (before "Structure final data")
    if start_marker not in content:
        print("Error: Phase 1 Flight logic not found. Make sure previous patch was applied or find another insertion point.")
        # If not phase 1, we can insert fresh. But let's assume phase 1 is there.
        return

    # We need to find the END of that block.
    # It ends before "        # Structure final data (NEW)"
    end_marker = "        # Structure final data (NEW)"
    
    # Robust replacement:
    # We will construct a regex or just split the string carefully.
    
    parts = content.split(start_marker)
    if len(parts) < 2:
        print("Error: content split failed")
        return
    
    pre_content = parts[0]
    post_part = parts[1]
    
    # Split post_part at end_marker
    if end_marker not in post_part:
        print("Error: End marker not found")
        return
        
    post_parts = post_part.split(end_marker)
    # middle_content is the old logic we want to replace
    # remaining_content is the rest of file
    
    remaining_content = end_marker + post_parts[1]
    # Note: split consumes the delimiter, so we add it back to remaining_content (or include in replacement)
    
    # New Phase 2 Logic
    new_logic = '''
        # 6b. Seasonal Flight Pressure (Phase 2 - Ultra Tier)
        print("   ✈️  Loading seasonal flight analytics...")
        flight_data = None
        
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            seasonal_file = os.path.join(base_dir, 'data', 'raw_flights_seasonal', f"{slug}_seasonal.json")
            
            # Fallback to single-day file if seasonal not found
            daily_file = os.path.join(base_dir, 'data', 'raw_flights', f"{slug}_flights.json")
            
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
                     # If monthly_counts are "daily average for that month" - wait, our script calls fetch_daily_flights for ONE day (15th).
                     # So the numbers ARE daily counts.
                     
                     # Score Calculation (Same logic but using peak day)
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
            
            # Fallback to Phase 1 file if seasonal missing
            elif os.path.exists(daily_file):
                 with open(daily_file, 'r', encoding='utf-8') as f:
                     f_json = json.load(f)
                 stats = f_json.get('stats', {})
                 total_flights = stats.get('flight_count', 0)
                 
                 # Score
                 flight_pressure_score = 0
                 if total_flights > 1000: flight_pressure_score = 100
                 elif total_flights > 600: flight_pressure_score = 80 + (total_flights-600)/20
                 elif total_flights > 300: flight_pressure_score = 60 + (total_flights-300)/15
                 elif total_flights > 100: flight_pressure_score = 40 + (total_flights-100)/10
                 elif total_flights > 50: flight_pressure_score = 20 + (total_flights-50)/2.5
                 else: flight_pressure_score = max(0, total_flights / 2.5)
                 
                 flight_data = {
                     "source": "snapshot",
                     "total_daily_arrivals": total_flights,
                     "pressure_score": int(flight_pressure_score),
                     "peak_hour": stats.get('peak_hour'),
                     "morning_share": round((stats.get('morning_flights',0)/total_flights*100), 1) if total_flights else 0,
                     "icao": f_json.get('icao')
                 }
                 print(f"   ✈️  Flight Pressure (Snapshot): {int(flight_pressure_score)}/100")

        except Exception as e:
            print(f"   ⚠️  Failed to load flight data: {e}")

'''
    
    # Reconstruct file
    final_content = pre_content + new_logic + remaining_content
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print("Successfully patched backend/etl.py with Seasonal Flight Logic")

if __name__ == "__main__":
    patch_etl()
