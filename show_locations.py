"""
Quick script to show the structure of LOCATIONS in etl.py
"""

import sys
sys.path.append('backend')

try:
    from etl import LOCATIONS
    
    print("=" * 60)
    print(f"TOTAL CITIES IN LOCATIONS: {len(LOCATIONS)}")
    print("=" * 60)
    
    # Show last 3 cities
    cities = list(LOCATIONS.keys())
    print("\nLast 3 cities:")
    for slug in cities[-3:]:
        config = LOCATIONS[slug]
        print(f"\n'{slug}': {{")
        for key, value in config.items():
            if isinstance(value, str):
                print(f'    "{key}": "{value}",')
            else:
                print(f'    "{key}": {value},')
        print("}")
    
    print("\n" + "=" * 60)
    print("All city slugs:")
    print("=" * 60)
    for i, slug in enumerate(cities, 1):
        print(f"{i:2}. {slug}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
