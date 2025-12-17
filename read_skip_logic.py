
try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
        start = content.find("file_age_minutes")
        if start != -1:
            print(content[start:start+200])
        else:
            print("file_age_minutes not found")
except Exception as e:
    print(f"Error: {e}")
