
try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
        print(f"File size: {len(content)}")
        count = content.count("marine")
        print(f"Occurrences of 'marine': {count}")
        
        # Find where marine data is fetched or used
        indices = [i for i in range(len(content)) if content.startswith('marine', i)]
        for i in indices[:5]: # Show first 5 contexts
            start = max(0, i - 100)
            end = min(len(content), i + 200)
            print(f"Context at {i}: {content[start:end]}")
except Exception as e:
    print(f"Error: {e}")
