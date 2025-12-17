
import os

target_cities = ['dublin-ie', 'oslo-no']

try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()

    main_marker = 'if __name__ == "__main__":'
    if main_marker in content:
        injection = f"""
    # FORCED MARINE UPDATE - Dublin & Oslo
    forced = {target_cities}
    LOCATIONS = {{k: v for k, v in LOCATIONS.items() if k in forced}}
    print(f"FORCED MODE: Processing {{len(LOCATIONS)}} cities: {{list(LOCATIONS.keys())}}")
"""
        new_content = content.replace(main_marker, main_marker + injection)
        
        if " < 1200:" in new_content:
            new_content = new_content.replace("< 1200:", "< -1:")
            print("Successfully disabled time-based skip.")
        
        with open('backend/etl_force_final.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Created backend/etl_force_final.py")
    else:
        print("Could not find main block")

except Exception as e:
    print(f"Error: {e}")
