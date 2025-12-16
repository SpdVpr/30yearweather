import os

path = 'backend/etl_tourism.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

search_code = """    # Process each location
    for slug, config in LOCATIONS.items():
        try:
            tourism_data = process_tourism_data_for_location(slug, config)"""

replace_code = """    # Process each location
    for slug, config in LOCATIONS.items():
        try:
            # Check if JSON exists, if so skip
            output_dir = os.path.join(os.path.dirname(__file__), 'data', 'tourism')
            output_path = os.path.join(output_dir, f'{slug}_tourism.json')
            
            if os.path.exists(output_path):
                print(f"\\n⏩ Skipping {config['name']} ({slug}) - Already exists")
                continue

            tourism_data = process_tourism_data_for_location(slug, config)"""

if search_code in content:
    new_content = content.replace(search_code, replace_code)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched etl_tourism.py")
else:
    print("Could not find the target code block to replace.")
