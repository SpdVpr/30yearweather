import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import etl_tourism as tourism
from config import LOCATIONS

def run_lyon_tourism():
    target = 'lyon-fr'
    if target not in LOCATIONS:
        print(f"Error: {target} not found in config.LOCATIONS")
        return

    print(f"Running Tourism ETL for {target}...")
    
    # Override global variable
    tourism.LOCATIONS = {target: LOCATIONS[target]}
    
    # Run based on how etl_tourism.py is structured
    # Assuming it has a main() function
    try:
        tourism.main()
    except AttributeError:
        # If no main, maybe it runs on import? 
        # But previous cat showed if __name__ == "__main__": main()
        print("Error: Could not find main() in etl_tourism")

if __name__ == "__main__":
    run_lyon_tourism()
