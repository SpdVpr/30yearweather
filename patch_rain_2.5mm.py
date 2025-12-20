
import os
import re

ETL_PATH = os.path.join('backend', 'etl.py')

def apply_patch():
    if not os.path.exists(ETL_PATH):
        print("Backend ETL not found.")
        return

    with open(ETL_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change precip threshold to 2.5 mm
    new_threshold = "2.5"
    
    # Target: df['rain_p'] = (df['precipitation_sum'] > 0.1).astype(float) * 100
    # Use regex to be safe about spacing and previous patches (like 1.0 or 3.0)
    pattern = r"(df\['rain_p'\] = \(df\['precipitation_sum'\] > )([\d\.]+)(\))"
    
    matches = list(re.finditer(pattern, content))
    if not matches:
        print("❌ Could not find the rain probability calculation line.")
        return

    print(f"Found {len(matches)} occurrences of rain logic.")
    
    new_content = re.sub(pattern, rf"\g<1>{new_threshold}\g<3>", content)
    
    # Also look for the wedding score penalty if it exists separately
    # In some versions, the wedding score uses its own threshold or looks at precip_prob
    
    with open(ETL_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Successfully patched rain threshold to {new_threshold}mm.")

if __name__ == "__main__":
    apply_patch()
