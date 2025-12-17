
with open('backend/etl.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Shiver Factor Logic
old_block = """
                    if avg_water_temp < 17:
                        shiver_factor = "Wim Hof Only"
                    elif avg_water_temp < 21:
                        shiver_factor = "Espresso Shot"
                    elif avg_water_temp < 25:
                        shiver_factor = "Perfect Swim"
                    elif avg_water_temp < 29:
                        shiver_factor = "Bathtub Mode"
                    else:
                        shiver_factor = "Soup"
"""
new_block = """
                    if avg_water_temp < 17:
                        shiver_factor = "Polar Plunge"
                    elif avg_water_temp < 21:
                        shiver_factor = "Refreshing Tonic"
                    elif avg_water_temp < 25:
                        shiver_factor = "Swimming Pool"
                    elif avg_water_temp < 29:
                        shiver_factor = "Tropical Bath"
                    else:
                        shiver_factor = "Hot Soup"
"""

# Try to find and replace slightly fuzzy if exact match fails due to potential indent differences
# But first try exact
if 'shiver_factor = "Wim Hof Only"' in content:
    content = content.replace('shiver_factor = "Wim Hof Only"', 'shiver_factor = "Polar Plunge"')
    content = content.replace('shiver_factor = "Espresso Shot"', 'shiver_factor = "Refreshing Tonic"')
    content = content.replace('shiver_factor = "Perfect Swim"', 'shiver_factor = "Swimming Pool"')
    content = content.replace('shiver_factor = "Bathtub Mode"', 'shiver_factor = "Tropical Bath"')
    content = content.replace('shiver_factor = "Soup"', 'shiver_factor = "Hot Soup"')
    
    with open('backend/etl.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated Shiver Factor labels in backend")
else:
    print("Could not find Shiver Factor labels in backend to replace")
