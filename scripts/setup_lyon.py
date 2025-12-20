import os
import re

# Configuration
LYON_CONFIG = """
    'lyon-fr': {
        "name": "Lyon",
        "country": "France",
        "lat": 45.7640,
        "lon": 4.8357,
        "is_coastal": False,
        "timezone": "Europe/Paris"
    },
"""

LYON_TOURISM = """
    {"slug": "lyon-fr", "name": "Lyon", "country_code": "FR", "lat": 45.7640, "lon": 4.8357},
"""

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, "backend", "config.py")
TOURISM_PATH = os.path.join(BASE_DIR, "backend", "etl_tourism.py")

def update_config():
    print(f"Updating {CONFIG_PATH}...")
    try:
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'lyon-fr' in content:
            print("Lyon already in config.py")
            return

        # Find the end of LOCATIONS dict
        # Looking for the last closing brace of the LOCATIONS structure
        # Assuming LOCATIONS = { ... }
        
        # Simple heuristic: find the last '}' in the file if the file ends with the dict
        # Or find '}' followed by newline or EOF
        
        # Regex to find LOCATIONS = { ... }
        match = re.search(r'(LOCATIONS\s*=\s*\{)(.*?)(\}\s*$)', content, re.DOTALL)
        if match:
             # This regex might be too greedy if file has more content.
             # Let's try to insert before the last '}'
             pass
        
        # Falback: Just look for the last '}'
        last_brace_idx = content.rfind('}')
        if last_brace_idx != -1:
            new_content = content[:last_brace_idx] + "," + LYON_CONFIG + content[last_brace_idx:]
            with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully added Lyon to config.py")
        else:
            print("Could not find closing brace in config.py")

    except Exception as e:
        print(f"Error updating config.py: {e}")

def update_tourism():
    print(f"Updating {TOURISM_PATH}...")
    try:
        with open(TOURISM_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'lyon-fr' in content:
            print("Lyon already in etl_tourism.py")
            return

        # Look for LOCATIONS = [ ... ]
        # We want to insert before the closing ']'
        
        # We search for "LOCATIONS = [" and then the next "]"
        start_idx = content.find("LOCATIONS = [")
        if start_idx != -1:
            end_idx = content.find("]", start_idx)
            if end_idx != -1:
                new_content = content[:end_idx] + "," + LYON_TOURISM + content[end_idx:]
                with open(TOURISM_PATH, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("Successfully added Lyon to etl_tourism.py")
            else:
                print("Could not find closing bracket ']' for LOCATIONS in etl_tourism.py")
        else:
            print("Could not find LOCATIONS list in etl_tourism.py")

    except Exception as e:
        print(f"Error updating etl_tourism.py: {e}")

if __name__ == "__main__":
    update_config()
    update_tourism()
