import requests
import json
import datetime
import os

import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv('RAPIDAPI_KEY')
HOST = "aerodatabox.p.rapidapi.com"

def debug_request():
    # Target: Tomorrow from "now" (assuming strict compliance with 'now')
    # If today is 2025-12-20...
    
    # We'll use a hardcoded date to be sure.
    # 2025-12-21
    date_str = "2025-12-21"
    start = f"{date_str}T12:00"
    end = f"{date_str}T23:59"
    
    icao = "LFLL" # Lyon
    
    url = f"https://aerodatabox.p.rapidapi.com/flights/airports/icao/{icao}/{start}/{end}"
    
    print(f"Requesting {url}...")
    
    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": HOST
    }
    
    params = {
        "withLeg": "true", # Changed to true to see if it affects data
        "direction": "Arrival",
        "withCancelled": "false",
        "withCodeshared": "true"
    }
    
    try:
        resp = requests.get(url, headers=headers, params=params)
        print(f"Status: {resp.status_code}")
        print("Response Headers (Rate Limit):")
        for k,v in resp.headers.items():
            if 'ratelimit' in k.lower():
                print(f"{k}: {v}")
                
        if resp.status_code == 200:
            data = resp.json()
            # Print structure summary
            print("\nKeys in response:", data.keys())
            if 'arrivals' in data:
                print(f"Arrivals count: {len(data['arrivals'])}")
                if len(data['arrivals']) > 0:
                    print("Sample arrival:", json.dumps(data['arrivals'][0], indent=2))
            else:
                print("No 'arrivals' key found!")
                print("Full response:", json.dumps(data, indent=2))
        else:
            print("Error response:", resp.text)
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    debug_request()
