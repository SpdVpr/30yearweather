import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_FILE = os.path.join(BASE_DIR, "backend", "airport_codes.py")

def add_lyon_airport():
    try:
        with open(TARGET_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if "'lyon-fr'" in content:
            print("Lyon already in airport_codes.py")
            return

        # Insert before the last closing brace
        last_brace = content.rfind('}')
        if last_brace != -1:
            new_entry = "    'lyon-fr': 'LFLL', # Lyon-Saint Exupéry\n"
            new_content = content[:last_brace] + new_entry + content[last_brace:]
            
            with open(TARGET_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully added Lyon (LFLL) to airport_codes.py")
        else:
            print("Could not find closing brace in airport_codes.py")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_lyon_airport()
