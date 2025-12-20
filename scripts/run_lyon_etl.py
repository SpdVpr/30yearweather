import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

import etl
from config import LOCATIONS

def run_lyon():
    target = 'lyon-fr'
    if target not in LOCATIONS:
        print(f"Error: {target} not found in config.LOCATIONS")
        # Try to reload or print keys
        print("Available keys:", list(LOCATIONS.keys()))
        return

    print(f"Running ETL for {target}...")
    
    # Override strict forced mode from etl.py by setting the module-level variable
    # We only want to process Lyon
    etl.LOCATIONS = {target: LOCATIONS[target]}
    
    # Run
    etl.main()

if __name__ == "__main__":
    run_lyon()
