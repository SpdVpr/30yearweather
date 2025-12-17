"""
Simple script to add 20 resort cities to config.py using string replacement
"""

resort_cities_code = """    'cancun-mx': {"name": "Cancún", "country": "Mexico", "lat": 21.1619, "lon": -86.8515, "is_coastal": True, "timezone": "America/Cancun"},
    'punta-cana-do': {"name": "Punta Cana", "country": "Dominican Republic", "lat": 18.5601, "lon": -68.3725, "is_coastal": True, "timezone": "America/Santo_Domingo"},
    'nassau-bs': {"name": "Nassau", "country": "Bahamas", "lat": 25.0443, "lon": -77.3504, "is_coastal": True, "timezone": "America/Nassau"},
    'san-juan-pr': {"name": "San Juan", "country": "Puerto Rico", "lat": 18.4655, "lon": -66.1057, "is_coastal": True, "timezone": "America/Puerto_Rico"},
    'montego-bay-jm': {"name": "Montego Bay", "country": "Jamaica", "lat": 18.4762, "lon": -77.8939, "is_coastal": True, "timezone": "America/Jamaica"},
    'palma-mallorca-es': {"name": "Palma de Mallorca", "country": "Spain", "lat": 39.5696, "lon": 2.6502, "is_coastal": True, "timezone": "Europe/Madrid"},
    'nice-fr': {"name": "Nice", "country": "France", "lat": 43.7102, "lon": 7.2620, "is_coastal": True, "timezone": "Europe/Paris"},
    'dubrovnik-hr': {"name": "Dubrovnik", "country": "Croatia", "lat": 42.6507, "lon": 18.0944, "is_coastal": True, "timezone": "Europe/Zagreb"},
    'santorini-gr': {"name": "Santorini", "country": "Greece", "lat": 36.3932, "lon": 25.4615, "is_coastal": True, "timezone": "Europe/Athens"},
    'las-palmas-es': {"name": "Las Palmas", "country": "Spain", "lat": 28.1248, "lon": -15.4300, "is_coastal": True, "timezone": "Atlantic/Canary"},
    'reykjavik-is': {"name": "Reykjavik", "country": "Iceland", "lat": 64.1466, "lon": -21.9426, "is_coastal": True, "timezone": "Atlantic/Reykjavik"},
    'queenstown-nz': {"name": "Queenstown", "country": "New Zealand", "lat": -45.0312, "lon": 168.6626, "is_coastal": False, "timezone": "Pacific/Auckland"},
    'innsbruck-at': {"name": "Innsbruck", "country": "Austria", "lat": 47.2692, "lon": 11.4041, "is_coastal": False, "timezone": "Europe/Vienna"},
    'interlaken-ch': {"name": "Interlaken", "country": "Switzerland", "lat": 46.6863, "lon": 7.8632, "is_coastal": False, "timezone\": "Europe/Zurich"},
    'whistler-ca': {"name": "Whistler", "country": "Canada", "lat": 50.1163, "lon": -122.9574, "is_coastal": False, "timezone": "America/Vancouver"},
    'bora-bora-pf': {"name": "Bora Bora", "country": "French Polynesia", "lat": -16.5004, "lon": -151.7415, "is_coastal": True, "timezone": "Pacific/Tahiti"},
    'male-mv': {"name": "Malé", "country": "Maldives", "lat": 4.1755, "lon": 73.5093, "is_coastal": True, "timezone": "Indian/Maldives"},
    'ras-al-khaimah-ae': {"name": "Ras Al Khaimah", "country": "UAE", "lat": 25.7895, "lon": 55.9432, "is_coastal": True, "timezone": "Asia/Dubai"},
    'zanzibar-tz': {"name": "Zanzibar", "country": "Tanzania", "lat": -6.1659, "lon": 39.2026, "is_coastal": True, "timezone": "Africa/Dar_es_Salaam"},
    'cartagena-co': {"name": "Cartagena", "country": "Colombia", "lat": 10.3910, "lon": -75.4794, "is_coastal": True, "timezone": "America/Bogota"}"""

# Read config
with open('backend/config.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the last closing brace of LOCATIONS
last_brace_idx = content.rfind('\n}')

if last_brace_idx == -1:
    print("❌ Could not find closing brace")
else:
    # Insert before the closing brace, with comma after previous entry
    new_content = content[:last_brace_idx] + ',\n' + resort_cities_code + content[last_brace_idx:]
    
    # Write back
    with open('backend/config.py', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Added 20 resort cities to backend/config.py")
    print("\nVerify with: python show_locations.py")
