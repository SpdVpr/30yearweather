"""
Extract beach destination data from raw marine files.
Uses backend/data/raw_marine for water temperature data.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, List
from dataclasses import dataclass

# European beach destinations that have marine data
BEACH_DESTINATIONS = {
    "antalya": {"name": "Antalya", "country": "Turkey"},
    "azores": {"name": "Azores", "country": "Portugal"},
    "barcelona": {"name": "Barcelona", "country": "Spain"},
    "batumi": {"name": "Batumi", "country": "Georgia"},
    "bodrum": {"name": "Bodrum", "country": "Turkey"},
    "cagliari": {"name": "Cagliari", "country": "Italy"},
    "cinque-terre": {"name": "Cinque Terre", "country": "Italy"},
    "crete": {"name": "Crete", "country": "Greece"},
    "dubrovnik": {"name": "Dubrovnik", "country": "Croatia"},
    "faro": {"name": "Faro", "country": "Portugal"},
    "gran-canaria": {"name": "Gran Canaria", "country": "Spain"},
    "ibiza": {"name": "Ibiza", "country": "Spain"},
    "lanzarote": {"name": "Lanzarote", "country": "Spain"},
    "las-palmas": {"name": "Las Palmas", "country": "Spain"},
    "lisbon": {"name": "Lisbon", "country": "Portugal"},
    "malaga": {"name": "Málaga", "country": "Spain"},
    "marseille": {"name": "Marseille", "country": "France"},
    "mykonos": {"name": "Mykonos", "country": "Greece"},
    "nafplio": {"name": "Nafplio", "country": "Greece"},
    "naples": {"name": "Naples", "country": "Italy"},
    "nice": {"name": "Nice", "country": "France"},
    "palma-mallorca": {"name": "Palma de Mallorca", "country": "Spain"},
    "paros": {"name": "Paros", "country": "Greece"},
    "piran": {"name": "Piran", "country": "Slovenia"},
    "porto": {"name": "Porto", "country": "Portugal"},
    "positano": {"name": "Positano", "country": "Italy"},
    "reggio-calabria": {"name": "Reggio Calabria", "country": "Italy"},
    "rhodes": {"name": "Rhodes", "country": "Greece"},
    "santorini": {"name": "Santorini", "country": "Greece"},
    "sorrento": {"name": "Sorrento", "country": "Italy"},
    "split": {"name": "Split", "country": "Croatia"},
    "tenerife": {"name": "Tenerife", "country": "Spain"},
    "valencia": {"name": "Valencia", "country": "Spain"},
    "valletta": {"name": "Valletta", "country": "Malta"},
    "venice": {"name": "Venice", "country": "Italy"},
}


def analyze_marine_data(slug: str, marine_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Analyze marine data and calculate monthly statistics."""
    
    times = marine_data.get("hourly", {}).get("time", [])
    temps = marine_data.get("hourly", {}).get("sea_surface_temperature", [])
    
    if not times or not temps:
        return None
    
    # Group by month
    monthly_temps: Dict[int, List[float]] = {i: [] for i in range(1, 13)}
    
    for i, time_str in enumerate(times):
        if i < len(temps) and temps[i] is not None:
            try:
                month = int(time_str[5:7])
                monthly_temps[month].append(temps[i])
            except (ValueError, IndexError):
                continue
    
    # Calculate monthly averages
    monthly_stats = {}
    for month in range(1, 13):
        if monthly_temps[month]:
            avg_temp = sum(monthly_temps[month]) / len(monthly_temps[month])
            monthly_stats[month] = round(avg_temp, 1)
        else:
            monthly_stats[month] = None
    
    # Calculate summer score (June-September)
    summer_temps = [monthly_stats[m] for m in [6, 7, 8, 9] if monthly_stats[m]]
    
    if not summer_temps:
        return None
    
    avg_summer_water = sum(summer_temps) / len(summer_temps)
    
    # Peak water temp
    valid_temps = [(m, t) for m, t in monthly_stats.items() if t is not None]
    if not valid_temps:
        return None
    
    peak_month, peak_temp = max(valid_temps, key=lambda x: x[1])
    
    # Count swimming season months (water >= 20°C)
    swimming_months = sum(1 for t in monthly_stats.values() if t and t >= 20)
    
    # Calculate beach score (simplified)
    # Water temp ideal: 22-26°C = 35 pts, 20-22/26-28 = 28 pts, etc.
    base_score = 0
    if 22 <= avg_summer_water <= 26:
        base_score = 35
    elif 20 <= avg_summer_water <= 28:
        base_score = 28
    elif 18 <= avg_summer_water <= 30:
        base_score = 20
    else:
        base_score = 10
    
    # Add points for swimming season length
    season_bonus = min(swimming_months * 3, 25)  # Up to 25 pts
    
    # Stability bonus (consistent warm temps)
    stability_bonus = 15 if peak_temp - avg_summer_water < 3 else 10
    
    # Calculate final summer score
    summer_score = round(base_score + season_bonus + stability_bonus, 1)
    
    month_names = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    return {
        "slug": slug,
        "avg_summer_water_temp": round(avg_summer_water, 1),
        "peak_water_temp": peak_temp,
        "peak_water_month": month_names[peak_month],
        "swimming_season_months": swimming_months,
        "summer_score": summer_score,
        "monthly_water_temps": {month_names[m]: t for m, t in monthly_stats.items()},
    }


