"""
Patch script to update ETL backend with the new Wedding Score formula.

This script modifies backend/etl.py to replace the old binary threshold-based
wedding score calculation with the new continuous formula.
"""

import re

def get_new_wedding_function():
    """Returns the new wedding score calculation function as a string."""
    return '''
def calculate_wedding_score(temp_max, temp_min, precip_prob, precip_mm, wind_kmh, humidity=70.0, clouds_percent=50.0):
    """
    Calculate wedding/outdoor event score (0-100) based on weather conditions.
    
    Uses a continuous scoring function that penalizes:
    - Temperature outside ideal range (20-26°C for perfect, 15-32°C acceptable)
    - Rain probability (biggest factor for outdoor events)
    - High wind speeds
    - High humidity in hot weather
    - High cloud cover
    """
    score = 100.0
    
    # === TEMPERATURE (max 30 points penalty) ===
    if temp_max < 15:
        score -= (15 - temp_max) * 4
    elif temp_max < 20:
        score -= (20 - temp_max) * 2
    elif temp_max > 32:
        score -= (temp_max - 32) * 4
    elif temp_max > 28:
        score -= (temp_max - 28) * 2
    
    # Night temperature check
    if temp_min < 10:
        score -= (10 - temp_min) * 1.5
    
    # === RAIN PROBABILITY (max 40 points penalty) ===
    if precip_prob < 15:
        score += 5  # Bonus for very low rain risk
    elif precip_prob < 30:
        score -= (precip_prob - 15) * 0.3
    elif precip_prob < 50:
        score -= 5 + (precip_prob - 30) * 0.5
    elif precip_prob < 70:
        score -= 15 + (precip_prob - 50) * 0.8
    else:
        score -= 31 + (precip_prob - 70) * 1.0
    
    # === WIND (max 15 points penalty) ===
    if wind_kmh > 30:
        score -= 15
    elif wind_kmh > 20:
        score -= (wind_kmh - 20) * 1.0
    elif wind_kmh > 15:
        score -= (wind_kmh - 15) * 0.5
    
    # === HUMIDITY (max 10 points penalty) ===
    if temp_max > 25 and humidity > 75:
        score -= min(10, (humidity - 75) * 0.4)
    
    # === CLOUD COVER (max 5 points penalty) ===
    if clouds_percent > 80:
        score -= 5
    elif clouds_percent > 60:
        score -= (clouds_percent - 60) * 0.15
    
    return max(0, min(100, round(score)))
'''


def get_new_wedding_call():
    """Returns the new call to calculate_wedding_score."""
    return '''            # Wedding Score (0-100) - Using continuous formula
            wedding_score = calculate_wedding_score(
                temp_max=avg_temp_max,
                temp_min=avg_temp_min,
                precip_prob=precip_prob,
                precip_mm=avg_precip,
                wind_kmh=avg_wind,
                humidity=avg_humidity if avg_humidity else 70.0,
                clouds_percent=avg_clouds if avg_clouds else 50.0
            )'''


def patch_etl():
    """Patch the ETL file with the new wedding score logic."""
    etl_path = "backend/etl.py"
    
    with open(etl_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already patched
    if "def calculate_wedding_score" in content:
        print("✅ ETL already contains the new wedding score function!")
        return True
    
    # 1. Add the function definition after imports
    # Find the end of imports section (look for first function or class definition)
    import_end_pattern = r"(from dotenv import load_dotenv\n)"
    match = re.search(import_end_pattern, content)
    
    if not match:
        # Try another marker
        import_end_pattern = r"(load_dotenv\(\)\n)"
        match = re.search(import_end_pattern, content)
    
    if match:
        insert_pos = match.end()
        new_function = get_new_wedding_function()
        content = content[:insert_pos] + "\n" + new_function + "\n" + content[insert_pos:]
        print("✅ Added calculate_wedding_score function")
    else:
        print("⚠️ Could not find import section, adding function at the beginning")
        content = get_new_wedding_function() + "\n" + content
    
    # 2. Replace the old wedding score calculation
    old_pattern = r'''            # Wedding Score \(0-100\)
            wedding_score = 0
            if \(THRESHOLDS\['wedding'\]\['temp_min'\] <= avg_temp_max <= THRESHOLDS\['wedding'\]\['temp_max'\] and
                avg_precip < THRESHOLDS\['wedding'\]\['precip_max'\] and
                avg_wind < THRESHOLDS\['wedding'\]\['wind_max'\]\):
                wedding_score = 100
                wedding_score -= precip_prob \* 0\.5  # Penalize for rain probability
                wedding_score -= \(avg_clouds \* 0\.2\)  # Penalize for clouds
            else:
                wedding_score = 30  # Base low score
                if avg_precip > 2:
                    wedding_score = 10

            wedding_score = max\(0, min\(100, wedding_score\)\)'''
    
    new_call = get_new_wedding_call()
    
    # Try exact replacement
    if re.search(old_pattern, content):
        content = re.sub(old_pattern, new_call, content)
        print("✅ Replaced old wedding score calculation")
    else:
        # Try a simpler pattern
        simple_pattern = r'# Wedding Score \(0-100\).*?wedding_score = max\(0, min\(100, wedding_score\)\)'
        if re.search(simple_pattern, content, re.DOTALL):
            content = re.sub(simple_pattern, new_call.strip(), content, flags=re.DOTALL)
            print("✅ Replaced old wedding score calculation (simple pattern)")
        else:
            print("❌ Could not find old wedding score calculation to replace")
            print("   Manual intervention may be required")
            return False
    
    # Write back
    with open(etl_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ ETL patched successfully!")
    print(f"   New cities will now use the improved wedding score formula.")
    return True


if __name__ == "__main__":
    print("🔧 Patching ETL backend with new Wedding Score formula...\n")
    success = patch_etl()
    if success:
        print("\n🎉 Done! The ETL is now configured to use the new formula for all future city imports.")
    else:
        print("\n⚠️ Patch incomplete. Please review the ETL file manually.")
