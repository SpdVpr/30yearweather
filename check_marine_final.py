
import json
import os

coastal_cities = ['barcelona-es', 'lisbon-pt', 'dublin-ie', 'stockholm-se', 'copenhagen-dk', 'oslo-no', 'helsinki-fi', 'tokyo-jp', 'shanghai-cn', 'hong-kong-hk', 'taipei-tw', 'singapore-sg', 'jakarta-id', 'bali-id', 'manila-ph', 'mumbai-in', 'dubai-ae', 'istanbul-tr']

print("Checking marine data in final JSON files:")
for city in coastal_cities:
    path = f"public/data/{city}.json"
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            # Check first day
            first_day = list(data.get('days', {}).values())[0] if data.get('days') else None
            has_marine = first_day and 'marine' in first_day
            print(f"{city}: {'✅ HAS marine' if has_marine else '❌ NO marine'}")
    else:
        print(f"{city}: ❌ File not found")
