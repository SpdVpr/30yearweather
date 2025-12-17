
import os
import json
import glob

DATA_DIR = "public/data"

# Mapping old labels to new labels based on the user's previous request implementation
# < 17: "Wim Hof Only" -> "Polar Plunge"
# < 21: "Espresso Shot" -> "Refreshing Tonic"
# < 25: "Perfect Swim" -> "Swimming Pool"
# < 29: "Bathtub Mode" -> "Tropical Bath"
# >= 29: "Soup" -> "Hot Soup"

REPLACEMENTS = {
    "Wim Hof Only": "Polar Plunge",
    "Espresso Shot": "Refreshing Tonic",
    "Perfect Swim": "Swimming Pool",
    "Bathtub Mode": "Tropical Bath",
    "Soup": "Hot Soup"
}

def patch_json_files():
    files = glob.glob(os.path.join(DATA_DIR, "*.json"))
    print(f"Found {len(files)} files to check...")

    for file_path in files:
        changed = False
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            days = data.get("days", {})
            for day_key, day_data in days.items():
                if "marine" in day_data and day_data["marine"]:
                    current_factor = day_data["marine"].get("shiver_factor")
                    if current_factor in REPLACEMENTS:
                        day_data["marine"]["shiver_factor"] = REPLACEMENTS[current_factor]
                        changed = True
            
            if changed:
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"✅ Patched {os.path.basename(file_path)}")
            else:
                # print(f"⏩ No changes needed for {os.path.basename(file_path)}")
                pass

        except Exception as e:
            print(f"❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    patch_json_files()
