
import json
import os
import requests
import datetime
from concurrent.futures import ThreadPoolExecutor

# Configuration
DATA_DIR = os.path.join(os.getcwd(), 'public', 'data')
START_DATE = "1994-01-01"
END_DATE = "2024-12-31"

def fetch_detailed_earthquake_data(lat, lon, radius_km=100, min_magnitude=4.0):
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "latitude": lat,
        "longitude": lon,
        "maxradiuskm": radius_km,
        "minmagnitude": min_magnitude,
        "starttime": START_DATE,
        "endtime": END_DATE
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        if response.status_code != 200:
            return None
            
        data = response.json()
        features = data.get("features", [])
        
        if not features:
            return {
                "last_event": None,
                "monthly_distribution": {i: 0 for i in range(1, 13)}
            }
            
        # Sort by time descending
        features.sort(key=lambda x: x["properties"]["time"], reverse=True)
        
        # Last event
        last_event_ts = features[0]["properties"]["time"]
        last_event_date = datetime.datetime.fromtimestamp(last_event_ts / 1000).strftime('%Y-%m-%d')
        
        # Monthly distribution
        monthly_dist = {i: 0 for i in range(1, 13)}
        
        for f in features:
            ts = f["properties"]["time"]
            date = datetime.datetime.fromtimestamp(ts / 1000)
            monthly_dist[date.month] += 1
            
        return {
            "last_event": last_event_date,
            "monthly_distribution": monthly_dist
        }
        
    except Exception as e:
        print(f"Error fetching quake data: {e}")
        return None

def process_city(filename):
    if not filename.endswith('.json'):
        return
        
    filepath = os.path.join(DATA_DIR, filename)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        meta = data.get('meta', {})
        safety = meta.get('safety_profile', {})
        seismic = safety.get('seismic', {})
        
        # Force refresh all cities (no skip)
            
        lat = meta.get('lat')
        lon = meta.get('lon')
        
        if lat is None or lon is None:
            return
            
        print(f"Updating {filename}...")
        
        details = fetch_detailed_earthquake_data(lat, lon)
        
        if details:
            if 'seismic' not in safety:
                safety['seismic'] = {}
                
            # Update seismic object
            # Preserve existing fields
            seismic['last_event'] = details['last_event']
            seismic['monthly_distribution'] = details['monthly_distribution']
            
            # Write back
            safety['seismic'] = seismic
            meta['safety_profile'] = safety
            data['meta'] = meta
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                
            print(f"✅ Updated {filename}")
        else:
            print(f"❌ Failed to get details for {filename}")
            
    except Exception as e:
        print(f"Error processing {filename}: {e}")

def main():
    files = os.listdir(DATA_DIR)
    # Filter for JSONs
    city_files = [f for f in files if f.endswith('.json')]
    
    print(f"Found {len(city_files)} cities to check.")
    
    with ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(process_city, city_files)

if __name__ == "__main__":
    main()
