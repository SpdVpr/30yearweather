"""
Regenerate city JSONs for the 50 new cities with updated tourism/flight data.
This script patches config.LOCATIONS to only include the new cities,
then runs the ETL.
"""

import os
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.getcwd(), 'backend'))

from backend import config

# List of 50 new cities (slugs without country code suffix)
NEW_CITIES_SLUGS = [
    "florence", "seattle", "jaipur", "goa", "da-nang", "washington-dc", 
    "malaga", "cebu", "bangalore", "colombo", "phoenix", "bergen", 
    "quebec-city", "hoi-an", "palawan", "jerusalem", "johannesburg", 
    "marseille", "bordeaux", "thessaloniki", "tallinn", "medellin", 
    "naha", "penang", "langkawi", "xian", "havana", "salzburg", 
    "bologna", "kochi", "antalya", "tulum", "durban", "tbilisi", 
    "mandalay", "luang-prabang", "lombok", "yogyakarta", "cairns", 
    "gold-coast", "adelaide", "hamilton", "san-sebastian", "split", 
    "mykonos", "crete", "salvador", "fortaleza", "brasilia", "florianopolis"
]

def run_etl_for_new_cities():
    print("=" * 60)
    print("🚀 REGENERATING JSONs FOR 50 NEW CITIES")
    print("=" * 60)
    
    # Get all locations that match our new cities
    new_locations = {}
    for slug, data in config.LOCATIONS.items():
        # Check if slug starts with any of the new city names
        base_slug = slug.rsplit('-', 1)[0] if slug.count('-') > 0 else slug
        if base_slug in NEW_CITIES_SLUGS or slug in NEW_CITIES_SLUGS:
            new_locations[slug] = data
    
    print(f"📍 Found {len(new_locations)} new cities to process:")
    for slug in sorted(new_locations.keys()):
        print(f"   • {slug}")
    
    if not new_locations:
        print("❌ No new cities found in config!")
        return
    
    # Delete existing JSON files for these cities to force regeneration
    print("\n🗑️  Removing existing JSON files to force regeneration...")
    deleted = 0
    for slug in new_locations.keys():
        json_path = os.path.join('public', 'data', f'{slug}.json')
        if os.path.exists(json_path):
            os.remove(json_path)
            deleted += 1
            print(f"   Deleted: {json_path}")
    print(f"   Deleted {deleted} files")
    
    # Patch config to only process new cities
    original_locations = config.LOCATIONS
    config.LOCATIONS = new_locations
    
    print(f"\n🔧 Patched config.LOCATIONS to {len(config.LOCATIONS)} cities")
    
    # Now import and run ETL
    print("\n" + "=" * 60)
    print("🏃 Starting ETL Pipeline...")
    print("=" * 60 + "\n")
    
    try:
        # Import etl module (it will use patched config)
        import importlib
        if 'backend.etl' in sys.modules:
            del sys.modules['backend.etl']
        
        from backend import etl
        
        # Patch etl's reference to config
        if hasattr(etl, 'config'):
            etl.config.LOCATIONS = new_locations
        if hasattr(etl, 'LOCATIONS'):
            etl.LOCATIONS = new_locations
            
        # Run main
        etl.main()
        
    except Exception as e:
        print(f"\n❌ Error during ETL: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Restore original config
        config.LOCATIONS = original_locations
        print("\n✅ Config restored to original state")

if __name__ == "__main__":
    run_etl_for_new_cities()
