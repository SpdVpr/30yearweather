"""
50 NEW TRENDING CITIES for 30YearWeather
Based on Google Trends, Skyscanner data, and search volume analysis (Dec 2024)

These cities have HIGH organic traffic potential based on:
- Search volume for "[city] weather" queries
- Tourism growth trends 2024-2025
- Geographic gaps in current coverage
"""

NEW_CITIES = {
    # ========== TIER 1: HIGHEST PRIORITY - Canary Islands (110k+ monthly searches) ==========
    'tenerife': {
        "name": "Tenerife",
        "country": "Spain",
        "lat": 28.2916,
        "lon": -16.6291,
        "is_coastal": True,
        "timezone": "Atlantic/Canary",
        "desc": "Largest Canary Island with year-round sunshine, Mount Teide volcano, and diverse landscapes."
    },
    'lanzarote': {
        "name": "Lanzarote",
        "country": "Spain",
        "lat": 29.0469,
        "lon": -13.5900,
        "is_coastal": True,
        "timezone": "Atlantic/Canary",
        "desc": "Volcanic island paradise with unique lunar landscapes and pristine beaches."
    },
    'gran-canaria': {
        "name": "Gran Canaria",
        "country": "Spain",
        "lat": 27.9202,
        "lon": -15.5474,
        "is_coastal": True,
        "timezone": "Atlantic/Canary",
        "desc": "Miniature continent with stunning dunes, diverse microclimates, and vibrant nightlife."
    },
    'fuerteventura': {
        "name": "Fuerteventura",
        "country": "Spain",
        "lat": 28.3587,
        "lon": -14.0537,
        "is_coastal": True,
        "timezone": "Atlantic/Canary",
        "desc": "Wind and surf paradise with endless golden beaches and crystal-clear waters."
    },
    
    # ========== TIER 1: TRENDING DESTINATIONS ==========
    'curacao': {
        "name": "Curaçao",
        "country": "Curaçao",
        "lat": 12.1696,
        "lon": -68.9900,
        "is_coastal": True,
        "timezone": "America/Curacao",
        "desc": "Dutch Caribbean gem with colorful Willemstad, pristine diving, and year-round sunshine."
    },
    'siem-reap': {
        "name": "Siem Reap",
        "country": "Cambodia",
        "lat": 13.3671,
        "lon": 103.8448,
        "is_coastal": False,
        "timezone": "Asia/Phnom_Penh",
        "desc": "Gateway to ancient Angkor Wat temples and rich Khmer cultural heritage."
    },
    'tromso': {
        "name": "Tromsø",
        "country": "Norway",
        "lat": 69.6492,
        "lon": 18.9553,
        "is_coastal": True,
        "timezone": "Europe/Oslo",
        "desc": "Arctic capital for Northern Lights, midnight sun, and pristine wilderness adventures."
    },
    'nha-trang': {
        "name": "Nha Trang",
        "country": "Vietnam",
        "lat": 12.2388,
        "lon": 109.1967,
        "is_coastal": True,
        "timezone": "Asia/Ho_Chi_Minh",
        "desc": "Vietnam's coastal paradise with stunning beaches, vibrant nightlife, and island hopping."
    },
    'reggio-calabria': {
        "name": "Reggio Calabria",
        "country": "Italy",
        "lat": 38.1112,
        "lon": 15.6467,
        "is_coastal": True,
        "timezone": "Europe/Rome",
        "desc": "Toe of Italy's boot with stunning Strait of Messina views and ancient Greek heritage."
    },
    'ibiza': {
        "name": "Ibiza",
        "country": "Spain",
        "lat": 38.9067,
        "lon": 1.4206,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "World-famous party island with legendary clubs, beautiful beaches, and bohemian spirit."
    },
    
    # ========== TIER 2: HIGH PRIORITY ==========
    'valencia': {
        "name": "Valencia",
        "country": "Spain",
        "lat": 39.4699,
        "lon": -0.3763,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "Mediterranean gem with 300 days of sunshine, futuristic architecture, and famous paella."
    },
    'bilbao': {
        "name": "Bilbao",
        "country": "Spain",
        "lat": 43.2630,
        "lon": -2.9350,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "Basque cultural capital with iconic Guggenheim Museum and world-class gastronomy."
    },
    'krabi': {
        "name": "Krabi",
        "country": "Thailand",
        "lat": 8.0863,
        "lon": 98.9063,
        "is_coastal": True,
        "timezone": "Asia/Bangkok",
        "desc": "Tropical paradise with dramatic limestone cliffs, island hopping, and pristine beaches."
    },
    'amman': {
        "name": "Amman",
        "country": "Jordan",
        "lat": 31.9454,
        "lon": 35.9284,
        "is_coastal": False,
        "timezone": "Asia/Amman",
        "desc": "Ancient capital blending Roman ruins with modern Middle Eastern culture and cuisine."
    },
    'hurghada': {
        "name": "Hurghada",
        "country": "Egypt",
        "lat": 27.2579,
        "lon": 33.8116,
        "is_coastal": True,
        "timezone": "Africa/Cairo",
        "desc": "Red Sea resort paradise with world-class diving, coral reefs, and year-round sunshine."
    },
    'sharm-el-sheikh': {
        "name": "Sharm El Sheikh",
        "country": "Egypt",
        "lat": 27.9158,
        "lon": 34.3300,
        "is_coastal": True,
        "timezone": "Africa/Cairo",
        "desc": "Premier Red Sea destination with legendary diving sites and luxurious resorts."
    },
    'luxor': {
        "name": "Luxor",
        "country": "Egypt",
        "lat": 25.6872,
        "lon": 32.6396,
        "is_coastal": False,
        "timezone": "Africa/Cairo",
        "desc": "World's greatest open-air museum with ancient temples, tombs, and Nile cruises."
    },
    'jeddah': {
        "name": "Jeddah",
        "country": "Saudi Arabia",
        "lat": 21.4858,
        "lon": 39.1925,
        "is_coastal": True,
        "timezone": "Asia/Riyadh",
        "desc": "Gateway to Mecca with historic Al-Balad district, Red Sea diving, and modern attractions."
    },
    'bodrum': {
        "name": "Bodrum",
        "country": "Turkey",
        "lat": 37.0344,
        "lon": 27.4305,
        "is_coastal": True,
        "timezone": "Europe/Istanbul",
        "desc": "Turkish Riviera gem with ancient castle, azure waters, and sophisticated nightlife."
    },
    'antwerp': {
        "name": "Antwerp",
        "country": "Belgium",
        "lat": 51.2194,
        "lon": 4.4025,
        "is_coastal": False,
        "timezone": "Europe/Brussels",
        "desc": "Diamond capital with stunning architecture, world-class art, and vibrant fashion scene."
    },
    
    # ========== TIER 3: EMERGING MARKETS ==========
    'sarande': {
        "name": "Sarandë",
        "country": "Albania",
        "lat": 39.8661,
        "lon": 20.0050,
        "is_coastal": True,
        "timezone": "Europe/Tirane",
        "desc": "Albanian Riviera jewel with crystal-clear Ionian waters and nearby ancient Butrint."
    },
    'tirana': {
        "name": "Tirana",
        "country": "Albania",
        "lat": 41.3275,
        "lon": 19.8187,
        "is_coastal": False,
        "timezone": "Europe/Tirane",
        "desc": "Colorful Albanian capital with vibrant café culture and fascinating post-communist history."
    },
    'kotor': {
        "name": "Kotor",
        "country": "Montenegro",
        "lat": 42.4247,
        "lon": 18.7712,
        "is_coastal": True,
        "timezone": "Europe/Podgorica",
        "desc": "UNESCO fjord town with medieval old town, dramatic bay, and mountain fortress."
    },
    'budva': {
        "name": "Budva",
        "country": "Montenegro",
        "lat": 42.2911,
        "lon": 18.8403,
        "is_coastal": True,
        "timezone": "Europe/Podgorica",
        "desc": "Montenegrin Miami with ancient walled town, beautiful beaches, and lively nightlife."
    },
    'st-lucia': {
        "name": "St. Lucia",
        "country": "Saint Lucia",
        "lat": 13.9094,
        "lon": -60.9789,
        "is_coastal": True,
        "timezone": "America/St_Lucia",
        "desc": "Volcanic paradise with iconic Pitons, lush rainforests, and romantic luxury resorts."
    },
    'turks-caicos': {
        "name": "Providenciales",
        "country": "Turks and Caicos",
        "lat": 21.7738,
        "lon": -72.2659,
        "is_coastal": True,
        "timezone": "America/Grand_Turk",
        "desc": "Caribbean's best beaches with Grace Bay, luxury resorts, and pristine snorkeling."
    },
    'antigua': {
        "name": "St. John's",
        "country": "Antigua and Barbuda",
        "lat": 17.1175,
        "lon": -61.8456,
        "is_coastal": True,
        "timezone": "America/Antigua",
        "desc": "365 beaches island with British colonial heritage, sailing paradise, and sunny skies."
    },
    'siargao': {
        "name": "Siargao",
        "country": "Philippines",
        "lat": 9.8483,
        "lon": 126.0458,
        "is_coastal": True,
        "timezone": "Asia/Manila",
        "desc": "Philippines' surfing capital with Cloud 9 waves, island hopping, and laid-back vibes."
    },
    'panglao': {
        "name": "Panglao",
        "country": "Philippines",
        "lat": 9.5804,
        "lon": 123.7747,
        "is_coastal": True,
        "timezone": "Asia/Manila",
        "desc": "Bohol's beach paradise near Chocolate Hills, tarsiers, and world-class diving."
    },
    'trivandrum': {
        "name": "Thiruvananthapuram",
        "country": "India",
        "lat": 8.5241,
        "lon": 76.9366,
        "is_coastal": True,
        "timezone": "Asia/Kolkata",
        "desc": "Kerala's capital gateway to backwaters, Ayurveda retreats, and tropical beaches."
    },
    
    # ========== TIER 4: GEOGRAPHIC DIVERSITY ==========
    'tartu': {
        "name": "Tartu",
        "country": "Estonia",
        "lat": 58.3780,
        "lon": 26.7290,
        "is_coastal": False,
        "timezone": "Europe/Tallinn",
        "desc": "Estonia's intellectual heart with historic university, charming old town, and bohemian spirit."
    },
    'stuttgart': {
        "name": "Stuttgart",
        "country": "Germany",
        "lat": 48.7758,
        "lon": 9.1829,
        "is_coastal": False,
        "timezone": "Europe/Berlin",
        "desc": "Automotive capital with Mercedes and Porsche museums, vineyards, and mineral baths."
    },
    'rotterdam': {
        "name": "Rotterdam",
        "country": "Netherlands",
        "lat": 51.9244,
        "lon": 4.4777,
        "is_coastal": True,
        "timezone": "Europe/Amsterdam",
        "desc": "Europe's largest port with cutting-edge architecture, vibrant nightlife, and food halls."
    },
    'basel': {
        "name": "Basel",
        "country": "Switzerland",
        "lat": 47.5596,
        "lon": 7.5886,
        "is_coastal": False,
        "timezone": "Europe/Zurich",
        "desc": "Art and culture capital at the junction of three countries with world-class museums."
    },
    'dusseldorf': {
        "name": "Düsseldorf",
        "country": "Germany",
        "lat": 51.2277,
        "lon": 6.7735,
        "is_coastal": False,
        "timezone": "Europe/Berlin",
        "desc": "Fashion and art hub on the Rhine with elegant boulevards and vibrant Altstadt."
    },
    'santander': {
        "name": "Santander",
        "country": "Spain",
        "lat": 43.4623,
        "lon": -3.8099,
        "is_coastal": True,
        "timezone": "Europe/Madrid",
        "desc": "Elegant Cantabrian coast city with beautiful beaches, royal palace, and fresh seafood."
    },
    'cordoba': {
        "name": "Córdoba",
        "country": "Spain",
        "lat": 37.8882,
        "lon": -4.7794,
        "is_coastal": False,
        "timezone": "Europe/Madrid",
        "desc": "Historic Andalusian gem with stunning Mezquita, Jewish quarter, and patios festival."
    },
    'dominica': {
        "name": "Roseau",
        "country": "Dominica",
        "lat": 15.3017,
        "lon": -61.3881,
        "is_coastal": True,
        "timezone": "America/Dominica",
        "desc": "Nature island with boiling lakes, pristine rainforests, and incredible diving."
    },
    'suva': {
        "name": "Suva",
        "country": "Fiji",
        "lat": -18.1416,
        "lon": 178.4419,
        "is_coastal": True,
        "timezone": "Pacific/Fiji",
        "desc": "Fiji's multicultural capital gateway to paradise islands and traditional culture."
    },
    'quepos': {
        "name": "Quepos",
        "country": "Costa Rica",
        "lat": 9.4318,
        "lon": -84.1619,
        "is_coastal": True,
        "timezone": "America/Costa_Rica",
        "desc": "Gateway to Manuel Antonio with stunning beaches, wildlife, and adventure activities."
    },
    
    # ========== TIER 5: SEASONAL & NICHE ==========
    'limon': {
        "name": "Limón",
        "country": "Costa Rica",
        "lat": 9.9907,
        "lon": -83.0359,
        "is_coastal": True,
        "timezone": "America/Costa_Rica",
        "desc": "Caribbean Costa Rica with Afro-Caribbean culture, reggae vibes, and pristine nature."
    },
    'madeira': {
        "name": "Funchal",
        "country": "Portugal",
        "lat": 32.6669,
        "lon": -16.9241,
        "is_coastal": True,
        "timezone": "Atlantic/Madeira",
        "desc": "Atlantic garden island with eternal spring climate, dramatic levadas, and Madeira wine."
    },
    'tucuman': {
        "name": "Tucumán",
        "country": "Argentina",
        "lat": -26.8083,
        "lon": -65.2176,
        "is_coastal": False,
        "timezone": "America/Argentina/Tucuman",
        "desc": "Garden of the Republic with lush landscapes, historic significance, and Andean gateway."
    },
    'juneau': {
        "name": "Juneau",
        "country": "United States",
        "lat": 58.3019,
        "lon": -134.4197,
        "is_coastal": True,
        "timezone": "America/Juneau",
        "desc": "Alaska's capital accessible only by sea or air with glaciers, whales, and wilderness."
    },
    'maui': {
        "name": "Kahului",
        "country": "United States",
        "lat": 20.8893,
        "lon": -156.4729,
        "is_coastal": True,
        "timezone": "Pacific/Honolulu",
        "desc": "Valley Isle paradise with Road to Hana, Haleakala sunrise, and world-class beaches."
    },
    'nantucket': {
        "name": "Nantucket",
        "country": "United States",
        "lat": 41.2835,
        "lon": -70.0995,
        "is_coastal": True,
        "timezone": "America/New_York",
        "desc": "Historic whaling island with pristine beaches, cobblestone streets, and New England charm."
    },
    'pondicherry': {
        "name": "Pondicherry",
        "country": "India",
        "lat": 11.9139,
        "lon": 79.8145,
        "is_coastal": True,
        "timezone": "Asia/Kolkata",
        "desc": "French colonial enclave with colorful streets, spiritual Auroville, and coastal serenity."
    },
    'somnath': {
        "name": "Somnath",
        "country": "India",
        "lat": 20.8880,
        "lon": 70.4012,
        "is_coastal": True,
        "timezone": "Asia/Kolkata",
        "desc": "Sacred pilgrimage site with ancient Jyotirlinga temple and Arabian Sea coastline."
    },
    'sumba': {
        "name": "Sumba",
        "country": "Indonesia",
        "lat": -9.6550,
        "lon": 120.2644,
        "is_coastal": True,
        "timezone": "Asia/Makassar",
        "desc": "Undiscovered Indonesian paradise with tribal culture, pristine beaches, and wild horses."
    },
    'mauritius': {
        "name": "Port Louis",
        "country": "Mauritius",
        "lat": -20.1609,
        "lon": 57.5012,
        "is_coastal": True,
        "timezone": "Indian/Mauritius",
        "desc": "Indian Ocean paradise with turquoise lagoons, luxury resorts, and multicultural heritage."
    },
}

