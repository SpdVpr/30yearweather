import os

path = 'backend/etl_tourism.py'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Using a smaller chunk to match indentation robustly or just finding the line
search_line = "    json_path = os.path.join(os.path.dirname(__file__), 'data', f'{slug}.json')"

if search_line in content:
    print("Found exact line match.")
    replace_line = "    json_path = os.path.join(os.path.dirname(__file__), '../public/data', f'{slug}.json')"
    new_content = content.replace(search_line, replace_line)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched etl_tourism.py path (simple replace)")
else:
    print("Could not find exact line. Trying manual construction...")
    # Debug print of relevant section
    start = content.find("def load_existing_weather_data")
    if start != -1:
        snippet = content[start:start+400]
        print("Snippet around function:\n", snippet)
