
NEW_CITIES = {
    # EUROPE (7)
    "hamburg": {"name": "Hamburg", "country": "Germany", "lat": 53.551, "lon": 9.993, "icao": "EDDH"},
    "seville": {"name": "Seville", "country": "Spain", "lat": 37.389, "lon": -5.984, "icao": "LEZL"},
    "naples": {"name": "Naples", "country": "Italy", "lat": 40.852, "lon": 14.268, "icao": "LIRN"},
    "valletta": {"name": "Valletta", "country": "Malta", "lat": 35.898, "lon": 14.514, "icao": "LMML"},
    "rhodes": {"name": "Rhodes", "country": "Greece", "lat": 36.434, "lon": 28.217, "icao": "LGRP"},
    "sofia": {"name": "Sofia", "country": "Bulgaria", "lat": 42.697, "lon": 23.321, "icao": "LBSF"},
    "riga": {"name": "Riga", "country": "Latvia", "lat": 56.949, "lon": 24.105, "icao": "EVRA"},

    # NORTH AMERICA (7)
    "chicago": {"name": "Chicago", "country": "United States", "lat": 41.878, "lon": -87.629, "icao": "KORD"},
    "boston": {"name": "Boston", "country": "United States", "lat": 42.360, "lon": -71.058, "icao": "KBOS"},
    "las-vegas": {"name": "Las Vegas", "country": "United States", "lat": 36.169, "lon": -115.139, "icao": "KLAS"},
    "honolulu": {"name": "Honolulu", "country": "United States", "lat": 21.306, "lon": -157.858, "icao": "PHNL"},
    "montreal": {"name": "Montreal", "country": "Canada", "lat": 45.501, "lon": -73.567, "icao": "CYUL"},
    "calgary": {"name": "Calgary", "country": "Canada", "lat": 51.044, "lon": -114.072, "icao": "CYYC"},
    "new-orleans": {"name": "New Orleans", "country": "United States", "lat": 29.951, "lon": -90.071, "icao": "KMSY"},
    
    # SOUTH AMERICA (5)
    "bogota": {"name": "Bogota", "country": "Colombia", "lat": 4.711, "lon": -74.072, "icao": "SKBO"},
    "sao-paulo": {"name": "Sao Paulo", "country": "Brazil", "lat": -23.550, "lon": -46.633, "icao": "SBGR"},
    "quito": {"name": "Quito", "country": "Ecuador", "lat": -0.180, "lon": -78.467, "icao": "SEQM"},
    "cusco": {"name": "Cusco", "country": "Peru", "lat": -13.532, "lon": -71.967, "icao": "SPZO"},
    "san-jose-cr": {"name": "San Jose", "country": "Costa Rica", "lat": 9.928, "lon": -84.090, "icao": "MROC"},

    # ASIA (8)
    "sapporo": {"name": "Sapporo", "country": "Japan", "lat": 43.061, "lon": 141.354, "icao": "RJCC"},
    "busan": {"name": "Busan", "country": "South Korea", "lat": 35.179, "lon": 129.075, "icao": "RKPK"},
    "chengdu": {"name": "Chengdu", "country": "China", "lat": 30.572, "lon": 104.066, "icao": "ZUUU"},
    "kathmandu": {"name": "Kathmandu", "country": "Nepal", "lat": 27.717, "lon": 85.324, "icao": "VNKT"},
    "colombo": {"name": "Colombo", "country": "Sri Lanka", "lat": 6.927, "lon": 79.861, "icao": "VCBI"},
    "almaty": {"name": "Almaty", "country": "Kazakhstan", "lat": 43.256, "lon": 76.928, "icao": "UAAA"},
    "tashkent": {"name": "Tashkent", "country": "Uzbekistan", "lat": 41.299, "lon": 69.240, "icao": "UTTT"},
    "fukuoka": {"name": "Fukuoka", "country": "Japan", "lat": 33.590, "lon": 130.401, "icao": "RJFF"},

    # MIDDLE EAST (4)
    "abu-dhabi": {"name": "Abu Dhabi", "country": "United Arab Emirates", "lat": 24.453, "lon": 54.377, "icao": "OMAA"},
    "doha": {"name": "Doha", "country": "Qatar", "lat": 25.285, "lon": 51.531, "icao": "OTHH"},
    "tel-aviv": {"name": "Tel Aviv", "country": "Israel", "lat": 32.085, "lon": 34.781, "icao": "LLBG"},
    "muscat": {"name": "Muscat", "country": "Oman", "lat": 23.585, "lon": 58.405, "icao": "OEMS"},

    # AFRICA (4)
    "cairo": {"name": "Cairo", "country": "Egypt", "lat": 30.044, "lon": 31.235, "icao": "HECA"},
    "johannesburg": {"name": "Johannesburg", "country": "South Africa", "lat": -26.204, "lon": 28.047, "icao": "FAOR"},
    "nairobi": {"name": "Nairobi", "country": "Kenya", "lat": -1.292, "lon": 36.821, "icao": "HKJK"},
    "casablanca": {"name": "Casablanca", "country": "Morocco", "lat": 33.573, "lon": -7.589, "icao": "GMMN"},

    # OCEANIA (5)
    "brisbane": {"name": "Brisbane", "country": "Australia", "lat": -27.469, "lon": 153.025, "icao": "YBBN"},
    "perth": {"name": "Perth", "country": "Australia", "lat": -31.950, "lon": 115.860, "icao": "YPPH"},
    "christchurch": {"name": "Christchurch", "country": "New Zealand", "lat": -43.532, "lon": 172.636, "icao": "NZCH"},
    "nadi": {"name": "Nadi", "country": "Fiji", "lat": -17.800, "lon": 177.416, "icao": "NFFN"},
    "papeete": {"name": "Papeete", "country": "French Polynesia", "lat": -17.551, "lon": -149.607, "icao": "NTAA"}
}

