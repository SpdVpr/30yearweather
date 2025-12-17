
import os

ETL_PATH = os.path.join('backend', 'etl.py')

def patch():
    print(f"Reading {ETL_PATH}...")
    try:
        with open(ETL_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print("File not found!")
        return

    # Use flexible matching if exact string space differs, but here we expect exact match from grep
    old_line = "df['rain_p'] = (df['precipitation_sum'] > 0.1).astype(float) * 100"
    new_line = "df['rain_p'] = (df['precipitation_sum'] > 1.0).astype(float) * 100 # Thresh > 1.0mm"
    
    if old_line in content:
        new_content = content.replace(old_line, new_line)
        with open(ETL_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Patch applied successfully! Threshold raised to 1.0mm")
    else:
        print("⚠️ String not found. Checking if already patched...")
        if "> 1.0" in content and "rain_p" in content:
             print("✅ Already patched.")
        else:
             print("❌ Could not find target string.")

if __name__ == "__main__":
    patch()
