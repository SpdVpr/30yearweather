
import os
import re

# List of coastal cities among the new ones (and potential update for old ones if missed)
COASTAL_CITIES = [
    'naples', 'valletta', 'rhodes', 'riga', 
    'boston', 'honolulu', 'new-orleans', 
    'busan', 'colombo', 'fukuoka', 
    'abu-dhabi', 'doha', 'tel-aviv', 'muscat', 
    'casablanca', 
    'brisbane', 'perth', 'christchurch', 'nadi', 'papeete',
    # Ensure existing ones are covered too if needed, but primarily new ones
    'nice', 'barcelona', 'venice', 'athens', 'dubrovnik', 'split', 'lisbon', 
    'porto', 'dubai', 'miami', 'los-angeles', 'san-francisco', 'vancouver', 
    'rio-de-janeiro', 'lima', 'sydney', 'melbourne', 'auckland', 'cape-town',
    'zanzibar', 'male', 'cancun', 'punta-cana', 'nassau', 'san-juan', 
    'havana', 'montego-bay', 'bora-bora', 'santorini', 'mykonos', 'ibiza', 
    'palma-mallorca', 'las-palmas', 'copenhagen', 'oslo', 'helsinki', 'stockholm',
    'hong-kong', 'singapore', 'mumbai', 'toyko', 'osaka', 'manila', 'bali', 'phuket'
]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, 'backend', 'config.py')

def update_config():
    with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex strategy:
    # Find matching dictionary entries and inject 'is_coastal': True if not present.
    # Entry format: 'slug': { ... }
    
    modified_content = content
    count = 0
    
    # Iterate over all coastal cities
    for slug in COASTAL_CITIES:
        # Regex to find the dictionary for this slug
        # Look for 'slug': { ... }
        # Capture the content inside { } to check if is_coastal exists
        
        # Simpler approach:
        # Find "'slug': {"
        # Check if "is_coastal" is in the line(s) following it before the closing '},'.
        # Since config.py is usually one line per city or formatted standardly.
        
        # Assuming format: 'slug': { ... },
        if f"'{slug}':" in modified_content:
            # Check if is_coastal is strictly missing for this entry
            # This is hard with regex on the whole file.
            pass
            
    # Let's try a line-by-line approach which is safer for this structure
    lines = content.splitlines()
    new_lines = []
    
    for line in lines:
        stripped = line.strip()
        # Check if line defines a city
        # e.g. 'slug': { ... },
        match = re.search(r"^'([\w-]+)':\s*\{(.*)\},?", stripped)
        if match:
            slug = match.group(1)
            inner_content = match.group(2)
            
            if slug in COASTAL_CITIES:
                if "'is_coastal': True" not in inner_content and '"is_coastal": True' not in inner_content:
                    # Inject it
                    # Remove closing brace if it exists in the match (it does)
                    # Actually we matched the content inside {} in group 2.
                    # Reconstruct the line
                    
                    # We need to preserve indentation? The match is on stripped line.
                    # Let's use the original line structure.
                    
                    # Find where the inner content ends
                    # Usually it's like: 'slug': { ... },
                    # We want to insert ", 'is_coastal': True" before "}"
                    
                    dict_end = line.rfind("}")
                    if dict_end != -1:
                        # Check if last char before } is ,
                        # It's python dict, trailing comma is allowed/optional.
                        
                        prefix = line[:dict_end]
                        suffix = line[dict_end:]
                        
                        # Add is_coastal
                        new_line = f"{prefix}, 'is_coastal': True{suffix}"
                        new_lines.append(new_line)
                        count += 1
                        continue
        
        new_lines.append(line)
        
    with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
        f.write("\n".join(new_lines))
        
    print(f"✅ Updated {count} cities to be coastal.")

if __name__ == "__main__":
    update_config()
