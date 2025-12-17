"""
Automated script to add 24 new cities to backend/etl.py
Safely patches the LOCATIONS dictionary with backup
"""

import os
import shutil
from datetime import datetime

def patch_etl_with_new_cities():
    """Add 24 new cities to backend/etl.py LOCATIONS dictionary"""
    
    etl_path = 'backend/etl.py'
    
    if not os.path.exists(etl_path):
        print(f"❌ Error: {etl_path} not found!")
        return False
    
    # Create backup
    backup_path = f'backend/etl_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.py'
    shutil.copy2(etl_path, backup_path)
    print(f"✅ Backup created: {backup_path}")
    
    # Read current content
    with open(etl_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define new cities to add (after kyoto-jp)
    new_cities_block = """    # ======================== NORTH AMERICA ========================
    'new-york-us': {
        "name": "New York",
        "country": "United States",
        "lat": 40.7128,
        "lon": -74.0060,
        "is_coastal": True,
        "timezone": "America/New_York"
    },
    'los-angeles-us': {
        "name": "Los Angeles",
        "country": "United States",
        "lat": 34.0522,
        "lon": -118.2437,
        "is_coastal": True,
        "timezone": "America/Los_Angeles"
    },
    'san-francisco-us': {
        "name": "San Francisco",
        "country": "United States",
        "lat": 37.7749,
        "lon": -122.4194,
        "is_coastal": True,
        "timezone": "America/Los_Angeles"
    },
    'miami-us': {
        "name": "Miami",
        "country": "United States",
        "lat": 25.7617,
        "lon": -80.1918,
        "is_coastal": True,
        "timezone": "America/New_York"
    },
    'vancouver-ca': {
        "name": "Vancouver",
        "country": "Canada",
        "lat": 49.2827,
        "lon": -123.1207,
        "is_coastal": True,
        "timezone": "America/Vancouver"
    },
    'toronto-ca': {
        "name": "Toronto",
        "country": "Canada",
        "lat": 43.6532,
        "lon": -79.3832,
        "is_coastal": True,
        "timezone": "America/Toronto"
    },
    'mexico-city-mx': {
        "name": "Mexico City",
        "country": "Mexico",
        "lat": 19.4326,
        "lon": -99.1332,
        "is_coastal": False,
        "timezone": "America/Mexico_City"
    },
    # ======================== SOUTH AMERICA ========================
    'rio-de-janeiro-br': {
        "name": "Rio de Janeiro",
        "country": "Brazil",
        "lat": -22.9068,
        "lon": -43.1729,
        "is_coastal": True,
        "timezone": "America/Sao_Paulo"
    },
    'buenos-aires-ar': {
        "name": "Buenos Aires",
        "country": "Argentina",
        "lat": -34.6037,
        "lon": -58.3816,
        "is_coastal": True,
        "timezone": "America/Argentina/Buenos_Aires"
    },
    'lima-pe': {
        "name": "Lima",
        "country": "Peru",
        "lat": -12.0464,
        "lon": -77.0428,
        "is_coastal": True,
        "timezone": "America/Lima"
    },
    'santiago-cl': {
        "name": "Santiago",
        "country": "Chile",
        "lat": -33.4489,
        "lon": -70.6693,
        "is_coastal": False,
        "timezone": "America/Santiago"
    },
    # ======================== OCEANIA ========================
    'sydney-au': {
        "name": "Sydney",
        "country": "Australia",
        "lat": -33.8688,
        "lon": 151.2093,
        "is_coastal": True,
        "timezone": "Australia/Sydney"
    },
    'melbourne-au': {
        "name": "Melbourne",
        "country": "Australia",
        "lat": -37.8136,
        "lon": 144.9631,
        "is_coastal": True,
        "timezone": "Australia/Melbourne"
    },
    'auckland-nz': {
        "name": "Auckland",
        "country": "New Zealand",
        "lat": -36.8485,
        "lon": 174.7633,
        "is_coastal": True,
        "timezone": "Pacific/Auckland"
    },
    # ======================== AFRICA ========================
    'cape-town-za': {
        "name": "Cape Town",
        "country": "South Africa",
        "lat": -33.9249,
        "lon": 18.4241,
        "is_coastal": True,
        "timezone": "Africa/Johannesburg"
    },
    'marrakech-ma': {
        "name": "Marrakech",
        "country": "Morocco",
        "lat": 31.6295,
        "lon": -7.9811,
        "is_coastal": False,
        "timezone": "Africa/Casablanca"
    },
    # ======================== EUROPE (Additional) ========================
    'edinburgh-uk': {
        "name": "Edinburgh",
        "country": "United Kingdom",
        "lat": 55.9533,
        "lon": -3.1883,
        "is_coastal": True,
        "timezone": "Europe/London"
    },
    'munich-de': {
        "name": "Munich",
        "country": "Germany",
        "lat": 48.1351,
        "lon": 11.5820,
        "is_coastal": False,
        "timezone": "Europe/Berlin"
    },
    'venice-it': {
        "name": "Venice",
        "country": "Italy",
        "lat": 45.4408,
        "lon": 12.3155,
        "is_coastal": True,
        "timezone": "Europe/Rome"
    },
    'krakow-pl': {
        "name": "Krakow",
        "country": "Poland",
        "lat": 50.0647,
        "lon": 19.9450,
        "is_coastal": False,
        "timezone": "Europe/Warsaw"
    },
    'porto-pt': {
        "name": "Porto",
        "country": "Portugal",
        "lat": 41.1579,
        "lon": -8.6291,
        "is_coastal": True,
        "timezone": "Europe/Lisbon"
    },
    # ======================== ASIA (Additional) ========================
    'osaka-jp': {
        "name": "Osaka",
        "country": "Japan",
        "lat": 34.6937,
        "lon": 135.5023,
        "is_coastal": True,
        "timezone": "Asia/Tokyo"
    },
    'phuket-th': {
        "name": "Phuket",
        "country": "Thailand",
        "lat": 7.8804,
        "lon": 98.3923,
        "is_coastal": True,
        "timezone": "Asia/Bangkok"
    },
    'chiang-mai-th': {
        "name": "Chiang Mai",
        "country": "Thailand",
        "lat": 18.7883,
        "lon": 98.9853,
        "is_coastal": False,
        "timezone": "Asia/Bangkok"
    },
"""
    
    # Find where kyoto-jp entry ends
    # Look for the pattern of kyoto-jp dict closing
    kyoto_marker = "'kyoto-jp':"
    
    if kyoto_marker not in content:
        print("❌ Error: Could not find 'kyoto-jp' entry in etl.py")
        print("⚠️  File structure may have changed. Please add cities manually.")
        return False
    
    # Find the closing brace of kyoto-jp entry
    kyoto_pos = content.find(kyoto_marker)
    
    # Find the next closing brace after kyoto_pos }  with comma
    search_from = kyoto_pos
    brace_count = 0
    found_open = False
    insert_pos = -1
    
    for i in range(search_from, len(content)):
        if content[i] == '{':
            found_open = True
            brace_count += 1
        elif content[i] == '}' and found_open:
            brace_count -= 1
            if brace_count == 0:
                # Found the closing brace of kyoto-jp
                # Look for the comma after it
                j = i + 1
                while j < len(content) and content[j] in ' \t\r\n':
                    j += 1
                if j < len(content) and content[j] == ',':
                    insert_pos = j + 1
                    break
    
    if insert_pos == -1:
        print("❌ Error: Could not find insertion point after kyoto-jp")
        return False
    
    # Insert new cities
    new_content = content[:insert_pos] + '\n' + new_cities_block + content[insert_pos:]
    
    # Write back
    with open(etl_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Successfully added 24 new cities to {etl_path}")
    print(f"📋 Backup saved: {backup_path}")
    
    return True

if __name__ == "__main__":
    print("=" * 70)
    print("🌍 ADDING 24 NEW CITIES TO backend/etl.py")
    print("=" * 70)
    print()
    
    if patch_etl_with_new_cities():
        print()
        print("=" * 70)
        print("✅ SUCCESS! Cities added to backend/etl.py")
        print("=" * 70)
        print()
        print("Next steps:")
        print("1. Verify: python show_locations.py")
        print("2. Run ETL: cd backend && python etl.py")
        print()
    else:
        print()
        print("=" * 70)
        print("❌ FAILED - Manual intervention required")
        print("=" * 70)
        print()
        print("Please manually add cities from NEW_CITIES_IMPLEMENTATION.md")
