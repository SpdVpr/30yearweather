
import sys
import os
import json

# Add backend directory to path so we can import etl
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from etl import process_location, save_to_json, LOCATIONS
except ImportError:
    # Try alternate path if running from root
    sys.path.append('backend')
    from etl import process_location, save_to_json, LOCATIONS

def regenerate_dubai():
    slug = 'dubai-ae'
    if slug in LOCATIONS:
        print(f"📍 Regenerating data for {slug}...")
        try:
            config = LOCATIONS[slug]
            data = process_location(slug, config)
            if data:
                save_to_json(slug, data)
                print(f"✅ Successfully regenerated {slug}")
            else:
                print(f"❌ Failed to generate data for {slug} (data is None)")
        except Exception as e:
            print(f"❌ Error processing {slug}: {e}")
            import traceback
            traceback.print_exc()
    else:
        print(f"❌ {slug} not found in LOCATIONS definition")

if __name__ == "__main__":
    regenerate_dubai()
