
import os

NEW_CITIES = [
    'cancun-mx', 'punta-cana-do', 'nassau-bs', 'san-juan-pr', 'montego-bay-jm',
    'palma-mallorca-es', 'nice-fr', 'dubrovnik-hr', 'santorini-gr', 'las-palmas-es',
    'reykjavik-is', 'queenstown-nz', 'innsbruck-at', 'interlaken-ch', 'whistler-ca',
    'bora-bora-pf', 'male-mv', 'ras-al-khaimah-ae', 'zanzibar-tz', 'cartagena-co'
]

count = 0
for slug in NEW_CITIES:
    path = os.path.join('public', 'data', f'{slug}.json')
    if os.path.exists(path):
        os.remove(path)
        print(f"Deleted {path}")
        count += 1
    else:
        print(f"Not found (good): {path}")

print(f"✅ Deleted {count} output files. ETL will now re-process them matching missing Marine data.")
