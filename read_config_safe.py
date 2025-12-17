
cities = ['hong-kong-hk', 'bangkok-th', 'bali-id', 'mumbai-in', 'manila-ph']
try:
    with open('backend/config.py', 'r', encoding='utf-8') as f:
        content = f.read()
        for city in cities:
            start_index = content.find('"' + city + '"')
            if start_index != -1:
                end_index = content.find('}', start_index)
                print(f"{city}: {content[start_index:end_index+1]}")
            else:
                print(f"{city}: Not found")
except Exception as e:
    print(f"Error: {e}")
