
import json
import os
from pathlib import Path
import statistics
from typing import Dict, List, TypedDict, Optional, Tuple

# Setup paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
RAW_DATA_DIR = PROJECT_ROOT / "backend" / "data" / "raw_weather"
META_DATA_DIR = PROJECT_ROOT / "public" / "data"
OUTPUT_FILE = PROJECT_ROOT / "src" / "lib" / "research" / "global-warming-2026.json"

class WarmingStats(TypedDict):
    slug: str
    name: str
    country: str
    continent: str
    avg_temp_start: float # e.g. 1996-2005
    avg_temp_end: float   # e.g. 2015-2024
    warming_total: float  # Total change
    warming_rate_decade: float # Slope * 10
    prediction_2026: float
    confidence_score: int
    yearly_data: Dict[int, float]
    data_source: str

def load_cities_list() -> List[str]:
    with open(PROJECT_ROOT / "src" / "lib" / "cities-list.json", "r", encoding="utf-8-sig") as f:
        return json.load(f)

def get_continent(timezone: str) -> str:
    if "Europe" in timezone: return "Europe"
    if "Asia" in timezone: return "Asia"
    if "America" in timezone: return "Americas"
    if "Africa" in timezone: return "Africa"
    if "Australia" in timezone: return "Oceania"
    if "Atlantic" in timezone: return "Europe"
    if "Pacific" in timezone: return "Pacific"
    return "Other"

def calculate_slope(years: List[int], temps: List[float]) -> Tuple[float, float]:
    # Returns slope, intercept
    n = len(years)
    if n < 2: return 0.0, 0.0
    
    sum_x = sum(years)
    sum_y = sum(temps)
    sum_xy = sum(x*y for x, y in zip(years, temps))
    sum_xx = sum(x*x for x in years)
    
    denom = (n * sum_xx - sum_x * sum_x)
    if denom == 0: return 0.0, 0.0
    
    slope = (n * sum_xy - sum_x * sum_y) / denom
    intercept = (sum_y - slope * sum_x) / n
    return slope, intercept

def load_json_safe(path: Path):
    if not path.exists(): return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except UnicodeDecodeError:
        with open(path, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {path}: {e}")
        return None

def analyze_city(city_slug: str) -> Optional[WarmingStats]:
    # 1. Get Metadata
    meta_data = load_json_safe(META_DATA_DIR / f"{city_slug}.json")
    if not meta_data:
        # print(f"Meta missing for {city_slug}")
        return None

    # 2. Get Raw Data
    raw_data = load_json_safe(RAW_DATA_DIR / f"{city_slug}_raw.json")
    if not raw_data:
        # print(f"Raw missing for {city_slug}")
        return None
        
    info = meta_data.get("meta", {})
    name = info.get("name", city_slug)
    country = info.get("country", "Unknown")
    timezone = info.get("timezone", "")
    continent = get_continent(timezone)
    
    daily = raw_data.get("daily", {})
    times = daily.get("time", [])
    maxs = daily.get("temperature_2m_max", [])
    mins = daily.get("temperature_2m_min", [])
    
    if not times or not maxs or not mins:
        return None
        
    # 3. Process Daily Data
    yearly_temps: Dict[int, List[float]] = {}
    
    for i, date_str in enumerate(times):
        if i >= len(maxs) or i >= len(mins): break
        
        t_max = maxs[i]
        t_min = mins[i]
        
        if t_max is None or t_min is None: continue
        
        try:
            year = int(date_str.split("-")[0])
        except: continue
        
        t_mean = (t_max + t_min) / 2
        
        if year not in yearly_temps:
            yearly_temps[year] = []
        yearly_temps[year].append(t_mean)
        
    # 4. Annual Averages
    yearly_avgs = {}
    for year, temps in yearly_temps.items():
        if len(temps) > 330: # Strict check: almost complete year
            yearly_avgs[year] = statistics.mean(temps)
            
    valid_years = sorted(yearly_avgs.keys())
    
    # We ignore 2025 if it is incomplete (but today is Dec 26, so likely complete enough or almost)
    # Let's clean up valid_years to be continuous range if possible, or robust to gaps
    
    if len(valid_years) < 20: 
        # print(f"Skipping {city_slug}: only {len(valid_years)} valid years")
        return None
        
    # 5. Analysis
    x_years = valid_years
    y_temps = [yearly_avgs[y] for y in x_years]
    
    slope, intercept = calculate_slope(x_years, y_temps)
    
    warming_rate_decade = slope * 10
    prediction_2026 = slope * 2026 + intercept
    
    # Decadal Comparison
    # Start Period: First 10 valid years
    start_years = x_years[:10]
    end_years = x_years[-10:]
    
    avg_start = statistics.mean([yearly_avgs[y] for y in start_years])
    avg_end = statistics.mean([yearly_avgs[y] for y in end_years])
    warming_total = avg_end - avg_start
    
    return {
        "slug": city_slug,
        "name": name,
        "country": country,
        "continent": continent,
        "avg_temp_start": round(avg_start, 2),
        "avg_temp_end": round(avg_end, 2),
        "warming_total": round(warming_total, 2),
        "warming_rate_decade": round(warming_rate_decade, 3),
        "prediction_2026": round(prediction_2026, 2),
        "yearly_data": {y: round(yearly_avgs[y], 2) for y in valid_years},
        "data_source": "Open-Meteo Historical Weather API (ERA5 Reanalysis)"
    }

def main():
    print("Starting Global Warming Trend analysis on RAW data...")
    cities = load_cities_list()
    print(f"Loaded {len(cities)} cities.")
    
    results = []
    
    for i, city in enumerate(cities):
        stats = analyze_city(city)
        if stats:
            results.append(stats)
        
        if (i+1) % 50 == 0:
            print(f"Processed {i+1} cities...")
            
    print(f"Analysis complete. Valid results: {len(results)}")
    
    if not results:
        print("No valid results found. Check raw data.")
        return
        
    # Sort and Aggregate
    results.sort(key=lambda x: x["warming_rate_decade"], reverse=True)
    
    continents = ["Europe", "Americas", "Asia", "Africa", "Oceania"]
    continent_stats = {}
    
    for cont in continents:
        cont_cities = [c for c in results if c["continent"] == cont]
        if cont_cities:
            avg_rate = statistics.mean([c["warming_rate_decade"] for c in cont_cities])
            continent_stats[cont] = {
                "cities_count": len(cont_cities),
                "avg_warming_rate_decade": round(avg_rate, 3),
                "fastest_city": max(cont_cities, key=lambda x: x["warming_rate_decade"])["name"]
            }
            
    global_slope = statistics.mean([c["warming_rate_decade"] for c in results])
    
    output_data = {
        "meta": {
            "title": "Global Warming Index 2026",
            "global_warming_rate_decade": round(global_slope, 3),
            "data_source": "Open-Meteo Historical Weather API (ERA5 Reanalysis)",
            "methodology": "Linear regression of annual mean temperatures (daily max+min/2) over ~30 years (1996-2025)",
            "generated_at": "2025-12-26"
        },
        "continent_stats": continent_stats,
        "top_warming_cities": results[:25],
        "top_cooling_cities": results[-10:],
        "full_dataset_link": "/research/global-warming-2026"
    }
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=4)
        
    print(f"Data saved to {OUTPUT_FILE}")
    print(f"Global Avg Warming Rate: {global_slope:.3f} °C/decade")

if __name__ == "__main__":
    main()
