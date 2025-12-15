
import os

# Point to backend/etl.py
etl_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'etl.py')

with open(etl_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Target block to replace
target = '        try:\n            data = process_location(slug, config)'
replacement = '''        try:
            # SKIP LOGIC START
            existing_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../public/data", f"{slug}.json")
            if os.path.exists(existing_path):
                print(f"   ⏩ Skipping {config['name']} ({slug}) - Already exists")
                continue
            # SKIP LOGIC END
            
            data = process_location(slug, config)'''

if target in content:
    new_content = content.replace(target, replacement)
    with open(etl_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("✅ Successfully patched etl.py")
else:
    print("❌ Could not find target string in etl.py")
