import sys
import os
import json

# Add backend directory to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from etl import LOCATIONS
except ImportError:
    sys.path.append('backend')
    from etl import LOCATIONS

# Print first 3 locations to see the format
print("Current LOCATIONS format:")
print("=" * 50)
count = 0
for slug, config in LOCATIONS.items():
    print(f"\n'{slug}': {json.dumps(config, indent=2)}")
    count += 1
    if count >= 3:
        break

print(f"\n\nTotal cities: {len(LOCATIONS)}")
