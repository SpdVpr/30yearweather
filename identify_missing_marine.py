
import json
import os

# 1. Get Coastal Cities from Config
coastal_cities = []
try:
    with open('backend/config.py', 'r', encoding='utf-8') as f:
        for line in f:
            if '"is_coastal": True' in line:
                # Extract slug
                # Line format: "slug": { ... }
                slug = line.split(':')[0].strip().strip('"')
                coastal_cities.append(slug)
except Exception as e:
    print(f"Error reading config: {e}")

print(f"Coastal Cities: {coastal_cities}")

# 2. Check for missing cache
missing_cache = []
marine_cache_path = 'backend/data/raw_marine'
for city in coastal_cities:
    if not os.path.exists(os.path.join(marine_cache_path, f"{city}_marine.json")):
        missing_cache.append(city)

print(f"Missing Marine Cache: {missing_cache}")
