
import os
import json
import time
import requests
import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Setup
base_dir = os.path.dirname(os.path.abspath(__file__))

try:
    from backend.config import LOCATIONS
except ImportError:
    import sys
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    from config import LOCATIONS

# Ensure data dir exists
health_dir = os.path.join(base_dir, 'backend', 'data', 'raw_health')
os.makedirs(health_dir, exist_ok=True)

# Country mapping helpers
def get_cdc_slug(country_name):
    # Standard normalization
    slug = country_name.lower().strip()
    slug = slug.replace(' ', '-')
    slug = slug.replace('.', '')
    slug = slug.replace("'", "")
    
    # Overrides
    overrides = {
        "usa": "united-states",
        "uk": "united-kingdom",
        "uae": "united-arab-emirates",
        "united-states-of-america": "united-states"
    }
    
    return overrides.get(slug, slug)

def fetch_health_info(country_name):
    slug = get_cdc_slug(country_name)
    url = f"https://wwwnc.cdc.gov/travel/destinations/traveler/none/{slug}"
    
    print(f"   💊 Fetching CDC data for {country_name} ({slug})...")
    
    try:
        resp = requests.get(url, timeout=15)
        if resp.status_code == 404:
            print(f"      ❌ 404 Not Found: {url}")
            return None
        
        resp.raise_for_status()
        soup = BeautifulSoup(resp.content, 'html.parser')
        
        info = {
            "source": url,
            "vaccines": [],
            "non_vaccine_diseases": [],
            "notices": []
        }
        
        # 1. Parse Vaccines
        # Look for the CLINICIAN view or TRAVELLER view table.
        # Usually checking for table with header "Vaccines for disease" or "Vaccine"
        tables = soup.find_all('table')
        vaccine_table = None
        
        for t in tables:
            headers = [th.get_text(strip=True).lower() for th in t.find_all(['th'])]
            if any("vaccine" in h for h in headers) or any("clinician" in h for h in headers) or any("disease" in h for h in headers):
                vaccine_table = t
                # Prefer the table that isn't hidden if multiple (though BS4 sees all)
                if 'hidden' not in t.get('class', []):
                    break
        
        if vaccine_table:
            rows = vaccine_table.find_all('tr')
            for row in rows[1:]: # Skip header
                cols = row.find_all(['td', 'th'])
                if len(cols) >= 2:
                    disease = cols[0].get_text(strip=True)
                    recommendation = cols[1].get_text(strip=True)
                    
                    # Clean up text notes
                    # Sometimes text is long. We keep it as is.
                    
                    if disease not in ["Routine vaccines"]:
                        info['vaccines'].append({
                            "disease": disease,
                            "recommendation": recommendation
                        })
                        
        # 2. Parse Non-Vaccine Diseases (Table 1 usually)
        # Check other tables
        for t in tables:
            if t == vaccine_table: continue
            
            headers = [th.get_text(strip=True).lower() for th in t.find_all(['th'])]
            if any("advice" in h for h in headers) and any("spreads" in h for h in headers):
                 rows = t.find_all('tr')
                 for row in rows[1:]:
                     cols = row.find_all(['td', 'th'])
                     if len(cols) >= 3:
                         name = cols[0].get_text(strip=True)
                         # spread = cols[1].get_text(strip=True)
                         advice = cols[2].get_text(strip=True)
                         info['non_vaccine_diseases'].append({
                             "disease": name,
                             "advice": advice
                         })

        # 3. Travel Health Notices (Warning Level)
        # Look for div with class 'travel-notice-alert' or similar
        # CDC structure changes, but often listed at top
        
        return info

    except Exception as e:
        print(f"      ❌ Error: {e}")
        return None

def main():
    print("🚀 Starting CDC Health Data Scraper...")
    
    # Identify unique countries from LOCATIONS
    # Locations is { slug: { country: "Name", ... } }
    countries = {} # Name -> [slugs]
    
    for city_slug, config in LOCATIONS.items():
        c_name = config['country']
        if c_name not in countries:
            countries[c_name] = []
        countries[c_name].append(city_slug)
        
    print(f"ℹ️  Found {len(countries)} unique countries to scan.")
    
    for country, cities in countries.items():
        
        # Check if any city already done? No, we map by country. 
        # But we save per city slug to make ETL easy (mapping 1:1)
        # Or better: Save per country, and ETL maps it. 
        # Let's save {country_slug}_health.json and ETL loads it.
        
        cdc_slug = get_cdc_slug(country)
        filename = f"{cdc_slug}_health.json"
        filepath = os.path.join(health_dir, filename)
        
        if os.path.exists(filepath):
            print(f"⏭️  Skipping {country} - Already done.")
        else:
            data = fetch_health_info(country)
            if data:
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
                print(f"   💾 Saved {filename} ({len(data['vaccines'])} vaccines)")
            
            time.sleep(1) # Be nice to CDC
            
    print("🎉 Health Data Download Complete!")

if __name__ == "__main__":
    main()
