# 🚀 OPTIMALIZOVANÝ NÁVOD - Import Nových Měst

**Verze:** 2.0 (Prosinec 2024)  
**Čas na 1 město:** ~2 minuty (s caching)  
**Cíl:** Maximální rychlost, žádné zbytečné regenerace

---

## 📋 RYCHLÝ CHECKLIST

### Před zahájením
- [ ] Máš připravené: název města, země, GPS souřadnice, ISO kód země, timezone
- [ ] Rozhodl jsi se, jestli město je pobřežní (`is_coastal: true/false`)

### Kroky
1. [ ] Přidej město do `backend/config.py` (LOCATIONS)
2. [ ] Přidej město do `src/lib/data.ts` (getAllCities)
3. [ ] Přidej město na homepage `src/app/page.tsx` (kategorie)
4. [ ] Spusť ETL s skip logikou (jen nová města!)
5. [ ] (Volitelné) Vygeneruj hero obrázky

---

## 🎯 KROK ZA KROKEM

### KROK 1: Backend Config (`backend/config.py`)

**Otevři:** `backend/config.py`  
**Najdi:** `LOCATIONS = {`  
**Přidej město před poslední `}`:**

```python
    'new-york-us': {
        "name": "New York",
        "country": "United States",
        "lat": 40.7128,
        "lon": -74.0060,
        "is_coastal": True,           # ⚠️ True pokud u moře!
        "timezone": "America/New_York" # ⚠️ Důležité pro správné časy!
    },
```

**💡 Tipy:**
- GPS najdeš na Google Maps (klikni pravým tlačítkem)
- Timezone: https://timeapi.io/time-zones
- is_coastal: True pokud je město do 50km od moře

---

### KROK 2: Frontend Cities (`src/lib/data.ts`)

**Otevři:** `src/lib/data.ts`  
**Najdi:** `export async function getAllCities()`  
**Přidej slug do správné kategorie:**

```typescript
// North America (7 cities)
'new-york-us', 'los-angeles-us', ...
```

**⚠️ Důležité:** Bez tohoto kroku se město NEOBJEVÍ na homepage!

---

### KROK 3: Homepage Categories (`src/app/page.tsx`)

**Otevři:** `src/app/page.tsx`  
**Najdi řádek ~260:** `{/* Categorized City Lists */}`  
**Přidej slug do příslušné kategorie:**

```typescript
{
  title: "North America",
  description: "Vibrant cities from coast to coast.",
  slugs: ['new-york-us', 'los-angeles-us', ...] // <- Přidej sem
}
```

**A TAKÉ aktualizuj isPng pole (řádek ~300):**

```typescript
const isPng = [
  // ...existing cities...
  'new-york-us', // <- Přidej nové město pokud má PNG obrázek
].includes(city.slug);
```

---

### KROK 4: Spusť ETL se Skip Logikou ⚡

**⚠️ DŮLEŽITÁ ZMĚNA:** ETL nyní automaticky přeskakuje existující města!

**Jak to funguje:**
- Před zpracováním každého města zkontroluje: `public/data/{slug}.json`
- Pokud soubor EXISTUJE → přeskočí ⏭️
- Pokud soubor NEEXISTUJE → zpracuje 🔄

**Spuštění:**
```bash
cd backend
.\venv\Scripts\python etl.py
```

**Co se stane:**
```
📍 Processing New York (new-york-us)
   🌐 Fetching weather data...  ✅
   ✅ Data saved

📍 Processing Prague (prague-cz)
   ⏭️  SKIPPED - Data already exists (last modified: 2024-12-17)

📍 Processing Sydney (sydney-au)
   🌐 Fetching weather data...  ✅
   ✅ Data saved
```

**Force regenerace všech měst:**
```bash
# Smaž raw cache aby se stáhlo znovu
rm backend/data/raw_weather/new-york-us_raw.json

# Nebo smaž finální output
rm public/data/new-york-us.json

# Pak spusť ETL normálně
python etl.py
```

---

### KROK 5: Hero Obrázky (Volitelné)

**Vygeneruj AI obrázek pro město:**

