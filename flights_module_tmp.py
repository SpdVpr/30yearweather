
import requests
import json
import time
import os
import datetime
from requests.auth import HTTPBasicAuth

# OpenSky Network API
# https://opensky-network.org/apidoc/

def fetch_flights_for_date(icao, date, username=None, password=None):
    start_ts = int(date.replace(hour=0, minute=0, second=0, microsecond=0).timestamp())
    end_ts = int(date.replace(hour=23, minute=59, second=59, microsecond=0).timestamp())
    
    url = f"https://opensky-network.org/api/flights/arrival"
    params = {
        "airport": icao,
        "begin": start_ts,
        "end": end_ts
    }
    
    auth = None
    if username and password:
        auth = HTTPBasicAuth(username, password)
        
    try:
        response = requests.get(url, params=params, auth=auth, timeout=30)
        
        if response.status_code == 404:
             return []
             
        if response.status_code == 403:
             print(f"   ⚠️ 403 Forbidden - OpenSky account required for historical data.")
             return None
        
        if response.status_code == 429:
             print(f"   ⚠️ 429 Too Many Requests - Slowing down...")
             time.sleep(5)
             return None

        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"   ❌ Error fetching flights for {icao} on {date.date()}: {e}")
        return None

def analyze_flights(flights):
    if not flights:
        return {
            "flight_count": 0,
            "peak_hour": None,
            "peak_count": 0,
            "morning_flights": 0,
            "afternoon_flights": 0,
            "evening_flights": 0,
            "night_flights": 0
        }
    
    arrival_times = [f['lastSeen'] for f in flights]
    
    hours = {}
    morning = 0 
    afternoon = 0
    evening = 0
    night = 0
    
    for ts in arrival_times:
        dt = datetime.datetime.fromtimestamp(ts, tz=datetime.timezone.utc)
        h = dt.hour
        hours[h] = hours.get(h, 0) + 1
        
        if 6 <= h < 12: morning += 1
        elif 12 <= h < 18: afternoon += 1
        elif 18 <= h < 24: evening += 1
        else: night += 1
        
    peak_hour = max(hours, key=hours.get) if hours else 0
    peak_count = hours[peak_hour] if hours else 0
    
    return {
        "flight_count": len(flights),
        "peak_hour": peak_hour,
        "peak_count": peak_count,
        "morning_flights": morning,
        "afternoon_flights": afternoon,
        "evening_flights": evening,
        "night_flights": night
    }

def calculate_flight_pressure(flight_count, capacity_baseline=None):
    if flight_count == 0: return 0
    
    import math
    if not capacity_baseline:
        # Log scale approximation
        score = min(100, int(math.log10(flight_count) * 33))
        return score
    
    pct = (flight_count / capacity_baseline) * 100
    return min(100, int(pct))
