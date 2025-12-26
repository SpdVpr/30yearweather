"""
Shoulder Season Index 2025: Data Extraction Script
Analyzes 30 years of weather data to find the best shoulder season months for each destination.

A good shoulder season month has:
- Pleasant temperature (18-26°C ideal)
- Low rain probability (<30%)
- Lower tourist crowds (based on flight data)
- Good sunshine hours (>6h)
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any
from dataclasses import dataclass
from datetime import datetime

# European cities from the dataset
EUROPEAN_CITIES = [
    "amsterdam", "antalya", "antwerp", "athens", "azores", "barcelona", "basel",
    "batumi", "bergen", "berlin", "bilbao", "bodrum", "bologna", "bordeaux",
    "bratislava", "bruges", "brussels", "budapest", "budva", "cagliari",
    "cappadocia", "cinque-terre", "copenhagen", "cordoba", "crete", "dublin",
    "dubrovnik", "dusseldorf", "edinburgh", "faro", "florence", "ghent",
    "gran-canaria", "hamburg", "helsinki", "ibiza", "innsbruck", "interlaken",
    "istanbul", "killarney", "kotor", "krakow", "lanzarote", "las-palmas",
    "lisbon", "ljubljana", "london", "lyon", "madeira", "madrid", "malaga",
    "marseille", "matera", "munich", "mykonos", "nafplio", "naples", "nice",
    "oslo", "palma-mallorca", "paris", "paros", "piran", "podgorica", "porto",
    "positano", "prague", "reggio-calabria", "reykjavik", "rhodes", "riga",
    "rome", "rotterdam", "salzburg", "santorini", "sarande", "seville",
    "skopje", "sofia", "sorrento", "split", "stockholm", "stuttgart",
    "tallinn", "tartu", "tbilisi", "tenerife", "thessaloniki", "tirana",
    "valencia", "valletta", "venice", "vienna", "warsaw", "yerevan", "zurich"
]

# Beach destinations subset (coastal + warm water potential)
BEACH_DESTINATIONS = [
    "antalya", "azores", "barcelona", "bodrum", "budva", "cagliari", "crete",
    "dubrovnik", "faro", "gran-canaria", "ibiza", "kotor", "lanzarote",
    "las-palmas", "lisbon", "madeira", "malaga", "mykonos", "nafplio", "naples",
    "nice", "palma-mallorca", "paros", "piran", "porto", "positano",
    "reggio-calabria", "rhodes", "santorini", "sarande", "seville", "sorrento",
    "split", "tenerife", "valencia", "valletta", "venice"
]

@dataclass
class MonthlyStats:
    """Monthly weather statistics for a destination."""
    month: int
    avg_temp: float
    rain_prob: float
    sunshine_hours: float
    humidity: float
    flight_pressure: int  # 0-100, higher = more tourists
    water_temp: float = None
    
    @property
    def shoulder_score(self) -> float:
        """
        Calculate shoulder season score (0-100).
        Higher is better for shoulder season travel.
        """
        score = 0.0
        
        # Temperature score (18-26°C is ideal, 40 points max)
        if 18 <= self.avg_temp <= 26:
            temp_score = 40
        elif 15 <= self.avg_temp < 18 or 26 < self.avg_temp <= 30:
            temp_score = 30
        elif 10 <= self.avg_temp < 15 or 30 < self.avg_temp <= 35:
            temp_score = 15
        else:
            temp_score = 5
        score += temp_score
        
        # Rain probability score (lower is better, 25 points max)
        if self.rain_prob < 15:
            rain_score = 25
        elif self.rain_prob < 25:
            rain_score = 20
        elif self.rain_prob < 35:
            rain_score = 15
        elif self.rain_prob < 50:
            rain_score = 10
        else:
            rain_score = 5
        score += rain_score
        
        # Tourist crowd score (lower flight pressure = better, 20 points max)
        # Shoulder season should have fewer crowds
        crowd_score = 20 * (1 - self.flight_pressure / 100)
        score += crowd_score
        
        # Sunshine hours score (6+ hours is good, 15 points max)
        if self.sunshine_hours >= 10:
            sun_score = 15
        elif self.sunshine_hours >= 8:
            sun_score = 12
        elif self.sunshine_hours >= 6:
            sun_score = 9
        else:
            sun_score = 5
        score += sun_score
        
        return round(score, 1)


@dataclass
class DestinationAnalysis:
    """Complete shoulder season analysis for a destination."""
    slug: str
    name: str
    country: str
    is_coastal: bool
    monthly_stats: List[MonthlyStats]
    warming_trend: float
    
    @property
    def best_shoulder_months(self) -> List[Dict]:
        """
        Find the best shoulder season months.
        Shoulder season = April-May (spring) or September-October (fall)
        """
        shoulder_months = [4, 5, 9, 10]  # April, May, September, October
        results = []
        
        for month_idx in shoulder_months:
            stats = self.monthly_stats[month_idx - 1]
            results.append({
                "month": month_idx,
                "month_name": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month_idx - 1],
                "score": stats.shoulder_score,
                "temp": stats.avg_temp,
                "rain_prob": stats.rain_prob,
                "sunshine": stats.sunshine_hours,
                "crowds": stats.flight_pressure,
                "water_temp": stats.water_temp
            })
        
        return sorted(results, key=lambda x: x["score"], reverse=True)
    
    @property
    def peak_vs_shoulder_savings(self) -> Dict:
        """Calculate the advantage of shoulder vs peak season."""
        peak_months = [7, 8]  # July, August
        shoulder_months = [5, 9]  # May, September
        
        peak_crowds = sum(self.monthly_stats[m-1].flight_pressure for m in peak_months) / 2
        shoulder_crowds = sum(self.monthly_stats[m-1].flight_pressure for m in shoulder_months) / 2
        
        return {
            "crowd_reduction": round(peak_crowds - shoulder_crowds, 1),
            "peak_crowds": round(peak_crowds, 1),
            "shoulder_crowds": round(shoulder_crowds, 1)
        }
    
    @property
    def overall_shoulder_score(self) -> float:
        """Average shoulder season score across spring and fall."""
        best = self.best_shoulder_months
        return round(sum(m["score"] for m in best) / len(best), 1)


def load_city_data(city_slug: str, data_dir: Path) -> Dict[str, Any]:
    """Load city JSON data."""
    file_path = data_dir / f"{city_slug}.json"
    if not file_path.exists():
        return None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def analyze_city(city_slug: str, data: Dict[str, Any]) -> DestinationAnalysis:
    """Analyze a city's shoulder season potential."""
    meta = data.get("meta", {})
    yearly = data.get("yearly_stats", {})
    days = data.get("days", {})
    
    # Get flight seasonality
    flight_info = meta.get("flight_info", {})
    seasonality = flight_info.get("seasonality", {})
    
    # Calculate max flights for normalization
    max_flights = max(seasonality.values()) if seasonality else 1
    
    # Calculate monthly statistics
    monthly_stats = []
    
    for month in range(1, 13):
        month_key = str(month)
        month_prefix = f"{month:02d}-"
        
        # Aggregate daily data for this month
        temps = []
        rain_probs = []
        sunshine_hours = []
        humidities = []
        water_temps = []
        
        for date_key, day_data in days.items():
            if date_key.startswith(month_prefix):
                stats = day_data.get("stats", {})
                temps.append(stats.get("temp_max", 20))
                rain_probs.append(stats.get("precip_prob", 0))
                sunshine_hours.append(stats.get("sunshine_hours", 6))
                humidities.append(stats.get("humidity_percent", 50))
                
                marine = day_data.get("marine", {})
                if marine and marine.get("water_temp"):
                    water_temps.append(marine["water_temp"])
        
        # Calculate averages
        avg_temp = sum(temps) / len(temps) if temps else 20
        avg_rain = sum(rain_probs) / len(rain_probs) if rain_probs else 0
        avg_sunshine = sum(sunshine_hours) / len(sunshine_hours) if sunshine_hours else 6
        avg_humidity = sum(humidities) / len(humidities) if humidities else 50
        avg_water = sum(water_temps) / len(water_temps) if water_temps else None
        
        # Flight pressure (normalized 0-100)
        flights = seasonality.get(month_key, 0)
        flight_pressure = int((flights / max_flights) * 100) if max_flights > 1 else 50
        
        monthly_stats.append(MonthlyStats(
            month=month,
            avg_temp=round(avg_temp, 1),
            rain_prob=round(avg_rain, 1),
            sunshine_hours=round(avg_sunshine, 1),
            humidity=round(avg_humidity, 1),
            flight_pressure=flight_pressure,
            water_temp=round(avg_water, 1) if avg_water else None
        ))
    
    return DestinationAnalysis(
        slug=city_slug,
        name=meta.get("name", city_slug.replace("-", " ").title()),
        country=meta.get("country", ""),
        is_coastal=meta.get("is_coastal", False),
        monthly_stats=monthly_stats,
        warming_trend=yearly.get("warming_trend", 0)
    )


