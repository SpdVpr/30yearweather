
import os

file_path = 'backend/etl.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update calculate_smart_stats
# Original:             values = group_df[col_name].values
# Replacement:          values = pd.to_numeric(group_df[col_name], errors='coerce').values
if '            values = group_df[col_name].values' in content:
    content = content.replace(
        '            values = group_df[col_name].values',
        '            values = pd.to_numeric(group_df[col_name], errors="coerce").values'
    )
    print("Updated calculate_smart_stats")
else:
    print("Could not find calculate_smart_stats line")


# 2. Update calculate_smart_std (same fix)
if '            values = group_df[col_name].values' in content:
    content = content.replace(
        '            values = group_df[col_name].values',
        '            values = pd.to_numeric(group_df[col_name], errors="coerce").values'
    )
    print("Updated calculate_smart_std")

# 3. Add Filter for Dubai in Main Loop
# Target:     for idx, (slug, config) in enumerate(LOCATIONS.items(), 1):
# Add check after it
target_loop = '    for idx, (slug, config) in enumerate(LOCATIONS.items(), 1):'
if target_loop in content:
    if 'if slug not in ["dubai-ae", "barcelona-es"]:' not in content:
        content = content.replace(
            target_loop,
            target_loop + '\n        if slug not in ["dubai-ae", "barcelona-es"]:\n            continue'
        )
        print("Added Dubai filter")
else:
    print("Could not find main loop")

# 4. Increase Sleep Time
# Target:                 print(f"   ⏳ Waiting 1 seconds before next location...")
# Target:                 time.sleep(1)
if 'time.sleep(1)' in content:
    content = content.replace('time.sleep(1)', 'time.sleep(3)')
    print("Increased sleep time")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patching complete")
