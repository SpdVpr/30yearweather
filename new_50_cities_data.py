"""
50 nových měst pro 30YearWeather
Připravené pro import do backend/config.py a backend/etl_tourism.py
"""

NEW_CITIES = [
    # TIER 1: Nejvyšší priorita - Kanárské ostrovy
    {
        "name": "Tenerife",
        "country": "Spain",
        "country_code": "ES",
        "lat": 28.2916,
        "lon": -16.6291,
        "slug": "tenerife",
        "desc": "Largest Canary Island with year-round sunshine, Mount Teide volcano, and diverse landscapes.",
        "tier": 1,
        "search_volume": 110000
    },
    {
        "name": "Lanzarote",
        "country": "Spain",
        "country_code": "ES",
        "lat": 29.0469,
        "lon": -13.5900,
        "slug": "lanzarote",
        "desc": "Volcanic island paradise with unique lunar landscapes and pristine beaches.",
        "tier": 1,
        "search_volume": 74000
    },
    {
        "name": "Gran Canaria",
        "country": "Spain",
        "country_code": "ES",
        "lat": 27.9202,
        "lon": -15.5474,
        "slug": "gran-canaria",
        "desc": "Miniature continent with stunning dunes, diverse microclimates, and vibrant nightlife.",
        "tier": 1,
        "search_volume": 60000
    },
    {
        "name": "Fuerteventura",
        "country": "Spain",
        "country_code": "ES",
        "lat": 28.3587,
        "lon": -14.0537,
        "slug": "fuerteventura",
        "desc": "Wind and surf paradise with endless golden beaches and crystal-clear waters.",
        "tier": 1,
        "search_volume": 18000
    },
    # TIER 1: Karibik & Trending
    {
        "name": "Curaçao",
        "country": "Curaçao",
        "country_code": "CW",
        "lat": 12.1696,
        "lon": -68.9900,
        "slug": "curacao",
        "desc": "Dutch Caribbean gem with colorful Willemstad, pristine diving, and year-round sunshine.",
        "tier": 1,
        "search_volume": 22000
    },
    {
        "name": "Siem Reap",
        "country": "Cambodia",
        "country_code": "KH",
        "lat": 13.3671,
        "lon": 103.8448,
        "slug": "siem-reap",
        "desc": "Gateway to ancient Angkor Wat temples and rich Khmer cultural heritage.",
        "tier": 1,
        "search_volume": 27000
    },
    {
        "name": "Tromsø",
        "country": "Norway",
        "country_code": "NO",
        "lat": 69.6492,
        "lon": 18.9553,
        "slug": "tromso",
        "desc": "Arctic capital for Northern Lights, midnight sun, and pristine wilderness adventures.",
        "tier": 1,
        "search_volume": 18000
    },
    {
        "name": "Nha Trang",
        "country": "Vietnam",
        "country_code": "VN",
        "lat": 12.2388,
        "lon": 109.1967,
        "slug": "nha-trang",
        "desc": "Vietnam's coastal paradise with stunning beaches, vibrant nightlife, and island hopping.",
        "tier": 1,
        "search_volume": 14000
    },
    {
        "name": "Reggio Calabria",
        "country": "Italy",
        "country_code": "IT",
        "lat": 38.1112,
        "lon": 15.6467,
        "slug": "reggio-calabria",
        "desc": "Toe of Italy's boot with stunning Strait of Messina views and ancient Greek heritage.",
        "tier": 1,
        "search_volume": 8000
    },
    {
        "name": "Ibiza",
        "country": "Spain",
        "country_code": "ES",
        "lat": 38.9067,
        "lon": 1.4206,
        "slug": "ibiza",
        "desc": "World-famous party island with legendary clubs, beautiful beaches, and bohemian spirit.",
        "tier": 1,
        "search_volume": 49000
    },
    
    # TIER 2: Vysoká priorita
    {
        "name": "Valencia",
        "country": "Spain",
        "country_code": "ES",
        "lat": 39.4699,
        "lon": -0.3763,
        "slug": "valencia",
        "desc": "Mediterranean gem with 300 days of sunshine, futuristic architecture, and famous paella.",
        "tier": 2,
        "search_volume": 40000
    },
    {
        "name": "Bilbao",
        "country": "Spain",
        "country_code": "ES",
        "lat": 43.2630,
        "lon": -2.9350,
        "slug": "bilbao",
        "desc": "Basque cultural capital with iconic Guggenheim Museum and world-class gastronomy.",
        "tier": 2,
        "search_volume": 12000
    },
    {
        "name": "Krabi",
        "country": "Thailand",
        "country_code": "TH",
        "lat": 8.0863,
        "lon": 98.9063,
        "slug": "krabi",
        "desc": "Tropical paradise with dramatic limestone cliffs, island hopping, and pristine beaches.",
        "tier": 2,
        "search_volume": 22000
    },
    {
        "name": "Amman",
        "country": "Jordan",
        "country_code": "JO",
        "lat": 31.9454,
        "lon": 35.9284,
        "slug": "amman",
        "desc": "Ancient capital blending Roman ruins with modern Middle Eastern culture and cuisine.",
        "tier": 2,
        "search_volume": 18000
    },
    {
        "name": "Hurghada",
        "country": "Egypt",
        "country_code": "EG",
        "lat": 27.2579,
        "lon": 33.8116,
        "slug": "hurghada",
        "desc": "Red Sea resort paradise with world-class diving, coral reefs, and year-round sunshine.",
        "tier": 2,
        "search_volume": 33000
    },
    {
        "name": "Sharm El Sheikh",
        "country": "Egypt",
        "country_code": "EG",
        "lat": 27.9158,
        "lon": 34.3300,
        "slug": "sharm-el-sheikh",
        "desc": "Premier Red Sea destination with legendary diving sites and luxurious resorts.",
        "tier": 2,
        "search_volume": 27000
    },
    {
        "name": "Luxor",
        "country": "Egypt",
        "country_code": "EG",
        "lat": 25.6872,
        "lon": 32.6396,
        "slug": "luxor",
        "desc": "World's greatest open-air museum with ancient temples, tombs, and Nile cruises.",
        "tier": 2,
        "search_volume": 15000
    },
    {
        "name": "Jeddah",
        "country": "Saudi Arabia",
        "country_code": "SA",
        "lat": 21.4858,
        "lon": 39.1925,
        "slug": "jeddah",
        "desc": "Gateway to Mecca with historic Al-Balad district, Red Sea diving, and modern attractions.",
        "tier": 2,
        "search_volume": 22000
    },
    {
        "name": "Bodrum",
        "country": "Turkey",
        "country_code": "TR",
        "lat": 37.0344,
        "lon": 27.4305,
        "slug": "bodrum",
        "desc": "Turkish Riviera gem with ancient castle, azure waters, and sophisticated nightlife.",
        "tier": 2,
        "search_volume": 18000
    },
    {
        "name": "Antwerp",
        "country": "Belgium",
        "country_code": "BE",
        "lat": 51.2194,
        "lon": 4.4025,
        "slug": "antwerp",
        "desc": "Diamond capital with stunning architecture, world-class art, and vibrant fashion scene.",
        "tier": 2,
        "search_volume": 12000
    },
    
    # TIER 3: Střední priorita - Emerging markets
    {
        "name": "Sarandë",
        "country": "Albania",
        "country_code": "AL",
        "lat": 39.8661,
        "lon": 20.0050,
        "slug": "sarande",
        "desc": "Albanian Riviera jewel with crystal-clear Ionian waters and nearby ancient Butrint.",
        "tier": 3,
        "search_volume": 8000
    },
    {
        "name": "Tirana",
        "country": "Albania",
        "country_code": "AL",
        "lat": 41.3275,
        "lon": 19.8187,
        "slug": "tirana",
        "desc": "Colorful Albanian capital with vibrant café culture and fascinating post-communist history.",
        "tier": 3,
        "search_volume": 12000
    },
    {
        "name": "Kotor",
        "country": "Montenegro",
        "country_code": "ME",
        "lat": 42.4247,
        "lon": 18.7712,
        "slug": "kotor",
        "desc": "UNESCO fjord town with medieval old town, dramatic bay, and mountain fortress.",
        "tier": 3,
        "search_volume": 14000
    },
    {
        "name": "Budva",
        "country": "Montenegro",
        "country_code": "ME",
        "lat": 42.2911,
        "lon": 18.8403,
        "slug": "budva",
        "desc": "Montenegrin Miami with ancient walled town, beautiful beaches, and lively nightlife.",
        "tier": 3,
        "search_volume": 10000
    },
    {
        "name": "St. Lucia",
        "country": "Saint Lucia",
        "country_code": "LC",
        "lat": 13.9094,
        "lon": -60.9789,
        "slug": "st-lucia",
        "desc": "Volcanic paradise with iconic Pitons, lush rainforests, and romantic luxury resorts.",
        "tier": 3,
        "search_volume": 18000
    },
    {
        "name": "Providenciales",
        "country": "Turks and Caicos",
        "country_code": "TC",
        "lat": 21.7738,
        "lon": -72.2659,
        "slug": "turks-caicos",
        "desc": "Caribbean's best beaches with Grace Bay, luxury resorts, and pristine snorkeling.",
        "tier": 3,
        "search_volume": 15000
    },
    {
        "name": "St. John's",
        "country": "Antigua and Barbuda",
        "country_code": "AG",
        "lat": 17.1175,
        "lon": -61.8456,
        "slug": "antigua",
        "desc": "365 beaches island with British colonial heritage, sailing paradise, and sunny skies.",
        "tier": 3,
        "search_volume": 12000
    },
    {
        "name": "Siargao",
        "country": "Philippines",
        "country_code": "PH",
        "lat": 9.8483,
        "lon": 126.0458,
        "slug": "siargao",
        "desc": "Philippines' surfing capital with Cloud 9 waves, island hopping, and laid-back vibes.",
        "tier": 3,
        "search_volume": 12000
    },
    {
        "name": "Panglao",
        "country": "Philippines",
        "country_code": "PH",
        "lat": 9.5804,
        "lon": 123.7747,
        "slug": "panglao",
        "desc": "Bohol's beach paradise near Chocolate Hills, tarsiers, and world-class diving.",
        "tier": 3,
        "search_volume": 8000
    },
    {
        "name": "Thiruvananthapuram",
        "country": "India",
        "country_code": "IN",
        "lat": 8.5241,
        "lon": 76.9366,
        "slug": "trivandrum",
        "desc": "Kerala's capital gateway to backwaters, Ayurveda retreats, and tropical beaches.",
        "tier": 3,
        "search_volume": 10000
    },
    
    # TIER 4: Geografická diverzita
    {
        "name": "Tartu",
        "country": "Estonia",
        "country_code": "EE",
        "lat": 58.3780,
        "lon": 26.7290,
        "slug": "tartu",
        "desc": "Estonia's intellectual heart with historic university, charming old town, and bohemian spirit.",
        "tier": 4,
        "search_volume": 5000
    },
    {
        "name": "Stuttgart",
        "country": "Germany",
        "country_code": "DE",
        "lat": 48.7758,
        "lon": 9.1829,
        "slug": "stuttgart",
        "desc": "Automotive capital with Mercedes and Porsche museums, vineyards, and mineral baths.",
        "tier": 4,
        "search_volume": 12000
    },
    {
        "name": "Rotterdam",
        "country": "Netherlands",
        "country_code": "NL",
        "lat": 51.9244,
        "lon": 4.4777,
        "slug": "rotterdam",
        "desc": "Europe's largest port with cutting-edge architecture, vibrant nightlife, and food halls.",
        "tier": 4,
        "search_volume": 15000
    },
    {
        "name": "Basel",
        "country": "Switzerland",
        "country_code": "CH",
        "lat": 47.5596,
        "lon": 7.5886,
        "slug": "basel",
        "desc": "Art and culture capital at the junction of three countries with world-class museums.",
        "tier": 4,
        "search_volume": 10000
    },
    {
        "name": "Düsseldorf",
        "country": "Germany",
        "country_code": "DE",
        "lat": 51.2277,
        "lon": 6.7735,
        "slug": "dusseldorf",
        "desc": "Fashion and art hub on the Rhine with elegant boulevards and vibrant Altstadt.",
        "tier": 4,
        "search_volume": 12000
    },
    {
        "name": "Santander",
        "country": "Spain",
        "country_code": "ES",
        "lat": 43.4623,
        "lon": -3.8099,
        "slug": "santander",
        "desc": "Elegant Cantabrian coast city with beautiful beaches, royal palace, and fresh seafood.",
        "tier": 4,
        "search_volume": 8000
    },
    {
        "name": "Córdoba",
        "country": "Spain",
        "country_code": "ES",
        "lat": 37.8882,
        "lon": -4.7794,
        "slug": "cordoba",
        "desc": "Historic Andalusian gem with stunning Mezquita, Jewish quarter, and patios festival.",
        "tier": 4,
        "search_volume": 15000
    },
    {
        "name": "Roseau",
        "country": "Dominica",
        "country_code": "DM",
        "lat": 15.3017,
        "lon": -61.3881,
        "slug": "dominica",
        "desc": "Nature island with boiling lakes, pristine rainforests, and incredible diving.",
        "tier": 4,
        "search_volume": 6000
    },
    {
        "name": "Suva",
        "country": "Fiji",
        "country_code": "FJ",
        "lat": -18.1416,
        "lon": 178.4419,
        "slug": "suva",
        "desc": "Fiji's multicultural capital gateway to paradise islands and traditional culture.",
        "tier": 4,
        "search_volume": 5000
    },
    {
        "name": "Quepos",
        "country": "Costa Rica",
        "country_code": "CR",
        "lat": 9.4318,
        "lon": -84.1619,
        "slug": "quepos",
        "desc": "Gateway to Manuel Antonio with stunning beaches, wildlife, and adventure activities.",
        "tier": 4,
        "search_volume": 8000
    },
    
    # TIER 5: Sezónní a niche destinace
    {
        "name": "Limón",
        "country": "Costa Rica",
        "country_code": "CR",
        "lat": 9.9907,
        "lon": -83.0359,
        "slug": "limon",
        "desc": "Caribbean Costa Rica with Afro-Caribbean culture, reggae vibes, and pristine nature.",
        "tier": 5,
        "search_volume": 5000
    },
    {
        "name": "Funchal",
        "country": "Portugal",
        "country_code": "PT",
        "lat": 32.6669,
        "lon": -16.9241,
        "slug": "madeira",
        "desc": "Atlantic garden island with eternal spring climate, dramatic levadas, and Madeira wine.",
        "tier": 5,
        "search_volume": 22000
    },
    {
        "name": "Tucumán",
        "country": "Argentina",
        "country_code": "AR",
        "lat": -26.8083,
        "lon": -65.2176,
        "slug": "tucuman",
        "desc": "Garden of the Republic with lush landscapes, historic significance, and Andean gateway.",
        "tier": 5,
        "search_volume": 4000
    },
    {
        "name": "Juneau",
        "country": "United States",
        "country_code": "US",
        "lat": 58.3019,
        "lon": -134.4197,
        "slug": "juneau",
        "desc": "Alaska's capital accessible only by sea or air with glaciers, whales, and wilderness.",
        "tier": 5,
        "search_volume": 12000
    },
    {
        "name": "Kahului",
        "country": "United States",
        "country_code": "US",
        "lat": 20.8893,
        "lon": -156.4729,
        "slug": "maui",
        "desc": "Valley Isle paradise with Road to Hana, Haleakala sunrise, and world-class beaches.",
        "tier": 5,
        "search_volume": 40000
    },
    {
        "name": "Nantucket",
        "country": "United States",
        "country_code": "US",
        "lat": 41.2835,
        "lon": -70.0995,
        "slug": "nantucket",
        "desc": "Historic whaling island with pristine beaches, charming cobblestone streets, and New England charm.",
        "tier": 5,
        "search_volume": 10000
    },
    {
        "name": "Pondicherry",
        "country": "India",
        "country_code": "IN",
        "lat": 11.9139,
        "lon": 79.8145,
        "slug": "pondicherry",
        "desc": "French colonial enclave with colorful streets, spiritual Auroville, and coastal serenity.",
        "tier": 5,
        "search_volume": 12000
    },
    {
        "name": "Somnath",
        "country": "India",
        "country_code": "IN",
        "lat": 20.8880,
        "lon": 70.4012,
        "slug": "somnath",
        "desc": "Sacred pilgrimage site with ancient Jyotirlinga temple and Arabian Sea coastline.",
        "tier": 5,
        "search_volume": 8000
    },
    {
        "name": "Sumba",
        "country": "Indonesia",
        "country_code": "ID",
        "lat": -9.6550,
        "lon": 120.2644,
        "slug": "sumba",
        "desc": "Undiscovered Indonesian paradise with tribal culture, pristine beaches, and wild horses.",
        "tier": 5,
        "search_volume": 6000
    },
    {
        "name": "Port Louis",
        "country": "Mauritius",
        "country_code": "MU",
        "lat": -20.1609,
        "lon": 57.5012,
        "slug": "mauritius",
        "desc": "Indian Ocean paradise with turquoise lagoons, luxury resorts, and multicultural heritage.",
        "tier": 5,
        "search_volume": 18000
    },
]