def main():
    """Main function to extract and analyze shoulder season data."""
    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent
    data_dir = project_root / "public" / "data"
    output_dir = project_root / "src" / "lib" / "research"
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"🔍 Analyzing {len(EUROPEAN_CITIES)} European destinations...")
    print(f"📂 Data directory: {data_dir}")
    
    results = []
    
    for city_slug in EUROPEAN_CITIES:
        data = load_city_data(city_slug, data_dir)
        if not data:
            print(f"  ⚠️  Missing data: {city_slug}")
            continue
        
        analysis = analyze_city(city_slug, data)
        
        # Get best months
        best = analysis.best_shoulder_months
        savings = analysis.peak_vs_shoulder_savings
        
        results.append({
            "slug": analysis.slug,
            "name": analysis.name,
            "country": analysis.country,
            "is_coastal": analysis.is_coastal,
            "overall_score": analysis.overall_shoulder_score,
            "best_month": best[0]["month_name"],
            "best_month_score": best[0]["score"],
            "best_month_temp": best[0]["temp"],
            "best_month_rain": best[0]["rain_prob"],
            "best_month_water_temp": best[0].get("water_temp"),
            "spring_score": round((best[0]["score"] + best[1]["score"]) / 2 if len(best) >= 2 else best[0]["score"], 1),
            "fall_score": round((best[2]["score"] + best[3]["score"]) / 2 if len(best) >= 4 else best[0]["score"], 1),
            "crowd_reduction": savings["crowd_reduction"],
            "warming_trend": analysis.warming_trend,
            "all_months": [
                {
                    "month": best[i]["month"],
                    "name": best[i]["month_name"],
                    "score": best[i]["score"],
                    "temp": best[i]["temp"],
                    "rain": best[i]["rain_prob"],
                    "water": best[i].get("water_temp")
                }
                for i in range(len(best))
            ]
        })
        
        print(f"  ✅ {analysis.name}: Best shoulder month = {best[0]['month_name']} (score: {best[0]['score']})")
    
    # Sort by overall score
    results.sort(key=lambda x: x["overall_score"], reverse=True)
    
    # Add rank
    for i, r in enumerate(results):
        r["rank"] = i + 1
    
    # Save results
    output_file = output_dir / "shoulder-season-2025.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump({
            "title": "Shoulder Season Index 2025",
            "subtitle": "Best Time to Visit European Destinations Based on 30 Years of Weather Data",
            "generated": datetime.now().isoformat(),
            "methodology": {
                "data_years": 30,
                "cities_analyzed": len(results),
                "factors": [
                    "Temperature (18-26°C ideal)",
                    "Rain probability (<30% preferred)",
                    "Tourist crowds (flight data)",
                    "Sunshine hours (6+ hours ideal)"
                ],
                "shoulder_months": ["April", "May", "September", "October"]
            },
            "key_findings": {
                "best_spring_destinations": [r for r in results if r["spring_score"] == max(x["spring_score"] for x in results)][:3],
                "best_fall_destinations": [r for r in results if r["fall_score"] == max(x["fall_score"] for x in results)][:3],
                "biggest_crowd_savings": sorted(results, key=lambda x: x["crowd_reduction"], reverse=True)[:5],
                "climate_change_impact": sorted(results, key=lambda x: x["warming_trend"], reverse=True)[:5]
            },
            "destinations": results
        }, f, indent=2, ensure_ascii=False)
    
    print(f"\n✨ Analysis complete! Saved to: {output_file}")
    print(f"📊 Top 5 Shoulder Season Destinations:")
    for i, r in enumerate(results[:5]):
        print(f"   {i+1}. {r['name']} ({r['country']}) - Score: {r['overall_score']}")
    
    return results


if __name__ == "__main__":
    main()
