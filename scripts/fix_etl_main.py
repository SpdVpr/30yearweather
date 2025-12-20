
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ETL_PATH = os.path.join(BASE_DIR, 'backend', 'etl.py')

def fix_etl():
    with open(ETL_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # The block to replace
    bad_block = """if __name__ == "__main__":
    # FORCED MARINE UPDATE - Dublin & Oslo
    forced = ['dublin-ie', 'oslo-no']
    LOCATIONS = {k: v for k, v in LOCATIONS.items() if k in forced}
    print(f"FORCED MODE: Processing {len(LOCATIONS)} cities: {list(LOCATIONS.keys())}")

    main()"""
    
    # New block
    new_block = """if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--city', type=str, help="Process single city")
    args = parser.parse_args()

    if args.city:
         LOCATIONS = {k: v for k, v in LOCATIONS.items() if (k == args.city or k == args.city.lower())}
         print(f"🎯 Single city mode: {list(LOCATIONS.keys())}")

    main()"""
    
    if bad_block in content:
        new_content = content.replace(bad_block, new_block)
        with open(ETL_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ backend/etl.py FIXED successfully!")
    else:
        # Fallback: Maybe whitespace mismatch?
        # Try to find just the first line and assume the rest matches end of file
        start_marker = 'if __name__ == "__main__":'
        # Check if forced is present
        if 'forced = [\'dublin-ie\', \'oslo-no\']' in content:
            # We have the problem, but string replace failed due to whitespace.
            # Let's truncate and append.
            idx = content.rfind(start_marker)
            if idx != -1:
                new_content = content[:idx] + new_block
                with open(ETL_PATH, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print("✅ backend/etl.py FIXED using truncate method.")
            else:
                 print("❌ Could not find __name__ == __main__ block.")
        else:
            print("INFO: backend/etl.py does not contain the target bad block. Already fixed?")

if __name__ == "__main__":
    fix_etl()
