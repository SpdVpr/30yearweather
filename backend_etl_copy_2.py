import requests
import pandas as pd
import numpy as np
import json
import os
import datetime
import time
from config import LOCATIONS, START_DATE, END_DATE, OPEN_METEO_ARCHIVE_URL, THRESHOLDS
from math import radians, cos, sin, asin, sqrt
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# NOAA National Hurricane Center - Active Storms GeoJSON
# Free API, no key required
NHC_ACTIVE_STORMS_URL = "https://www.nhc.noaa.gov/gis/forecast/archive/ww_wwatl_latest.json"  # Atlantic
NHC_PACIFIC_STORMS_URL = "https://www.nhc.noaa.gov/gis/forecast/archive/ww_wwpac_latest.json"  # Pacific

# Smithsonian Global Volcanism Program - KML data
# Free data, updated regularly
# Source: https://volcano.si.edu/ge/GVPWorldVolcanoes.kml
SMITHSONIAN_VOLCANO_KML = "https://volcano.si.edu/ge/GVPWorldVolcanoes.kml"

# Cache for volcano data (to avoid repeated downloads)
_volcano_cache = None
_volcano_cache_time = None

# Open-Meteo Professional API Key
# Get your API key at: https://open-meteo.com/en/pricing
# Professional tier: 5M calls/month, €99/month
OPENMETEO_API_KEY = os.getenv("OPENMETEO_API_KEY", "")  # Set in .env file

