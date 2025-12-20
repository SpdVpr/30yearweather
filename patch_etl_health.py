
import os
import sys

def patch_etl_health():
    file_path = 'backend/etl.py'
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to add this NEW logic.
    # We can add it after the Flight Logic we just added.
    
    # Target: The end of the flight logic block
    # Or just simply before "Structure final data (NEW)" again.
    # Our previous patch added specific flight logic.
    
    target = '        # Structure final data (NEW)'
    
    if target not in content:
        print("Error: Target not found")
        return
        
    health_logic = '''
        # 6c. Health & Vaccination Data (CDC)
        print("   💊 Loading health recommendations...")
        health_data = None
        
        try:
            # Helper to get slug (duplicate logic from scraper, but simple enough to inline or use simple normalization)
            def get_cdc_slug_inline(c_name):
                s = c_name.lower().strip().replace(' ', '-').replace('.', '').replace("'", "")
                overrides = {
                    "usa": "united-states",
                    "uk": "united-kingdom",
                    "uae": "united-arab-emirates",
                    "united-states-of-america": "united-states"
                }
                return overrides.get(s, s)
                
            c_slug = get_cdc_slug_inline(config['country'])
            base_dir = os.path.dirname(os.path.abspath(__file__))
            health_file = os.path.join(base_dir, 'data', 'raw_health', f"{c_slug}_health.json")
            
            if os.path.exists(health_file):
                with open(health_file, 'r', encoding='utf-8') as f:
                    health_data = json.load(f)
                
                # Summary for log
                vac_count = len(health_data.get('vaccines', []))
                print(f"   💊 Found {vac_count} vaccine recommendations")
            else:
                print(f"   ⚠️  Health data not found for {config['country']} ({c_slug})")

        except Exception as e:
            print(f"   ⚠️  Failed to load health data: {e}")

'''
    
    replacement = health_logic + target
    new_content = content.replace(target, replacement)
    
    # Add to final_data dict
    # Look for: '"flight_info": flight_data' (which we added in previous patch)
    
    target_dict = '"flight_info": flight_data'
    replacement_dict = '"flight_info": flight_data,\n                "health_info": health_data'
    
    if target_dict in new_content:
        new_content = new_content.replace(target_dict, replacement_dict)
    else:
        # Fallback if previous patch was STRICT and maybe diff indentation
        print("Warning: Dict target not found (flight_info used?). Trying broader search")
        # Try finding the end of safety_profile or similar
    
    # Update existing data branch
    target_update = "        final_data['meta']['flight_info'] = flight_data"
    replacement_update = "        final_data['meta']['health_info'] = health_data\n" + target_update
    
    new_content = new_content.replace(target_update, replacement_update)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Successfully patched backend/etl.py with Health Logic")

if __name__ == "__main__":
    patch_etl_health()
