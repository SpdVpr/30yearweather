"""
Script to add 24 new cities to backend/config.py LOCATIONS dictionary
This is where LOCATIONS is actually defined!
"""

import os
import shutil
from datetime import datetime

def patch_config_with_new_cities():
    """Add 24 new cities to backend/config.py LOCATIONS dictionary"""
    
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
    # We'll look for the last } before any other major section
    
    in_locations = False
    brace_depth = 0
    insert_line_idx = -1
    
    for i, line in enumerate(lines):
        if 'LOCATIONS = {' in line or 'LOCATIONS={' in line:
            in_locations = True
            brace_depth = 0
            continue
        
        if in_locations:
            # Count braces
            brace_depth += line.count('{') - line.count('}')
            
            # If we're back to 0, we found the closing brace
            if brace_depth == 0 and '}' in line:
                # Insert before this line
                insert_line_idx = i
                break
    
    if insert_line_idx == -1:
        print("❌ Error: Could not find LOCATIONS dictionary closing brace")
        return False
    
    # Prepare new cities block
    new_cities = [
        "    # ======================== NORTH AMERICA ========================\n",
        "    'new-york-us': {\n",
        "        \"name\": \"New York\",\n",
        "        \"country\": \"United States\",\n",
        "        \"lat\": 40.7128,\n",
        "        \"lon\": -74.0060,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/New_York\"\n",
        "    },\n",
        "    'los-angeles-us': {\n",
        "        \"name\": \"Los Angeles\",\n",
        "        \"country\": \"United States\",\n",
        "        \"lat\": 34.0522,\n",
        "        \"lon\": -118.2437,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Los_Angeles\"\n",
        "    },\n",
        "    'san-francisco-us': {\n",
        "        \"name\": \"San Francisco\",\n",
        "        \"country\": \"United States\",\n",
        "        \"lat\": 37.7749,\n",
        "        \"lon\": -122.4194,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Los_Angeles\"\n",
        "    },\n",
        "    'miami-us': {\n",
        "        \"name\": \"Miami\",\n",
        "        \"country\": \"United States\",\n",
        "        \"lat\": 25.7617,\n",
        "        \"lon\": -80.1918,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/New_York\"\n",
        "    },\n",
        "    'vancouver-ca': {\n",
        "        \"name\": \"Vancouver\",\n",
        "        \"country\": \"Canada\",\n",
        "        \"lat\": 49.2827,\n",
        "        \"lon\": -123.1207,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Vancouver\"\n",
        "    },\n",
        "    'toronto-ca': {\n",
        "        \"name\": \"Toronto\",\n",
        "        \"country\": \"Canada\",\n",
        "        \"lat\": 43.6532,\n",
        "        \"lon\": -79.3832,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Toronto\"\n",
        "    },\n",
        "    'mexico-city-mx': {\n",
        "        \"name\": \"Mexico City\",\n",
        "        \"country\": \"Mexico\",\n",
        "        \"lat\": 19.4326,\n",
        "        \"lon\": -99.1332,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"America/Mexico_City\"\n",
        "    },\n",
        "    # ======================== SOUTH AMERICA ========================\n",
        "    'rio-de-janeiro-br': {\n",
        "        \"name\": \"Rio de Janeiro\",\n",
        "        \"country\": \"Brazil\",\n",
        "        \"lat\": -22.9068,\n",
        "        \"lon\": -43.1729,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Sao_Paulo\"\n",
        "    },\n",
        "    'buenos-aires-ar': {\n",
        "        \"name\": \"Buenos Aires\",\n",
        "        \"country\": \"Argentina\",\n",
        "        \"lat\": -34.6037,\n",
        "        \"lon\": -58.3816,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Argentina/Buenos_Aires\"\n",
        "    },\n",
        "    'lima-pe': {\n",
        "        \"name\": \"Lima\",\n",
        "        \"country\": \"Peru\",\n",
        "        \"lat\": -12.0464,\n",
        "        \"lon\": -77.0428,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"America/Lima\"\n",
        "    },\n",
        "    'santiago-cl': {\n",
        "        \"name\": \"Santiago\",\n",
        "        \"country\": \"Chile\",\n",
        "        \"lat\": -33.4489,\n",
        "        \"lon\": -70.6693,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"America/Santiago\"\n",
        "    },\n",
        "    # ======================== OCEANIA ========================\n",
        "    'sydney-au': {\n",
        "        \"name\": \"Sydney\",\n",
        "        \"country\": \"Australia\",\n",
        "        \"lat\": -33.8688,\n",
        "        \"lon\": 151.2093,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Australia/Sydney\"\n",
        "    },\n",
        "    'melbourne-au': {\n",
        "        \"name\": \"Melbourne\",\n",
        "        \"country\": \"Australia\",\n",
        "        \"lat\": -37.8136,\n",
        "        \"lon\": 144.9631,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Australia/Melbourne\"\n",
        "    },\n",
        "    'auckland-nz': {\n",
        "        \"name\": \"Auckland\",\n",
        "        \"country\": \"New Zealand\",\n",
        "        \"lat\": -36.8485,\n",
        "        \"lon\": 174.7633,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Pacific/Auckland\"\n",
        "    },\n",
        "    # ======================== AFRICA ========================\n",
        "    'cape-town-za': {\n",
        "        \"name\": \"Cape Town\",\n",
        "        \"country\": \"South Africa\",\n",
        "        \"lat\": -33.9249,\n",
        "        \"lon\": 18.4241,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Africa/Johannesburg\"\n",
        "    },\n",
        "    'marrakech-ma': {\n",
        "        \"name\": \"Marrakech\",\n",
        "        \"country\": \"Morocco\",\n",
        "        \"lat\": 31.6295,\n",
        "        \"lon\": -7.9811,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Africa/Casablanca\"\n",
        "    },\n",
        "    # ======================== EUROPE (Additional) ========================\n",
        "    'edinburgh-uk': {\n",
        "        \"name\": \"Edinburgh\",\n",
        "        \"country\": \"United Kingdom\",\n",
        "        \"lat\": 55.9533,\n",
        "        \"lon\": -3.1883,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/London\"\n",
        "    },\n",
        "    'munich-de': {\n",
        "        \"name\": \"Munich\",\n",
        "        \"country\": \"Germany\",\n",
        "        \"lat\": 48.1351,\n",
        "        \"lon\": 11.5820,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Europe/Berlin\"\n",
        "    },\n",
        "    'venice-it': {\n",
        "        \"name\": \"Venice\",\n",
        "        \"country\": \"Italy\",\n",
        "        \"lat\": 45.4408,\n",
        "        \"lon\": 12.3155,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Rome\"\n",
        "    },\n",
        "    'krakow-pl': {\n",
        "        \"name\": \"Krakow\",\n",
        "        \"country\": \"Poland\",\n",
        "        \"lat\": 50.0647,\n",
        "        \"lon\": 19.9450,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Europe/Warsaw\"\n",
        "    },\n",
        "    'porto-pt': {\n",
        "        \"name\": \"Porto\",\n",
        "        \"country\": \"Portugal\",\n",
        "        \"lat\": 41.1579,\n",
        "        \"lon\": -8.6291,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Europe/Lisbon\"\n",
        "    },\n",
        "    # ======================== ASIA (Additional) ========================\n",
        "    'osaka-jp': {\n",
        "        \"name\": \"Osaka\",\n",
        "        \"country\": \"Japan\",\n",
        "        \"lat\": 34.6937,\n",
        "        \"lon\": 135.5023,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Asia/Tokyo\"\n",
        "    },\n",
        "    'phuket-th': {\n",
        "        \"name\": \"Phuket\",\n",
        "        \"country\": \"Thailand\",\n",
        "        \"lat\": 7.8804,\n",
        "        \"lon\": 98.3923,\n",
        "        \"is_coastal\": True,\n",
        "        \"timezone\": \"Asia/Bangkok\"\n",
        "    },\n",
        "    'chiang-mai-th': {\n",
        "        \"name\": \"Chiang Mai\",\n",
        "        \"country\": \"Thailand\",\n",
        "        \"lat\": 18.7883,\n",
        "        \"lon\": 98.9853,\n",
        "        \"is_coastal\": False,\n",
        "        \"timezone\": \"Asia/Bangkok\"\n",
        "    },\n"
    ]
    
    # Insert new cities
    lines[insert_line_idx:insert_line_idx] = new_cities
    
    # Write back
    with open(config_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    
    print(f"✅ Successfully added 24 new cities to {config_path}")
    print(f"📋 Backup saved: {backup_path}")
    
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("🌍 ADDING 24 NEW CITIES TO backend/config.py")
    print("=" * 70)
    print()
    
    if patch_config_with_new_cities():
        print()
        print("=" * 70)
        print("✅ SUCCESS! Cities added to backend/config.py")
        print("=" * 70)
        print()
        print("Verification:")
        print("  python show_locations.py  (should show 64 cities)")
        print()
        print("Next: Run ETL to generate data")
        print("  cd backend")
        print("  python etl.py")
        print()
    else:
        print()
        print("=" * 70)
        print("❌ FAILED")
        print("=" * 70)
