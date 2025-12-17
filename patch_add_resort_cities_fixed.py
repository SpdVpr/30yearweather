"""
FIXED: Automatic patch script to add 20 new resort/vacation cities
Fixes the missing comma issue
"""

import os
from datetime import datetime
import shutil

def patch_config_with_resort_cities_fixed():
    """Add 20 new resort cities to backend/config.py - FIXED VERSION"""
    
    config_path = 'backend/config.py'
    
    if not os.path.exists(config_path):
        print(f"❌ Error: {config_path} not found!")
        return False
    
    # Create backup
    backup_path = f'backend/config_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.py'
    shutil.copy2(config_path, backup_path)
    print(f"✅ Backup created: {backup_path}")
    
    # Read file
    with open(config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find last city entry (should be 'kyoto-jp' or similar)
    # We need to add a comma after the last entry and then add our new entries
    
    # Look for the pattern: closing brace followed by newline and then closing brace of LOCATIONS
    # Pattern: }\n}  (end of last city, end of LOCATIONS dict)
    
    import re
    
    # Find the last city entry - looking for the pattern before the final }
    pattern = r'(\s+"timezone":\s+"[^"]+"\n\s+})\n(\s*}\s*$)'
    
    match = re.search(pattern, content)
    
    if not match:
        print("❌ Could not find insertion point")
        return False
    
    # New cities to add (with comma after last existing entry)
    new_cities = """,
    # ======================== CARIBBEAN & CENTRAL AMERICA ========================
    'cancun-mx': {
        "name": "Cancún",
        "country": "Mexico",
        "lat": 21.1619,
        "lon": -86.8515,
        "is_coastal": True,
        "timezone": "America/Cancun"
    },
    'punta-cana-do': {
        "name": "Punta Cana",
        "country": "Dominican Republic",
        "lat": 18.5601,
        "lon": -68.3725,
        "is_coastal": True,
        "timezone": "America/Santo_Domingo"
    },
    'nassau-bs': {
        "name": "Nassau",
        "country": "Bahamas",
        "lat": 25.0443,
        "lon": -77.3504,
        "is_coastal": True,
        "timezone": "America/Nassau"
    },
    'san-juan-pr': {
        "name": "San Juan",
        "country": "Puerto Rico",
        "lat": 18.4655,
        "lon": -66.1057,
        "is_coastal": True,
        "timezone": "America/Puerto_Rico"
    },
    'montego-bay-jm': {
        "name": "Montego Bay",
        "country": "Jamaica",
        "lat": 18.4762,
        "lon": -77.8939,
        "is_coastal": True,
        "timezone": "America/Jamaica"
    },
    # ======================== MEDITERRANEAN & ATLANTIC ========================
    'palma-mallorca-es': {
        "name": "Palma de Mallorca",
        "country": "Spain",
        "lat": 39.5696,
        "lon": 2.6502,
        "is_coastal": True,
        "timezone": "Europe/Madrid"
    },
    'nice-fr': {
        "name": "Nice",
        "country": "France",
        "lat": 43.7102,
        "lon": 7.2620,
        "is_coastal": True,
        "timezone": "Europe/Paris"
    },
    'dubrovnik-hr': {
        "name": "Dubrovnik",
        "country": "Croatia",
        "lat": 42.6507,
        "lon": 18.0944,
        "is_coastal": True,
        "timezone": "Europe/Zagreb"
    },
    'santorini-gr': {
        "name": "Santorini",
        "country": "Greece",
        "lat": 36.3932,
        "lon": 25.4615,
        "is_coastal": True,
        "timezone": "Europe/Athens"
    },
    'las-palmas-es': {
        "name": "Las Palmas",
        "country": "Spain",
        "lat": 28.1248,
        "lon": -15.4300,
        "is_coastal": True,
        "timezone": "Atlantic/Canary"
    },
    # ======================== MOUNTAIN & ADVENTURE ========================
    'reykjavik-is': {
        "name": "Reykjavik",
        "country": "Iceland",
        "lat": 64.1466,
        "lon": -21.9426,
        "is_coastal": True,
        "timezone": "Atlantic/Reykjavik"
    },
    'queenstown-nz': {
        "name": "Queenstown",
        "country": "New Zealand",
        "lat": -45.0312,
        "lon": 168.6626,
        "is_coastal": False,
        "timezone": "Pacific/Auckland"
    },
    'innsbruck-at': {
        "name": "Innsbruck",
        "country": "Austria",
        "lat": 47.2692,
        "lon": 11.4041,
        "is_coastal": False,
        "timezone": "Europe/Vienna"
    },
    'interlaken-ch': {
        "name": "Interlaken",
        "country": "Switzerland",
        "lat": 46.6863,
        "lon": 7.8632,
        "is_coastal": False,
        "timezone": "Europe/Zurich"
    },
    'whistler-ca': {
        "name": "Whistler",
        "country": "Canada",
        "lat": 50.1163,
        "lon": -122.9574,
        "is_coastal": False,
        "timezone": "America/Vancouver"
    },
    # ======================== EXOTIC & LUXURY ========================
    'bora-bora-pf': {
        "name": "Bora Bora",
        "country": "French Polynesia",
        "lat": -16.5004,
        "lon": -151.7415,
        "is_coastal": True,
        "timezone": "Pacific/Tahiti"
    },
    'male-mv': {
        "name": "Malé",
        "country": "Maldives",
        "lat": 4.1755,
        "lon": 73.5093,
        "is_coastal": True,
        "timezone": "Indian/Maldives"
    },
    'ras-al-khaimah-ae': {
        "name": "Ras Al Khaimah",
        "country": "UAE",
        "lat": 25.7895,
        "lon": 55.9432,
        "is_coastal": True,
        "timezone": "Asia/Dubai"
    },
    'zanzibar-tz': {
        "name": "Zanzibar",
        "country": "Tanzania",
        "lat": -6.1659,
        "lon": 39.2026,
        "is_coastal": True,
        "timezone": "Africa/Dar_es_Salaam"
    },
    'cartagena-co': {
        "name": "Cartagena",
        "country": "Colombia",
        "lat": 10.3910,
        "lon": -75.4794,
        "is_coastal": True,
        "timezone": "America/Bogota"
    }
"""
    
    # Replace: add comma after last entry and insert new cities
    new_content = re.sub(pattern, r'\1' + new_cities + r'\n\2', content)
    
    # Write back
    with open(config_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Successfully added 20 resort cities to {config_path}")
    print(f"📋 Backup saved: {backup_path}")
    
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("🏖️  ADDING 20 NEW RESORT & VACATION CITIES (FIXED)")
    print("=" * 70)
    print()
    
    if patch_config_with_resort_cities_fixed():
        print()
        print("=" * 70)
        print("✅ SUCCESS! 20 resort cities added")
        print("=" * 70)
        print()
        print("Verification: python show_locations.py")
    else:
        print()
        print("❌ FAILED")
