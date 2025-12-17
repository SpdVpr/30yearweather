
import os
from datetime import datetime, timedelta

# Calculate safe end date (today - 2 days)
safe_date = (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")
print(f"Setting END_DATE to: {safe_date}")

config_path = os.path.join('backend', 'config.py')

with open(config_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded future date with safe past date
# My previous script set it to "2025-12-31"
new_content = content.replace('END_DATE = "2025-12-31"', f'END_DATE = "{safe_date}"')

with open(config_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Updated END_DATE in backend/config.py")
