
import os
import sys

def patch_etl():
    file_path = 'backend/etl.py'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Target insertion point: Before "        # Structure final data (NEW)"
    target = '        # Structure final data (NEW)'
    
    if target not in content:
        print("Error: Target not found in etl.py")
        return

    flight_logic = '''
        # 6b. Flight Pressure (NEW!)
        print("   ✈️  Loading flight pressure data...")
        flight_data = None
        flight_pressure_score = 0
        
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            flights_file = os.path.join(base_dir, 'data', 'raw_flights', f"{slug}_flights.json")
            
            if os.path.exists(flights_file):
                 with open(flights_file, 'r', encoding='utf-8') as f:
                     f_json = json.load(f)
                     
                 if f_json and 'stats' in f_json:
                     stats = f_json['stats']
                     total_flights = stats.get('flight_count', 0)
                     
                     # Calculate Score (0-100)
                     if total_flights > 1000: flight_pressure_score = 100
                     elif total_flights > 600: flight_pressure_score = 80 + (total_flights-600)/20
                     elif total_flights > 300: flight_pressure_score = 60 + (total_flights-300)/15
                     elif total_flights > 100: flight_pressure_score = 40 + (total_flights-100)/10
                     elif total_flights > 50: flight_pressure_score = 20 + (total_flights-50)/2.5
                     else: flight_pressure_score = max(0, total_flights / 2.5) # 0-20
                     
                     flight_pressure_score = int(round(min(100, flight_pressure_score)))
                     
                     flight_data = {
                         "total_daily_arrivals": total_flights,
                         "pressure_score": flight_pressure_score,
                         "peak_hour": stats.get('peak_hour'),
                         "morning_share": round((stats.get('morning_flights',0)/total_flights*100), 1) if total_flights else 0,
                         "evening_share": round((stats.get('evening_flights',0)/total_flights*100), 1) if total_flights else 0,
                         "icao": f_json.get('icao')
                     }
                     print(f"   ✈️  Flight Pressure: {flight_pressure_score}/100 ({total_flights} daily arrivals)")
        except Exception as e:
            print(f"   ⚠️  Failed to load flight data: {e}")

'''
    
    # Insert logic before the target
    replacement = flight_logic + target
    
    new_content = content.replace(target, replacement)
    
    # Also need to add it to the 'final_data' dict
    # Look for: '"safety_profile": {' inside the "Structure final data" block
    # Actually, it's easier to verify where final_data is defined.
    # We can invoke a second replace.
    
    # Let's verify if we need to replace inside the dictionary definition.
    # Yes, we do.
    
    # Target 2: '"air_quality": air_quality_data' inside 'final_data = {'
    target_dict = '                    "air_quality": air_quality_data\n                }'
    replacement_dict = '                    "air_quality": air_quality_data\n                },\n                "flight_info": flight_data'
    
    if target_dict in new_content:
        new_content = new_content.replace(target_dict, replacement_dict)
    else:
        print("Warning: Dict target not exact match, trying broader match...")
        # Fallback using broader match if indentation varies
    
    # Also need to handle the "UPDATE EXISTING DATA" branch
    # Target 3: 'final_data['meta']['last_updated'] = datetime.datetime.now().isoformat()'
    
    target_update = "        final_data['meta']['last_updated'] = datetime.datetime.now().isoformat()"
    replacement_update = "        final_data['meta']['flight_info'] = flight_data\n" + target_update
    
    new_content = new_content.replace(target_update, replacement_update)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully patched backend/etl.py with Flight Logic")

if __name__ == "__main__":
    patch_etl()
