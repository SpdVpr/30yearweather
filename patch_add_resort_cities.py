"""
Automatic patch script to add 20 new resort/vacation cities to backend/config.py
Focus: Beach resorts, mountain destinations, exotic locations
"""

import os
import sys
from datetime import datetime
import shutil

def patch_config_with_resort_cities():
    """Add 20 new resort cities to backend/config.py"""
    
    config_path = 'backend/config.py'
    
    if not os.path.exists(config_path):
        print(f"❌ Error: {config_path} not found!")
        return False
    
    # Create backup
    backup_path = f'backend/config_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.py'
    shutil.copy2(config_path, backup_path)
    print(f"✅ Backup created: {backup_path}")
    
    # Read current content
    with open(config_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Find the closing brace of LOCATIONS dictionary
    in_locations = False
    brace_depth = 0
    insert_line_idx = -1
    
    for i, line in enumerate(lines):
        if 'LOCATIONS = {' in line or 'LOCATIONS={' in line:
            in_locations = True
            brace_depth = 0
            continue
        
        if in_locations:
            brace_depth += line.count('{') - line.count('}')
            
            if brace_depth == 0 and '}' in line:
                insert_line_idx = i
                break
    
    if insert_line_idx == -1:
        print("❌ Error: Could not find LOCATIONS dictionary closing brace")
        return False
    
    # New resort cities configuration
    new_cities = [
        "    # ======================== CARIBBEAN & CENTRAL AMERICA ========================\n",
        "    'cancun-mx': {\n",
        "        \"name\": \"Cancún\",\n",
        "        \"country\": \"Mexico\",\n",
        "        \"lat\": 21.1619,\n",
        "        \"lon\": -86.8515,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Cancun\"\n",
        "    },\n",
        "    'punta-cana-do': {\n",
        "        \"name\": \"Punta Cana\",\n",
        "        \"country\": \"Dominican Republic\",\n",
        "        \"lat\": 18.5601,\n",
        "        \"lon\": -68.3725,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Santo_Domingo\"\n",
        "    },\n",
        "    'nassau-bs': {\n",
        "        \"name\": \"Nassau\",\n",
        "        \"country\": \"Bahamas\",\n",
        "        \"lat\": 25.0443,\n",
        "        \"lon\": -77.3504,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Nassau\"\n",
        "    },\n",
        "    'san-juan-pr': {\n",
        "        \"name\": \"San Juan\",\n",
        "        \"country\": \"Puerto Rico\",\n",
        "        \"lat\": 18.4655,\n",
        "        \"lon\": -66.1057,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Puerto_Rico\"\n",
        "    },\n",
        "    'montego-bay-jm': {\n",
        "        \"name\": \"Montego Bay\",\n",
        "        \"country\": \"Jamaica\",\n",
        "        \"lat\": 18.4762,\n",
        "        \"lon\": -77.8939,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Jamaica\"\n",
        "    },\n",
        "    # ======================== MEDITERRANEAN & ATLANTIC ========================\n",
        "    'palma-mallorca-es': {\n",
        "        \"name\": \"Palma de Mallorca\",\n",
        "        \"country\": \"Spain\",\n",
        "        \"lat\": 39.5696,\n",
        "        \"lon\": 2.6502,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Madrid\"\n",
        "    },\n",
        "    'nice-fr': {\n",
        "        \"name\": \"Nice\",\n",
        "        \"country\": \"France\",\n",
        "        \"lat\": 43.7102,\n",
        "        \"lon\": 7.2620,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Paris\"\n",
        "    },\n",
        "    'dubrovnik-hr': {\n",
        "        \"name\": \"Dubrovnik\",\n",
        "        \"country\": \"Croatia\",\n",
        "        \"lat\": 42.6507,\n",
        "        \"lon\": 18.0944,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Zagreb\"\n",
        "    },\n",
        "    'santorini-gr': {\n",
        "        \"name\": \"Santorini\",\n",
        "        \"country\": \"Greece\",\n",
        "        \"lat\": 36.3932,\n",
        "        \"lon\": 25.4615,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Athens\"\n",
        "    },\n",
        "    'las-palmas-es': {\n",
        "        \"name\": \"Las Palmas\",\n",
        "        \"country\": \"Spain\",\n",
        "        \"lat\": 28.1248,\n",
        "        \"lon\": -15.4300,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Atlantic/Canary\"\n",
        "    },\n",
        "    # ======================== MOUNTAIN & ADVENTURE ========================\n",
        "    'reykjavik-is': {\n",
        "        \"name\": \"Reykjavik\",\n",
        "        \"country\": \"Iceland\",\n",
        "        \"lat\": 64.1466,\n",
        "        \"lon\": -21.9426,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Atlantic/Reykjavik\"\n",
        "    },\n",
        "    'queenstown-nz': {\n",
        "        \"name\": \"Queenstown\",\n",
        "        \"country\": \"New Zealand\",\n",
        "        \"lat\": -45.0312,\n",
        "        \"lon\": 168.6626,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Pacific/Auckland\"\n",
        "    },\n",
        "    'innsbruck-at': {\n",
        "        \"name\": \"Innsbruck\",\n",
        "        \"country\": \"Austria\",\n",
        "        \"lat\": 47.2692,\n",
        "        \"lon\": 11.4041,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Europe/Vienna\"\n",
        "    },\n",
        "    'interlaken-ch': {\n",
        "        \"name\": \"Interlaken\",\n",
        "        \"country\": \"Switzerland\",\n",
        "        \"lat\": 46.6863,\n",
        "        \"lon\": 7.8632,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Europe/Zurich\"\n",
        "    },\n",
        "    'whistler-ca': {\n",
        "        \"name\": \"Whistler\",\n",
        "        \"country\": \"Canada\",\n",
        "        \"lat\": 50.1163,\n",
        "        \"lon\": -122.9574,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"America/Vancouver\"\n",
        "    },\n",
        "    # ======================== EXOTIC & LUXURY ========================\n",
        "    'bora-bora-pf': {\n",
        "        \"name\": \"Bora Bora\",\n",
        "        \"country\": \"French Polynesia\",\n",
        "        \"lat\": -16.5004,\n",
        "        \"lon\": -151.7415,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Pacific/Tahiti\"\n",
        "    },\n",
        "    'male-mv': {\n",
        "        \"name\": \"Malé\",\n",
        "        \"country\": \"Maldives\",\n",
        "        \"lat\": 4.1755,\n",
        "        \"lon\": 73.5093,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Indian/Maldives\"\n",
        "    },\n",
        "    'ras-al-khaimah-ae': {\n",
        "        \"name\": \"Ras Al Khaimah\",\n",
        "        \"country\": \"UAE\",\n",
        "        \"lat\": 25.7895,\n",
        "        \"lon\": 55.9432,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Asia/Dubai\"\n",
        "    },\n",
        "    'zanzibar-tz': {\n",
        "        \"name\": \"Zanzibar\",\n",
        "        \"country\": \"Tanzania\",\n",
        "        \"lat\": -6.1659,\n",
        "        \"lon\": 39.2026,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Africa/Dar_es_Salaam\"\n",
        "    },\n",
        "    'cartagena-co': {\n",
        "        \"name\": \"Cartagena\",\n",
        "        \"country\": \"Colombia\",\n",
        "        \"lat\": 10.3910,\n",
        "        \"lon\": -75.4794,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Bogota\"\n",
        "    },\n"
    ]
    
    # Insert new cities
    lines[insert_line_idx:insert_line_idx] = new_cities
    
    # Write back
    with open(config_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"✅ Successfully added 20 resort cities to {config_path}")
    print(f"📋 Backup saved: {backup_path}")
    
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("🏖️  ADDING 20 NEW RESORT & VACATION CITIES")
    print("=" * 70)
    print()
    print("Categories:")
    print("  🏖️  Caribbean & Central America: 5 cities")
    print("  🌊 Mediterranean & Atlantic: 5 cities")
    print("  🏔️  Mountain & Adventure: 5 cities")
    print("  🌴 Exotic & Luxury: 5 cities")
    print()
    
    if patch_config_with_resort_cities():
        print()
        print("=" * 70)
        print("✅ SUCCESS! 20 resort cities added to backend/config.py")
        print("=" * 70)
        print()
        print("Verification:")
        print("  python show_locations.py  (should show 84 cities)")
        print()
        print("Next Steps:")
        print("  1. Update src/lib/data.ts (add 20 new slugs)")
        print("  2. Update src/app/page.tsx (add new categories)")
        print("  3. Run ETL: cd backend && python etl.py")
        print("  4. Generate hero images")
        print()
    else:
        print()
        print("=" * 70)
        print("❌ FAILED")
        print("=" * 70)
