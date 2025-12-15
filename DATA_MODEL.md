# 📊 Data Model & Frontend Metriky - Detailní Popis

## 🔄 Jak funguje zpracování dat

### Krok 1: Stažení RAW dat (30 let)
ETL script stáhne **každý den** z posledních 30 let (1994-2024):

**Např. pro 15. července:**
- 15.7.1994 → temp_max: 24°C, precip: 0mm, wind: 10km/h
- 15.7.1995 → temp_max: 22°C, precip: 2mm, wind: 8km/h
- 15.7.1996 → temp_max: 26°C, precip: 0mm, wind: 12km/h
- ...
- 15.7.2023 → temp_max: 23°C, precip: 1mm, wind: 9km/h
- 15.7.2024 → temp_max: 25°C, precip: 0mm, wind: 11km/h

**Celkem:** ~30 datových bodů pro jeden kalendářní den

### Krok 2: Agregace (Průměrování)
Script spočítá **průměry** všech těchto 30 let:

```python
# Pseudokód
all_july_15_data = [
    {date: "1994-07-15", temp_max: 24, ...},
    {date: "1995-07-15", temp_max: 22, ...},
    # ... 30 záznamů
]

average_temp_max = mean([24, 22, 26, ..., 25])  # → 23.2°C
average_temp_min = mean([13, 12, 14, ..., 13])  # → 13.0°C
precip_probability = count(precip > 0.1mm) / 30 * 100  # → 10%
```

### Krok 3: Výpočet Custom Scores

**Wedding Index:**
```python
if (temp je mezi 18-28°C 
    AND déšť < 0.5mm 
    AND vítr < 15km/h):
    score = 100
    score -= precip_prob * 0.5  # Penalizace za možnost deště
    score -= clouds * 0.2        # Penalizace za oblačnost
else:
    score = 30  # Základní nízké skóre
```

**Reliability Score:**
```python
# Měří konzistenci počasí
std_deviation = standardDeviation([24, 22, 26, ..., 25])
reliability = 100 - (std_deviation * 10)

# Pokud je std_dev = 2°C → reliability = 80%
# Pokud je std_dev = 8°C → reliability = 20%
```

### Krok 4: Uložení do Firebase
Pouze **agregovanaý výsledek** - ne 30 let RAW dat!

---

## 📋 Struktura Jednoho Dne (15. července)

### Kompletní JSON pro 07-15:

```json
{
  "07-15": {
    "stats": {
      "temp_max": 23.2,          // °C - průměr max teploty za 30 let
      "temp_min": 13.0,          // °C - průměr min teploty za 30 let
      "precip_mm": 0.5,          // mm - průměrné srážky
      "precip_prob": 10,         // % - pravděpodobnost deště (kolikrát pršelo)
      "wind_kmh": 8.3,           // km/h - průměrná rychlost větru
      "clouds_percent": 42       // % - průměrná oblačnost
    },
    "scores": {
      "wedding": 78,             // 0-100 - vhodnost pro svatbu
      "reliability": 85          // 0-100 - konzistence počasí
    },
    "clothing": [
      "T-Shirt",                 // Doporučení oblečení
      "Light Clothing",
      "Layers (Onion System)"    // Kvůli rozdílu den/noc > 12°C
    ],
    "events": []                 // Svátky (např. [{"type":"holiday","description":"..."}])
  }
}
```

---

## 🎨 Co zobrazujeme na Frontendu

### 1. **Verdict Hero** (Horní banner)

**Otázka:** "Is July 15 good for a wedding in Prague?"

**Odpověď:** 
- **YES** (zelená) - pokud wedding score ≥ 80
- **MAYBE** (žlutá) - pokud wedding score 40-79
- **NO** (červená) - pokud wedding score < 40

**Zobrazené hodnoty:**
- Wedding Score: **78/100**
- Progress bar v barvě verdiktu
- Text: "Perfect conditions expected based on historical data"

---

### 2. **Statistiky dne** (Sidebar - pravá strana)

```
Day Stats
─────────────────
Max Temp        23.2°C
Min Temp        13.0°C
Wind            8.3 km/h
Rain Amount     0.5 mm
Rain Chance     10%
```

---

### 3. **Smart Suitcase** (Co si zabalit)

**Ikony + Text:**
- 👕 T-Shirt
- 🧥 Light Clothing
- 🧅 Layers (Onion System)

*Poznámka: "Layers" protože rozdíl mezi dnem (23°C) a nocí (13°C) je 10°C*

---

### 4. **Temperature Chart** (Tremor Area Chart)

**Graf:**
- **Oranžová plocha**: Max temperatura (23.2°C)
- **Modrá plocha**: Min temperatura (13.0°C)
- **Šedá oblast mezi**: Teplotní rozsah

