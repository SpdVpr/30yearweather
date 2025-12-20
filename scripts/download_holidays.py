
import os
import json
import requests
import pycountry
import time

try:
    from backend.config import LOCATIONS
except ImportError:
    import sys
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from config import LOCATIONS

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HOLIDAYS_DIR = os.path.join(BASE_DIR, 'backend', 'data', 'raw_holidays')
os.makedirs(HOLIDAYS_DIR, exist_ok=True)

YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026]

# Manual overrides for countries that pycountry might miss or Nager uses differently
COUNTRY_OVERRIDES = {
    "United States": "US",
    "United Kingdom": "GB", # Nager uses GB
    "South Korea": "KR",
    "Vietnam": "VN",
    "Russia": "RU",
    "Czech Republic": "CZ",
    "Turkey": "TR",
    "Hong Kong": "HK",
    "Macau": "MO", 
    "Taiwan": "TW", # Usually CN or TW? Nager supports TW? Not sure.
    "China": "CN",
    "Bolivia": "BO",
    "Venezuela": "VE",
    "Iran": "IR",
    "Syria": "SY",
    "Cape Verde": "CV", 
    "Curacao": "CW",
    "Sint Maarten": "SX",
    "St. Martin": "MF",
    "St. Barts": "BL", 
    "French Polynesia": "FR", # Often Nager defaults to FR holidays for overseas? Or None.
    "Laos": "LA",
    "Myanmar": "MM",
    "Brunei": "BN"
}

def get_iso_code(country_name):
    # Check overrides first
    if country_name in COUNTRY_OVERRIDES:
        return COUNTRY_OVERRIDES[country_name]
    
    # Fuzzy search
    try:
        matches = pycountry.countries.search_fuzzy(country_name)
        if matches:
            return matches[0].alpha_2
    except LookupError:
        pass
        
    return None

def fetch_holidays(iso_code, year):
    url = f"https://date.nager.at/api/v3/PublicHolidays/{year}/{iso_code}"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            return resp.json()
        elif resp.status_code == 404:
            # Not supported country
            return []
        else:
            print(f"      ⚠️ API Error {resp.status_code} for {iso_code}/{year}")
            return []
    except Exception as e:
        print(f"      ⚠️ Except: {e}")
        return []

def main():
    print("==================================================")
    print(f"🎉 DOWNLOADING PUBLIC HOLIDAYS FOR {len(LOCATIONS)} CITIES")
    print("==================================================")
    
    success_count = 0
    fail_count = 0

    processed_countries = {} # Cache country results to avoid re-fetching same country 10 times

    for slug, config in LOCATIONS.items():
        country_name = config.get('country', 'Unknown')
        iso_code = get_iso_code(country_name)
        
        filepath = os.path.join(HOLIDAYS_DIR, f"{slug}_holidays.json")
        
        # Check if file exists and is valid (> 2KB usually implies data, < 100B implies empty/broken)
        # But we want to re-download if it's broken (1KB ~ empty dict {})
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            if size > 100: 
                # print(f"⏭️  Skipping {slug} ({country_name}) - Already exists.")
                # continue
                pass # Re-downloading to be safe/update
        
        if not iso_code:
            print(f"❌ {slug}: Could not determine ISO code for '{country_name}'")
            fail_count += 1
            # Write empty dict to avoid re-processing errors? Or leave as is.
            # Writing empty valid JSON is better than broken file.
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump({}, f)
            continue

        print(f"📍 Processing {slug} ({country_name} -> {iso_code})...")
        
        # Optimization: cache country data
        if iso_code in processed_countries:
            city_holidays = processed_countries[iso_code]
            # Save
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(city_holidays, f, indent=4, ensure_ascii=False)
            print(f"   ✅ Saved from cache ({len(city_holidays)} days)")
            success_count += 1
            continue

        all_holidays = {}
        has_data = False
        
        for year in YEARS:
            data = fetch_holidays(iso_code, year)
            if data:
                has_data = True
                for h in data:
                    date = h.get('date')
                    name = h.get('name') or h.get('localName')
                    if date and name:
                        all_holidays[date] = name
            time.sleep(0.1) # Be nice to API
            
        if has_data:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(all_holidays, f, indent=4, ensure_ascii=False)
            print(f"   ✅ Processed {len(all_holidays)} holidays.")
            processed_countries[iso_code] = all_holidays
            success_count += 1
        else:
            print(f"   ⚠️  No holiday data found for {iso_code}")
            # Save empty
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump({}, f, indent=4)
            processed_countries[iso_code] = {} # Mark as empty
            fail_count += 1
            
    print("\n==================================================")
    print(f"DONE. Success: {success_count}, Failed/Empty: {fail_count}")

if __name__ == "__main__":
    main()
