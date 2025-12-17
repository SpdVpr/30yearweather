
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

    # Previous patch line
    old_line = "df['rain_p'] = (df['precipitation_sum'] > 1.0).astype(float) * 100 # Thresh > 1.0mm"
    # New strict line
    new_line = "df['rain_p'] = (df['precipitation_sum'] > 3.0).astype(float) * 100 # Thresh > 3.0mm (Tropical Fix)"
    
    # Also fallback if previous patch wasn't applied exactly as written above (check spaces/comments)
    # We can try to regex replace or simplistic approach matching the logic part
    if old_line in content:
        new_content = content.replace(old_line, new_line)
        with open(ETL_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Patch applied! Threshold -> 3.0mm")
    else:
        # Try to find the original original line?
        original = "df['rain_p'] = (df['precipitation_sum'] > 0.1).astype(float) * 100"
        if original in content:
            new_content = content.replace(original, new_line)
            with open(ETL_PATH, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("✅ Patch applied! Threshold -> 3.0mm (from original)")
        else:
            print("⚠️ Could not find exact match to patch. Manual check needed.")
            # Simple string search might fail due to formatting I used in previous tool call.
            # Let's try to match by part.
             
            part_match = "df['rain_p'] = (df['precipitation_sum'] >"
            if part_match in content:
                print("Found partial match. attempting safe replace...")
                import re
                new_content = re.sub(r"df\['rain_p'\] = \(df\['precipitation_sum'\] > [\d\.]+\)", 
                                     "df['rain_p'] = (df['precipitation_sum'] > 3.0)", content)
                with open(ETL_PATH, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("✅ Regex Patch applied! Threshold -> 3.0mm")

if __name__ == "__main__":
    patch()
