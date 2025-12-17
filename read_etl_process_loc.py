
try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
        start = content.find("def process_location")
        if start != -1:
            end = content.find("return", start + 5000) # Read enough context
            print(content[start:end])
        else:
            print("Function process_location not found")
except Exception as e:
    print(f"Error: {e}")
