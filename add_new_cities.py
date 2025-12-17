"""
Script to add 24 new cities to the 30YearWeather platform
This will update the LOCATIONS dictionary in backend/etl.py
"""

NEW_CITIES = {
    # North America (7 cities)
    'new-york-us': {
        "name": "New York",
        "country": "United States",
        "lat": 40.7128,
        "lon": -74.0060,
        "is_coastal": True,
        "timezone": "America/New_York"
    },
    'los-angeles-us': {
        "name": "Los Angeles",
        "country": "United States",
        "lat": 34.0522,
        "lon": -118.2437,
        "is_coastal": True,
        "timezone": "America/Los_Angeles"
    },
    'san-francisco-us': {
        "name": "San Francisco",
        "country": "United States",
        "lat": 37.7749,
        "lon": -122.4194,
        "is_coastal": True,
        "timezone": "America/Los_Angeles"
    },
    'miami-us': {
        "name": "Miami",
        "country": "United States",
        "lat": 25.7617,
        "lon": -80.1918,
        "is_coastal": True,
        "timezone": "America/New_York"
    },
    'vancouver-ca': {
        "name": "Vancouver",
        "country": "Canada",
        "lat": 49.2827,
        "lon": -123.1207,
        "is_coastal": True,
        "timezone": "America/Vancouver"
    },
    'toronto-ca': {
        "name": "Toronto",
        "country": "Canada",
        "lat": 43.6532,
        "lon": -79.3832,
        "is_coastal": True,
        "timezone": "America/Toronto"
    },
    'mexico-city-mx': {
        "name": "Mexico City",
        "country": "Mexico",
        "lat": 19.4326,
        "lon": -99.1332,
        "is_coastal": False,
        "timezone": "America/Mexico_City"
    },
    
    # South America (4 cities)
    'rio-de-janeiro-br': {
        "name": "Rio de Janeiro",
        "country": "Brazil",
        "lat": -22.9068,
        "lon": -43.1729,
        "is_coastal": True,
        "timezone": "America/Sao_Paulo"
    },
    'buenos-aires-ar': {
        "name": "Buenos Aires",
        "country": "Argentina",
        "lat": -34.6037,
        "lon": -58.3816,
        "is_coastal": True,
        "timezone": "America/Argentina/Buenos_Aires"
    },
    'lima-pe': {
        "name": "Lima",
        "country": "Peru",
        "lat": -12.0464,
        "lon": -77.0428,
        "is_coastal": True,
        "timezone": "America/Lima"
    },
    'santiago-cl': {
        "name": "Santiago",
        "country": "Chile",
        "lat": -33.4489,
        "lon": -70.6693,
        "is_coastal": False,
        "timezone": "America/Santiago"
    },
    
    # Oceania (3 cities)
    'sydney-au': {
        "name": "Sydney",
        "country": "Australia",
        "lat": -33.8688,
        "lon": 151.2093,
        "is_coastal": True,
        "timezone": "Australia/Sydney"
    },
    'melbourne-au': {
        "name": "Melbourne",
        "country": "Australia",
        "lat": -37.8136,
        "lon": 144.9631,
        "is_coastal": True,
        "timezone": "Australia/Melbourne"
    },
    'auckland-nz': {
        "name": "Auckland",
        "country": "New Zealand",
        "lat": -36.8485,
        "lon": 174.7633,
        "is_coastal": True,
        "timezone": "Pacific/Auckland"
    },
    
    # Africa (2 cities)
    'cape-town-za': {
        "name": "Cape Town",
        "country": "South Africa",
        "lat": -33.9249,
        "lon": 18.4241,
        "is_coastal": True,
        "timezone": "Africa/Johannesburg"
    },
    'marrakech-ma': {
        "name": "Marrakech",
        "country": "Morocco",
        "lat": 31.6295,
        "lon": -7.9811,
        "is_coastal": False,
        "timezone": "Africa/Casablanca"
    },
    
    # Europe (5 cities)
    'edinburgh-uk': {
        "name": "Edinburgh",
        "country": "United Kingdom",
        "lat": 55.9533,
        "lon": -3.1883,
        "is_coastal": True,
        "timezone": "Europe/London"
    },
    'munich-de': {
        "name": "Munich",
        "country": "Germany",
        "lat": 48.1351,
        "lon": 11.5820,
        "is_coastal": False,
        "timezone": "Europe/Berlin"
    },
    'venice-it': {
        "name": "Venice",
        "country": "Italy",
        "lat": 45.4408,
        "lon": 12.3155,
        "is_coastal": True,
        "timezone": "Europe/Rome"
    },
    'krakow-pl': {
        "name": "Krakow",
        "country": "Poland",
        "lat": 50.0647,
        "lon": 19.9450,
        "is_coastal": False,
        "timezone": "Europe/Warsaw"
    },
    'porto-pt': {
        "name": "Porto",
        "country": "Portugal",
        "lat": 41.1579,
        "lon": -8.6291,
        "is_coastal": True,
        "timezone": "Europe/Lisbon"
    },
    
    # Asia (3 cities)
    'osaka-jp': {
        "name": "Osaka",
        "country": "Japan",
        "lat": 34.6937,
        "lon": 135.5023,
        "is_coastal": True,
        "timezone": "Asia/Tokyo"
    },
    'phuket-th': {
        "name": "Phuket",
        "country": "Thailand",
        "lat": 7.8804,
        "lon": 98.3923,
        "is_coastal": True,
        "timezone": "Asia/Bangkok"
    },
    'chiang-mai-th': {
        "name": "Chiang Mai",
        "country": "Thailand",
        "lat": 18.7883,
        "lon": 98.9853,
        "is_coastal": False,
        "timezone": "Asia/Bangkok"
    }
}

