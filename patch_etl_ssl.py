
file_path = 'backend/etl.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace(
    'response = requests.get(url, timeout=10)',
    'response = requests.get(url, timeout=10, verify=False)'
)

if content == new_content:
    print("Replace failed - string not found")
else:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully patched fetch_holidays")