**Prompt:**
```
Cinematic cityscape photo of [CITY NAME], iconic landmarks visible, 
golden hour lighting, warm tones, premium travel photography, 8k resolution,
professional composition, vibrant colors
```

**Ulož jako:**
```
public/images/{slug}-hero.png
```

**Příklad:** `public/images/new-york-us-hero.png`

**💡 Tip:** Použij Midjourney, DALL-E nebo Stable Diffusion

---

## 🔧 AUTOMATIZACE PRO BULK IMPORT

Pokud přidáváš více měst najednou (5+), použij helper skripty:

### Helper: Patch Config Cities
```bash
# Použij připravený skript který přidá město do config.py
python patch_config_cities.py
```

Nebo vytvořit vlastní seznam měst:

```python
NEW_CITIES = {
    'your-city-slug': {
        "name": "Your City",
        "country": "Country",
        "lat": 0.0,
        "lon": 0.0,
        "is_coastal": False,
        "timezone": "Timezone/Name"
    }
}
```

---

## 📊 SKIP LOGIKA - JAK FUNGUJE

### Co kontroluje ETL:

1. **Existuje `public/data/{slug}.json`?**
   - ANO → ⏭️ SKIP
   - NE → 🔄 ZPRACUJ

2. **Existuje `backend/data/raw_weather/{slug}_raw.json`?**
   - ANO → ✅ Použij cache (nesta huj znovu)
   - NE → 📥 Stáhni z API

### Kdy se regeneruje:

- ❌ **NIKDY automaticky** - ETL přeskočí existující města
- ✅ **Pouze pokud:**
  - Smažeš `public/data/{slug}.json`
  - Nebo smažeš `backend/data/raw_weather/{slug}_raw.json`

### Výhody:

- ⚡ **10x rychlejší** - zpracuje jen nová města
- 💾 **Šetří bandwidth** - používá cachované raw data
- 🛡️ **Bezpečné** - neničí existující data
- 🎯 **Přesné** - vždy vidíš co se zpracovává

---

## 🚨 TROUBLESHOOTING

### Město se neobjevuje na homepage
✅ **Fix:** Zkontroluj že je v `src/lib/data.ts` a `src/app/page.tsx`

### ETL říká "SKIPPED" ale já chci regenerovat
✅ **Fix:** Smaž `public/data/{slug}.json` a spusť znovu

### Chybí marine data u pobřežního města
✅ **Fix:** Zkontroluj že má `is_coastal: True` v config.py

### Obrázek se nenačítá
✅ **Fix:** Zkontroluj že je v `isPng` poli na homepage nebo změň na .webp

---

## 📝 TEMPLATE PRO NOVÉ MĚSTO

```python
# backend/config.py
'city-slug-cc': {
    "name": "City Name",
    "country": "Country Name",
    "lat": 0.0000,
    "lon": 0.0000,
    "is_coastal": False,  # True/False
    "timezone": "Continent/City"
},
```

```typescript
// src/lib/data.ts - přidej do správné kategorie
'city-slug-cc',

// src/app/page.tsx - přidej do kategorie
slugs: ['city-slug-cc', ...]

// src/app/page.tsx - přidej do isPng pokud má PNG
'city-slug-cc',
```

---

## ⏱️ ČASOVÉ ODHADY

| Aktivita | Čas | Note |
|----------|-----|------|
| Přidání do config.py | 2 min | Copy-paste + úprava |
| Přidání do frontend | 3 min | 2 soubory |
| ETL 1 nového města | 2-5 min | S caching |
| ETL 10 nových měst | 20-50 min | Paralelně |
| Vygenerování obrázků | 5-10 min/město | AI generování |

**Celkem pro 1 město:** ~10-20 minut (včetně testování)

---

## ✅ HOTOVO!

Po dokončení těchto kroků:
- ✅ Město se objeví na homepage
- ✅ Město má svou stránku `/city-slug`
- ✅ Město má data pro všech 365 dní
- ✅ Město má bezpečnostní analýzu
- ✅ Pobřežní města mají marine data

**Otestuj:** `http://localhost:3005/city-slug`

---

**Vytvořeno:** 17. prosince 2024  
**Autor:** 30YearWeather Team  
**Další update:** Při změnách v ETL procesu