# Country codes for tourism ETL
COUNTRY_CODES = {
    'new-york-us': 'US',
    'los-angeles-us': 'US',
    'san-francisco-us': 'US',
    'miami-us': 'US',
    'vancouver-ca': 'CA',
    'toronto-ca': 'CA',
    'mexico-city-mx': 'MX',
    'rio-de-janeiro-br': 'BR',
    'buenos-aires-ar': 'AR',
    'lima-pe': 'PE',
    'santiago-cl': 'CL',
    'sydney-au': 'AU',
    'melbourne-au': 'AU',
    'auckland-nz': 'NZ',
    'cape-town-za': 'ZA',
    'marrakech-ma': 'MA',
    'edinburgh-uk': 'GB',
    'munich-de': 'DE',
    'venice-it': 'IT',
    'krakow-pl': 'PL',
    'porto-pt': 'PT',
    'osaka-jp': 'JP',
    'phuket-th': 'TH',
    'chiang-mai-th': 'TH'
}

if __name__ == "__main__":
    import sys
    import os
    
    # Print summary
    print("=" * 60)
    print("NEW CITIES TO BE ADDED (24 total)")
    print("=" * 60)
    
    regions = {
        'North America': ['new-york-us', 'los-angeles-us', 'san-francisco-us', 'miami-us', 
                         'vancouver-ca', 'toronto-ca', 'mexico-city-mx'],
        'South America': ['rio-de-janeiro-br', 'buenos-aires-ar', 'lima-pe', 'santiago-cl'],
        'Oceania': ['sydney-au', 'melbourne-au', 'auckland-nz'],
        'Africa': ['cape-town-za', 'marrakech-ma'],
        'Europe': ['edinburgh-uk', 'munich-de', 'venice-it', 'krakow-pl', 'porto-pt'],
        'Asia': ['osaka-jp', 'phuket-th', 'chiang-mai-th']
    }
    
    for region, cities in regions.items():
        print(f"\n{region} ({len(cities)} cities):")
        for slug in cities:
            city = NEW_CITIES[slug]
            coastal = "🌊" if city['is_coastal'] else "🏔️"
            print(f"  {coastal} {city['name']}, {city['country']} ({slug})")
    
    print("\n" + "=" * 60)
    print(f"Total: {len(NEW_CITIES)} new cities")
    print("=" * 60)
    
    # Print Python code to add to etl.py
    print("\n\nCode to add to LOCATIONS in backend/etl.py:")
    print("-" * 60)
    for slug, config in NEW_CITIES.items():
        print(f"    '{slug}': {config},")
