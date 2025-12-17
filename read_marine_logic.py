
try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Find fetch_marine_data function
        start = content.find("def fetch_marine_data")
        if start != -1:
            end = content.find("\ndef ", start + 100)  # Find next function
            print("=== FETCH_MARINE_DATA FUNCTION ===")
            print(content[start:end])
        else:
            print("fetch_marine_data not found")
except Exception as e:
    print(f"Error: {e}")
