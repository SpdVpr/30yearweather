/**
 * Complete list of coastal cities with marine data coordinates and sea/ocean names
 * 
 * This file serves as the source of truth for:
 * 1. Marine API coordinates (must be on water, not land)
 * 2. Sea/Ocean names for frontend display
 * 
 * Coordinates are set to be clearly offshore (50-100km from coast) to ensure
 * ERA5-Ocean coverage at ~0.5° resolution.
 */

const COASTAL_CITIES_MARINE = {
    // ========== ATLANTIC OCEAN ==========

    // Canary Islands (Spain)
    'tenerife': {
        marine_lat: 28.00, marine_lon: -17.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlántico'
    },
    'fuerteventura': {
        marine_lat: 28.20, marine_lon: -14.80,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlántico'
    },
    'gran-canaria': {
        marine_lat: 27.80, marine_lon: -16.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlántico'
    },
    'lanzarote': {
        marine_lat: 29.20, marine_lon: -13.90,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlántico'
    },
    'las-palmas': {
        marine_lat: 27.80, marine_lon: -16.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlántico'
    },

    // Madeira & Azores (Portugal)
    'madeira': {
        marine_lat: 32.50, marine_lon: -17.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlântico'
    },

    // Portugal
    'lisbon': {
        marine_lat: 38.50, marine_lon: -10.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlântico'
    },
    'porto': {
        marine_lat: 41.00, marine_lon: -9.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlântico'
    },

    // Spain - Bay of Biscay & Atlantic
    'bilbao': {
        marine_lat: 44.00, marine_lon: -3.50,
        sea_name: 'Bay of Biscay',
        sea_name_local: 'Golfo de Vizcaya'
    },
    'santander': {
        marine_lat: 44.00, marine_lon: -4.00,
        sea_name: 'Bay of Biscay',
        sea_name_local: 'Golfo de Vizcaya'
    },
    'san-sebastian': {
        marine_lat: 44.00, marine_lon: -2.00,
        sea_name: 'Bay of Biscay',
        sea_name_local: 'Golfo de Vizcaya'
    },

    // France - Bay of Biscay
    'bordeaux': {
        marine_lat: 45.50, marine_lon: -2.00,
        sea_name: 'Bay of Biscay',
        sea_name_local: 'Golfe de Gascogne'
    },

    // UK & Ireland
    'dublin': {
        marine_lat: 53.20, marine_lon: -5.80,
        sea_name: 'Irish Sea',
        sea_name_local: 'Irish Sea'
    },
    'edinburgh': {
        marine_lat: 56.00, marine_lon: -2.50,
        sea_name: 'North Sea',
        sea_name_local: 'North Sea'
    },

    // Netherlands
    'rotterdam': {
        marine_lat: 52.50, marine_lon: 3.50,
        sea_name: 'North Sea',
        sea_name_local: 'Noordzee'
    },
    'amsterdam': {
        marine_lat: 52.80, marine_lon: 4.00,
        sea_name: 'North Sea',
        sea_name_local: 'Noordzee'
    },

    // Scandinavia
    'bergen': {
        marine_lat: 60.00, marine_lon: 4.00,
        sea_name: 'North Sea',
        sea_name_local: 'Nordsjøen'
    },
    'oslo': {
        marine_lat: 59.00, marine_lon: 10.50,
        sea_name: 'Skagerrak',
        sea_name_local: 'Skagerrak'
    },
    'copenhagen': {
        marine_lat: 55.50, marine_lon: 12.00,
        sea_name: 'Øresund Strait',
        sea_name_local: 'Øresund'
    },
    'stockholm': {
        marine_lat: 59.00, marine_lon: 19.00,
        sea_name: 'Baltic Sea',
        sea_name_local: 'Östersjön'
    },
    'helsinki': {
        marine_lat: 59.80, marine_lon: 24.50,
        sea_name: 'Gulf of Finland',
        sea_name_local: 'Suomenlahti'
    },
    'tallinn': {
        marine_lat: 59.30, marine_lon: 24.00,
        sea_name: 'Gulf of Finland',
        sea_name_local: 'Soome laht'
    },
    'riga': {
        marine_lat: 57.00, marine_lon: 23.50,
        sea_name: 'Gulf of Riga',
        sea_name_local: 'Rīgas līcis'
    },
    'tromso': {
        marine_lat: 70.00, marine_lon: 18.00,
        sea_name: 'Norwegian Sea',
        sea_name_local: 'Norskehavet'
    },

    // Iceland
    'reykjavik': {
        marine_lat: 64.00, marine_lon: -23.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantshafið'
    },

    // USA - Atlantic
    'boston': {
        marine_lat: 42.00, marine_lon: -70.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },
    'new-york': {
        marine_lat: 40.20, marine_lon: -73.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },
    'miami': {
        marine_lat: 25.50, marine_lon: -79.80,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },
    'nantucket': {
        marine_lat: 41.00, marine_lon: -69.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },

    // Bermuda
    'hamilton': {
        marine_lat: 32.00, marine_lon: -65.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },

    // Brazil - Atlantic
    'rio-de-janeiro': {
        marine_lat: -23.50, marine_lon: -42.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Oceano Atlântico'
    },
    'florianopolis': {
        marine_lat: -27.80, marine_lon: -47.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Oceano Atlântico'
    },
    'salvador': {
        marine_lat: -13.00, marine_lon: -37.80,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Oceano Atlântico'
    },
    'fortaleza': {
        marine_lat: -3.50, marine_lon: -37.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Oceano Atlântico'
    },

    // Argentina
    'buenos-aires': {
        marine_lat: -35.50, marine_lon: -56.00,
        sea_name: 'Río de la Plata',
        sea_name_local: 'Río de la Plata'
    },

    // Morocco
    'casablanca': {
        marine_lat: 33.20, marine_lon: -8.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'المحيط الأطلسي'
    },

    // ========== MEDITERRANEAN SEA ==========

    // Spain - Mediterranean
    'barcelona': {
        marine_lat: 41.00, marine_lon: 2.50,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Mar Mediterráneo'
    },
    'valencia': {
        marine_lat: 39.00, marine_lon: 0.50,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Mar Mediterráneo'
    },
    'malaga': {
        marine_lat: 36.50, marine_lon: -4.00,
        sea_name: 'Alboran Sea',
        sea_name_local: 'Mar de Alborán'
    },
    'ibiza': {
        marine_lat: 38.50, marine_lon: 2.00,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Mar Mediterráneo'
    },
    'palma-mallorca': {
        marine_lat: 39.20, marine_lon: 3.00,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Mar Mediterráneo'
    },

    // France - Mediterranean
    'marseille': {
        marine_lat: 42.80, marine_lon: 5.50,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Mer Méditerranée'
    },
    'nice': {
        marine_lat: 43.50, marine_lon: 7.50,
        sea_name: 'Ligurian Sea',
        sea_name_local: 'Mer Ligure'
    },

    // Italy
    'naples': {
        marine_lat: 40.50, marine_lon: 14.50,
        sea_name: 'Tyrrhenian Sea',
        sea_name_local: 'Mar Tirreno'
    },
    'reggio-calabria': {
        marine_lat: 38.00, marine_lon: 16.00,
        sea_name: 'Ionian Sea',
        sea_name_local: 'Mar Ionio'
    },
    'venice': {
        marine_lat: 45.00, marine_lon: 13.00,
        sea_name: 'Adriatic Sea',
        sea_name_local: 'Mare Adriatico'
    },

    // Malta
    'valletta': {
        marine_lat: 35.50, marine_lon: 14.80,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Baħar Mediterran'
    },

    // Croatia
    'split': {
        marine_lat: 43.00, marine_lon: 16.50,
        sea_name: 'Adriatic Sea',
        sea_name_local: 'Jadransko more'
    },
    'dubrovnik': {
        marine_lat: 42.50, marine_lon: 18.00,
        sea_name: 'Adriatic Sea',
        sea_name_local: 'Jadransko more'
    },

    // Montenegro
    'budva': {
        marine_lat: 42.00, marine_lon: 18.50,
        sea_name: 'Adriatic Sea',
        sea_name_local: 'Jadransko more'
    },
    'kotor': {
        marine_lat: 42.20, marine_lon: 18.50,
        sea_name: 'Adriatic Sea',
        sea_name_local: 'Jadransko more'
    },

    // Albania
    'sarande': {
        marine_lat: 39.50, marine_lon: 19.50,
        sea_name: 'Ionian Sea',
        sea_name_local: 'Deti Jon'
    },

    // Greece
    'athens': {
        marine_lat: 37.50, marine_lon: 24.00,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Αιγαίο Πέλαγος'
    },
    'thessaloniki': {
        marine_lat: 40.00, marine_lon: 23.50,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Αιγαίο Πέλαγος'
    },
    'crete': {
        marine_lat: 35.00, marine_lon: 25.00,
        sea_name: 'Sea of Crete',
        sea_name_local: 'Κρητικό Πέλαγος'
    },
    'santorini': {
        marine_lat: 36.20, marine_lon: 25.70,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Αιγαίο Πέλαγος'
    },
    'mykonos': {
        marine_lat: 37.50, marine_lon: 25.50,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Αιγαίο Πέλαγος'
    },
    'rhodes': {
        marine_lat: 36.00, marine_lon: 28.50,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Αιγαίο Πέλαγος'
    },

    // Turkey
    'istanbul': {
        marine_lat: 40.80, marine_lon: 29.50,
        sea_name: 'Sea of Marmara',
        sea_name_local: 'Marmara Denizi'
    },
    'antalya': {
        marine_lat: 36.50, marine_lon: 31.00,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'Akdeniz'
    },
    'bodrum': {
        marine_lat: 36.80, marine_lon: 27.80,
        sea_name: 'Aegean Sea',
        sea_name_local: 'Ege Denizi'
    },

    // Israel
    'tel-aviv': {
        marine_lat: 32.00, marine_lon: 34.00,
        sea_name: 'Mediterranean Sea',
        sea_name_local: 'הים התיכון'
    },

    // ========== RED SEA ==========

    // Egypt
    'hurghada': {
        marine_lat: 27.00, marine_lon: 34.50,
        sea_name: 'Red Sea',
        sea_name_local: 'البحر الأحمر'
    },
    'sharm-el-sheikh': {
        marine_lat: 27.50, marine_lon: 34.80,
        sea_name: 'Red Sea',
        sea_name_local: 'البحر الأحمر'
    },

    // Saudi Arabia
    'jeddah': {
        marine_lat: 21.00, marine_lon: 38.50,
        sea_name: 'Red Sea',
        sea_name_local: 'البحر الأحمر'
    },

    // ========== CARIBBEAN SEA ==========

    // Caribbean Islands
    'antigua': {
        marine_lat: 16.50, marine_lon: -62.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Caribbean Sea'
    },
    'dominica': {
        marine_lat: 15.00, marine_lon: -62.00,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Caribbean Sea'
    },
    'st-lucia': {
        marine_lat: 13.50, marine_lon: -61.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Caribbean Sea'
    },
    'curacao': {
        marine_lat: 11.80, marine_lon: -69.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Caribbean Sea'
    },
    'montego-bay': {
        marine_lat: 18.80, marine_lon: -78.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Caribbean Sea'
    },
    'nassau': {
        marine_lat: 24.80, marine_lon: -78.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },
    'turks-caicos': {
        marine_lat: 21.50, marine_lon: -72.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },
    'san-juan': {
        marine_lat: 18.00, marine_lon: -66.50,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Océano Atlántico'
    },
    'punta-cana': {
        marine_lat: 18.00, marine_lon: -68.00,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Mar Caribe'
    },
    'havana': {
        marine_lat: 23.50, marine_lon: -82.00,
        sea_name: 'Gulf of Mexico',
        sea_name_local: 'Golfo de México'
    },
    'cancun': {
        marine_lat: 21.50, marine_lon: -86.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Mar Caribe'
    },
    'tulum': {
        marine_lat: 20.00, marine_lon: -87.00,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Mar Caribe'
    },

    // Central America
    'limon': {
        marine_lat: 9.50, marine_lon: -82.50,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Mar Caribe'
    },
    'quepos': {
        marine_lat: 9.00, marine_lon: -84.80,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Océano Pacífico'
    },
    'cartagena': {
        marine_lat: 10.00, marine_lon: -76.00,
        sea_name: 'Caribbean Sea',
        sea_name_local: 'Mar Caribe'
    },

    // USA - Gulf of Mexico
    'new-orleans': {
        marine_lat: 29.00, marine_lon: -89.00,
        sea_name: 'Gulf of Mexico',
        sea_name_local: 'Gulf of Mexico'
    },

    // ========== PACIFIC OCEAN ==========

    // USA - Pacific
    'los-angeles': {
        marine_lat: 33.50, marine_lon: -118.50,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },
    'san-francisco': {
        marine_lat: 37.50, marine_lon: -123.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },
    'seattle': {
        marine_lat: 47.80, marine_lon: -123.00,
        sea_name: 'Puget Sound',
        sea_name_local: 'Puget Sound'
    },
    'vancouver': {
        marine_lat: 49.00, marine_lon: -124.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },

    // Hawaii
    'honolulu': {
        marine_lat: 21.00, marine_lon: -158.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Ka Moana Pakipika'
    },
    'maui': {
        marine_lat: 20.50, marine_lon: -157.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Ka Moana Pakipika'
    },

    // Pacific Islands
    'bora-bora': {
        marine_lat: -16.70, marine_lon: -151.80,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Moana Pātitifā'
    },
    'papeete': {
        marine_lat: -17.80, marine_lon: -149.80,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Moana Pātitifā'
    },
    'nadi': {
        marine_lat: -17.50, marine_lon: 177.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },
    'suva': {
        marine_lat: -18.50, marine_lon: 179.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },

    // Japan
    'tokyo': {
        marine_lat: 35.00, marine_lon: 140.50,
        sea_name: 'Pacific Ocean',
        sea_name_local: '太平洋'
    },
    'osaka': {
        marine_lat: 34.00, marine_lon: 135.50,
        sea_name: 'Osaka Bay',
        sea_name_local: '大阪湾'
    },
    'fukuoka': {
        marine_lat: 33.50, marine_lon: 130.00,
        sea_name: 'Sea of Japan',
        sea_name_local: '日本海'
    },
    'naha': {
        marine_lat: 26.00, marine_lon: 128.00,
        sea_name: 'East China Sea',
        sea_name_local: '東シナ海'
    },

    // South Korea
    'busan': {
        marine_lat: 35.00, marine_lon: 129.50,
        sea_name: 'Sea of Japan',
        sea_name_local: '동해'
    },

    // China
    'shanghai': {
        marine_lat: 30.80, marine_lon: 123.00,
        sea_name: 'East China Sea',
        sea_name_local: '东海'
    },
    'hong-kong': {
        marine_lat: 22.00, marine_lon: 114.50,
        sea_name: 'South China Sea',
        sea_name_local: '南海'
    },

    // Taiwan
    'taipei': {
        marine_lat: 25.50, marine_lon: 122.00,
        sea_name: 'East China Sea',
        sea_name_local: '東海'
    },

    // Philippines
    'manila': {
        marine_lat: 14.00, marine_lon: 121.00,
        sea_name: 'Manila Bay',
        sea_name_local: 'Dagat Luzon'
    },
    'cebu': {
        marine_lat: 10.00, marine_lon: 124.00,
        sea_name: 'Cebu Strait',
        sea_name_local: 'Cebu Strait'
    },
    'palawan': {
        marine_lat: 9.50, marine_lon: 118.00,
        sea_name: 'South China Sea',
        sea_name_local: 'West Philippine Sea'
    },
    'panglao': {
        marine_lat: 9.30, marine_lon: 124.00,
        sea_name: 'Bohol Sea',
        sea_name_local: 'Dagat ng Bohol'
    },
    'siargao': {
        marine_lat: 10.00, marine_lon: 126.50,
        sea_name: 'Philippine Sea',
        sea_name_local: 'Dagat Pilipinas'
    },

    // Indonesia
    'bali': {
        marine_lat: -8.50, marine_lon: 115.50,
        sea_name: 'Bali Sea',
        sea_name_local: 'Laut Bali'
    },
    'lombok': {
        marine_lat: -8.80, marine_lon: 116.50,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Samudra Hindia'
    },
    'jakarta': {
        marine_lat: -6.00, marine_lon: 107.00,
        sea_name: 'Java Sea',
        sea_name_local: 'Laut Jawa'
    },
    'sumba': {
        marine_lat: -10.20, marine_lon: 120.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Samudra Hindia'
    },

    // Vietnam
    'hoi-an': {
        marine_lat: 15.80, marine_lon: 109.00,
        sea_name: 'South China Sea',
        sea_name_local: 'Biển Đông'
    },
    'nha-trang': {
        marine_lat: 12.00, marine_lon: 110.00,
        sea_name: 'South China Sea',
        sea_name_local: 'Biển Đông'
    },
    'da-nang': {
        marine_lat: 16.00, marine_lon: 109.00,
        sea_name: 'South China Sea',
        sea_name_local: 'Biển Đông'
    },

    // Thailand
    'phuket': {
        marine_lat: 7.50, marine_lon: 98.00,
        sea_name: 'Andaman Sea',
        sea_name_local: 'ทะเลอันดามัน'
    },
    'krabi': {
        marine_lat: 7.50, marine_lon: 98.50,
        sea_name: 'Andaman Sea',
        sea_name_local: 'ทะเลอันดามัน'
    },

    // Malaysia
    'langkawi': {
        marine_lat: 6.50, marine_lon: 99.50,
        sea_name: 'Andaman Sea',
        sea_name_local: 'Laut Andaman'
    },
    'penang': {
        marine_lat: 5.20, marine_lon: 100.00,
        sea_name: 'Strait of Malacca',
        sea_name_local: 'Selat Melaka'
    },

    // Singapore
    'singapore': {
        marine_lat: 1.00, marine_lon: 104.00,
        sea_name: 'Singapore Strait',
        sea_name_local: 'Singapore Strait'
    },

    // ========== INDIAN OCEAN ==========

    // Maldives
    'male': {
        marine_lat: 4.00, marine_lon: 73.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Indian Ocean'
    },

    // Sri Lanka
    'colombo': {
        marine_lat: 6.50, marine_lon: 79.50,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Indian Ocean'
    },

    // India
    'mumbai': {
        marine_lat: 18.80, marine_lon: 72.00,
        sea_name: 'Arabian Sea',
        sea_name_local: 'अरब सागर'
    },
    'goa': {
        marine_lat: 15.00, marine_lon: 73.00,
        sea_name: 'Arabian Sea',
        sea_name_local: 'अरब सागर'
    },
    'kochi': {
        marine_lat: 9.50, marine_lon: 75.50,
        sea_name: 'Arabian Sea',
        sea_name_local: 'അറബിക്കടൽ'
    },
    'trivandrum': {
        marine_lat: 8.00, marine_lon: 76.00,
        sea_name: 'Arabian Sea',
        sea_name_local: 'അറബിക്കടൽ'
    },
    'pondicherry': {
        marine_lat: 11.50, marine_lon: 80.50,
        sea_name: 'Bay of Bengal',
        sea_name_local: 'வங்காள விரிகுடா'
    },
    'somnath': {
        marine_lat: 20.50, marine_lon: 69.50,
        sea_name: 'Arabian Sea',
        sea_name_local: 'अरब सागर'
    },

    // UAE & Gulf
    'dubai': {
        marine_lat: 25.00, marine_lon: 55.50,
        sea_name: 'Persian Gulf',
        sea_name_local: 'الخليج العربي'
    },
    'abu-dhabi': {
        marine_lat: 24.00, marine_lon: 54.00,
        sea_name: 'Persian Gulf',
        sea_name_local: 'الخليج العربي'
    },
    'doha': {
        marine_lat: 25.50, marine_lon: 51.80,
        sea_name: 'Persian Gulf',
        sea_name_local: 'الخليج العربي'
    },
    'muscat': {
        marine_lat: 23.00, marine_lon: 59.00,
        sea_name: 'Gulf of Oman',
        sea_name_local: 'خليج عمان'
    },
    'ras-al-khaimah': {
        marine_lat: 26.00, marine_lon: 56.00,
        sea_name: 'Persian Gulf',
        sea_name_local: 'الخليج العربي'
    },

    // Mauritius & East Africa
    'mauritius': {
        marine_lat: -20.50, marine_lon: 58.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Indian Ocean'
    },
    'zanzibar': {
        marine_lat: -6.50, marine_lon: 40.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Bahari ya Hindi'
    },
    'durban': {
        marine_lat: -30.00, marine_lon: 32.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Indian Ocean'
    },
    'cape-town': {
        marine_lat: -34.50, marine_lon: 18.00,
        sea_name: 'Atlantic Ocean',
        sea_name_local: 'Atlantic Ocean'
    },

    // ========== AUSTRALIA & NZ ==========

    'sydney': {
        marine_lat: -34.00, marine_lon: 152.00,
        sea_name: 'Tasman Sea',
        sea_name_local: 'Tasman Sea'
    },
    'melbourne': {
        marine_lat: -38.50, marine_lon: 145.50,
        sea_name: 'Bass Strait',
        sea_name_local: 'Bass Strait'
    },
    'brisbane': {
        marine_lat: -27.00, marine_lon: 154.00,
        sea_name: 'Coral Sea',
        sea_name_local: 'Coral Sea'
    },
    'gold-coast': {
        marine_lat: -28.50, marine_lon: 154.00,
        sea_name: 'Coral Sea',
        sea_name_local: 'Coral Sea'
    },
    'cairns': {
        marine_lat: -16.50, marine_lon: 146.50,
        sea_name: 'Coral Sea',
        sea_name_local: 'Coral Sea'
    },
    'perth': {
        marine_lat: -32.00, marine_lon: 115.00,
        sea_name: 'Indian Ocean',
        sea_name_local: 'Indian Ocean'
    },
    'adelaide': {
        marine_lat: -35.00, marine_lon: 137.50,
        sea_name: 'Gulf St Vincent',
        sea_name_local: 'Gulf St Vincent'
    },
    'auckland': {
        marine_lat: -37.00, marine_lon: 175.50,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Te Moananui-a-Kiwa'
    },
    'christchurch': {
        marine_lat: -43.80, marine_lon: 173.50,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Pacific Ocean'
    },

    // South America - Pacific
    'lima': {
        marine_lat: -12.50, marine_lon: -78.00,
        sea_name: 'Pacific Ocean',
        sea_name_local: 'Océano Pacífico'
    },

    // Canada
    'toronto': {
        marine_lat: 43.50, marine_lon: -79.00,
        sea_name: 'Lake Ontario',
        sea_name_local: 'Lake Ontario'
    },
};

module.exports = { COASTAL_CITIES_MARINE };
