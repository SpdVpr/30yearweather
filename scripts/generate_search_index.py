import os
import json
import statistics
from datetime import datetime

# Configuration
INPUT_DIR = os.path.join(os.getcwd(), "public", "data")
OUTPUT_FILE = os.path.join(os.getcwd(), "public", "search-index.json")

# Simple seasonal fallback (copied from frontend logic as a base)
FALLBACK_SEASONALITY = [
    {"crowd": 40, "price": 50},  # Jan
    {"crowd": 35, "price": 45},  # Feb
    {"crowd": 50, "price": 60},  # Mar
    {"crowd": 70, "price": 75},  # Apr
    {"crowd": 85, "price": 85},  # May
    {"crowd": 90, "price": 90},  # Jun
    {"crowd": 95, "price": 95},  # Jul
    {"crowd": 100, "price": 100},  # Aug
    {"crowd": 85, "price": 90},  # Sep
    {"crowd": 70, "price": 75},  # Oct
    {"crowd": 50, "price": 60},  # Nov
    {"crowd": 85, "price": 95},  # Dec
]

def analyze_city(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    meta = data.get("meta", {})
    days = data.get("days", {})

    # Structure to hold monthly aggregations
    months_data = {}
    for i in range(1, 13):
        months_data[i] = {
            "temp_max": [],
            "temp_min": [],
            "rain_days": 0,
            "rain_prob_accum": [],
            "wind_accum": [],
            "humidity_accum": [],
            "marine_temp_accum": [],
            "wave_height_accum": [],
            "count": 0
        }

    # Iterate through all days
    for date_key, day_data in days.items():
        try:
            date_obj = datetime.strptime(f"2024-{date_key}", "%Y-%m-%d")
            month = date_obj.month
            
            stats = day_data.get("stats", {})
            
            # Temps
            months_data[month]["temp_max"].append(stats.get("temp_max", 0))
            months_data[month]["temp_min"].append(stats.get("temp_min", 0))
            
            # Rain (if precip_prob > 20% or precip_mm > 1.0)
            if stats.get("precip_prob", 0) > 25 or stats.get("precip_mm", 0) > 1.0:
                months_data[month]["rain_days"] += 1
                
            months_data[month]["rain_prob_accum"].append(stats.get("precip_prob", 0))
            months_data[month]["wind_accum"].append(stats.get("wind_kmh", 0))
            months_data[month]["humidity_accum"].append(stats.get("humidity_percent", 0))

            # Marine
            marine = day_data.get("marine")
            if marine:
                months_data[month]["marine_temp_accum"].append(marine.get("water_temp", 0))
                months_data[month]["wave_height_accum"].append(marine.get("wave_height", 0))

            months_data[month]["count"] += 1

        except Exception as e:
            # print(f"Skipping day {date_key}: {e}")
            continue

    # Finalize monthly averages
    final_months = []
    for m in range(1, 13):
        d = months_data[m]
        count = d["count"] if d["count"] > 0 else 1
        
        # Tourism fallback
        tourism = FALLBACK_SEASONALITY[m-1]

        m_stats = {
            "m": m,
            "temp_max": round(statistics.mean(d["temp_max"]), 1) if d["temp_max"] else 0,
            "temp_min": round(statistics.mean(d["temp_min"]), 1) if d["temp_min"] else 0,
            "rain_days": d["rain_days"],
            "rain_prob": round(statistics.mean(d["rain_prob_accum"]), 0) if d["rain_prob_accum"] else 0,
            "wind_kmh": round(statistics.mean(d["wind_accum"]), 0) if d["wind_accum"] else 0,
            "humidity": round(statistics.mean(d["humidity_accum"]), 0) if d["humidity_accum"] else 0,
            "crowd": tourism["crowd"],
            "price": tourism["price"],
        }

        # Marine averages
        if d["marine_temp_accum"]:
            m_stats["water_temp"] = round(statistics.mean(d["marine_temp_accum"]), 1)
        if d["wave_height_accum"]:
            m_stats["wave_height"] = round(statistics.mean(d["wave_height_accum"]), 1)
            
        final_months.append(m_stats)

    return {
        "slug": os.path.splitext(os.path.basename(file_path))[0],
        "name": meta.get("name"),
        "country": meta.get("country"),
        "coords": {
            "lat": meta.get("lat"),
            "lon": meta.get("lon")
        },
        "is_coastal": meta.get("is_coastal", False),
        "months": final_months
    }

def main():
    print("Generating search index...")
    index = []
    
    if not os.path.exists(INPUT_DIR):
        print(f"Error: {INPUT_DIR} does not exist.")
        return

    files = [f for f in os.listdir(INPUT_DIR) if f.endswith(".json")]
    print(f"Found {len(files)} cities.")

    for filename in files:
        file_path = os.path.join(INPUT_DIR, filename)
        try:
            city_data = analyze_city(file_path)
            index.append(city_data)
            # print(f"Encoded {city_data['name']}")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    # Save to public
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=None)  # Minified
        
    print(f"✅ Search index generated at {OUTPUT_FILE} ({len(index)} cities)")

if __name__ == "__main__":
    main()