# Open-Meteo API URLs
# Free tier uses: api.open-meteo.com
# Professional tier uses: customer-api.open-meteo.com
OPENMETEO_BASE_URL = "customer-api.open-meteo.com" if OPENMETEO_API_KEY else "api.open-meteo.com"
OPENMETEO_AIR_QUALITY_URL = f"https://{OPENMETEO_BASE_URL}/v1/air-quality"
OPENMETEO_FLOOD_URL = f"https://{OPENMETEO_BASE_URL}/v1/flood"

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two points on Earth (in km) using Haversine formula.
    """
    R = 6371  # Earth radius in kilometers

    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))

    return R * c

def interpret_weather_code(code):
    """
    Interpret WMO Weather Code to human-readable description.
    Source: https://open-meteo.com/en/docs

    Args:
        code: WMO weather code (0-99)

    Returns:
        Dict with description, icon suggestion, and severity
    """
    if code is None or pd.isna(code):
        return {
            "description": "Unknown",
            "icon": "question",
            "severity": "unknown"
        }

    code = int(code)

    # WMO Weather interpretation codes
    weather_map = {
        0: {"description": "Clear sky", "icon": "sun", "severity": "clear"},
        1: {"description": "Mainly clear", "icon": "sun-cloud", "severity": "clear"},
        2: {"description": "Partly cloudy", "icon": "cloud-sun", "severity": "cloudy"},
        3: {"description": "Overcast", "icon": "cloud", "severity": "cloudy"},
        45: {"description": "Fog", "icon": "fog", "severity": "fog"},
        48: {"description": "Depositing rime fog", "icon": "fog", "severity": "fog"},
        51: {"description": "Light drizzle", "icon": "drizzle", "severity": "rain"},
        53: {"description": "Moderate drizzle", "icon": "drizzle", "severity": "rain"},
        55: {"description": "Dense drizzle", "icon": "drizzle", "severity": "rain"},
        56: {"description": "Light freezing drizzle", "icon": "sleet", "severity": "freezing"},
        57: {"description": "Dense freezing drizzle", "icon": "sleet", "severity": "freezing"},
        61: {"description": "Slight rain", "icon": "rain", "severity": "rain"},
        63: {"description": "Moderate rain", "icon": "rain", "severity": "rain"},
        65: {"description": "Heavy rain", "icon": "rain-heavy", "severity": "rain"},
        66: {"description": "Light freezing rain", "icon": "sleet", "severity": "freezing"},
        67: {"description": "Heavy freezing rain", "icon": "sleet", "severity": "freezing"},
        71: {"description": "Slight snow", "icon": "snow", "severity": "snow"},
        73: {"description": "Moderate snow", "icon": "snow", "severity": "snow"},
        75: {"description": "Heavy snow", "icon": "snow-heavy", "severity": "snow"},
        77: {"description": "Snow grains", "icon": "snow", "severity": "snow"},
        80: {"description": "Slight rain showers", "icon": "rain-showers", "severity": "rain"},
        81: {"description": "Moderate rain showers", "icon": "rain-showers", "severity": "rain"},
        82: {"description": "Violent rain showers", "icon": "rain-heavy", "severity": "rain"},
        85: {"description": "Slight snow showers", "icon": "snow-showers", "severity": "snow"},
        86: {"description": "Heavy snow showers", "icon": "snow-heavy", "severity": "snow"},
        95: {"description": "Thunderstorm", "icon": "thunderstorm", "severity": "storm"},
        96: {"description": "Thunderstorm with slight hail", "icon": "thunderstorm-hail", "severity": "storm"},
        99: {"description": "Thunderstorm with heavy hail", "icon": "thunderstorm-hail", "severity": "storm"}
    }

    return weather_map.get(code, {
        "description": f"Unknown ({code})",
        "icon": "question",
        "severity": "unknown"
    })

def check_hurricane_risk(lat, lon, is_coastal):
    """
    Check hurricane/typhoon risk using geographic analysis.

    Based on NOAA historical hurricane track data and climatology.
    Only coastal locations are at significant risk.

    Args:
        lat: Latitude
        lon: Longitude
        is_coastal: Boolean indicating if location is coastal

    Returns:
        Dict with hurricane risk info or None
    """
    # Define hurricane-prone regions (based on NOAA historical data)
    hurricane_zones = {
        "Atlantic": {
            "bounds": {"lat_min": 5, "lat_max": 45, "lon_min": -100, "lon_max": -10},
            "season": {"start_month": 6, "end_month": 11},
            "name": "Atlantic Hurricane",
            "annual_avg": 14  # Average storms per year
        },
        "Eastern Pacific": {
            "bounds": {"lat_min": 5, "lat_max": 40, "lon_min": -180, "lon_max": -80},
            "season": {"start_month": 5, "end_month": 11},
            "name": "Eastern Pacific Hurricane",
            "annual_avg": 17
        },
        "Western Pacific": {
            "bounds": {"lat_min": 5, "lat_max": 45, "lon_min": 100, "lon_max": 180},
            "season": {"start_month": 1, "end_month": 12},  # Year-round
            "name": "Typhoon",
            "annual_avg": 27
        },
        "Indian Ocean": {
            "bounds": {"lat_min": -30, "lat_max": 30, "lon_min": 40, "lon_max": 100},
            "season": {"start_month": 4, "end_month": 12},
            "name": "Cyclone",
            "annual_avg": 12
        }
    }

    # Check if location is in a hurricane zone
    for zone_name, zone_data in hurricane_zones.items():
        bounds = zone_data["bounds"]
        if (bounds["lat_min"] <= lat <= bounds["lat_max"] and
            bounds["lon_min"] <= lon <= bounds["lon_max"]):

            # Only coastal locations are at significant risk
            if not is_coastal:
                continue

            season = zone_data["season"]
            is_year_round = (season["start_month"] == 1 and season["end_month"] == 12)

            # Determine risk level based on frequency
            if zone_data["annual_avg"] >= 20:
                risk_level = "Very High"
            elif zone_data["annual_avg"] >= 15:
                risk_level = "High"
            else:
                risk_level = "Moderate"

            return {
                "zone": zone_name,
                "storm_type": zone_data["name"],
                "season_start": season["start_month"],
                "season_end": season["end_month"],
                "is_year_round": is_year_round,
                "risk_level": risk_level,
                "annual_avg_storms": zone_data["annual_avg"],
                "source": "NOAA Historical Climatology"
            }

    return None

def get_volcano_data():
    """
    Get volcano data from Smithsonian Global Volcanism Program.

    Note: Full KML parsing would require additional libraries.
    For now, using curated list of major active volcanoes based on Smithsonian GVP data.
    Data source: https://volcano.si.edu/

    Returns:
        List of volcano dicts with name, lat, lon, country, last_eruption
    """
    # Curated list of major active volcanoes (Smithsonian GVP data)
    # Updated December 2024
    return [
        {"name": "Mount Fuji", "lat": 35.3606, "lon": 138.7274, "country": "Japan", "last_eruption": 1707},
        {"name": "Mount Vesuvius", "lat": 40.8214, "lon": 14.4264, "country": "Italy", "last_eruption": 1944},
        {"name": "Mount Etna", "lat": 37.7510, "lon": 14.9934, "country": "Italy", "last_eruption": 2024},
        {"name": "Krakatoa", "lat": -6.1021, "lon": 105.4230, "country": "Indonesia", "last_eruption": 2020},
        {"name": "Mount Agung", "lat": -8.3429, "lon": 115.5068, "country": "Indonesia", "last_eruption": 2019},
        {"name": "Mount Merapi", "lat": -7.5407, "lon": 110.4458, "country": "Indonesia", "last_eruption": 2023},
        {"name": "Popocatépetl", "lat": 19.0225, "lon": -98.6278, "country": "Mexico", "last_eruption": 2024},
        {"name": "Mount Rainier", "lat": 46.8523, "lon": -121.7603, "country": "USA", "last_eruption": 1894},
        {"name": "Yellowstone", "lat": 44.4280, "lon": -110.5885, "country": "USA", "last_eruption": -70000},
        {"name": "Mauna Loa", "lat": 19.4756, "lon": -155.6054, "country": "USA", "last_eruption": 2022},
        {"name": "Kilauea", "lat": 19.4069, "lon": -155.2834, "country": "USA", "last_eruption": 2024},
        {"name": "Mount St. Helens", "lat": 46.1914, "lon": -122.1956, "country": "USA", "last_eruption": 2008},
        {"name": "Sakurajima", "lat": 31.5858, "lon": 130.6572, "country": "Japan", "last_eruption": 2024},
        {"name": "Eyjafjallajökull", "lat": 63.6314, "lon": -19.6083, "country": "Iceland", "last_eruption": 2010},
        {"name": "Cotopaxi", "lat": -0.6770, "lon": -78.4367, "country": "Ecuador", "last_eruption": 2015},
        {"name": "Mount Pinatubo", "lat": 15.1300, "lon": 120.3500, "country": "Philippines", "last_eruption": 1993},
        {"name": "Taal Volcano", "lat": 14.0021, "lon": 120.9937, "country": "Philippines", "last_eruption": 2022},
        {"name": "Mayon Volcano", "lat": 13.2572, "lon": 123.6856, "country": "Philippines", "last_eruption": 2023},
        {"name": "Mount Nyiragongo", "lat": -1.5200, "lon": 29.2500, "country": "DR Congo", "last_eruption": 2021},
    ]

def check_volcano_proximity(lat, lon, max_distance_km=100):
    """
    Check if location is near active volcanoes using Smithsonian GVP data.

    Args:
        lat: Latitude
        lon: Longitude
        max_distance_km: Maximum distance to search (default 100km)

    Returns:
        Dict with volcano proximity info or None
    """
    volcanoes = get_volcano_data()
    nearby_volcanoes = []

    for volcano in volcanoes:
        distance = haversine_distance(lat, lon, volcano["lat"], volcano["lon"])

        if distance <= max_distance_km:
            # Determine activity level based on last eruption
            current_year = 2024
            years_since = current_year - volcano["last_eruption"]

            if years_since < 0:
                activity = "Supervolcano (dormant)"
            elif years_since < 10:
                activity = "Very Active"
            elif years_since < 50:
                activity = "Active"
            elif years_since < 200:
                activity = "Moderately Active"
            else:
                activity = "Dormant"

            nearby_volcanoes.append({
                "name": volcano["name"],
                "country": volcano["country"],
                "distance_km": round(distance, 1),
                "last_eruption": volcano["last_eruption"],
                "activity_level": activity
            })

    # Sort by distance
    nearby_volcanoes.sort(key=lambda x: x["distance_km"])

    if nearby_volcanoes:
        # Determine overall risk
        closest = nearby_volcanoes[0]
        if closest["distance_km"] < 30:
            risk_level = "Very High"
        elif closest["distance_km"] < 50:
            risk_level = "High"
        else:
            risk_level = "Medium"

        return {
            "risk_level": risk_level,
            "nearby_volcanoes": nearby_volcanoes[:3],  # Top 3 closest
            "count": len(nearby_volcanoes),
            "source": "Smithsonian Global Volcanism Program"
        }

    return None

def calculate_flood_risk(elevation, is_coastal, precip_extremes):
    """
    Calculate flood risk based on elevation, coastal location, and precipitation extremes.

    Args:
        elevation: Elevation in meters (None if unknown)
        is_coastal: Boolean indicating if location is coastal
        precip_extremes: Dict with max precipitation data

    Returns:
        Dict with flood risk assessment
    """
    risk_factors = []
    risk_score = 0  # 0-100, higher = more risk

    # Factor 1: Elevation
    if elevation is not None:
        if elevation < 5:
            risk_score += 40
            risk_factors.append("Very low elevation (<5m)")
        elif elevation < 20:
            risk_score += 25
            risk_factors.append("Low elevation (<20m)")
        elif elevation < 50:
            risk_score += 10
            risk_factors.append("Moderate elevation")

    # Factor 2: Coastal location
    if is_coastal:
        risk_score += 20
        risk_factors.append("Coastal location (storm surge risk)")

    # Factor 3: Extreme precipitation
    if precip_extremes and precip_extremes.get('max_daily_precip'):
        max_precip = precip_extremes['max_daily_precip']
        if max_precip > 100:
            risk_score += 30
            risk_factors.append(f"Extreme rainfall events ({max_precip:.0f}mm/day)")
        elif max_precip > 50:
            risk_score += 15
            risk_factors.append(f"Heavy rainfall events ({max_precip:.0f}mm/day)")

    # Determine risk level
    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 30:
        risk_level = "Medium"
    elif risk_score > 0:
        risk_level = "Low"
    else:
        risk_level = "Minimal"

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "risk_factors": risk_factors,
        "elevation": elevation
    }

def calculate_monthly_flood_risk(elevation, is_coastal, monthly_precip_avg, monthly_precip_max):
    """
    Calculate monthly flood risk based on elevation, coastal location, and monthly precipitation.

    Args:
        elevation: Elevation in meters (None if unknown)
        is_coastal: Boolean indicating if location is coastal
        monthly_precip_avg: Average precipitation for the month (mm)
        monthly_precip_max: Maximum daily precipitation in the month (mm)

    Returns:
        Dict with flood risk assessment
    """
    risk_score = 0  # 0-100, higher = more risk

    # Factor 1: Elevation (constant)
    if elevation is not None:
        if elevation < 5:
            risk_score += 30
        elif elevation < 20:
            risk_score += 20
        elif elevation < 50:
            risk_score += 10

    # Factor 2: Coastal location (constant)
    if is_coastal:
        risk_score += 15

    # Factor 3: Monthly precipitation (VARIABLE!)
    if monthly_precip_avg > 200:  # Very wet month
        risk_score += 40
    elif monthly_precip_avg > 150:
        risk_score += 30
    elif monthly_precip_avg > 100:
        risk_score += 20
    elif monthly_precip_avg > 50:
        risk_score += 10

    # Factor 4: Extreme daily precipitation
    if monthly_precip_max > 100:
        risk_score += 15
    elif monthly_precip_max > 50:
        risk_score += 10

    # Determine risk level
    if risk_score >= 60:
        risk_level = "High"
    elif risk_score >= 35:
        risk_level = "Medium"
    elif risk_score >= 15:
        risk_level = "Low"
    else:
        risk_level = "Minimal"

    return {
        "risk_level": risk_level,
        "risk_score": risk_score,
        "monthly_precip_avg": round(monthly_precip_avg, 1),
        "monthly_precip_max": round(monthly_precip_max, 1)
    }

def get_air_quality(lat, lon):
    """
    Get real-time air quality data from Open-Meteo Air Quality API.

    API: https://customer-air-quality-api.open-meteo.com/v1/air-quality
    Professional tier: 5M calls/month

    Args:
        lat: Latitude
        lon: Longitude

    Returns:
        Dict with air quality info or None
    """
    try:
        # Build URL based on API key availability
        if OPENMETEO_API_KEY:
            url = "https://customer-air-quality-api.open-meteo.com/v1/air-quality"
        else:
            url = "https://air-quality-api.open-meteo.com/v1/air-quality"

        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ["pm10", "pm2_5", "us_aqi", "us_aqi_pm2_5", "us_aqi_pm10"],
            "timezone": "auto"
        }

        # Add API key if available
        if OPENMETEO_API_KEY:
            params["apikey"] = OPENMETEO_API_KEY

        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 429:
            print("   ⚠️  Open-Meteo rate limit exceeded. Skipping air quality.")
            return None

        response.raise_for_status()
        data = response.json()

        if not data.get("current"):
            return None

        # Get current air quality data
        current = data["current"]
        pm25 = current.get("pm2_5", 0)
        pm10 = current.get("pm10", 0)
        us_aqi = current.get("us_aqi", 0)

        # Determine category based on US EPA AQI scale
        if us_aqi <= 50:
            category = "Good"
            health_note = "Air quality is excellent. Perfect for outdoor activities."
        elif us_aqi <= 100:
            category = "Moderate"
            health_note = "Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exertion."
        elif us_aqi <= 150:
            category = "Unhealthy for Sensitive"
            health_note = "Unhealthy for sensitive groups. Consider wearing a mask outdoors."
        elif us_aqi <= 200:
            category = "Unhealthy"
            health_note = "Unhealthy. Everyone should reduce outdoor activities."
        elif us_aqi <= 300:
            category = "Very Unhealthy"
            health_note = "Very unhealthy. Avoid outdoor activities. Wear N95 mask if you must go out."
        else:
            category = "Hazardous"
            health_note = "Hazardous. Stay indoors. Seal windows and doors."

        return {
            "aqi": int(us_aqi),
            "pm25": round(pm25, 1),
            "pm10": round(pm10, 1),
            "category": category,
            "health_note": health_note,
            "source": "Open-Meteo CAMS"
        }

    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Air quality API error: {e}")
        return None

def get_flood_risk(lat, lon):
    """
    Get flood risk data from Open-Meteo Flood API.

    API: https://customer-flood-api.open-meteo.com/v1/flood
    Professional tier: 5M calls/month

    Args:
        lat: Latitude
        lon: Longitude

    Returns:
        Dict with flood risk info or None
    """
    try:
        # Build URL based on API key availability
        if OPENMETEO_API_KEY:
            url = "https://customer-flood-api.open-meteo.com/v1/flood"
        else:
            url = "https://flood-api.open-meteo.com/v1/flood"

        # Get last 7 days of river discharge data
        end_date = datetime.datetime.now()
        start_date = end_date - datetime.timedelta(days=7)

        params = {
            "latitude": lat,
            "longitude": lon,
            "daily": ["river_discharge"],
            "start_date": start_date.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d")
        }

        # Add API key if available
        if OPENMETEO_API_KEY:
            params["apikey"] = OPENMETEO_API_KEY

        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 429:
            print("   ⚠️  Open-Meteo Flood API rate limit exceeded. Skipping flood risk.")
            return None

        response.raise_for_status()
        data = response.json()

        if not data.get("daily") or not data["daily"].get("river_discharge"):
            return None

        # Analyze river discharge data
        discharge_values = [d for d in data["daily"]["river_discharge"] if d is not None]

        if not discharge_values:
            return None

        avg_discharge = sum(discharge_values) / len(discharge_values)
        max_discharge = max(discharge_values)

        # Determine flood risk based on discharge levels
        # Higher discharge = higher flood risk
        if max_discharge > 1000:
            risk_level = "High"
            risk_note = "Very high river discharge detected. Flood risk is elevated."
        elif max_discharge > 500:
            risk_level = "Medium"
            risk_note = "Elevated river discharge. Monitor flood warnings."
        elif max_discharge > 100:
            risk_level = "Low"
            risk_note = "Normal river discharge levels."
        else:
            risk_level = "Minimal"
            risk_note = "Low river discharge. Minimal flood risk."

        return {
            "risk_level": risk_level,
            "avg_discharge": round(avg_discharge, 1),
            "max_discharge": round(max_discharge, 1),
            "risk_note": risk_note,
            "source": "Open-Meteo GloFAS"
        }

    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Flood API error: {e}")
        return None

def get_monthly_air_quality_historical(lat, lon, slug):
    """
    Get historical air quality data for each month (averaged over last 10 years).

    API: https://customer-air-quality-api.open-meteo.com/v1/air-quality
    Historical data available from 2013 onwards.

    Args:
        lat: Latitude
        lon: Longitude
        slug: Location slug for caching

    Returns:
        Dict with monthly AQI data {1: {...}, 2: {...}, ..., 12: {...}}
    """
    # Cache directory
    cache_dir = os.path.join(os.path.dirname(__file__), "data", "air_quality")
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{slug}_monthly_aqi.json")

    # Check cache (valid for 30 days)
    if os.path.exists(cache_path):
        cache_age = datetime.datetime.now() - datetime.datetime.fromtimestamp(os.path.getmtime(cache_path))
        if cache_age.days < 30:
            print(f"   📦 Found cached monthly AQI data (age: {cache_age.days} days)")
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"   ⚠️  Cache load failed: {e}")

    print(f"   🌐 Fetching historical air quality data (2014-2023, 10 years)...")

    try:
        # Build URL based on API key availability
        if OPENMETEO_API_KEY:
            url = "https://customer-air-quality-api.open-meteo.com/v1/air-quality"
        else:
            url = "https://air-quality-api.open-meteo.com/v1/air-quality"

        # Get 10 years of historical data (2014-2023)
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": "2014-01-01",
            "end_date": "2023-12-31",
            "hourly": ["pm10", "pm2_5", "us_aqi"],
            "timezone": "auto"
        }

        # Add API key if available
        if OPENMETEO_API_KEY:
            params["apikey"] = OPENMETEO_API_KEY

        response = requests.get(url, params=params, timeout=60)

        if response.status_code == 429:
            print("   ⚠️  Open-Meteo Air Quality API rate limit exceeded.")
            return None

        response.raise_for_status()
        data = response.json()

        if not data.get("hourly"):
            return None

        # Convert to DataFrame for easier aggregation
        df = pd.DataFrame({
            'time': pd.to_datetime(data['hourly']['time']),
            'pm25': data['hourly']['pm2_5'],
            'pm10': data['hourly']['pm10'],
            'us_aqi': data['hourly']['us_aqi']
        })

        # Extract month
        df['month'] = df['time'].dt.month

        # Calculate monthly averages
        monthly_data = {}
        for month in range(1, 13):
            month_df = df[df['month'] == month]

            if len(month_df) == 0:
                continue

            avg_aqi = month_df['us_aqi'].mean()
            avg_pm25 = month_df['pm25'].mean()
            avg_pm10 = month_df['pm10'].mean()

            # Determine category based on US EPA AQI scale
            if avg_aqi <= 50:
                category = "Good"
                health_note = "Air quality is excellent."
            elif avg_aqi <= 100:
                category = "Moderate"
                health_note = "Air quality is acceptable."
            elif avg_aqi <= 150:
                category = "Unhealthy for Sensitive"
                health_note = "Sensitive groups should limit outdoor exertion."
            elif avg_aqi <= 200:
                category = "Unhealthy"
                health_note = "Everyone should reduce outdoor activities."
            elif avg_aqi <= 300:
                category = "Very Unhealthy"
                health_note = "Avoid outdoor activities."
            else:
                category = "Hazardous"
                health_note = "Stay indoors."

            monthly_data[month] = {
                "aqi": int(round(avg_aqi)),
                "pm25": round(avg_pm25, 1),
                "pm10": round(avg_pm10, 1),
                "category": category,
                "health_note": health_note,
                "source": "Open-Meteo CAMS (10-year avg)"
            }

        # Save to cache
        try:
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(monthly_data, f, indent=2)
            print(f"   💾 Saved monthly AQI to cache")
        except Exception as e:
            print(f"   ⚠️  Could not save to cache: {e}")

        return monthly_data

    except requests.exceptions.RequestException as e:
        print(f"   ⚠️  Air quality API error: {e}")
        return None

def get_monthly_hurricane_risk(hurricane_data, month):
    """
    Calculate monthly hurricane/typhoon risk based on season.

    Args:
        hurricane_data: Base hurricane data from check_hurricane_risk()
        month: Month number (1-12)

    Returns:
        Dict with monthly hurricane risk
    """
    if not hurricane_data:
        return None

    zone = hurricane_data.get('zone', '')
    storm_type = hurricane_data.get('storm_type', 'Hurricane')

    # Define peak seasons for different zones
    # Source: NOAA Historical Climatology
    peak_seasons = {
        'North Atlantic': (6, 11),  # June-November
        'Eastern Pacific': (5, 11),  # May-November
        'Western Pacific': (5, 12),  # May-December (typhoons)
        'North Indian': (4, 12),     # April-December
        'South Indian': (11, 4),     # November-April (Southern Hemisphere)
        'Australian': (11, 4)        # November-April (Southern Hemisphere)
    }

    season_start, season_end = peak_seasons.get(zone, (1, 12))

    # Check if month is in peak season
    # Handle Southern Hemisphere seasons (wraps around year)
    if season_start > season_end:  # Southern Hemisphere
        is_peak_season = month >= season_start or month <= season_end
    else:  # Northern Hemisphere
        is_peak_season = season_start <= month <= season_end

    # Calculate risk level based on season
    if is_peak_season:
        # Peak season - use base risk level
        risk_level = hurricane_data.get('risk_level', 'Medium')
        risk_multiplier = 1.0
    else:
        # Off-season - reduce risk
        base_risk = hurricane_data.get('risk_level', 'Medium')
        if base_risk == 'Very High':
            risk_level = 'Medium'
            risk_multiplier = 0.3
        elif base_risk == 'High':
            risk_level = 'Low'
            risk_multiplier = 0.2
        else:
            risk_level = 'Low'
            risk_multiplier = 0.1

    # Calculate estimated storms for this month
    annual_storms = hurricane_data.get('annual_avg_storms', 0)
    if is_peak_season:
        # Distribute storms across peak season months
        if season_start > season_end:  # Southern Hemisphere
            peak_months = (12 - season_start + 1) + season_end
        else:
            peak_months = season_end - season_start + 1
        monthly_storms = (annual_storms * 0.9) / peak_months  # 90% of storms in peak season
    else:
        # Off-season gets remaining 10%
        off_season_months = 12 - ((season_end - season_start + 1) if season_start <= season_end else (12 - season_start + 1) + season_end)
        monthly_storms = (annual_storms * 0.1) / max(off_season_months, 1)

    return {
        "zone": zone,
        "storm_type": storm_type,
        "risk_level": risk_level,
        "is_peak_season": is_peak_season,
        "monthly_avg_storms": round(monthly_storms, 1),
        "season_months": f"{season_start}-{season_end}",
        "source": "NOAA Historical Climatology"
    }

def fetch_earthquake_data(lat, lon, start_date, end_date, radius_km=100, min_magnitude=4.0):
    """
    Fetches historical earthquake data from USGS Earthquake Catalog API.

    Args:
        lat: Latitude
        lon: Longitude
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
        radius_km: Search radius in kilometers (default: 100km)
        min_magnitude: Minimum earthquake magnitude (default: 4.0)

    Returns:
        dict with earthquake statistics including:
        - count_30y: Total earthquakes in period
        - avg_per_year: Average earthquakes per year
        - max_magnitude: Maximum recorded magnitude
        - seismic_score: Stability score (0-100)
        - risk_level: Risk classification
        - last_event: Date of most recent earthquake (YYYY-MM-DD)
        - monthly_distribution: Dict {1-12: count} of earthquakes per month
    """
    # Convert dates to strings if they are date objects
    if isinstance(start_date, datetime.date):
        start_date_str = start_date.strftime("%Y-%m-%d")
    else:
        start_date_str = start_date

    if isinstance(end_date, datetime.date):
        end_date_str = end_date.strftime("%Y-%m-%d")
    else:
        end_date_str = end_date

    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    params = {
        "format": "geojson",
        "latitude": lat,
        "longitude": lon,
        "maxradiuskm": radius_km,
        "minmagnitude": min_magnitude,
        "starttime": start_date_str,
        "endtime": end_date_str
    }

    try:
        print(f"   Fetching earthquake data (radius: {radius_km}km, min mag: {min_magnitude})...")
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()

        count = data["metadata"]["count"]
        print(f"   🌍 Earthquakes found: {count}")

        # Calculate statistics
        if count == 0:
            return {
                "count_30y": 0,
                "avg_per_year": 0,
                "max_magnitude": None,
                "seismic_score": 100,
                "risk_level": "Stable",
                "last_event": None,
                "monthly_distribution": {i: 0 for i in range(1, 13)}
            }

        # Extract magnitudes and timestamps
        features = data["features"]
        magnitudes = [f["properties"]["mag"] for f in features]
        max_mag = max(magnitudes)

        # Sort by time descending to get last event
        features_sorted = sorted(features, key=lambda x: x["properties"]["time"], reverse=True)
        last_event_ts = features_sorted[0]["properties"]["time"]
        last_event_date = datetime.datetime.fromtimestamp(last_event_ts / 1000).strftime('%Y-%m-%d')

        # Calculate monthly distribution
        monthly_distribution = {i: 0 for i in range(1, 13)}
        for f in features:
            ts = f["properties"]["time"]
            event_date = datetime.datetime.fromtimestamp(ts / 1000)
            monthly_distribution[event_date.month] += 1

        # Calculate years span
        years_span = (datetime.datetime.strptime(end_date_str, "%Y-%m-%d") -
                     datetime.datetime.strptime(start_date_str, "%Y-%m-%d")).days / 365.25
        avg_per_year = count / years_span

        # Calculate Seismic Stability Score (0-100, higher = more stable)
        if avg_per_year == 0:
            seismic_score = 100
            risk_level = "Stable"
        elif avg_per_year < 1:
            seismic_score = 80
            risk_level = "Low"
        elif avg_per_year < 5:
            seismic_score = 50
            risk_level = "Medium"
        elif avg_per_year < 20:
            seismic_score = 20
            risk_level = "High"
        else:
            seismic_score = 5
            risk_level = "Very High"

        print(f"   📊 Seismic Score: {seismic_score}/100 ({risk_level} risk)")
        print(f"   📅 Last earthquake: {last_event_date}")

        return {
            "count_30y": count,
            "avg_per_year": round(avg_per_year, 1),
            "max_magnitude": round(max_mag, 1),
            "seismic_score": seismic_score,
            "risk_level": risk_level,
            "last_event": last_event_date,
            "monthly_distribution": monthly_distribution
        }

    except Exception as e:
        print(f"   ⚠️  Earthquake data fetch failed: {e}")
        return {
            "count_30y": None,
            "avg_per_year": None,
            "max_magnitude": None,
            "seismic_score": None,
            "risk_level": "Unknown",
            "last_event": None,
            "monthly_distribution": None
        }

def fetch_weather_data(lat, lon, start_date, end_date, slug):
    """
    Fetches raw historical weather data from Open-Meteo Archive API.
    Now includes extended weather variables for comprehensive analysis:
    - Health: pressure, humidity, UV index
    - Outdoor: sunshine duration, visibility, snowfall
    - Weather conditions: weather code
    Checks local cache first to avoid API limits.
    """
    # Cache directory
    cache_dir = os.path.join(os.path.dirname(__file__), "data", "raw_weather")
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{slug}_raw.json")

    # Check cache
    if os.path.exists(cache_path):
        print(f"   📦 Found cached weather data for {slug}, loading...")
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Check if it has elevation (it should)
            elevation = data.get('elevation', None)
            if elevation:
                print(f"   📍 Elevation: {elevation}m above sea level")

            return data
        except Exception as e:
            print(f"   ⚠️  Cache load failed, fetching from API. Error: {e}")

    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": [
            # Temperature
            "temperature_2m_max",
            "temperature_2m_min",
            # Precipitation & Snow
            "precipitation_sum",
            "precipitation_hours",
            "snowfall_sum",
            # Wind
            "wind_speed_10m_max",
            # Clouds & Sun
            "cloud_cover_mean",
            "sunshine_duration",
            # Pressure & Humidity
            "pressure_msl_mean",
            "relative_humidity_2m_mean",
            # Weather condition
            "weather_code"
            # NOTE: UV index is NOT available in Archive API (only in Forecast API)
            # NOTE: Visibility is NOT available in daily data (only hourly)
        ],
        "timezone": "auto"
    }

    # Use customer API if API key is available
    if OPENMETEO_API_KEY:
        url = "https://customer-archive-api.open-meteo.com/v1/archive"
        params["apikey"] = OPENMETEO_API_KEY
        print(f"   🌐 Fetching weather data from Open-Meteo Archive API (Professional)...")
    else:
        url = OPEN_METEO_ARCHIVE_URL
        print(f"   🌐 Fetching weather data from Open-Meteo Archive API (Free)...")

    response = requests.get(url, params=params, timeout=60)
    response.raise_for_status()
    data = response.json()

    # Save to cache
    try:
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"   💾 Saved raw data to cache: {cache_path}")
    except Exception as e:
        print(f"   ⚠️  Could not save to cache: {e}")

    # Extract elevation from response (Open-Meteo returns it automatically)
    elevation = data.get('elevation', None)
    if elevation:
        print(f"   📍 Elevation: {elevation}m above sea level")

    return data

def fetch_holidays(country_code, year):
    """
    Fetch public holidays for a country and year
    """
    try:
        url = f"https://date.nager.at/api/v3/PublicHolidays/{year}/{country_code}"
        response = requests.get(url, timeout=10, verify=False)
        response.raise_for_status()
        holidays = response.json()
        # Convert to dict with date as key
        return {h['date']: h['name'] for h in holidays}
    except Exception as e:
        print(f"   ⚠️  Could not fetch holidays for {country_code}: {e}")
        return {}


def fetch_marine_data(lat, lon, start_date, end_date, slug):
    """
    Fetches raw historical marine data (Waves & SST) from Open-Meteo Marine/Forecast API.
    """
    cache_dir = os.path.join(os.path.dirname(__file__), "data", "raw_marine")
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{slug}_marine.json")

    if os.path.exists(cache_path):
        print(f"   📦 Found cached marine data for {slug}, loading...")
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                wh = data.get('daily', {}).get('wave_height_max', [])
                if any(x is not None for x in wh):
                    return data
                print(f"   ⚠️ Cached marine data for {slug} is empty/invalid. Refetching...")
        except: pass

    # Use Marine Forecast API with historical dates
    # This seems to be the way to get waves + SST
    # Coordinate Overrides
    marine_lat, marine_lon = lat, lon
    MARINE_OVERRIDES = {
        'shanghai': {'lat': 31.05, 'lon': 122.25},
        'tokyo': {'lat': 35.40, 'lon': 139.90},
        'taipei': {'lat': 25.15, 'lon': 121.25},
        'jakarta': {'lat': -5.95, 'lon': 106.85},
        'oslo': {'lat': 59.45, 'lon': 10.60},
        'dublin': {'lat': 53.33, 'lon': -5.95},
        'amsterdam': {'lat': 52.46, 'lon': 4.54}
    }
    if slug in MARINE_OVERRIDES:
        print(f"   ⚓ Using MARINE OVERRIDE for {slug}: {MARINE_OVERRIDES[slug]}")
        marine_lat = MARINE_OVERRIDES[slug]['lat']
        marine_lon = MARINE_OVERRIDES[slug]['lon']

    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": marine_lat,
        "longitude": marine_lon,
        "start_date": start_date,
        "end_date": end_date,
        "daily": ["wave_height_max", "wave_direction_dominant", "wave_period_max"],
        "hourly": ["sea_surface_temperature"] # Hourly SST
    }
    
    # Retry logic
    for attempt in range(3):
        try:
            response = requests.get(url, params=params, timeout=20, verify=False)
            response.raise_for_status()
            data = response.json()
            
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(data, f)
            
            return data
        except Exception as e:
            print(f"   ⚠️  Marine fetch failed (attempt {attempt+1}): {e}")
            time.sleep(2)
            
    return None

def process_location(slug, config):
    """
    Main processing logic for a single location.
    """
    print(f"\n{'='*60}")
    print(f"📍 Processing {config['name']} ({slug})")
    print(f"{'='*60}")

    # 1. Fetch Data (with caching + fallback)
    raw_data = None
    try:
        raw_data = fetch_weather_data(config['lat'], config['lon'], START_DATE, END_DATE, slug)
    except Exception as e:
        print(f"   ⚠️  Raw weather data unavailable (API limit or error): {e}")

    # 2. Check for existing data if raw fail
    existing_data = None
    if not raw_data:
        existing_data = load_existing_json(slug)
        if existing_data:
            print(f"   ♻️  Using existing processed data for {slug}. Weather stats will NOT be updated.")
        else:
            # If we have neither raw nor existing, we can't proceed
            raise Exception("Cannot proceed: No raw data and no existing data found.")

    # 1b. Fetch Natural Disaster Risk Data (NEW!)
    print("   🌪️  Analyzing natural disaster risks...")

    # Earthquake data (API call)
    earthquake_data = fetch_earthquake_data(
        config['lat'],
        config['lon'],
        START_DATE,
        END_DATE,
        radius_km=100,
        min_magnitude=4.0
    )

    # Hurricane/Typhoon risk (geographic analysis)
    hurricane_data = check_hurricane_risk(config['lat'], config['lon'], config.get('is_coastal', False))
    if hurricane_data:
        print(f"   🌀 Hurricane Risk: {hurricane_data['storm_type']} - {hurricane_data['risk_level']} ({hurricane_data['annual_avg_storms']} storms/year avg)")

    # Volcano proximity (static check)
    volcano_data = check_volcano_proximity(config['lat'], config['lon'], max_distance_km=100)
    if volcano_data:
        print(f"   🌋 Volcanoes nearby: {volcano_data['count']} ({volcano_data['risk_level']} risk)")
        for v in volcano_data['nearby_volcanoes']:
            print(f"      - {v['name']}: {v['distance_km']}km ({v['activity_level']})")

    # Air quality (Open-Meteo API)
    air_quality_data = get_air_quality(config['lat'], config['lon'])
    if air_quality_data:
        print(f"   💨 Air Quality: AQI {air_quality_data['aqi']} ({air_quality_data['category']}) - PM2.5: {air_quality_data['pm25']}µg/m³")

    # Calculate Flood Risk / Altitude (Need elevation)
    # If using existing data, try to get elevation from it
    elevation = None

    # 1c. Fetch Marine Data (Coastal Cities)
    marine_raw = None
    if config.get('is_coastal', False):
        print(f"   🌊 Coastal city detected. Fetching Marine data...")
        try:
            marine_raw = fetch_marine_data(config['lat'], config['lon'], START_DATE, END_DATE, slug)
        except Exception as e:
            print(f"   ⚠️  Marine data fetch failed: {e}")
    if raw_data:
        elevation = raw_data.get('elevation', None)
    elif existing_data:
        elevation = existing_data.get('meta', {}).get('geo_info', {}).get('elevation', None)
        if elevation is None: # fallback to top-level if old format
             elevation = existing_data.get('meta', {}).get('elevation', None)
    
    # Get precipitation extremes for flood risk calculation
    precip_extremes = {}
    if raw_data:
        daily = raw_data.get("daily", {})
        df = pd.DataFrame(daily)
        max_daily_precip = df['precipitation_sum'].max()
        precip_extremes = {
            "max_daily_precip": float(max_daily_precip) if pd.notna(max_daily_precip) else 0
        }
    else:
        # We can't easily get extremes from aggregated data perfectly, 
        # but we might be able to estimate or just skip flood risk update if data missing
        pass 

    # Determine if high altitude
    is_high_altitude = elevation and elevation > 1500

    # Get flood risk from Open-Meteo Flood API
    print("   🌊 Fetching flood risk data...")
    flood_api_data = get_flood_risk(config['lat'], config['lon'])

    # Also calculate flood risk based on elevation and precipitation (backup/additional context)
    flood_data = calculate_flood_risk(
        elevation=elevation,
        is_coastal=config.get('is_coastal', False),
        precip_extremes=precip_extremes
    )

    # Combine both flood risk assessments
    if flood_api_data:
        print(f"   🌊 Flood Risk (API): {flood_api_data['risk_level']} - {flood_api_data['risk_note']}")
        # Use API data as primary, but keep calculated data as backup
        flood_data['api_data'] = flood_api_data

    if flood_data['risk_level'] != "Minimal":
        print(f"   🌊 Flood Risk (Calculated): {flood_data['risk_level']} (score: {flood_data['risk_score']})")

    # Calculate altitude effects
    altitude_effects = {}
    if elevation:
        uv_multiplier = 1 + (elevation / 300 * 0.04)
        altitude_effects = {
            "uv_multiplier": round(uv_multiplier, 2),
            "alcohol_warning": is_high_altitude,
            "sunburn_risk": "High" if elevation > 1500 else "Medium" if elevation > 800 else "Normal"
        }

    # === BRANCH: FULL RE-CALCULATION ===
    if raw_data:
        # Convert to DataFrame
        daily = raw_data.get("daily", {})
        df = pd.DataFrame(daily)
        df['date'] = pd.to_datetime(df['time'])
        df['doy'] = df['date'].dt.strftime('%m-%d')  # Day of Year (MM-DD)
        df['month'] = df['date'].dt.month  # Month number (1-12)
        df['year'] = df['date'].dt.year  # Year for smart weighting

        # Merge Marine Data if available
        if marine_raw:
            try:
                # Daily Waves
                m_daily = pd.DataFrame(marine_raw.get('daily', {}))
                m_daily['date'] = pd.to_datetime(m_daily['time'])
                # Rename to avoid collisions
                m_daily = m_daily.rename(columns={'wave_height_max': 'wave_height_max', 'wave_direction_dominant': 'wave_dir', 'wave_period_max': 'wave_period'})
                df = pd.merge(df, m_daily[['date', 'wave_height_max', 'wave_period']], on='date', how='left')
                
                # Process Hourly SST to Daily Avg
                m_hourly = pd.DataFrame(marine_raw.get('hourly', {}))
                m_hourly['time'] = pd.to_datetime(m_hourly['time'])
                m_hourly['date'] = m_hourly['time'].dt.date
                if 'sea_surface_temperature' in m_hourly.columns:
                    sst_daily = m_hourly.groupby('date')['sea_surface_temperature'].mean().reset_index()
                    sst_daily['date'] = pd.to_datetime(sst_daily['date'])
                    sst_daily = sst_daily.rename(columns={'sea_surface_temperature': 'water_temp'})
                    df = pd.merge(df, sst_daily[['date', 'water_temp']], on='date', how='left')
            except Exception as e:
                print(f"   ⚠️  Error merging marine data: {e}")

        # Fetch monthly safety data (NEW!)
        print("   🌐 Fetching monthly safety data...")

        # 1. Monthly Air Quality (historical 10-year average)
        monthly_air_quality = get_monthly_air_quality_historical(config['lat'], config['lon'], slug)
        if monthly_air_quality:
            print(f"   ✅ Monthly air quality data loaded ({len(monthly_air_quality)} months)")

        # 2. Calculate monthly precipitation stats for flood risk
        monthly_precip_stats = {}
        for month in range(1, 13):
            month_df = df[df['month'] == month]
            if len(month_df) > 0:
                monthly_precip_stats[month] = {
                    'avg': month_df['precipitation_sum'].mean(),
                    'max': month_df['precipitation_sum'].max()
                }

        # Fetch holidays for recent years (for crowd analysis)
        current_year = datetime.date.today().year
        country_code = slug.split('-')[-1].upper()  # Extract country code from slug
        all_holidays = {}
        
        # Check if raw holidays file exists
        base_dir = os.path.dirname(os.path.abspath(__file__))
        holidays_file = os.path.join(base_dir, 'data', 'raw_holidays', f"{slug}_holidays.json")
        
        if os.path.exists(holidays_file):
             try:
                 with open(holidays_file, 'r', encoding='utf-8') as f:
                     all_holidays = json.load(f)
                 print(f"   📂 Loaded {len(all_holidays)} holidays from raw file: {holidays_file}")
             except Exception as e:
                 print(f"   ⚠️  Failed to load raw holidays from file: {e}")
        
        # If no holidays loaded from file (or file missing), fetch from API
        if not all_holidays:
            for year in range(current_year - 5, current_year + 1):
                year_holidays = fetch_holidays(country_code, year)
                all_holidays.update(year_holidays)
            print(f"   Fetched {len(all_holidays)} holidays from API")

        # Save raw holidays data
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            holidays_dir = os.path.join(base_dir, 'data', 'raw_holidays')
            os.makedirs(holidays_dir, exist_ok=True)
            
            holidays_file = os.path.join(holidays_dir, f"{slug}_holidays.json")
            with open(holidays_file, 'w', encoding='utf-8') as f:
                json.dump(all_holidays, f, indent=4, ensure_ascii=False)
            print(f"   💾 Saved raw holidays to {holidays_file}")
        except Exception as e:
            print(f"   ⚠️  Failed to save raw holidays: {e}")

        # 2. Aggregations with ROLLING WINDOW (Smoothing)
        df['doy_int'] = df['date'].dt.dayofyear
        # Pre-calculate boolean rain column for Smart Prob calculation
        df['rain_p'] = (df['precipitation_sum'] > 0.1).astype(float) * 100
        
        days_data = {}
        unique_days = sorted(df['doy'].unique())

        print(f"   Processing {len(unique_days)} unique days with Premium Smart Rolling Window (+/- 2 days)...")

        # Helper for Smart Weighting (Continuous variables)
        def _get_weights(years):
            if len(years) == 0: return []
            max_year = years.max()
            weights = []
            for y in years:
                age = max_year - y
                if age < 10:
                    # Recent 10 years: Weight 1.0 -> 3.0
                    w = 3.0 - (age * 0.2) 
                else:
                    w = 1.0
                weights.append(w)
            return weights

        def calculate_smart_stats(group_df, col_name): 
            values = pd.to_numeric(group_df[col_name], errors="coerce").values
            # Filter NaNs for robustness
            mask = ~np.isnan(values)
            if not mask.any(): return 0
            
            clean_values = values[mask]
            clean_years = group_df['year'].values[mask]
            weights = _get_weights(clean_years)
            
            return np.average(clean_values, weights=weights)

        def calculate_smart_std(group_df, col_name):
            values = pd.to_numeric(group_df[col_name], errors="coerce").values
            # Filter NaNs
            mask = ~np.isnan(values)
            if not mask.any(): return 0
            
            clean_values = values[mask]
            clean_years = group_df['year'].values[mask]
            weights = np.array(_get_weights(clean_years))
            
            mean_val = np.average(clean_values, weights=weights)
            variance = np.average((clean_values - mean_val)**2, weights=weights)
            return np.sqrt(variance)

        # Helper for Smart Icons (Categorical variables - Weighted Voting)
        def calculate_smart_mode(group_df, col_name):
            values = pd.to_numeric(group_df[col_name], errors="coerce").values
            # Filter out NaNs
            mask = ~np.isnan(values)
            values = values[mask]
            if len(values) == 0: return None
            
            years = group_df['year'].values[mask]
            weights = _get_weights(years)
            
            # Weighted Vote
            votes = {}
            for val, w in zip(values, weights):
                val = int(val)
                votes[val] = votes.get(val, 0) + w
            
            # Return key with max votes
            return max(votes, key=votes.get)

        for day in unique_days:
            # Find the "center" record to get the integer DOY
            day_ref = df[df['doy'] == day].iloc[0]
            center_doy = day_ref['doy_int']
            
            # Define Window: +/- 2 days
            window_ints = []
            for offset in range(-2, 3): 
                val = center_doy + offset
                if val <= 0: val += 365 
                if val > 366: val -= 365 
                window_ints.append(val)
            
            # Filter Dataframe for this Window
            group = df[df['doy_int'].isin(window_ints)]

            # Smart Weighted Stats (Weighted Average for Temps)
            avg_temp_max = calculate_smart_stats(group, 'temperature_2m_max')
            avg_temp_min = calculate_smart_stats(group, 'temperature_2m_min')
            
            # Smart Rain Probability (Weighted by recency)
            # If seasons are shifting, this captures the new trend better than 30y mean
            precip_prob = calculate_smart_stats(group, 'rain_p')
            
            # Robust Precip Amount (Storm Guard)
            # Remove top 5% outliers (extreme storms) to get "typical" rain amount
            p_values = group['precipitation_sum'].values
            if len(p_values) > 20: 
                p95 = np.percentile(p_values, 95)
                # Keep values below 95th percentile (filtering out hurricanes/floods)
                filtered_p = p_values[p_values <= p95]
                if len(filtered_p) > 0:
                    avg_precip = filtered_p.mean()
                else:
                    avg_precip = p_values.mean() # Fallback
            else:
                avg_precip = p_values.mean()

            # Smart Wind (Median - better for "typical" wind, filters storms)
            avg_wind = group['wind_speed_10m_max'].median()
            
            avg_clouds = group['cloud_cover_mean'].mean() if 'cloud_cover_mean' in group else 0

            # NEW: Extended Weather Variables
            avg_snowfall = group['snowfall_sum'].mean() if 'snowfall_sum' in group else 0
            
            # Smart Sunshine (Weighted - sunny days are increasing in many places)
            avg_sunshine = calculate_smart_stats(group, 'sunshine_duration') if 'sunshine_duration' in group else 0
            avg_humidity = calculate_smart_stats(group, 'relative_humidity_2m_mean') if 'relative_humidity_2m_mean' in group else None

            # Smart Icon (Weighted Voting)
            # Replaces old simple mode(). If it snowed 20 years ago but rains now, we show Rain.
            most_common_weather_code = None
            if 'weather_code' in group:
                most_common_weather_code = calculate_smart_mode(group, 'weather_code')

            weather_condition = interpret_weather_code(most_common_weather_code) if most_common_weather_code is not None else None

            # Pressure Stats
            # Pressure Stats - Using Smart Stats (Weighted by recency)
            avg_pressure = calculate_smart_stats(group, 'pressure_msl_mean') if 'pressure_msl_mean' in group else None
            pressure_std = calculate_smart_std(group, 'pressure_msl_mean') if 'pressure_msl_mean' in group else 0

            # Marine Stats (Waves & SST)
            marine_info = None
            if 'wave_height_max' in group.columns and 'water_temp' in group.columns:
                 avg_wave_height = calculate_smart_stats(group, 'wave_height_max')
                 avg_water_temp = calculate_smart_stats(group, 'water_temp')
                 
                 if avg_water_temp > 0: # Ensure valid data
                     # Shiver Factor
                     shiver = "Hot Soup"
                     if avg_water_temp < 17: shiver = "Polar Plunge"
                     elif avg_water_temp < 21: shiver = "Refreshing Tonic"
                     elif avg_water_temp < 25: shiver = "Swimming Pool"
                     elif avg_water_temp < 29: shiver = "Tropical Bath"
                     
                     # Family Safety Flag
                     safety_flag = "Surfers Only"
                     if avg_wave_height < 0.5: safety_flag = "Lake-like"
                     elif avg_wave_height < 1.2: safety_flag = "Fun Waves"
                     
                     # Jellyfish Radar
                     # Month is in 'day' string MM-DD. 
                     month_num = int(day.split('-')[0])
                     jellyfish = False
                     if avg_water_temp > 26 and month_num in [8, 9]:
                         jellyfish = True
                     
                     marine_info = {
                         "water_temp": round(avg_water_temp, 1),
                         "wave_height": round(avg_wave_height, 2),
                         "shiver_factor": shiver,
                         "family_safety": safety_flag,
                         "jellyfish_warning": jellyfish
                     }

            # Calculate pressure volatility (how much it changes day-to-day)
            # High volatility = migraine risk
            pressure_volatility = "Low"
            if pressure_std > 8:
                pressure_volatility = "High"
            elif pressure_std > 4:
                pressure_volatility = "Medium"

            # Reliability (Std Dev of Max Temp)
            temp_std = group['temperature_2m_max'].std()
            reliability_score = max(0, 100 - (temp_std * 10))
            
            # 3. Custom Scores
            # Wedding Score (0-100)
            wedding_score = 0
            if (THRESHOLDS['wedding']['temp_min'] <= avg_temp_max <= THRESHOLDS['wedding']['temp_max'] and
                avg_precip < THRESHOLDS['wedding']['precip_max'] and
                avg_wind < THRESHOLDS['wedding']['wind_max']):
                wedding_score = 100
                wedding_score -= precip_prob * 0.5  # Penalize for rain probability
                wedding_score -= (avg_clouds * 0.2)  # Penalize for clouds
            else:
                wedding_score = 30  # Base low score
                if avg_precip > 2: 
                    wedding_score = 10
                
            wedding_score = max(0, min(100, wedding_score))

            # 4. Clothing Logic
            clothing = []
            avg_temp = (avg_temp_max + avg_temp_min) / 2
            
            if avg_temp < 10:
                clothing.append("Heavy Coat")
                clothing.append("Scarf")
                clothing.append("Gloves")
            elif avg_temp < 18:
                clothing.append("Light Jacket")
                clothing.append("Long Pants")
            else:
                clothing.append("T-Shirt")
                clothing.append("Light Clothing")
                
            if precip_prob > 30:
                clothing.append("Umbrella")
                
            if (avg_temp_max - avg_temp_min) > 12:
                clothing.append("Layers (Onion System)")

            # Check if this day is a holiday
            events = []
            year_day = f"{current_year}-{day}"
            if year_day in all_holidays:
                events.append({"type": "holiday", "description": all_holidays[year_day]})

            # 5. Historical Records (last 10 years for transparency)
            # Show actual data so people can see we're not making numbers up!
            # FIX: Filter group to only include the EXACT day, not the rolling window neighbors
            # Otherwise we get duplicate years (e.g. 2024, 2024, 2024...)
            historical_records = []
            exact_day_group = group[group['doy'] == day]
            recent_years = exact_day_group.tail(10)  # Last 10 years of the EXACT day
            for _, record in recent_years.iterrows():
                rec_data = {
                    "year": int(record['date'].year),
                    "temp_max": round(float(record['temperature_2m_max']), 1),
                    "temp_min": round(float(record['temperature_2m_min']), 1),
                    "precip": round(float(record['precipitation_sum']), 1)
                }

                # Add optional new fields if available
                if 'snowfall_sum' in record and not pd.isna(record['snowfall_sum']):
                    rec_data['snowfall'] = round(float(record['snowfall_sum']), 1)
                if 'weather_code' in record and not pd.isna(record['weather_code']):
                    rec_data['weather_code'] = int(record['weather_code'])

                historical_records.append(rec_data)

            # Sort by year descending (newest first)
            historical_records.sort(key=lambda x: x['year'], reverse=True)

            # Calculate Health Impact Scores
            migraine_risk = "Low"
            joint_pain_risk = "Low"

            if pressure_volatility == "High":
                migraine_risk = "High"
            elif pressure_volatility == "Medium":
                migraine_risk = "Medium"

            # Joint pain risk: Low pressure + High humidity + Cold
            # Now using actual humidity data instead of just precipitation
            if avg_humidity:
                if avg_pressure and avg_pressure < 1010 and avg_humidity > 80 and avg_temp_max < 15:
                    joint_pain_risk = "High"
                elif avg_pressure and avg_pressure < 1013 and avg_humidity > 70:
                    joint_pain_risk = "Medium"
            else:
                # Fallback to old method if humidity not available
                if avg_pressure and avg_pressure < 1010 and precip_prob > 40 and avg_temp_max < 15:
                    joint_pain_risk = "High"
                elif avg_pressure and avg_pressure < 1013 and precip_prob > 30:
                    joint_pain_risk = "Medium"

            # Fishing conditions (pressure trend)
            fishing_conditions = "Fair"
            if pressure_volatility == "High":
                fishing_conditions = "Excellent"  # Fish are active when pressure changes
            elif avg_pressure and avg_pressure > 1020:
                fishing_conditions = "Poor"  # High stable pressure = lazy fish

            # === MONTHLY SAFETY DATA (NEW!) ===
            # Extract month from day (MM-DD format)
            month = int(day.split('-')[0])

            # Build monthly safety profile
            safety_data = {}

            # 1. Air Quality (monthly average)
            if monthly_air_quality and month in monthly_air_quality:
                safety_data['air_quality'] = monthly_air_quality[month]

            # 2. Hurricane/Typhoon Risk (seasonal)
            if hurricane_data:
                monthly_hurricane = get_monthly_hurricane_risk(hurricane_data, month)
                if monthly_hurricane:
                    safety_data['hurricane'] = monthly_hurricane

            # 3. Flood Risk (based on monthly precipitation)
            if month in monthly_precip_stats:
                monthly_flood = calculate_monthly_flood_risk(
                    elevation=elevation,
                    is_coastal=config.get('is_coastal', False),
                    monthly_precip_avg=monthly_precip_stats[month]['avg'],
                    monthly_precip_max=monthly_precip_stats[month]['max']
                )
                safety_data['flood'] = monthly_flood

            # 4. Earthquake (constant - same for all months)
            if earthquake_data and earthquake_data.get('risk_level') != 'Stable':
                safety_data['seismic'] = {
                    'risk_level': earthquake_data.get('risk_level'),
                    'avg_per_year': earthquake_data.get('avg_per_year'),
                    'seismic_score': earthquake_data.get('seismic_score')
                }

            # 5. Volcano (constant - same for all months)
            if volcano_data and volcano_data.get('risk_level') not in ['None', 'Minimal']:
                safety_data['volcano'] = {
                    'risk_level': volcano_data.get('risk_level'),
                    'count': volcano_data.get('count'),
                    'nearest': volcano_data['nearby_volcanoes'][0]['name'] if volcano_data.get('nearby_volcanoes') else None
                }

            days_data[day] = {
                "stats": {
                    "temp_max": round(avg_temp_max, 1),
                    "temp_min": round(avg_temp_min, 1),
                    "precip_mm": round(avg_precip, 1),
                    "precip_prob": round(precip_prob, 0),
                    "wind_kmh": round(avg_wind, 1),
                    "clouds_percent": round(avg_clouds, 0),
                    "pressure_hpa": round(avg_pressure, 1) if avg_pressure else None,
                    # NEW: Extended weather variables
                    "snowfall_cm": round(avg_snowfall, 1) if avg_snowfall else 0,
                    "sunshine_hours": round(avg_sunshine / 3600, 1) if avg_sunshine else 0,  # Convert seconds to hours
                    "humidity_percent": round(avg_humidity, 0) if avg_humidity else None
                },
                "weather_condition": weather_condition,  # NEW: Weather description & icon
                "scores": {
                    "wedding": round(wedding_score, 0),
                    "reliability": round(reliability_score, 0)
                },
                "pressure_stats": {
                    "mean_hpa": round(avg_pressure, 1) if avg_pressure else None,
                    "volatility": pressure_volatility,
                    "std_dev": round(pressure_std, 1) if pressure_std else None
                },
                "health_impact": {
                    "migraine_risk": migraine_risk,
                    "joint_pain_risk": joint_pain_risk,
                    "fishing_conditions": fishing_conditions
                },
                "safety": safety_data,  # NEW: Monthly safety data
                "marine": marine_info,
                "clothing": clothing,
                "events": events if events else [],
                "historical_records": historical_records  # NEW: Actual historical data
            }

        # Calculate yearly stats
        
        # Global Warming Trend (First 5 years vs Last 5 years)
        yearly_avgs = df.groupby('year')['temperature_2m_max'].mean()
        first_5_years_avg = yearly_avgs.head(5).mean()
        last_5_years_avg = yearly_avgs.tail(5).mean()
        warming_trend = round(last_5_years_avg - first_5_years_avg, 2)

        yearly_stats = {
            "avg_temp_annual": round(df['temperature_2m_max'].mean(), 1),
            "warming_trend": warming_trend,
            "coldest_month": int(df.groupby(df['date'].dt.month)['temperature_2m_min'].mean().idxmin()),
            "hottest_month": int(df.groupby(df['date'].dt.month)['temperature_2m_max'].mean().idxmax()),
            "wettest_month": int(df.groupby(df['date'].dt.month)['precipitation_sum'].sum().idxmax()),
            "total_days_analyzed": int(len(df))
        }

        # Structure final data (NEW)
        final_data = {
            "meta": {
                "name": config['name'],
                "country": config['country'],
                "lat": config['lat'],
                "lon": config['lon'],
                "is_coastal": config.get('is_coastal', False),
                "timezone": config.get('timezone', 'UTC'),
                "last_updated": datetime.datetime.now().isoformat(),
                "geo_info": {
                    "elevation": elevation,
                    "is_high_altitude": is_high_altitude,
                    "altitude_effects": altitude_effects if altitude_effects else None
                },
                "safety_profile": {
                    "seismic": earthquake_data,
                    "hurricane": hurricane_data,
                    "volcano": volcano_data,
                    "flood": flood_data if flood_data['risk_level'] != "Minimal" else None,
                    "air_quality": air_quality_data
                }
            },
            "yearly_stats": yearly_stats,
            "days": days_data
        }

    # === BRANCH: UPDATE EXISTING DATA ===
    else:
        # Use existing data, update only meta fields
        final_data = existing_data
        
        # Ensure 'meta' exists
        if 'meta' not in final_data:
            final_data['meta'] = {}
            
        # Update Safety Profile
        final_data['meta']['safety_profile'] = {
            "seismic": earthquake_data,
            "hurricane": hurricane_data,
            "volcano": volcano_data,
            "flood": flood_data if flood_data['risk_level'] != "Minimal" else None,
            "air_quality": air_quality_data
        }
        
        # Update Geo Info
        if 'geo_info' not in final_data['meta']:
            final_data['meta']['geo_info'] = {}

        final_data['meta']['geo_info']['elevation'] = elevation
        final_data['meta']['geo_info']['is_high_altitude'] = is_high_altitude
        final_data['meta']['geo_info']['altitude_effects'] = altitude_effects
        
        final_data['meta']['last_updated'] = datetime.datetime.now().isoformat()

    return final_data

def load_existing_json(slug):
    """Load existing processed JSON data"""
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(script_dir, "../public/data", f"{slug}.json")
        
        if os.path.exists(file_path):
            with open(file_path, "r", encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"   ⚠️  Could not load existing JSON: {e}")
    return None

def save_to_json(slug, data, output_dir="../public/data"):
    """Save location data to JSON file (directly to public/data for Next.js)"""
    # Get absolute path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir_abs = os.path.join(script_dir, output_dir)
    os.makedirs(output_dir_abs, exist_ok=True)

    output_path = os.path.join(output_dir_abs, f"{slug}.json")

    with open(output_path, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"   ✅ Saved to JSON: {output_path}")
    return True

def main():
    print("\n" + "="*60)
    print("🌍 HISTORICAL WEATHER DATA ETL PIPELINE")
    print("="*60)
    print(f"📅 Date Range: {START_DATE} to {END_DATE}")
    print(f"📍 Locations: {len(LOCATIONS)}")
    print("="*60)

    # Process each location
    location_count = len(LOCATIONS)
    for idx, (slug, config) in enumerate(LOCATIONS.items(), 1):

        try:
            # SKIP LOGIC START
            # Skip if updated in the last 20 minutes
            output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../public/data")
            output_path = os.path.join(output_dir, f"{slug}.json")
            if os.path.exists(output_path):
                mtime = os.path.getmtime(output_path)
                if time.time() - mtime < -1: # 20 minutes
                    print(f"   ⏩ Skipping {config['name']} ({slug}) - Recently updated")
                    continue

            #     print(f"   ⏩ Skipping {config['name']} ({slug}) - Already exists")

            
            data = process_location(slug, config)

            # Save to JSON only (for GitHub static hosting)
            json_success = save_to_json(slug, data)

            if json_success:
                print(f"   ✅ {config['name']}: Data saved successfully")

            # Add delay between locations to avoid rate limiting (except for last one)
            if idx < location_count:
                print(f"   ⏳ Waiting 1 seconds before next location...")
                time.sleep(3)

        except Exception as e:
            print(f"   ❌ Error processing {slug}: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*60)
    print("✅ ETL Pipeline Complete")
    print("="*60)

if __name__ == "__main__":
    # FORCED MARINE UPDATE - Dublin & Oslo
    forced = ['dublin-ie', 'oslo-no']
    LOCATIONS = {k: v for k, v in LOCATIONS.items() if k in forced}
    print(f"FORCED MODE: Processing {len(LOCATIONS)} cities: {list(LOCATIONS.keys())}")

    main()
