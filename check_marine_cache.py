
import os

path = 'backend/data/raw_marine'
cities = ['hong-kong-hk', 'bali-id', 'dubai-ae', 'mumbai-in']

if os.path.exists(path):
    print(f"Directory {path} exists.")
    for city in cities:
        file_path = os.path.join(path, f"{city}_marine.json")
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"{city}: Found ({size} bytes)")
        else:
            print(f"{city}: Not found")
else:
    print(f"Directory {path} does not exist.")
