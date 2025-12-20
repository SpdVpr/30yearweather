import requests
import json

API_KEY = "5de5692f22msh01fc088bbb2705bp1fa920jsn526e9d191954"
HOST = "aerodatabox.p.rapidapi.com"

def test_connection():
    # Test endpoint: Lyon (LFLL) for a specific date/time
    # 2024-01-15 12:00 to 23:59
    url = "https://aerodatabox.p.rapidapi.com/flights/airports/icao/LFLL/2024-01-15T12:00/2024-01-15T23:59"
    
    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": HOST
    }
    
    params = {
        "withLeg": "false",
        "direction": "Arrival",
        "withCancelled": "false",
        "withCodeshared": "true"
    }
    
    print(f"Connecting to {url}...")
    try:
        response = requests.get(url, headers=headers, params=params)
        print(f"Status Code: {response.status_code}")
        
        # Check Rate Limit Headers
        print("Headers:")
        for k, v in response.headers.items():
            if "ratelimit" in k.lower() or "rapidapi" in k.lower():
                print(f"  {k}: {v}")
                
        if response.status_code == 200:
            data = response.json()
            arrivals = data.get('arrivals', [])
            print(f"Success! Found {len(arrivals)} arrivals.")
            print(json.dumps(data, indent=2)[:500] + "...")
        else:
            print("Error Response:")
            print(response.text)
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_connection()