# Pomocná funkce pro export do config.py formátu
def export_for_config():
    """Export cities for backend/config.py LOCATIONS list"""
    lines = []
    for city in NEW_CITIES:
        lines.append(f'''    {{
        "name": "{city['name']}",
        "country": "{city['country']}",
        "lat": {city['lat']},
        "lon": {city['lon']},
        "slug": "{city['slug']}",
        "desc": "{city['desc']}"
    }},''')
    return "\n".join(lines)

# Pomocná funkce pro export do etl_tourism.py formátu
def export_for_tourism():
    """Export cities for backend/etl_tourism.py LOCATIONS list"""
    lines = []
    for city in NEW_CITIES:
        lines.append(f'''    {{
        "slug": "{city['slug']}",
        "name": "{city['name']}",
        "country_code": "{city['country_code']}",
        "lat": {city['lat']},
        "lon": {city['lon']}
    }},''')
    return "\n".join(lines)

if __name__ == "__main__":
    print(f"=== 50 nových měst pro 30YearWeather ===")
    print(f"Celkem měst: {len(NEW_CITIES)}")
    print()
    
    # Statistiky podle tierů
    tier_stats = {}
    for city in NEW_CITIES:
        tier = city['tier']
        tier_stats[tier] = tier_stats.get(tier, 0) + 1
    
    print("Rozdělení podle priorit:")
    for tier in sorted(tier_stats.keys()):
        print(f"  TIER {tier}: {tier_stats[tier]} měst")
    
    print()
    print("Top 10 měst podle search volume:")
    sorted_cities = sorted(NEW_CITIES, key=lambda x: x['search_volume'], reverse=True)[:10]
    for i, city in enumerate(sorted_cities, 1):
        print(f"  {i}. {city['name']}: {city['search_volume']:,} searches/month")
