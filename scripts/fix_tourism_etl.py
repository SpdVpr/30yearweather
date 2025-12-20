import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET_FILE = os.path.join(BASE_DIR, "backend", "etl_tourism.py")

def fix_bug():
    try:
        with open(TARGET_FILE, 'r', encoding='utf-8') as f:
            content = f.read()
            
        old_code = "if weather_data.get('meta', {}).get('flight_info', {}).get('seasonality'):"
        new_code = "if (weather_data.get('meta', {}).get('flight_info') or {}).get('seasonality'):"
        
        if old_code in content:
            new_content = content.replace(old_code, new_code)
            with open(TARGET_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully patched etl_tourism.py")
        else:
            if new_code in content:
                print("Patch already applied.")
            else:
                print("Could not find exact line to patch.")
                
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_bug()
