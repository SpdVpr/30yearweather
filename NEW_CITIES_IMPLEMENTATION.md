# 📍 24 NEW CITIES - IMPLEMENTATION GUIDE

## ✅ COMPLETED TASKS

### 1. Frontend Updated ✅
- **File**: `src/lib/data.ts`
- **Change**: Added 24 new cities to `getAllCities()` function
- **Status**: ✅ DONE - Frontend is ready for new city data

## 🔧 PENDING TASKS - ETL CONFIGURATION

### 2. Backend ETL - Weather Data
**File to edit**: `backend/etl.py`

**What to do**: Add the following cities to the `LOCATIONS` dictionary:

```python
# Add these entries to LOCATIONS in backend/etl.py:

# ======================== NORTH AMERICA (7) ========================
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

# ======================== SOUTH AMERICA (4) ========================
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

# ======================== OCEANIA (3) ========================
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

# ======================== AFRICA (2) ========================
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

# ======================== EUROPE (5) ========================
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

# ======================== ASIA (3) ========================
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
},
```

### 3. Backend ETL - Tourism Data
**File to edit**: `backend/etl_tourism.py`

**What to do**: Add the following to the `LOCATIONS` list:

```python
# Add these entries to LOCATIONS list in backend/etl_tourism.py:

# North America
{"slug": "new-york-us", "name": "New York", "country_code": "US", "lat": 40.7128, "lon": -74.0060},
{"slug": "los-angeles-us", "name": "Los Angeles", "country_code": "US", "lat": 34.0522, "lon": -118.2437},
{"slug": "san-francisco-us", "name": "San Francisco", "country_code": "US", "lat": 37.7749, "lon": -122.4194},
{"slug": "miami-us", "name": "Miami", "country_code": "US", "lat": 25.7617, "lon": -80.1918},
{"slug": "vancouver-ca", "name": "Vancouver", "country_code": "CA", "lat": 49.2827, "lon": -123.1207},
{"slug": "toronto-ca", "name": "Toronto", "country_code": "CA", "lat": 43.6532, "lon": -79.3832},
{"slug": "mexico-city-mx", "name": "Mexico City", "country_code": "MX", "lat": 19.4326, "lon": -99.1332},

# South America
{"slug": "rio-de-janeiro-br", "name": "Rio de Janeiro", "country_code": "BR", "lat": -22.9068, "lon": -43.1729},
{"slug": "buenos-aires-ar", "name": "Buenos Aires", "country_code": "AR", "lat": -34.6037, "lon": -58.3816},
{"slug": "lima-pe", "name": "Lima", "country_code": "PE", "lat": -12.0464, "lon": -77.0428},
{"slug": "santiago-cl", "name": "Santiago", "country_code": "CL", "lat": -33.4489, "lon": -70.6693},

# Oceania
{"slug": "sydney-au", "name": "Sydney", "country_code": "AU", "lat": -33.8688, "lon": 151.2093},
{"slug": "melbourne-au", "name": "Melbourne", "country_code": "AU", "lat": -37.8136, "lon": 144.9631},
{"slug": "auckland-nz", "name": "Auckland", "country_code": "NZ", "lat": -36.8485, "lon": 174.7633},

# Africa
{"slug": "cape-town-za", "name": "Cape Town", "country_code": "ZA", "lat": -33.9249, "lon": 18.4241},
{"slug": "marrakech-ma", "name": "Marrakech", "country_code": "MA", "lat": 31.6295, "lon": -7.9811},

# Europe
{"slug": "edinburgh-uk", "name": "Edinburgh", "country_code": "GB", "lat": 55.9533, "lon": -3.1883},
{"slug": "munich-de", "name": "Munich", "country_code": "DE", "lat": 48.1351, "lon": 11.5820},
{"slug": "venice-it", "name": "Venice", "country_code": "IT", "lat": 45.4408, "lon": 12.3155},
{"slug": "krakow-pl", "name": "Krakow", "country_code": "PL", "lat": 50.0647, "lon": 19.9450},
{"slug": "porto-pt", "name": "Porto", "country_code": "PT", "lat": 41.1579, "lon": -8.6291},

# Asia
{"slug": "osaka-jp", "name": "Osaka", "country_code": "JP", "lat": 34.6937, "lon": 135.5023},
{"slug": "phuket-th", "name": "Phuket", "country_code": "TH", "lat": 7.8804, "lon": 98.3923},
{"slug": "chiang-mai-th", "name": "Chiang Mai", "country_code": "TH", "lat": 18.7883, "lon": 98.9853},
```

## 🚀 NEXT STEPS TO EXECUTE

Once you've updated both backend files:

### Step 1: Generate Weather Data
```bash
cd backend
python etl.py
```

**What this does:**
- Downloads 30 years of weather history for each city
- Saves raw data to: `backend/data/raw_weather/{slug}_raw.json`
- Saves marine data to: `backend/data/raw_marine/{slug}_marine.json` (for coastal cities)
- Generates final JSON to: `public/data/{slug}.json`

### Step 2: Generate Tourism Data
```bash
cd backend
python etl_tourism.py
```

**What this does:**
- Fetches tourism statistics from World Bank API
- Saves to: `backend/data/tourism/{slug}_tourism.json`
- Uploads to Firestore

## 📊 SUMMARY

### Current Status:
| Status | Component | File |
|--------|-----------|------|
| ✅ DONE | Frontend | `src/lib/data.ts` |
| ⏳ TODO | Backend Weather ETL | `backend/etl.py` |
| ⏳ TODO | Backend Tourism ETL | `backend/etl_tourism.py` |

### After Adding Cities:
- **Current cities**: 40
- **New cities**: 24
- **Total cities**: 64

### Geographic Coverage:
- Europe: 22 → 27 cities (+5)
- Asia: 17 → 20 cities (+3)
- North America: 0 → 7 cities (+7) 🆕
- South America: 0 → 4 cities (+4) 🆕
- Oceania: 0 → 3 cities (+3) 🆕
- Africa: 0 → 2 cities (+2) 🆕

## ⚠️ IMPORTANT NOTES

1. **Data Storage**: Raw data stays in `backend/data/` folders - this is correct!
2. **Processing Time**: Each city takes ~2-5 minutes to process (30 years of data)
3. **API Limits**: ETL script has built-in rate limiting and caching
4. **Coastal Cities**: 18 out of 24 new cities are coastal - will get marine data automatically

## 🎯 READY TO IMPORT

All configuration is prepared. Once you update the two backend ETL files, just run the commands and the system will:
- ✅ Cache raw data to avoid re-downloading
- ✅ Handle API rate limits automatically
- ✅ Generate all required metadata (safety, tourism, marine)
- ✅ Create final JSON files for frontend

The frontend is already configured and ready to display these cities once the data is generated! 🚀
