
try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
        start = content.find("for idx, (slug, config)")
        if start != -1:
            print(content[start:start+1000])
        else:
            print("Loop not found")
except Exception as e:
    print(f"Error: {e}")