import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(base_dir, 'backend', 'config.py')
airports_path = os.path.join(base_dir, 'backend', 'airport_codes.py')

def update_config():
    with open(config_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find last brace of LOCATIONS dict
    # Assuming LOCATIONS = { ... } structure
    # Robust search for "LOCATIONS = {" and match closing brace? 
    # Or just insert before the last closing brace if loop is complex.
    # Simple insertion before last '}' of the file might break if there are other dicts.
    # config.py usually ends with LOCATIONS dict closure.
    
    # Identify LOCATIONS block
    start_idx = content.find("LOCATIONS = {")
    if start_idx == -1:
        print("Error: LOCATIONS dict not found in config.py")
        return
        
    last_brace_idx = content.rfind("}")
    if last_brace_idx == -1:
        print("Error: Closing brace not found")
        return

    # Prepare new entries
    new_entries = []
    for slug, info in NEW_CITIES.items():
        if f"'{slug}':" not in content and f'"{slug}":' not in content:
            entry = f"    '{slug}': {{ 'name': \"{info['name']}\", 'country': \"{info['country']}\", 'lat': {info['lat']}, 'lon': {info['lon']} }},\n"
            new_entries.append(entry)
            
    if not new_entries:
        print("No new cities to add to config.")
    else:
        # Insert
        new_content = content[:last_brace_idx] + "".join(new_entries) + content[last_brace_idx:]
        with open(config_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added {len(new_entries)} cities to config.py")

def update_airports():
    with open(airports_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    last_brace_idx = content.rfind("}")
    
    new_entries = []
    for slug, info in NEW_CITIES.items():
        if f"'{slug}':" not in content:
            entry = f"    '{slug}': '{info['icao']}', # {info['name']}\n"
            new_entries.append(entry)
            
    if not new_entries:
        print("No new airports to add.")
    else:
        new_content = content[:last_brace_idx] + "".join(new_entries) + content[last_brace_idx:]
        with open(airports_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added {len(new_entries)} airports to airport_codes.py")

if __name__ == "__main__":
    update_config()
    update_airports()
