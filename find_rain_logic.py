
import os
import re

ETL_PATH = os.path.join('backend', 'etl.py')

def find_rain_logic():
    if not os.path.exists(ETL_PATH):
        print("Backend ETL not found.")
        return

    with open(ETL_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for the rain probability calculation
    # Likely using pandas: df['rain_p'] = (df['precipitation_sum'] > 1.0)
    
    matches = re.finditer(r"df\['rain_p'\] = \(df\['precipitation_sum'\] > ([\d\.]+)\)", content)
    found = False
    for m in matches:
        print(f"Found rain threshold: {m.group(1)} at position {m.start()}")
        found = True

    if not found:
        print("Could not find standard pandas rain chance logic. Searching for 'precipitation_sum'...")
        # Search for lines containing precipitation_sum to see how it's used
        lines = content.splitlines()
        for i, line in enumerate(lines):
            if 'precipitation_sum' in line and '>' in line:
                print(f"Line {i+1}: {line.strip()}")

if __name__ == "__main__":
    find_rain_logic()
