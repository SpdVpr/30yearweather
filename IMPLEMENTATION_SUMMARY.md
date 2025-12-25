# Historical Weather Intelligence Platform - Implementation Summary

## 🌍 Current Status: 223 Cities Live!

**Last Updated**: 2025-12-25

---

## ⚡ CRITICAL: Vercel Blob Storage

**Data je uložena v Vercel Blob Storage** (ne v `public/data/`). Toto řeší Vercel 250MB limit a umožňuje škálování na 1000+ měst.

### Architektura
```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL BLOB STORAGE                          │
│  https://x0whxo5qfycdlx3w.public.blob.vercel-storage.com/      │
│                                                                 │
│  cities/prague.json, cities/london.json, ... (223 měst)        │
│  Celková velikost: ~268 MB                                      │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                    fetch() při build time
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS BUILD (Vercel)                       │
│  src/lib/data.ts → getCityData() → fetch z Blob URL            │
│  src/lib/blob-urls.json → mapování slug → URL                  │
│                                                                 │
│  Výsledek: SSG stránky (pre-rendered HTML)                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 WORKFLOW: Přidání nových měst

### Krok 1: Připravit data měst
```powershell
# 1. Přidat město do backend/config.py
# 2. Přidat ICAO kód do backend/airport_codes.py
```

### Krok 2: Spustit ETL pipeline
```powershell
# Stáhnout a zpracovat data
python backend/etl.py

# Stáhnout podpůrná data (volitelné)
python download_health_cdc.py
python scripts/download_holidays.py
python download_seasonal_flights.py
python fix_missing_tourism.py
```

### Krok 3: Generovat hero obrázky
```powershell
# Generovat AI obrázky (vyžaduje IDEOGRAM_API_KEY v .env)
python scripts/generate_trending_heroes.py

# Převést do WebP
python convert_heroes_to_webp.py
```

### Krok 4: ⚠️ UPLOAD NA VERCEL BLOB (KRITICKÉ!)
```powershell
# Nastavit token (jednorázově, nebo z .env)
$env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."

# Upload nových měst na Blob
npx tsx scripts/sync-blob.ts

# Nebo upload všech měst (první spuštění)
npx tsx scripts/upload-to-blob.ts
```

### Krok 5: Aktualizovat seznam měst
```powershell
# Regenerovat cities-list.json
Get-ChildItem public\data -Filter "*.json" | ForEach-Object { $_.BaseName } | ConvertTo-Json -Compress | Out-File -FilePath "src\lib\cities-list.json" -Encoding utf8
```

### Krok 6: Commit a Deploy
```powershell
git add .
git commit -m "Add new cities"
git push origin main
```

---

## 🔑 Environment Variables

### Lokální vývoj (.env)
```bash
IDEOGRAM_API_KEY=your_ideogram_key
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Vercel Dashboard (Settings → Environment Variables)
```
BLOB_READ_WRITE_TOKEN = vercel_blob_rw_...
```

---

## 📁 Klíčové soubory pro Blob

| Soubor | Účel |
|--------|------|
| `src/lib/data.ts` | Načítá data z Blob URL (ne z fs!) |
| `src/lib/blob-urls.json` | Mapování slug → Blob URL |
| `src/lib/cities-list.json` | Seznam všech městských slugů |
| `scripts/upload-to-blob.ts` | Upload všech měst na Blob |
| `scripts/sync-blob.ts` | Sync pouze nových měst |

---

## 📁 Key Scripts Reference

| Script | Purpose | Location |
|--------|---------|----------|
| `backend/etl.py` | Main weather data ETL (30 years) | `backend/` |
| `backend/config.py` | City definitions (LOCATIONS dict) | `backend/` |
| `backend/airport_codes.py` | ICAO codes for flight data | `backend/` |
| `fix_missing_tourism.py` | Tourism ETL (syncs missing cities) | Root |
| `download_health_cdc.py` | CDC health advisories | Root |
| `download_seasonal_flights.py` | Flight seasonality data | Root |
| `scripts/download_holidays.py` | Public holiday data | `scripts/` |
| `scripts/generate_trending_heroes.py` | AI hero image generation | `scripts/` |
| `convert_heroes_to_webp.py` | PNG to WebP conversion | Root |

---

## 🏗️ Architecture Overview

### Data Flow
```
Open-Meteo API → backend/etl.py → public/data/{slug}.json (lokální)
                                            ↓
                               scripts/sync-blob.ts
                                            ↓
                              Vercel Blob Storage (cloud)
                                            ↓
                           src/lib/data.ts (fetch z Blob)
                                            ↓
                              SSG stránky (pre-rendered)
```

