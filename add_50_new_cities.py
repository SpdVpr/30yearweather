"""
Script to add 50 new cities to the 30YearWeather platform
Cities requested by user for expansion.
"""

NEW_CITIES = {
    # EUROPE
    'florence': {
        "name": "Florence",
        "country": "Italy",
        "lat": 43.7696,
        "lon": 11.2558,
        "is_coastal": False,
        "timezone": "Europe/Rome",
        "desc": "Renaissance art capital of Tuscany, Italy."
    },
    'malaga': {
        "name": "Malaga",
        "country": "Spain",
        "lat": 36.7213,
        "lon": -4.4214,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "Sunny coastal city on Spain's Costa del Sol."
    },
    'marseille': {
        "name": "Marseille",
        "country": "France",
        "lat": 43.2965,
        "lon": 5.3698,
        "is_coastal": True,
        "timezone": "Europe/Paris",
        "desc": "France's vibrant Mediterranean port city."
    },
    'bordeaux': {
        "name": "Bordeaux",
        "country": "France",
        "lat": 44.8378,
        "lon": -0.5792,
        "is_coastal": False,
        "timezone": "Europe/Paris",
        "desc": "World-famous wine region and elegant French city."
    },
    'thessaloniki': {
        "name": "Thessaloniki",
        "country": "Greece",
        "lat": 40.6401,
        "lon": 22.9444,
        "is_coastal": True,
        "timezone": "Europe/Athens",
        "desc": "Greece's vibrant northern metropolis with rich history."
    },
    'tallinn': {
        "name": "Tallinn",
        "country": "Estonia",
        "lat": 59.4370,
        "lon": 24.7536,
        "is_coastal": True,
        "timezone": "Europe/Tallinn",
        "desc": "Medieval old town meets modern Nordic design."
    },
    'bergen': {
        "name": "Bergen",
        "country": "Norway",
        "lat": 60.3913,
        "lon": 5.3221,
        "is_coastal": True,
        "timezone": "Europe/Oslo",
        "desc": "Gateway to Norway's stunning fjords."
    },
    'salzburg': {
        "name": "Salzburg",
        "country": "Austria",
        "lat": 47.8095,
        "lon": 13.0550,
        "is_coastal": False,
        "timezone": "Europe/Vienna",
        "desc": "Mozart's birthplace in the Austrian Alps."
    },
    'bologna': {
        "name": "Bologna",
        "country": "Italy",
        "lat": 44.4949,
        "lon": 11.3426,
        "is_coastal": False,
        "timezone": "Europe/Rome",
        "desc": "Italy's culinary capital and oldest university town."
    },
    'san-sebastian': {
        "name": "San Sebastian",
        "country": "Spain",
        "lat": 43.3183,
        "lon": -1.9812,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "Basque Country's gourmet beach destination."
    },
    'split': {
        "name": "Split",
        "country": "Croatia",
        "lat": 43.5081,
        "lon": 16.4402,
        "is_coastal": True,
        "timezone": "Europe/Zagreb",
        "desc": "Ancient Roman palace on Croatia's Dalmatian coast."
    },
    'mykonos': {
        "name": "Mykonos",
        "country": "Greece",
        "lat": 37.4467,
        "lon": 25.3289,
        "is_coastal": True,
        "timezone": "Europe/Athens",
        "desc": "Greece's most glamorous island destination."
    },
    'crete': {
        "name": "Crete",
        "country": "Greece",
        "lat": 35.2401,
        "lon": 24.8093,
        "is_coastal": True,
        "timezone": "Europe/Athens",
        "desc": "Greece's largest island with ancient Minoan heritage."
    },
    'tbilisi': {
        "name": "Tbilisi",
        "country": "Georgia",
        "lat": 41.7151,
        "lon": 44.8271,
        "is_coastal": False,
        "timezone": "Asia/Tbilisi",
        "desc": "Ancient crossroads of Europe and Asia."
    },

    # NORTH AMERICA
    'seattle': {
        "name": "Seattle",
        "country": "United States",
        "lat": 47.6062,
        "lon": -122.3321,
        "is_coastal": True,
        "timezone": "America/Los_Angeles",
        "desc": "Pacific Northwest tech hub and coffee culture capital."
    },
    'washington-dc': {
        "name": "Washington DC",
        "country": "United States",
        "lat": 38.9072,
        "lon": -77.0369,
        "is_coastal": False,
        "timezone": "America/New_York",
        "desc": "America's capital with world-class monuments and museums."
    },
    'phoenix': {
        "name": "Phoenix",
        "country": "United States",
        "lat": 33.4484,
        "lon": -112.0740,
        "is_coastal": False,
        "timezone": "America/Phoenix",
        "desc": "Desert metropolis with year-round desert sun."
    },
    'quebec-city': {
        "name": "Quebec City",
        "country": "Canada",
        "lat": 46.8139,
        "lon": -71.2080,
        "is_coastal": False,
        "timezone": "America/Toronto",
        "desc": "North America's most European city with French heritage."
    },
    'havana': {
        "name": "Havana",
        "country": "Cuba",
        "lat": 23.1136,
        "lon": -82.3666,
        "is_coastal": True,
        "timezone": "America/Havana",
        "desc": "Cuba's vibrant capital frozen in time."
    },
    'tulum': {
        "name": "Tulum",
        "country": "Mexico",
        "lat": 20.2114,
        "lon": -87.4654,
        "is_coastal": True,
        "timezone": "America/Cancun",
        "desc": "Bohemian beach paradise with Mayan ruins."
    },

    # SOUTH AMERICA
    'medellin': {
        "name": "Medellín",
        "country": "Colombia",
        "lat": 6.2442,
        "lon": -75.5812,
        "is_coastal": False,
        "timezone": "America/Bogota",
        "desc": "Colombia's city of eternal spring."
    },
    'salvador': {
        "name": "Salvador",
        "country": "Brazil",
        "lat": -12.9714,
        "lon": -38.5014,
        "is_coastal": True,
        "timezone": "America/Bahia",
        "desc": "Brazil's Afro-Brazilian cultural capital."
    },
    'fortaleza': {
        "name": "Fortaleza",
        "country": "Brazil",
        "lat": -3.7172,
        "lon": -38.5433,
        "is_coastal": True,
        "timezone": "America/Fortaleza",
        "desc": "Tropical beaches on Brazil's northeastern coast."
    },
    'brasilia': {
        "name": "Brasília",
        "country": "Brazil",
        "lat": -15.7975,
        "lon": -47.8919,
        "is_coastal": False,
        "timezone": "America/Sao_Paulo",
        "desc": "Brazil's modernist planned capital."
    },
    'florianopolis': {
        "name": "Florianópolis",
        "country": "Brazil",
        "lat": -27.5954,
        "lon": -48.5480,
        "is_coastal": True,
        "timezone": "America/Sao_Paulo",
        "desc": "Brazil's island paradise for beaches and nightlife."
    },

    # ASIA
    'jaipur': {
        "name": "Jaipur",
        "country": "India",
        "lat": 26.9124,
        "lon": 75.7873,
        "is_coastal": False,
        "timezone": "Asia/Kolkata",
        "desc": "India's Pink City of royal palaces."
    },
    'goa': {
        "name": "Goa",
        "country": "India",
        "lat": 15.2993,
        "lon": 74.1240,
        "is_coastal": True,
        "timezone": "Asia/Kolkata",
        "desc": "India's tropical beach paradise with Portuguese heritage."
    },
    'bangalore': {
        "name": "Bangalore",
        "country": "India",
        "lat": 12.9716,
        "lon": 77.5946,
        "is_coastal": False,
        "timezone": "Asia/Kolkata",
        "desc": "India's Silicon Valley with pleasant climate."
    },
    'kochi': {
        "name": "Kochi",
        "country": "India",
        "lat": 9.9312,
        "lon": 76.2673,
        "is_coastal": True,
        "timezone": "Asia/Kolkata",
        "desc": "Kerala's historic port with Chinese fishing nets."
    },
    'colombo': {
        "name": "Colombo",
        "country": "Sri Lanka",
        "lat": 6.9271,
        "lon": 79.8612,
        "is_coastal": True,
        "timezone": "Asia/Colombo",
        "desc": "Sri Lanka's bustling coastal capital."
    },
    'da-nang': {
        "name": "Da Nang",
        "country": "Vietnam",
        "lat": 16.0544,
        "lon": 108.2022,
        "is_coastal": True,
        "timezone": "Asia/Ho_Chi_Minh",
        "desc": "Vietnam's beach resort with marble mountains."
    },
    'hoi-an': {
        "name": "Hoi An",
        "country": "Vietnam",
        "lat": 15.8801,
        "lon": 108.3380,
        "is_coastal": True,
        "timezone": "Asia/Ho_Chi_Minh",
        "desc": "Vietnam's lantern-lit ancient trading port."
    },
    'cebu': {
        "name": "Cebu",
        "country": "Philippines",
        "lat": 10.3157,
        "lon": 123.8854,
        "is_coastal": True,
        "timezone": "Asia/Manila",
        "desc": "Philippines' historic island with pristine beaches."
    },
    'palawan': {
        "name": "Palawan",
        "country": "Philippines",
        "lat": 9.8349,
        "lon": 118.7384,
        "is_coastal": True,
        "timezone": "Asia/Manila",
        "desc": "Philippines' last ecological frontier."
    },
    'naha': {
        "name": "Naha",
        "country": "Japan",
        "lat": 26.2124,
        "lon": 127.6809,
        "is_coastal": True,
        "timezone": "Asia/Tokyo",
        "desc": "Okinawa's tropical gateway to Japan."
    },
    'penang': {
        "name": "Penang",
        "country": "Malaysia",
        "lat": 5.4164,
        "lon": 100.3327,
        "is_coastal": True,
        "timezone": "Asia/Kuala_Lumpur",
        "desc": "Malaysia's food paradise with colonial heritage."
    },
    'langkawi': {
        "name": "Langkawi",
        "country": "Malaysia",
        "lat": 6.3500,
        "lon": 99.8000,
        "is_coastal": True,
        "timezone": "Asia/Kuala_Lumpur",
        "desc": "Malaysia's duty-free island archipelago."
    },
    'xian': {
        "name": "Xi'an",
        "country": "China",
        "lat": 34.3416,
        "lon": 108.9398,
        "is_coastal": False,
        "timezone": "Asia/Shanghai",
        "desc": "Home of the Terracotta Warriors and ancient Silk Road."
    },
    'mandalay': {
        "name": "Mandalay",
        "country": "Myanmar",
        "lat": 21.9588,
        "lon": 96.0891,
        "is_coastal": False,
        "timezone": "Asia/Yangon",
        "desc": "Myanmar's cultural heart with ancient temples."
    },
    'luang-prabang': {
        "name": "Luang Prabang",
        "country": "Laos",
        "lat": 19.8856,
        "lon": 102.1347,
        "is_coastal": False,
        "timezone": "Asia/Vientiane",
        "desc": "Laos' UNESCO World Heritage temple town."
    },
    'lombok': {
        "name": "Lombok",
        "country": "Indonesia",
        "lat": -8.6500,
        "lon": 116.3248,
        "is_coastal": True,
        "timezone": "Asia/Makassar",
        "desc": "Bali's unspoiled neighbor with stunning beaches."
    },
    'yogyakarta': {
        "name": "Yogyakarta",
        "country": "Indonesia",
        "lat": -7.7956,
        "lon": 110.3695,
        "is_coastal": False,
        "timezone": "Asia/Jakarta",
        "desc": "Java's cultural capital near Borobudur temple."
    },

    # MIDDLE EAST
    'jerusalem': {
        "name": "Jerusalem",
        "country": "Israel",
        "lat": 31.7683,
        "lon": 35.2137,
        "is_coastal": False,
        "timezone": "Asia/Jerusalem",
        "desc": "Sacred city for three world religions."
    },
    'antalya': {
        "name": "Antalya",
        "country": "Turkey",
        "lat": 36.8969,
        "lon": 30.7133,
        "is_coastal": True,
        "timezone": "Europe/Istanbul",
        "desc": "Turkey's stunning Mediterranean Riviera."
    },

    # AFRICA
    'johannesburg': {
        "name": "Johannesburg",
        "country": "South Africa",
        "lat": -26.2041,
        "lon": 28.0473,
        "is_coastal": False,
        "timezone": "Africa/Johannesburg",
        "desc": "South Africa's economic powerhouse."
    },
    'durban': {
        "name": "Durban",
        "country": "South Africa",
        "lat": -29.8587,
        "lon": 31.0218,
        "is_coastal": True,
        "timezone": "Africa/Johannesburg",
        "desc": "South Africa's subtropical coastal city."
    },

    # OCEANIA
    'cairns': {
        "name": "Cairns",
        "country": "Australia",
        "lat": -16.9186,
        "lon": 145.7781,
        "is_coastal": True,
        "timezone": "Australia/Brisbane",
        "desc": "Gateway to the Great Barrier Reef."
    },
    'gold-coast': {
        "name": "Gold Coast",
        "country": "Australia",
        "lat": -28.0167,
        "lon": 153.4000,
        "is_coastal": True,
        "timezone": "Australia/Brisbane",
        "desc": "Australia's premier beach and theme park destination."
    },
    'adelaide': {
        "name": "Adelaide",
        "country": "Australia",
        "lat": -34.9285,
        "lon": 138.6007,
        "is_coastal": True,
        "timezone": "Australia/Adelaide",
        "desc": "South Australia's elegant wine country capital."
    },
    'hamilton': {
        "name": "Hamilton",
        "country": "New Zealand",
        "lat": -37.7870,
        "lon": 175.2793,
        "is_coastal": False,
        "timezone": "Pacific/Auckland",
        "desc": "New Zealand's vibrant inland garden city."
    },
}