**Legenda:**
"30-year average for July 15th"

---

### 5. **Rain Probability Chart** (Tremor Bar Chart)

**Sloupcový graf:**
- **Výška sloupce**: 10%
- **Barva**: Modrá
- **MaxValue**: 100%

**Text pod grafem:**
"Based on how many times it rained > 0.1mm on this day in the last 30 years."

---

## 🔢 Metriky - Kompletní Seznam

### Raw Statistics (stats)
| Metrika | Jednotka | Popis | Příklad |
|---------|----------|-------|---------|
| `temp_max` | °C | Průměrná max teplota (30 let) | 23.2 |
| `temp_min` | °C | Průměrná min teplota (30 let) | 13.0 |
| `precip_mm` | mm | Průměrné srážky | 0.5 |
| `precip_prob` | % | Pravděpodobnost deště | 10 |
| `wind_kmh` | km/h | Průměrná rychlost větru | 8.3 |
| `clouds_percent` | % | Průměrná oblačnost | 42 |

### Computed Scores (scores)
| Metrika | Rozsah | Význam | Příklad |
|---------|--------|--------|---------|
| `wedding` | 0-100 | Vhodnost pro svatbu | 78 |
| `reliability` | 0-100 | Konzistence počasí | 85 |

**Wedding Score Faktory:**
- ✅ Teplota v rozmezí 18-28°C
- ✅ Srážky < 0.5mm
- ✅ Vítr < 15km/h
- ❌ Penalizace za pravděpodobnost deště
- ❌ Penalizace za oblačnost

**Reliability Score:**
- Vysoké (80-100): Počasí je každý rok podobné
- Střední (50-79): Mírná variabilita
- Nízké (0-49): Počasí se hodně mění mezi roky

### Recommendations (clothing)
Pole stringů na základě:
- Průměrné teploty
- Pravděpodobnosti deště
- Rozdílu den/noc teploty

**Logika:**
```python
if avg_temp < 10:
    ["Heavy Coat", "Scarf", "Gloves"]
elif avg_temp < 18:
    ["Light Jacket", "Long Pants"]
else:
    ["T-Shirt", "Light Clothing"]

if precip_prob > 30:
    append("Umbrella")

if (temp_max - temp_min) > 12:
    append("Layers (Onion System)")
```

### Events (events)
```json
[
  {
    "type": "holiday",
    "description": "Independence Day"
  }
]
```

---

## 📊 Příklad: Zimní vs Letní Den

### ❄️ 1. ledna (Zima)
```json
{
  "stats": {
    "temp_max": 3.7,
    "temp_min": -2.1,
    "precip_mm": 0.7,
    "precip_prob": 50,
    "wind_kmh": 16.6,
    "clouds_percent": 75
  },
  "scores": {
    "wedding": 30,      // ❌ Příliš chladno
    "reliability": 48   // ⚠️ Počasí nestabilní
  },
  "clothing": [
    "Heavy Coat",
    "Scarf",
    "Gloves",
    "Umbrella"
  ],
  "events": [
    {
      "type": "holiday",
      "description": "New Year's Day"
    }
  ]
}
```

**Frontend zobrazí:**
- Verdict: **NO** (červená)
- "Historically poor conditions (rain or cold)"

---

### ☀️ 15. července (Léto)
```json
{
  "stats": {
    "temp_max": 23.2,
    "temp_min": 13.0,
    "precip_mm": 0.5,
    "precip_prob": 10,
    "wind_kmh": 8.3,
    "clouds_percent": 42
  },
  "scores": {
    "wedding": 78,      // ✅ Ideální podmínky
    "reliability": 85   // ✅ Stabilní počasí
  },
  "clothing": [
    "T-Shirt",
    "Light Clothing",
    "Layers (Onion System)"
  ],
  "events": []
}
```

**Frontend zobrazí:**
- Verdict: **MAYBE** (žlutá - skóre 78 je těsně pod 80)
- "Conditions are mixed" (protože není ≥80)

---

## 🎯 Summary

**Co JE v datech:**
✅ 30-letý průměr pro každý kalendářní den
✅ 6 základních metrik (temp, déšť, vítr, oblačnost)
✅ 2 vypočítané scores (svatba, spolehlivost)
✅ Doporučení oblečení
✅ Detekce svátků

**Co NENÍ v datech:**
❌ RAW data (těch 10,959 záznamů)
❌ Denní předpověď (to je historický průměr)
❌ Swim Index (Marine API nefunguje)
❌ Air Quality (zatím ne implementováno)

**Velikost dat:**
- **V Firebase:** ~158 KB pro celé město (366 dnů)
- **Na frontendu:** ~430 bytes na den

---

Chceš abych ti ukázal jak to přesně vypadá v JSON souboru pro konkrétní datum?
