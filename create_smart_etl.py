"""
Optimalizovaný ETL skript s SKIP logikou pro existující data
Přeskakuje města, která už mají vygenerovaný JSON soubor

Použití:
  python etl_smart.py           # Zpracuje jen nová města
  python etl_smart.py --force   # Zpracuje všechna města (ignoruje existující)
"""

import os
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_smart_etl():
    """Vytvoří smart ETL s skip logikou"""
    
    # Přečti původní etl.py
    with open('backend/etl.py', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the main processing loop a přidej skip logiku
    # Hledáme pattern: for idx, (slug, config) in enumerate(LOCATIONS.items(), 1):
    
    # Injektuj skip logiku před process_location
    skip_logic = """
        # ============================================================
        # SMART SKIP: Přeskoč města s existujícími daty
        # ============================================================
        output_path = os.path.join(os.path.dirname(__file__), '../public/data', f'{slug}.json')
        if os.path.exists(output_path) and '--force' not in sys.argv:
            print(f"   ⏭️  Skipping {name} ({slug}) - Data already exists")
            print(f"   💡 Use --force to regenerate")
            continue
        
"""
    
    # Najdi místo kam vložit skip logiku
    # Hledáme start processing loop
    marker = "print(f\"📍 Processing"
    
    if marker in content:
        # Insert skip logic right after the location loop starts
        # Before the print statement
        lines = content.split('\n')
        new_lines = []
        
        for i, line in enumerate(lines):
            new_lines.append(line)
            
            # Po print Processing vložíme skip logiku
            if marker in line:
                # Zjisti odsazení
                indent = len(line) - len(line.lstrip())
                # Přidej skip logiku s odpowídajícím odsazením
                skip_lines = skip_logic.split('\n')
                for skip_line in skip_lines:
                    if skip_line.strip():  # Only indent non-empty lines
                        new_lines.append(' ' * indent + skip_line)
                    else:
                        new_lines.append(skip_line)
        
        new_content = '\n'.join(new_lines)
        
        # Ulož jako etl_smart.py
        with open('backend/etl_smart.py', 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("✅ Created backend/etl_smart.py with skip logic")
        return True
    else:
        print("❌ Could not find processing marker")
        return False

if __name__ == "__main__":
    print("=" * 70)
    print("Creating Smart ETL with Skip Logic")
    print("=" * 70)
    
    if create_smart_etl():
        print("\n✅ SUCCESS!")
        print("\nUsage:")
        print("  cd backend")
        print("  python etl_smart.py          # Process only new cities")
        print("  python etl_smart.py --force  # Regenerate all cities")
    else:
        print("\n❌ FAILED - Manual implementation needed")