# Airport ICAO codes for flight data
AIRPORT_CODES_NEW = {
    'florence': 'LIRQ',      # Florence Airport (Peretola)
    'seattle': 'KSEA',       # Seattle-Tacoma International
    'jaipur': 'VIJP',        # Jaipur International
    'goa': 'VOGO',           # Goa International  
    'da-nang': 'VVDN',       # Da Nang International
    'washington-dc': 'KIAD', # Washington Dulles
    'malaga': 'LEMG',        # Malaga Airport
    'cebu': 'RPVM',          # Mactan-Cebu International
    'bangalore': 'VOBL',     # Kempegowda International
    'colombo': 'VCBI',       # Bandaranaike International
    'phoenix': 'KPHX',       # Phoenix Sky Harbor
    'bergen': 'ENBR',        # Bergen Flesland
    'quebec-city': 'CYQB',   # Quebec Jean Lesage
    'hoi-an': 'VVDN',        # Uses Da Nang Airport
    'palawan': 'RPVP',       # Puerto Princesa
    'jerusalem': 'LLBG',     # Ben Gurion (nearest)
    'johannesburg': 'FAOR',  # O.R. Tambo
    'marseille': 'LFML',     # Marseille Provence
    'bordeaux': 'LFBD',      # Bordeaux-Mérignac
    'thessaloniki': 'LGTS',  # Thessaloniki Makedonia
    'tallinn': 'EETN',       # Lennart Meri Tallinn
    'medellin': 'SKRG',      # José María Córdova
    'naha': 'ROAH',          # Naha Airport Okinawa
    'penang': 'WMKP',        # Penang International
    'langkawi': 'WMKL',      # Langkawi International
    'xian': 'ZLXY',          # Xi'an Xianyang
    'havana': 'MUHA',        # José Martí International
    'salzburg': 'LOWS',      # Salzburg W.A. Mozart
    'bologna': 'LIPE',       # Bologna Guglielmo Marconi
    'kochi': 'VOCI',         # Cochin International
    'antalya': 'LTAI',       # Antalya Airport
    'tulum': 'MMUN',         # Cancun (nearest)
    'durban': 'FALE',        # King Shaka International
    'tbilisi': 'UGTB',       # Tbilisi International
    'mandalay': 'VYMD',      # Mandalay International
    'luang-prabang': 'VLLB', # Luang Prabang International
    'lombok': 'WADL',        # Lombok International
    'yogyakarta': 'WAHI',    # Yogyakarta Adisucipto
    'cairns': 'YBCS',        # Cairns Airport
    'gold-coast': 'YBCG',    # Gold Coast Airport
    'adelaide': 'YPAD',      # Adelaide Airport
    'hamilton': 'NZHN',      # Hamilton Airport
    'san-sebastian': 'LESO', # San Sebastian Airport
    'split': 'LDSP',         # Split Airport
    'mykonos': 'LGMK',       # Mykonos Airport
    'crete': 'LGIR',         # Heraklion Nikos Kazantzakis
    'salvador': 'SBSV',      # Salvador Deputado Luis Eduardo Magalhães
    'fortaleza': 'SBFZ',     # Fortaleza Pinto Martins
    'brasilia': 'SBBR',      # Brasília International
    'florianopolis': 'SBFL', # Florianópolis Hercílio Luz
}

