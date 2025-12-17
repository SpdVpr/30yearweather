# ✅ CHECKLIST - Přidání 24 nových měst

## Hotovo ✅
- [x] Frontend aktualizován (`src/lib/data.ts`) - 64 měst ready
- [x] Připravena konfigurace pro ETL
- [x] Vytvořena dokumentace

## Co dál? 🔧

### 1. Otevři `backend/etl.py`
Zkopíruj města z `NEW_CITIES_IMPLEMENTATION.md` do `LOCATIONS` dictionary

### 2. Otevři `backend/etl_tourism.py`  
Zkopíruj města z `NEW_CITIES_IMPLEMENTATION.md` do `LOCATIONS` list

### 3. Spusť ETL
```bash
cd backend
python etl.py           # Vygeneruje weather data (2-5 min/město)
python etl_tourism.py   # Vygeneruje tourism data
```

## Nová města (24):

🌎 **Severní Amerika (7)**
- New York, Los Angeles, San Francisco, Miami
- Vancouver, Toronto, Mexico City

🌎 **Jižní Amerika (4)**  
- Rio de Janeiro, Buenos Aires, Lima, Santiago

🌏 **Oceánie (3)**
- Sydney, Melbourne, Auckland

🌍 **Afrika (2)**
- Cape Town, Marrakech

🇪🇺 **Evropa (5)**
- Edinburgh, Munich, Venice, Krakow, Porto

🌏 **Asie (3)**
- Osaka, Phuket, Chiang Mai

## Kam se ukládají data:
- Raw weather: `backend/data/raw_weather/{slug}_raw.json`
- Raw marine: `backend/data/raw_marine/{slug}_marine.json`  
- Tourism: `backend/data/tourism/{slug}_tourism.json`
- **Final frontend**: `public/data/{slug}.json`

Všechno ready! Jen zkopíruj konfigurace do backend ETL souborů a spusť! 🚀
