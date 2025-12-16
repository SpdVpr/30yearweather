import os

path = 'backend/etl_tourism.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

search_code = """    # Try local JSON first
    json_path = os.path.join(os.path.dirname(__file__), 'data', f'{slug}.json')

    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)"""

replace_code = """    # Try local JSON first (UPDATED PATH)
    # The weather ETL saves directly to public/data for the frontend
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, '../public/data', f'{slug}.json')

    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)"""

if search_code in content:
    new_content = content.replace(search_code, replace_code)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched etl_tourism.py path")
else:
    print("Could not find block")
