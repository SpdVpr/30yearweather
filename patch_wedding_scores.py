"""
Patch script to recalculate Wedding Scores for all cities.

The previous logic used strict binary thresholds that produced unrealistic scores
(e.g., Bali on May 11 with 28°C and 36% rain got a score of 10/100).

This script uses a continuous scoring function that penalizes:
- Temperature outside ideal range (18-28°C)
- Rain probability
- High wind speeds
- High humidity (tropical discomfort)
- High cloud cover

Formula Design:
- Start at 100 points
- Penalize for cold/hot temps
- Penalize for rain probability (biggest factor for outdoor events)
- Penalize for wind
- Penalize for humidity if hot
- Bonus for low rain probability
"""

import json
import os
from pathlib import Path


def calculate_wedding_score(
    temp_max: float,
    temp_min: float,
    precip_prob: float,
    precip_mm: float,
    wind_kmh: float,
    humidity: float = 70.0,
    clouds_percent: float = 50.0
) -> int:
    """
    Calculate wedding/outdoor event score (0-100) based on weather conditions.
    
    Ideal conditions:
    - Temperature: 20-26°C (comfortable outdoor)
    - Rain probability: < 20%
    - Wind: < 15 km/h
    - Humidity: < 70%
    - Low cloud cover for photos
    """
    score = 100.0
    
    # === TEMPERATURE (max 30 points penalty) ===
    # Ideal range: 20-26°C
    if temp_max < 15:
        # Too cold - heavy penalty
        score -= (15 - temp_max) * 4
    elif temp_max < 20:
        # Cool - mild penalty  
        score -= (20 - temp_max) * 2
    elif temp_max > 32:
        # Too hot - heavy penalty
        score -= (temp_max - 32) * 4
    elif temp_max > 28:
        # Hot - mild penalty
        score -= (temp_max - 28) * 2
    
    # Night temperature check (too cold evenings are bad for outdoor weddings)
    if temp_min < 10:
        score -= (10 - temp_min) * 1.5
    
    # === RAIN PROBABILITY (max 40 points penalty) ===
    # This is the most important factor for outdoor events
    if precip_prob < 15:
        # Very low rain risk - bonus!
        score += 5
    elif precip_prob < 30:
        # Acceptable risk
        score -= (precip_prob - 15) * 0.3
    elif precip_prob < 50:
        # Moderate risk
        score -= 5 + (precip_prob - 30) * 0.5
    elif precip_prob < 70:
        # High risk
        score -= 15 + (precip_prob - 50) * 0.8
    else:
        # Very high risk - significant penalty
        score -= 31 + (precip_prob - 70) * 1.0
    
    # === WIND (max 15 points penalty) ===
    # Light breeze is fine, strong wind is problematic
    if wind_kmh > 30:
        # Strong wind - major issues
        score -= 15
    elif wind_kmh > 20:
        # Moderate wind - noticeable
        score -= (wind_kmh - 20) * 1.0
    elif wind_kmh > 15:
        # Light to moderate - minor
        score -= (wind_kmh - 15) * 0.5
    
    # === HUMIDITY (max 10 points penalty) ===
    # High humidity in hot weather is uncomfortable
    if temp_max > 25 and humidity > 75:
        # Muggy conditions
        score -= min(10, (humidity - 75) * 0.4)
    
    # === CLOUD COVER (max 5 points penalty) ===
    # Affects photography and ambiance
    if clouds_percent > 80:
        score -= 5
    elif clouds_percent > 60:
        score -= (clouds_percent - 60) * 0.15
    
    # Ensure score is within 0-100
    return max(0, min(100, round(score)))


def patch_city_file(filepath: Path) -> dict:
    """Patch a single city JSON file with recalculated wedding scores."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    city_name = data.get('meta', {}).get('name', filepath.stem)
    changes = []
    
    if 'days' not in data:
        return {'city': city_name, 'status': 'no_days', 'changes': 0}
    
    for date_key, day_data in data['days'].items():
        if 'stats' not in day_data or 'scores' not in day_data:
            continue
        
        stats = day_data['stats']
        old_score = day_data['scores'].get('wedding', 0)
        
        # Calculate new score
        new_score = calculate_wedding_score(
            temp_max=stats.get('temp_max', 20),
            temp_min=stats.get('temp_min', 15),
            precip_prob=stats.get('precip_prob', 0),
            precip_mm=stats.get('precip_mm', 0),
            wind_kmh=stats.get('wind_kmh', 10),
            humidity=stats.get('humidity_percent', 70),
            clouds_percent=stats.get('clouds_percent', 50)
        )
        
        # Update score
        day_data['scores']['wedding'] = new_score
        
        if old_score != new_score:
            changes.append({
                'date': date_key,
                'old': old_score,
                'new': new_score,
                'diff': new_score - old_score
            })
    
    # Save updated file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    return {
        'city': city_name,
        'status': 'updated',
        'changes': len(changes),
        'sample_changes': changes[:5]  # Show first 5 changes as sample
    }


def main():
    """Main function to patch all city files."""
    
    data_dir = Path(__file__).parent / 'public' / 'data'
    
    if not data_dir.exists():
        print(f"❌ Data directory not found: {data_dir}")
        return
    
    json_files = list(data_dir.glob('*.json'))
    
    if not json_files:
        print(f"❌ No JSON files found in {data_dir}")
        return
    
    print(f"🔧 Patching Wedding Scores for {len(json_files)} cities...")
    print(f"📁 Data directory: {data_dir}\n")
    
    total_changes = 0
    results = []
    
    for filepath in sorted(json_files):
        result = patch_city_file(filepath)
        results.append(result)
        total_changes += result['changes']
        
        status_icon = "✅" if result['changes'] > 0 else "⏭️"
        print(f"{status_icon} {result['city']}: {result['changes']} days updated")
        
        # Show sample changes for first few cities
        if result['changes'] > 0 and result.get('sample_changes'):
            for change in result['sample_changes'][:3]:
                print(f"   └─ {change['date']}: {change['old']} → {change['new']} ({change['diff']:+.0f})")
    
    print(f"\n{'='*50}")
    print(f"📊 Summary: {total_changes} total days updated across {len(json_files)} cities")
    
    # Show some examples of the new scoring
    print(f"\n🎯 Wedding Score Examples (new formula):")
    print(f"   • Perfect day (24°C, 10% rain, 10 km/h wind): {calculate_wedding_score(24, 18, 10, 0, 10, 50, 30)}")
    print(f"   • Good day (28°C, 25% rain, 15 km/h wind): {calculate_wedding_score(28, 22, 25, 1, 15, 65, 50)}")
    print(f"   • Bali May 11 (28°C, 36% rain, 17 km/h wind, 81% humidity): {calculate_wedding_score(28, 25.7, 36, 2.2, 16.9, 81, 62)}")
    print(f"   • Rainy day (22°C, 70% rain, 20 km/h wind): {calculate_wedding_score(22, 15, 70, 5, 20, 80, 90)}")
    print(f"   • Cold day (8°C, 40% rain, 25 km/h wind): {calculate_wedding_score(8, 2, 40, 2, 25, 70, 70)}")


if __name__ == "__main__":
    main()