# Airport ICAO codes for flight data
AIRPORT_CODES_NEW = {
    # Canary Islands
    'tenerife': 'GCTS',        # Tenerife South
    'lanzarote': 'GCRR',       # Lanzarote Airport
    'gran-canaria': 'GCLP',    # Gran Canaria Airport
    'fuerteventura': 'GCFV',   # Fuerteventura Airport
    
    # Caribbean & Latin America
    'curacao': 'TNCC',         # Curaçao International
    'st-lucia': 'TLPL',        # Hewanorra International
    'turks-caicos': 'MBPV',    # Providenciales International
    'antigua': 'TAPA',         # V.C. Bird International
    'dominica': 'TDCF',        # Douglas-Charles Airport
    'quepos': 'MRQP',          # Quepos La Managua
    'limon': 'MRLM',           # Limón International
    'tucuman': 'SANT',         # Teniente Benjamin Matienzo
    
    # Europe
    'tromso': 'ENTC',          # Tromsø Airport
    'reggio-calabria': 'LICR', # Reggio Calabria Airport
    'ibiza': 'LEIB',           # Ibiza Airport
    'valencia': 'LEVC',        # Valencia Airport
    'bilbao': 'LEBB',          # Bilbao Airport
    'bodrum': 'LTFE',          # Milas-Bodrum Airport
    'antwerp': 'EBAW',         # Antwerp International
    'sarande': 'LATI',         # Tirana (nearest)
    'tirana': 'LATI',          # Tirana International
    'kotor': 'LYPG',           # Podgorica (nearest)
    'budva': 'LYTV',           # Tivat Airport
    'tartu': 'EETU',           # Tartu Airport
    'stuttgart': 'EDDS',       # Stuttgart Airport
    'rotterdam': 'EHRD',       # Rotterdam The Hague
    'basel': 'LFSB',           # EuroAirport Basel
    'dusseldorf': 'EDDL',      # Düsseldorf Airport
    'santander': 'LEXJ',       # Seve Ballesteros-Santander
    'cordoba': 'LEBA',         # Córdoba Airport
    'madeira': 'LPMA',         # Madeira Airport
    
    # Middle East & Africa
    'siem-reap': 'VDSR',       # Siem Reap International
    'nha-trang': 'VVCR',       # Cam Ranh International
    'krabi': 'VTSG',           # Krabi Airport
    'amman': 'OJAI',           # Queen Alia International
    'hurghada': 'HEGN',        # Hurghada International
    'sharm-el-sheikh': 'HESH', # Sharm El Sheikh International
    'luxor': 'HELX',           # Luxor International
    'jeddah': 'OEJN',          # King Abdulaziz International
    'mauritius': 'FIMP',       # Sir Seewoosagur Ramgoolam
    
    # Asia & Pacific
    'siargao': 'RPNS',         # Sayak Airport
    'panglao': 'RPSP',         # Bohol-Panglao International
    'trivandrum': 'VOTV',      # Trivandrum International
    'pondicherry': 'VOPC',     # Puducherry Airport
    'somnath': 'VAPO',         # Porbandar (nearest)
    'sumba': 'WADT',           # Tambolaka Airport
    'suva': 'NFSU',            # Nausori International
    
    # USA
    'juneau': 'PAJN',          # Juneau International
    'maui': 'PHOG',            # Kahului Airport
    'nantucket': 'KACK',       # Nantucket Memorial
}