def main():
    """Main function."""
    print("🏖️ Beach Destination Index - Data Extraction from Marine Data")
    print("=" * 60)
    
    marine_dir = Path(__file__).parent.parent.parent / "backend" / "data" / "raw_marine"
    output_dir = Path(__file__).parent.parent.parent / "src" / "lib" / "research"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    results = []
    
    for slug, info in BEACH_DESTINATIONS.items():
        marine_file = marine_dir / f"{slug}_marine.json"
        
        if not marine_file.exists():
            print(f"  ⚠️ {slug}: No marine data file")
            continue
        
        try:
            with open(marine_file, 'r', encoding='utf-8') as f:
                marine_data = json.load(f)
            
            analysis = analyze_marine_data(slug, marine_data)
            
            if analysis:
                analysis["name"] = info["name"]
                analysis["country"] = info["country"]
                results.append(analysis)
                print(f"  ✓ {info['name']}: Summer water {analysis['avg_summer_water_temp']}°C, Peak {analysis['peak_water_temp']}°C in {analysis['peak_water_month']}")
            else:
                print(f"  ⚠️ {slug}: Could not analyze")
                
        except Exception as e:
            print(f"  ❌ {slug}: {e}")
    
    # Sort by summer score
    results.sort(key=lambda x: x["summer_score"], reverse=True)
    
    # Add rankings
    for i, r in enumerate(results, 1):
        r["rank"] = i
    
    if not results:
        print("\n❌ No results to save!")
        return
    
    # Key findings
    top_destinations = results[:5]
    warmest_water = max(results, key=lambda x: x.get("peak_water_temp") or 0)
    longest_season = max(results, key=lambda x: x.get("swimming_season_months") or 0)
    
    # Save
    output_file = output_dir / "beach-index-2025.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "title": "Beach Destination Index 2025",
            "subtitle": "Best European Beach Destinations Based on 30 Years of Water Temperature Data",
            "generated": datetime.now().isoformat(),
            "methodology": {
                "data_years": 30,
                "destinations_analyzed": len(results),
                "factors": [
                    "Summer water temperature (avg June-September)",
                    "Peak water temperature and timing",
                    "Swimming season length (months with water >= 20°C)",
                    "Temperature stability"
                ],
                "season_months": ["June", "July", "August", "September"]
            },
            "key_findings": {
                "top_destinations": [{"name": d["name"], "score": d["summer_score"], "water_temp": d["avg_summer_water_temp"]} for d in top_destinations],
                "warmest_water": {
                    "destination": warmest_water["name"],
                    "peak_temp": warmest_water.get("peak_water_temp"),
                    "peak_month": warmest_water.get("peak_water_month")
                },
                "longest_swimming_season": {
                    "destination": longest_season["name"],
                    "months": longest_season.get("swimming_season_months")
                }
            },
            "destinations": results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Analysis complete! Saved to: {output_file}")
    print(f"\n🏆 Top 5 Beach Destinations by Water Temperature:")
    for i, r in enumerate(results[:5], 1):
        print(f"   {i}. {r['name']} ({r['country']}) - Water: {r['avg_summer_water_temp']}°C, Score: {r['summer_score']}")


if __name__ == "__main__":
    main()