# Country codes for health/tourism data  
COUNTRY_CODES_NEW = {
    'florence': 'IT',
    'seattle': 'US',
    'jaipur': 'IN',
    'goa': 'IN',
    'da-nang': 'VN',
    'washington-dc': 'US',
    'malaga': 'ES',
    'cebu': 'PH',
    'bangalore': 'IN',
    'colombo': 'LK',
    'phoenix': 'US',
    'bergen': 'NO',
    'quebec-city': 'CA',
    'hoi-an': 'VN',
    'palawan': 'PH',
    'jerusalem': 'IL',
    'johannesburg': 'ZA',
    'marseille': 'FR',
    'bordeaux': 'FR',
    'thessaloniki': 'GR',
    'tallinn': 'EE',
    'medellin': 'CO',
    'naha': 'JP',
    'penang': 'MY',
    'langkawi': 'MY',
    'xian': 'CN',
    'havana': 'CU',
    'salzburg': 'AT',
    'bologna': 'IT',
    'kochi': 'IN',
    'antalya': 'TR',
    'tulum': 'MX',
    'durban': 'ZA',
    'tbilisi': 'GE',
    'mandalay': 'MM',
    'luang-prabang': 'LA',
    'lombok': 'ID',
    'yogyakarta': 'ID',
    'cairns': 'AU',
    'gold-coast': 'AU',
    'adelaide': 'AU',
    'hamilton': 'NZ',
    'san-sebastian': 'ES',
    'split': 'HR',
    'mykonos': 'GR',
    'crete': 'GR',
    'salvador': 'BR',
    'fortaleza': 'BR',
    'brasilia': 'BR',
    'florianopolis': 'BR',
}