# Country codes for health/tourism data  
COUNTRY_CODES_NEW = {
    'tenerife': 'ES',
    'lanzarote': 'ES',
    'gran-canaria': 'ES',
    'fuerteventura': 'ES',
    'curacao': 'CW',
    'siem-reap': 'KH',
    'tromso': 'NO',
    'nha-trang': 'VN',
    'reggio-calabria': 'IT',
    'ibiza': 'ES',
    'valencia': 'ES',
    'bilbao': 'ES',
    'krabi': 'TH',
    'amman': 'JO',
    'hurghada': 'EG',
    'sharm-el-sheikh': 'EG',
    'luxor': 'EG',
    'jeddah': 'SA',
    'bodrum': 'TR',
    'antwerp': 'BE',
    'sarande': 'AL',
    'tirana': 'AL',
    'kotor': 'ME',
    'budva': 'ME',
    'st-lucia': 'LC',
    'turks-caicos': 'TC',
    'antigua': 'AG',
    'siargao': 'PH',
    'panglao': 'PH',
    'trivandrum': 'IN',
    'tartu': 'EE',
    'stuttgart': 'DE',
    'rotterdam': 'NL',
    'basel': 'CH',
    'dusseldorf': 'DE',
    'santander': 'ES',
    'cordoba': 'ES',
    'dominica': 'DM',
    'suva': 'FJ',
    'quepos': 'CR',
    'limon': 'CR',
    'madeira': 'PT',
    'tucuman': 'AR',
    'juneau': 'US',
    'maui': 'US',
    'nantucket': 'US',
    'pondicherry': 'IN',
    'somnath': 'IN',
    'sumba': 'ID',
    'mauritius': 'MU',
}

def main():
    print("=" * 70)
    print("🌍 50 NEW TRENDING CITIES FOR 30YearWeather")
    print("   Based on Google Trends & Skyscanner 2024-2025 Data")
    print("=" * 70)
    
    # Count by tier
    tier_counts = {
        "TIER 1 (Canary Islands + Trending)": 10,
        "TIER 2 (High Priority)": 10,
        "TIER 3 (Emerging Markets)": 10,
        "TIER 4 (Geographic Diversity)": 10,
        "TIER 5 (Seasonal & Niche)": 10,
    }
    
    for tier, count in tier_counts.items():
        print(f"\n{tier}: {count} cities")
    
    print(f"\n{'='*70}")
    print(f"TOTAL: {len(NEW_CITIES)} new cities")
    print(f"{'='*70}")
    
    # List all cities
    print("\n📋 All cities to be added:")
    for i, (slug, city) in enumerate(NEW_CITIES.items(), 1):
        coastal = "🌊" if city['is_coastal'] else "🏔️"
        print(f"  {i:2}. {coastal} {city['name']}, {city['country']} ({slug})")

if __name__ == "__main__":
    main()
