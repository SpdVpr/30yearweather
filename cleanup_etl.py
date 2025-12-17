
file_path = 'backend/etl.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Revert Dubai Filter
filter_str = '        if slug not in ["dubai-ae", "barcelona-es"]:\n            continue'
if filter_str in content:
    content = content.replace(filter_str, '')
    print("Removed Dubai filter")
else:
    print("Filter not found (maybe already removed or different format)")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleanup complete")