def main():
    import os
    import sys
    
    print("=" * 60)
    print(f"50 NEW CITIES TO BE ADDED")
    print("=" * 60)
    
    # Organize by region
    regions = {
        'Europe': ['florence', 'malaga', 'marseille', 'bordeaux', 'thessaloniki', 
                   'tallinn', 'bergen', 'salzburg', 'bologna', 'san-sebastian',
                   'split', 'mykonos', 'crete', 'tbilisi'],
        'North America': ['seattle', 'washington-dc', 'phoenix', 'quebec-city', 'havana', 'tulum'],
        'South America': ['medellin', 'salvador', 'fortaleza', 'brasilia', 'florianopolis'],
        'Asia': ['jaipur', 'goa', 'bangalore', 'kochi', 'colombo', 'da-nang', 'hoi-an',
                 'cebu', 'palawan', 'naha', 'penang', 'langkawi', 'xian', 'mandalay',
                 'luang-prabang', 'lombok', 'yogyakarta'],
        'Middle East': ['jerusalem', 'antalya'],
        'Africa': ['johannesburg', 'durban'],
        'Oceania': ['cairns', 'gold-coast', 'adelaide', 'hamilton']
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
    
    # Add to config.py
    print("\n\n📝 Code to add to LOCATIONS in backend/config.py:")
    print("-" * 60)
    for slug, config in NEW_CITIES.items():
        print(f"    '{slug}': {config},")
        
    print("\n\n✈️ Code to add to AIRPORT_CODES in backend/airport_codes.py:")
    print("-" * 60)
    for slug, icao in AIRPORT_CODES_NEW.items():
        print(f"    '{slug}': '{icao}',")

if __name__ == "__main__":
    main()
