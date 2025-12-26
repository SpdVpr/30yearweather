"""
Extract Winter Sun Destinations data from daily weather data.
Analyzes destinations for winter (Nov-Feb) weather conditions.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, List

# Destinations that could offer winter sun
WINTER_DESTINATIONS = [
    # Canary Islands
    "gran-canaria", "tenerife", "lanzarote", "las-palmas", "fuerteventura",
    # Madeira & Azores
    "madeira", "azores",
    # Southern Spain
    "malaga", "seville", "valencia", "barcelona",
    # Portugal
    "lisbon", "faro", "porto",
    # Greece
    "athens", "crete", "rhodes", "santorini", "mykonos",
    # Italy
    "rome", "naples", "cagliari",
    # Croatia/Adriatic
    "dubrovnik", "split",
    # Malta
    "valletta",
    # Turkey
    "antalya", "bodrum", "istanbul",
    # Morocco
    "marrakech", "casablanca",
    # Egypt
    "hurghada", "sharm-el-sheikh",
    # Middle East
    "dubai", "tel-aviv",
]

# City metadata fallback
CITY_INFO = {
    "gran-canaria": {"name": "Gran Canaria", "country": "Spain"},
    "tenerife": {"name": "Tenerife", "country": "Spain"},
    "lanzarote": {"name": "Lanzarote", "country": "Spain"},
    "las-palmas": {"name": "Las Palmas", "country": "Spain"},
    "fuerteventura": {"name": "Fuerteventura", "country": "Spain"},
    "madeira": {"name": "Madeira", "country": "Portugal"},
    "azores": {"name": "Azores", "country": "Portugal"},
    "malaga": {"name": "Málaga", "country": "Spain"},
    "seville": {"name": "Seville", "country": "Spain"},
    "valencia": {"name": "Valencia", "country": "Spain"},
    "barcelona": {"name": "Barcelona", "country": "Spain"},
    "lisbon": {"name": "Lisbon", "country": "Portugal"},
    "faro": {"name": "Faro", "country": "Portugal"},
    "porto": {"name": "Porto", "country": "Portugal"},
    "athens": {"name": "Athens", "country": "Greece"},
    "crete": {"name": "Crete", "country": "Greece"},
    "rhodes": {"name": "Rhodes", "country": "Greece"},
    "santorini": {"name": "Santorini", "country": "Greece"},
    "mykonos": {"name": "Mykonos", "country": "Greece"},
    "rome": {"name": "Rome", "country": "Italy"},
    "naples": {"name": "Naples", "country": "Italy"},
    "cagliari": {"name": "Cagliari", "country": "Italy"},
    "dubrovnik": {"name": "Dubrovnik", "country": "Croatia"},
    "split": {"name": "Split", "country": "Croatia"},
    "valletta": {"name": "Valletta", "country": "Malta"},
    "antalya": {"name": "Antalya", "country": "Turkey"},
    "bodrum": {"name": "Bodrum", "country": "Turkey"},
    "istanbul": {"name": "Istanbul", "country": "Turkey"},
    "marrakech": {"name": "Marrakech", "country": "Morocco"},
    "casablanca": {"name": "Casablanca", "country": "Morocco"},
    "hurghada": {"name": "Hurghada", "country": "Egypt"},
    "sharm-el-sheikh": {"name": "Sharm El Sheikh", "country": "Egypt"},
    "dubai": {"name": "Dubai", "country": "UAE"},
    "tel-aviv": {"name": "Tel Aviv", "country": "Israel"},
}

# Winter months mapping (MM)
WINTER_MONTHS = {
    "11": "Nov",
    "12": "Dec",
    "01": "Jan",
    "02": "Feb"
}


def analyze_winter_weather(slug: str, city_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Analyze winter weather from city daily data."""
    
    meta = city_data.get("meta", {})
    days = city_data.get("days", {})
    
    if not days:
        return None
    
    # Collect winter data
    monthly_data = {m: {"temps": [], "sunshine": [], "rain_prob": []} for m in WINTER_MONTHS.keys()}
    
    for day_key, day_data in days.items():
        month = day_key[:2]  # "MM-DD" -> "MM"
        
        if month in WINTER_MONTHS:
            stats = day_data.get("stats", {})
            
            # Get average temp from max and min
            temp_max = stats.get("temp_max")
            temp_min = stats.get("temp_min")
            
            if temp_max is not None and temp_min is not None:
                avg_temp = (temp_max + temp_min) / 2
                monthly_data[month]["temps"].append(avg_temp)
            
            sunshine = stats.get("sunshine_hours")
            if sunshine is not None:
                monthly_data[month]["sunshine"].append(sunshine)
            
            rain_prob = stats.get("precip_prob")
            if rain_prob is not None:
                monthly_data[month]["rain_prob"].append(rain_prob)
    
    # Calculate monthly averages
    winter_stats = {}
    for month, data in monthly_data.items():
        if data["temps"]:
            winter_stats[WINTER_MONTHS[month]] = {
                "avg_temp": round(sum(data["temps"]) / len(data["temps"]), 1),
                "sunshine": round(sum(data["sunshine"]) / len(data["sunshine"]), 1) if data["sunshine"] else 5,
                "rain_prob": round(sum(data["rain_prob"]) / len(data["rain_prob"]), 1) if data["rain_prob"] else 30
            }
    
    if not winter_stats:
        return None
    
    # Calculate overall winter averages
    all_temps = [s["avg_temp"] for s in winter_stats.values()]
    all_sunshine = [s["sunshine"] for s in winter_stats.values()]
    all_rain = [s["rain_prob"] for s in winter_stats.values()]
    
    avg_temp = sum(all_temps) / len(all_temps)
    avg_sunshine = sum(all_sunshine) / len(all_sunshine)
    avg_rain = sum(all_rain) / len(all_rain)
    
    # Find best winter month
    best_month = max(winter_stats.items(), key=lambda x: x[1]["avg_temp"] + x[1]["sunshine"] - x[1]["rain_prob"]/10)
    
    # Calculate Winter Sun Score (0-100)
    score = 0.0
    
    # Temperature score (max 40 pts) - higher is better for winter sun
    if avg_temp >= 22:
        score += 40
    elif avg_temp >= 18:
        score += 35
    elif avg_temp >= 14:
        score += 28
    elif avg_temp >= 10:
        score += 20
    elif avg_temp >= 6:
        score += 12
    else:
        score += 5
    
    # Sunshine score (max 30 pts) - more sunshine = better
    if avg_sunshine >= 8:
        score += 30
    elif avg_sunshine >= 6:
        score += 25
    elif avg_sunshine >= 5:
        score += 18
    elif avg_sunshine >= 4:
        score += 12
    else:
        score += 5
    
    # Rain score (max 30 pts) - less rain = better
    if avg_rain < 10:
        score += 30
    elif avg_rain < 20:
        score += 25
    elif avg_rain < 30:
        score += 18
    elif avg_rain < 45:
        score += 12
    else:
        score += 5
    
    return {
        "slug": slug,
        "name": meta.get("name", CITY_INFO.get(slug, {}).get("name", slug.title())),
        "country": meta.get("country", CITY_INFO.get(slug, {}).get("country", "Unknown")),
        "winter_sun_score": round(score, 1),
        "avg_temp": round(avg_temp, 1),
        "avg_sunshine_hours": round(avg_sunshine, 1),
        "avg_rain_prob": round(avg_rain, 1),
        "best_winter_month": best_month[0],
        "best_month_temp": best_month[1]["avg_temp"],
        "monthly_data": winter_stats
    }


