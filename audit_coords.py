
import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from backend import config

# List of "Risk" cities (Islands, Resorts, Coastal areas with mountains)
RISK_CITIES = [
    'phuket', 'santorini', 'zanzibar', 'palma-mallorca', 'las-palmas', 
    'bora-bora', 'male', 'ras-al-khaimah', 'cancun', 'punta-cana', 
    'montego-bay', 'nassau', 'san-juan', 'tenerife'
]

print(f"{'City':<20} | {'Lat':<10} | {'Lon':<10} | {'Google Maps Link'}")
print("-" * 80)

for slug, data in config.LOCATIONS.items():
    if slug in RISK_CITIES or data.get('is_coastal'): # Check all coastal just in case
        lat = data['lat']
        lon = data['lon']
        gmaps = f"https://www.google.com/maps?q={lat},{lon}"
        print(f"{slug:<20} | {lat:<10} | {lon:<10} | {gmaps}")
