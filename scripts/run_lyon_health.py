import sys
import os

# Add root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import download_health_cdc as health_script
from backend.config import LOCATIONS

def run_lyon_health():
    target_slug = 'lyon-fr'
    if target_slug not in LOCATIONS:
        print(f"Error: {target_slug} not in LOCATIONS")
        # Assuming manual setup.py added it
    
    cities = {'France': ['lyon-fr']}
    
    print("🚀 custom: Downloading CDC health data for France (Lyon)...")
    
    country = "France"
    cdc_slug = health_script.get_cdc_slug(country)
    filepath = os.path.join(health_script.health_dir, f"{cdc_slug}_health.json")
    
    data = health_script.fetch_health_info(country)
    
    import json
    if data:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"   💾 Saved {cdc_slug}_health.json ({len(data['vaccines'])} vaccines)")
    else:
        print("   ❌ Failed to fetch data.")

if __name__ == "__main__":
    run_lyon_health()