def main():
    """Main function."""
    print("☀️ Winter Sun Destinations Index - Data Extraction")
    print("=" * 60)
    
    data_dir = Path(__file__).parent.parent.parent / "public" / "data"
    output_dir = Path(__file__).parent.parent.parent / "src" / "lib" / "research"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    results = []
    
    for slug in WINTER_DESTINATIONS:
        city_file = data_dir / f"{slug}.json"
        
        if not city_file.exists():
            print(f"  ⚠️ {slug}: No data file")
            continue
        
        try:
            with open(city_file, 'r', encoding='utf-8') as f:
                city_data = json.load(f)
            
            analysis = analyze_winter_weather(slug, city_data)
            
            if analysis:
                results.append(analysis)
                print(f"  ✓ {analysis['name']}: {analysis['avg_temp']}°C, {analysis['avg_sunshine_hours']}h sun, Score: {analysis['winter_sun_score']}")
            else:
                print(f"  ⚠️ {slug}: No daily data available")
                
        except Exception as e:
            print(f"  ❌ {slug}: {e}")
    
    if not results:
        print("\n❌ No results!")
        return
    
    # Sort by winter sun score
    results.sort(key=lambda x: x["winter_sun_score"], reverse=True)
    
    # Add rankings
    for i, r in enumerate(results, 1):
        r["rank"] = i
    
    # Key findings
    top_destinations = results[:5]
    warmest = max(results, key=lambda x: x["avg_temp"])
    sunniest = max(results, key=lambda x: x["avg_sunshine_hours"])
    driest = min(results, key=lambda x: x["avg_rain_prob"])
    
    # Save
    output_file = output_dir / "winter-sun-2025.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "title": "Winter Sun Index 2025",
            "subtitle": "Best European & Mediterranean Destinations for Winter Warmth",
            "generated": datetime.now().isoformat(),
            "methodology": {
                "data_years": 30,
                "destinations_analyzed": len(results),
                "winter_months": ["November", "December", "January", "February"],
                "factors": [
                    "Average temperature (40 pts) - 18°C+ ideal",
                    "Daily sunshine hours (30 pts) - 6+ hours ideal",
                    "Rain probability (30 pts) - <20% ideal"
                ]
            },
            "key_findings": {
                "top_destinations": [
                    {"name": d["name"], "score": d["winter_sun_score"], "temp": d["avg_temp"]} 
                    for d in top_destinations
                ],
                "warmest": {
                    "destination": warmest["name"],
                    "avg_temp": warmest["avg_temp"],
                    "country": warmest["country"]
                },
                "sunniest": {
                    "destination": sunniest["name"],
                    "sunshine_hours": sunniest["avg_sunshine_hours"],
                    "country": sunniest["country"]
                },
                "driest": {
                    "destination": driest["name"],
                    "rain_prob": driest["avg_rain_prob"],
                    "country": driest["country"]
                }
            },
            "destinations": results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Analysis complete! Saved to: {output_file}")
    print(f"\n☀️ Top 5 Winter Sun Destinations:")
    for i, r in enumerate(results[:5], 1):
        print(f"   {i}. {r['name']} ({r['country']}) - {r['avg_temp']}°C, {r['avg_sunshine_hours']}h sun, Score: {r['winter_sun_score']}")


if __name__ == "__main__":
    main()
