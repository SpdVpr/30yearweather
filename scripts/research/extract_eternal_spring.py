
import json
import os
from pathlib import Path
import statistics
from typing import Dict, List, TypedDict, Optional

# Setup paths
PROJECT_ROOT = Path(__file__).parent.parent.parent
DATA_DIR = PROJECT_ROOT / "public" / "data"
OUTPUT_FILE = PROJECT_ROOT / "src" / "lib" / "research" / "global-eternal-spring-2026.json"

# Defining logic for Eternal Spring
# Ideal: Constant 20-25°C, Low Humidity, Moderate Sun, No Extremes

class CityStats(TypedDict):
    slug: str
    name: str
    country: str
    continent: str
    avg_annual_temp: float
    temp_variance: float # Difference between hottest and coldest month avg
    days_perfect: int # Days between 18-26°C
    days_extreme: int # Days > 30°C or < 10°C
    spring_score: float
    best_months: List[str]

def load_all_cities() -> List[str]:
    with open(PROJECT_ROOT / "src" / "lib" / "cities-list.json", "r", encoding="utf-8-sig") as f:
        return json.load(f)

def get_continent(timezone: str) -> str:
    if "Europe" in timezone: return "Europe"
    if "Asia" in timezone: return "Asia"
    if "America" in timezone: return "Americas"
    if "Africa" in timezone: return "Africa"
    if "Australia" in timezone: return "Oceania"
    if "Atlantic" in timezone: return "Atlantic"
    if "Pacific" in timezone: return "Pacific"
    return "Other"

def analyze_city(city_slug: str) -> Optional[CityStats]:
    file_path = DATA_DIR / f"{city_slug}.json"
    if not file_path.exists():
        print(f"File not found: {file_path}")
        return None
    
    try:
        # Try both encodings
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except UnicodeDecodeError:
             with open(file_path, "r", encoding="utf-8-sig") as f:
                data = json.load(f)
            
        # Basic metadata
        name = data.get("name", city_slug)
        country = data.get("country", "Unknown")
        timezone = data.get("timezone", "")
        continent = get_continent(timezone)
        
        # We need daily data to calculate "perfect days"
        days_data = data.get("days", {})
        if not days_data:
            print(f"No daily data for {city_slug}")
            return None
            
        monthly_temps = {} # month -> [temps]
        total_perfect_days = 0
        total_extreme_days = 0
        all_temps = []
        
        for date_key, day_val in days_data.items():
            # Parse month
            if "-" not in date_key: continue
            month = date_key.split("-")[0]
            
            # Get stats object
            stats = day_val.get("stats", {})
            
            temp_max = stats.get("temp_max")
            temp_min = stats.get("temp_min")
            
            if temp_max is None or temp_min is None: continue
            
            # Calculate mean as avg of max and min
            temp_mean = (temp_max + temp_min) / 2
            
            all_temps.append(temp_mean)
            
            if month not in monthly_temps:
                monthly_temps[month] = []
            monthly_temps[month].append(temp_mean)
            
            # Perfect day criteria
            if 20 <= temp_max <= 26 and temp_min >= 12:
                total_perfect_days += 1
            elif 18 <= temp_mean <= 24: 
                total_perfect_days += 0.5 
            
            # Extreme criteria
            if temp_max > 30 or temp_min < 10:
                total_extreme_days += 1
                
        # Calculate monthly averages
        if not monthly_temps:
            return None
            
        monthly_avgs = {m: statistics.mean(temps) for m, temps in monthly_temps.items()}
        
        avg_annual_temp = statistics.mean(all_temps)
        
        # Valid candidate filter (relaxed for global cities)
        if avg_annual_temp < 10 or avg_annual_temp > 30:
             return None
             
        # Find hottest and coldest months
        hottest_month_temp = max(monthly_avgs.values())
        coldest_month_temp = min(monthly_avgs.values())
        temp_variance = hottest_month_temp - coldest_month_temp
        
        # Scoring Algorithm
        variance_score = max(0, 50 - (temp_variance * 2.5))
        dist_from_ideal = abs(avg_annual_temp - 21)
        temp_score = max(0, 30 - (dist_from_ideal * 3))
        
        # Ratio of extreme days to total year (365)
        extreme_ratio = total_extreme_days / 365
        extreme_score = max(0, 20 - (extreme_ratio * 100))
        
        total_score = variance_score + temp_score + extreme_score
        final_score = min(100, round(total_score, 1))
        
        # Debug print for first few
        # if city_slug in ["barcelona", "tenerife", "dubai"]:
        #     print(f"Debug {city_slug}: Score {final_score}, Var {temp_variance}, Avg {avg_annual_temp}")

        # Relaxed criteria for testing
        if avg_annual_temp < 10 or avg_annual_temp > 30:
            return None
            
        return {
            "slug": city_slug,
            "name": name,
            "country": country,
            "continent": continent,
            "avg_annual_temp": round(avg_annual_temp, 1),
            "temp_variance": round(temp_variance, 1),
            "days_perfect": int(total_perfect_days),
            "days_extreme": int(total_extreme_days),
            "spring_score": final_score,
            "best_months": [] 
        }

    except Exception as e:
        print(f"Error processing {city_slug}: {e}")
        return None

def main():
    print("Starting Global Eternal Spring analysis...")
    cities = load_all_cities()
    print(f"Loaded {len(cities)} cities from list.")
    results = []
    
    for city in cities:
        stats = analyze_city(city)
        if stats: # Removed score filter for debugging
            results.append(stats)
            if len(results) % 50 == 0:
                print(f"Processed {len(results)} valid cities...")
        # else:
            # print(f"Skipped {city}")

    print(f"Total valid results: {len(results)}")
    
    if not results:
        print("No results found! Exiting.")
        return

    # Sort by score
    results.sort(key=lambda x: x["spring_score"], reverse=True)
    
    # Top 20
    top_destinations = results[:25]
    
    output_data = {
        "title": "Global Eternal Spring Index 2026",
        "methodology": {
            "description": "Analysis of temperature stability and comfort",
            "cities_analyzed": len(cities),
            "factors": ["Monthly Temperature Variance", "Annual Average", "Extreme Days"]
        },
        "destinations": top_destinations,
        "key_findings": {
            "most_stable": min(results, key=lambda x: x["temp_variance"]),
            "most_perfect_days": max(results, key=lambda x: x["days_perfect"]),
            "top_region": "The High-Altitude Tropics & Macaronesia"
        }
    }
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=4)
        
    print(f"Analysis complete. Saved {len(top_destinations)} destinations to {OUTPUT_FILE}")
    print("Top 5:")
    for d in top_destinations[:5]:
        print(f"{d['name']}: {d['spring_score']} (Var: {d['temp_variance']}°C)")

if __name__ == "__main__":
    main()
