"""
Generate mapping of old slugs (with country codes) to new slugs (without country codes)
This will be used to create redirects in next.config.js
"""

# Based on the migration logic and new_cities_config.py
# Old slugs had 2-letter country codes at the end

OLD_TO_NEW_SLUG_MAPPING = {
    # North America
    'new-york-us': 'new-york',
    'los-angeles-us': 'los-angeles',
    'san-francisco-us': 'san-francisco',
    'miami-us': 'miami',
    'vancouver-ca': 'vancouver',
    'toronto-ca': 'toronto',
    'mexico-city-mx': 'mexico-city',
    'chicago-us': 'chicago',
    'boston-us': 'boston',
    'las-vegas-us': 'las-vegas',
    'honolulu-us': 'honolulu',
    'montreal-ca': 'montreal',
    'calgary-ca': 'calgary',
    'new-orleans-us': 'new-orleans',
    
    # South America
    'rio-de-janeiro-br': 'rio-de-janeiro',
    'buenos-aires-ar': 'buenos-aires',
    'lima-pe': 'lima',
    'santiago-cl': 'santiago',
    'bogota-co': 'bogota',
    'sao-paulo-br': 'sao-paulo',
    'quito-ec': 'quito',
    'cusco-pe': 'cusco',
    'san-jose-cr': 'san-jose-cr',  # Already correct
    'cartagena-co': 'cartagena',
    
    # Europe
    'prague-cz': 'prague',
    'berlin-de': 'berlin',
    'london-uk': 'london',
    'paris-fr': 'paris',
    'rome-it': 'rome',
    'barcelona-es': 'barcelona',
    'vienna-at': 'vienna',
    'zurich-ch': 'zurich',
    'athens-gr': 'athens',
    'amsterdam-nl': 'amsterdam',
    'madrid-es': 'madrid',
    'brussels-be': 'brussels',
    'warsaw-pl': 'warsaw',
    'budapest-hu': 'budapest',
    'lisbon-pt': 'lisbon',
    'dublin-ie': 'dublin',
    'stockholm-se': 'stockholm',
    'copenhagen-dk': 'copenhagen',
    'oslo-no': 'oslo',
    'helsinki-fi': 'helsinki',
    'bratislava-sk': 'bratislava',
    'istanbul-tr': 'istanbul',
    'edinburgh-uk': 'edinburgh',
    'munich-de': 'munich',
    'venice-it': 'venice',
    'krakow-pl': 'krakow',
    'porto-pt': 'porto',
    'hamburg-de': 'hamburg',
    'seville-es': 'seville',
    'naples-it': 'naples',
    'valletta-mt': 'valletta',
    'rhodes-gr': 'rhodes',
    'sofia-bg': 'sofia',
    'riga-lv': 'riga',
    'lyon-fr': 'lyon',
    'nice-fr': 'nice',
    'dubrovnik-hr': 'dubrovnik',
    'santorini-gr': 'santorini',
    'palma-mallorca-es': 'palma-mallorca',
    'reykjavik-is': 'reykjavik',
    'innsbruck-at': 'innsbruck',
    'interlaken-ch': 'interlaken',
    
    # Asia
    'tokyo-jp': 'tokyo',
    'kyoto-jp': 'kyoto',
    'osaka-jp': 'osaka',
    'seoul-kr': 'seoul',
    'beijing-cn': 'beijing',
    'shanghai-cn': 'shanghai',
    'hong-kong-hk': 'hong-kong',
    'taipei-tw': 'taipei',
    'bangkok-th': 'bangkok',
    'phuket-th': 'phuket',
    'chiang-mai-th': 'chiang-mai',
    'singapore-sg': 'singapore',
    'kuala-lumpur-my': 'kuala-lumpur',
    'hanoi-vn': 'hanoi',
    'ho-chi-minh-vn': 'ho-chi-minh',
    'jakarta-id': 'jakarta',
    'bali-id': 'bali',
    'manila-ph': 'manila',
    'mumbai-in': 'mumbai',
    'new-delhi-in': 'new-delhi',
    'dubai-ae': 'dubai',
    'sapporo-jp': 'sapporo',
    'busan-kr': 'busan',
    'chengdu-cn': 'chengdu',
    'kathmandu-np': 'kathmandu',
    'colombo-lk': 'colombo',
    'almaty-kz': 'almaty',
    'tashkent-uz': 'tashkent',
    'fukuoka-jp': 'fukuoka',
    'abu-dhabi-ae': 'abu-dhabi',
    'doha-qa': 'doha',
    'tel-aviv-il': 'tel-aviv',
    'muscat-om': 'muscat',
    'ras-al-khaimah-ae': 'ras-al-khaimah',
    'male-mv': 'male',
    
    # Oceania
    'sydney-au': 'sydney',
    'melbourne-au': 'melbourne',
    'auckland-nz': 'auckland',
    'brisbane-au': 'brisbane',
    'perth-au': 'perth',
    'christchurch-nz': 'christchurch',
    'nadi-fj': 'nadi',
    'papeete-pf': 'papeete',
    'queenstown-nz': 'queenstown',
    'bora-bora-pf': 'bora-bora',
    
    # Africa
    'cape-town-za': 'cape-town',
    'marrakech-ma': 'marrakech',
    'cairo-eg': 'cairo',
    'johannesburg-za': 'johannesburg',
    'nairobi-ke': 'nairobi',
    'casablanca-ma': 'casablanca',
    'zanzibar-tz': 'zanzibar',
    
    # Caribbean
    'cancun-mx': 'cancun',
    'punta-cana-do': 'punta-cana',
    'nassau-bs': 'nassau',
    'san-juan-pr': 'san-juan',
    'montego-bay-jm': 'montego-bay',
    
    # North America (Canada)
    'whistler-ca': 'whistler',
    'las-palmas-es': 'las-palmas',
}

if __name__ == "__main__":
    print("=" * 80)
    print("OLD SLUG TO NEW SLUG MAPPING")
    print("=" * 80)
    print(f"\nTotal mappings: {len(OLD_TO_NEW_SLUG_MAPPING)}\n")
    
    for old, new in sorted(OLD_TO_NEW_SLUG_MAPPING.items()):
        print(f"{old:30} -> {new}")