### Key Directories
```
d:/historical-weather/
├── backend/
│   ├── config.py              # City definitions
│   ├── airport_codes.py       # ICAO airport codes
│   ├── etl.py                 # Main ETL pipeline
│   └── data/
│       ├── raw_weather/       # Cached weather data
│       ├── raw_flights/       # Cached flight data
│       ├── raw_holidays/      # Cached holiday data
│       ├── raw_health/        # CDC health data
│       └── tourism/           # Tourism data JSONs
│
├── public/
│   ├── data/                  # City JSON files (LOCAL ONLY - not used in prod!)
│   └── images/                # Hero images (.webp)
│
├── src/
│   ├── app/                   # Next.js pages
│   ├── components/            # React components
│   └── lib/
│       ├── data.ts            # Data fetching (FROM BLOB!)
│       ├── blob-urls.json     # Slug → Blob URL mapping
│       └── cities-list.json   # List of all city slugs
│
└── scripts/
    ├── upload-to-blob.ts      # Upload all cities
    ├── sync-blob.ts           # Sync new cities only
    ├── generate_trending_heroes.py
    └── download_holidays.py
```

---

## ⚙️ ETL Skip Logic

The ETL scripts are smart - they skip already processed cities:

- **Weather ETL**: Skips if `public/data/{slug}.json` exists
- **Tourism ETL**: Skips if `backend/data/tourism/{slug}_tourism.json` exists
- **Flights ETL**: Skips if `backend/data/raw_flights/{slug}_seasonal.json` exists
- **Hero Images**: Skips if `public/images/{slug}-hero.png` or `.webp` exists
- **Blob Sync**: Skips if city already exists in Blob storage

This makes re-running safe and efficient!

---

## 🖼️ Hero Image Generation

Uses **Ideogram API** for AI-generated city hero images.

### Requirements
- `IDEOGRAM_API_KEY` in `.env` file

### Scripts
- `scripts/generate_trending_heroes.py` - Generate for new cities
- `convert_heroes_to_webp.py` - Convert PNG → WebP (90% compression)

### Image Naming Convention
- PNG: `public/images/{slug}-hero.png`
- WebP: `public/images/{slug}-hero.webp`

---

##  Data Sources

| Data Type | Source | API |
|-----------|--------|-----|
| Weather (30 years) | Open-Meteo | Archive API |
| Marine data | Open-Meteo | Marine API |
| Air Quality | Open-Meteo | Air Quality API |
| Earthquakes | USGS | Earthquake API |
| Floods | Open-Meteo | Flood API |
| Holidays | Nager.at | Public Holidays API |
| Flight data | AeroDataBox | RapidAPI |
| Health advisories | CDC | Travel Health API |
| Tourist arrivals | World Bank | Tourism API |
| Attractions | OpenStreetMap | Overpass API |
| Hero images | Ideogram | AI Image API |

---

## 🐛 Common Issues & Solutions

### Vercel 250MB Limit
**Error**: `Serverless Function has exceeded the unzipped maximum size of 250 MB`
**Solution**: Data je v Blob storage. Ujistěte se, že `src/lib/data.ts` používá fetch z blob-urls.json.

### Blob Upload Fails
**Error**: `BLOB_READ_WRITE_TOKEN not set`
**Solution**: `$env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."`

### City Not Found After Deploy
**Error**: 404 na nové město
**Solution**: Zapomněli jste spustit `npx tsx scripts/sync-blob.ts` před deployem!

### Rate Limiting (429 errors)
**Cause**: Too many API requests to Open-Meteo Marine or Overpass
**Solution**: Script retries automatically. Some data may be missing for new cities.

---

## 🏆 Current Metrics

- **Total Cities**: 223
- **Data per City**: ~1.2 MB JSON
- **Historical Range**: 30 years (1995-2025)
- **Days per City**: 366 (leap year coverage)
- **Hero Images**: WebP (~150KB each, ~90% compression)
- **Blob Storage Used**: ~268 MB

---

## 📞 Quick Commands

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Run complete ETL for all cities
python backend/etl.py

# Sync missing tourism data only
python fix_missing_tourism.py

# Generate images for new cities
python scripts/generate_trending_heroes.py

# Convert all PNG heroes to WebP
python convert_heroes_to_webp.py

# ⚠️ SYNC NEW CITIES TO BLOB (REQUIRED BEFORE DEPLOY!)
$env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."
npx tsx scripts/sync-blob.ts

# Update cities list
Get-ChildItem public\data -Filter "*.json" | ForEach-Object { $_.BaseName } | ConvertTo-Json -Compress | Out-File -FilePath "src\lib\cities-list.json" -Encoding utf8

# Deploy
git add .
git commit -m "Add new cities"
git push origin main
```

---

## ✅ Pre-Deploy Checklist

Before pushing to GitHub:

- [ ] New city JSONs exist in `public/data/`
- [ ] New hero images exist in `public/images/` (WebP format)
- [ ] **Cities uploaded to Blob** (`npx tsx scripts/sync-blob.ts`)
- [ ] `src/lib/cities-list.json` updated
- [ ] `src/lib/blob-urls.json` updated (automatic from sync-blob)
- [ ] Local dev server tested (`npm run dev`)

---

**Platform Status**: ✅ Production Ready with 223 cities on Vercel Blob Storage
