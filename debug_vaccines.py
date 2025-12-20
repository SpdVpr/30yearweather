
import json
import os

def check_vaccines(slug):
    path = f"public/data/{slug}.json"
    if not os.path.exists(path):
        print(f"{slug} not found")
        return
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    health = data.get('meta', {}).get('health_info', {})
    print(f"City: {slug}")
    for v in health.get('vaccines', []):
        print(f"- {v['disease']}: {v['recommendation']}")

if __name__ == "__main__":
    check_vaccines("montego-bay")
    check_vaccines("bangkok")
