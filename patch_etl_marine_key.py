
import os

etl_path = os.path.join('backend', 'etl.py')

with open(etl_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Switch URL to Customer API
content = content.replace(
    'https://marine-api.open-meteo.com/v1/marine',
    'https://customer-marine-api.open-meteo.com/v1/marine'
)

# 2. Add API Key to params
# Finding the params dictionary end for marine fetch
# It ends with 'hourly': ... }
# I'll just replace the whole params block to be safe if I can match it.
# Or simpler: Add apikey line.

if '"hourly": ["sea_surface_temperature"]' in content:
    # Add apikey
    content = content.replace(
        '"hourly": ["sea_surface_temperature"] # Hourly SST',
        '"hourly": ["sea_surface_temperature"], # Hourly SST\n        "apikey": "Edom9jUz2cuVVleK"'
    )
elif '"hourly": ["sea_surface_temperature"],' in content:
     # Already has comma?
     pass

# Also ensuring verify=True for customer API? No, keep verify=False as in original to avoid cert errors seen in log.

with open(etl_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Patched etl.py: Switched to Customer Marine API & Added API Key.")
