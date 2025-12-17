
with open('backend/etl.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Shiver Factor Logic (One-liner format)
if 'if avg_water_temp < 17: shiver = "Wim Hof Only"' in content:
    content = content.replace('if avg_water_temp < 17: shiver = "Wim Hof Only"', 'if avg_water_temp < 17: shiver = "Polar Plunge"')
    content = content.replace('elif avg_water_temp < 21: shiver = "Espresso Shot"', 'elif avg_water_temp < 21: shiver = "Refreshing Tonic"')
    content = content.replace('elif avg_water_temp < 25: shiver = "Perfect Swim"', 'elif avg_water_temp < 25: shiver = "Swimming Pool"')
    content = content.replace('elif avg_water_temp < 29: shiver = "Bathtub Mode"', 'elif avg_water_temp < 29: shiver = "Tropical Bath"')
    content = content.replace('shiver = "Soup"', 'shiver = "Hot Soup"')
    
    with open('backend/etl.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated Shiver Factor labels in backend (one-line format)")
else:
    print("Could not find Shiver Factor labels to replace (check format)")
