
import os
import re

def fix_routes_logic():
    path = 'backend/etl.py'
    if not os.path.exists(path):
        print("etl.py not found")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Search for the specific block of code that handles routes
    old_block = r'''                 # 2. Routes (Top 5)
                 raw_routes = s_json.get\('routes', \[\]\)
                 if raw_routes:
                     # Structure: \[{'destination': {'code': 'LHR', 'name': 'Heathrow'}, 'dailyAverage': 15.5}, ...\]
                     # API structure might vary, let's correspond to what AeroDataBox returns for "routes/daily"
                     # Usually it is a list of objects.
                     # Let's handle generic list
                     sorted_routes = sorted\(raw_routes, key=lambda x: x.get\('averageDailyFlights', 0\), reverse=True\)
                     for r in sorted_routes\[:5\]:
                         airport = r.get\('destinationAirport', \{\}\)
                         name = airport.get\('name', 'Unknown'\)
                         iata = airport.get\('iata', ''\)
                         routes_summary.append\(f"\{name\} \(\{iata\}\)"\)'''

    # New code with correct structure
    new_block = '''                 # 2. Routes (Top 5)
                 # structure is typically s_json['routes']['routes'] from AeroDataBox daily-routes API
                 r_data = s_json.get('routes', {})
                 raw_routes = []
                 if isinstance(r_data, dict):
                     raw_routes = r_data.get('routes', [])
                 elif isinstance(r_data, list):
                     raw_routes = r_data

                 if raw_routes:
                     sorted_routes = sorted(raw_routes, key=lambda x: x.get('averageDailyFlights', 0), reverse=True)
                     for r in sorted_routes[:5]:
                         airport = r.get('destination', r.get('destinationAirport', {}))
                         name = airport.get('name', 'Unknown')
                         iata = airport.get('iata', airport.get('code', ''))
                         if name != 'Unknown':
                             routes_summary.append(f"{name} ({iata})")'''

    # Use re.sub to replace the block
    new_content = re.sub(old_block, new_block, content, flags=re.DOTALL)
    
    if new_content == content:
        print("Could not find the routes block with exact match. Trying more flexible match.")
        # Fallback to a simpler match if indentation or whitespace varies
        pattern = r'raw_routes = s_json.get\(\'routes\', \[\]\).*?routes_summary.append\(f"\{name\} \(\{iata\}\)"\)'
        new_content = re.sub(pattern, new_block.strip() , content, flags=re.DOTALL)

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Success: Flight routes logic in etl.py fixed.")
    else:
        print("Failure: Could not patch etl.py. Please check the file content.")

if __name__ == "__main__":
    fix_routes_logic()
