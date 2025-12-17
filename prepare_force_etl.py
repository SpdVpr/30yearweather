
import os

target_cities = ['stockholm-se', 'helsinki-fi', 'tokyo-jp', 'shanghai-cn', 'hong-kong-hk', 'taipei-tw', 'singapore-sg', 'jakarta-id', 'bali-id', 'manila-ph', 'mumbai-in', 'istanbul-tr']

try:
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject logic to filter locations at start of main
    main_marker = 'if __name__ == "__main__":'
    if main_marker in content:
        injection = f"""
    # FORCED MARINE UPDATE
    forced = {target_cities}
    LOCATIONS = {{k: v for k, v in LOCATIONS.items() if k in forced}}
    print(f"FORCED MODE: Processing {{len(LOCATIONS)}} cities: {{list(LOCATIONS.keys())}}")
"""
        new_content = content.replace(main_marker, main_marker + injection)
        
        # Disable the time-based skip
        # Logic: if time.time() - mtime < 1200:
        if " < 1200:" in new_content:
            new_content = new_content.replace("< 1200:", "< -1:") # Impossible condition
            print("Successfully disabled time-based skip.")
        else:
            print("Warning: Could not find skip logic (< 1200:)")
        
        with open('backend/etl_force.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Created backend/etl_force.py")
    else:
        print("Could not find main block")

except Exception as e:
    print(f"Error: {e}")
