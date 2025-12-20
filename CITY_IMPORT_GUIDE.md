# 🚀 OFFICIAL WORKFLOW: Adding New Cities (v3.0)

**Version:** 3.0 (December 2024)  
**Goal:** Consistent, high-quality, SEO-optimized weather pages for tourists.

---

## 📋 PRE-FLIGHT CHECKLIST

Before adding a city, ensure you have:
1.  **Correct Coordinates (CRITICAL):**
    *   For **Beach Destinations (Bali, Phuket, etc.)**: Use coordinates for the *main tourist beach*, NOT the city center/airport.
        *   *Bad:* Bali (Denpasar City) -> Rain data is wrong (inland mountains).
        *   *Good:* Bali (Kuta Beach) -> Accurate beach weather.
    *   For **Cities (Paris, London)**: Use the city center.
2.  **Timezone:** Correct IANA string (e.g., `Asia/Bangkok`). Important for the Solar Elevation chart.
3.  **Category:** Decide which homepage category fits best (Exotic, Mountains, etc.).

---

## 🎯 STEP-BY-STEP GUIDE

### PHASE 1: Configuration (`backend/config.py`)

1.  Open `backend/config.py`.
2.  Add your new city to the `LOCATIONS` dictionary. Use this template:

```python
    'city-slug': {
        "name": "City Name",
        "country": "Country Name",
        "lat": 0.0000,      # Check Google Maps (Right click -> Coordinates)
        "lon": 0.0000,
        "is_coastal": True, # True = Download Marine Data (water temp, waves)
        "timezone": "Region/City", # VITAL for sun position accuracy!
        # Optional:
        "desc": "Custom SEO description overrides default generation." 
    },
```

---

### PHASE 2: Data Generation (ETL)

The ETL pipeline downloads raw data (cached) and processes it into the JSON format the frontend needs.

1.  **Run the ETL script:**
    ```bash
    # From root directory
    python backend/etl.py
    ```

2.  **How it works:**
    *   It checks `backend/data/raw_weather/`. If raw data exists, it uses it (Fast).
    *   If not, it downloads 30 years of history from Open-Meteo (Slow).
    *   It calculates stats using **Smart Tourism Logic** (Rain threshold > 3.0mm, weighted recency).
    *   Output is saved to `public/data/[slug].json`.

    > **⚡ TIP:** If you changed coordinates for an existing city, you MUST delete its raw cache first to force a re-download!
    > `del backend\data\raw_weather\city-slug_raw.json`

---

### PHASE 2.5: Additional Data (Flights & Health)

To make the city pages complete, we need flight connection data and health advisories.

1.  **Register Airport (backend/airport_codes.py):**
    *   Find the ICAO code for the city's main airport (e.g., Lyon -> 'LFLL').
    *   Add it to the dictionary in `backend/airport_codes.py`.
    *   **Verify the ICAO code is correct** to ensure data fetching works.

2.  **Download Flight Data:**
    *   Run: `python download_seasonal_flights.py`
    *   This script now uses **smart date selection** to find the most recent available flight data (past/future) to build a robust seasonality profile.
    *   It also fetches **Top Routes** and **Delay Statistics**.
    *   If specific months are empty, it automatically fills gaps with the annual average.

3.  **Download Health Data:**
    *   Run: `python download_health_cdc.py`
    *   This scrapes the latest vaccine requirements from the CDC website.

---

### PHASE 3: Frontend Registration

Next.js needs to know about the city to build the pages and display it on the homepage.

1.  **Register usage (`src/lib/data.ts`):**
    *   Add the `slug` to the `getAllCities()` list inside the correct region comment block.
    *   *Why?* This tells Next.js to generate static pages (`[city]/page.tsx`) during build.

2.  **Add to Homepage (`src/app/page.tsx`):**
    *   Find the `categorizedCities` array.
    *   Add the `slug` to the `slugs` array of the appropriate section (e.g., "Exotic & Tropical").

---

### PHASE 4: Assets (Images)
    
Every city needs a high-quality Hero image.
    
1.  **Generate & Convert Automatically (Recommended):**
    *   Open `scripts/generate_city_hero.py`.
    *   Update the `PROMPT` and `FILENAME` variables at the bottom of the script.
    *   Run the script:
    ```bash
    python scripts/generate_city_hero.py
    ```
    *   **What this does:**
        *   Generates the image using Ideogram API.
        *   Automatically downloads it to `public/images/`.
        *   Automatically optimizes and converts it to WebP format.

2.  **Manual Alternative:**
    *   Use Midjourney/Ideogram manually.
    *   **Prompt:** `"Beautiful cinematic shot of [City/Beach], sunny day, photorealistic, 8k --ar 4:3"`
    *   Save as PNG to `public/images/[slug]-hero.png`.
    *   Run optimizer: `python convert_heroes_to_webp.py`

---

### PHASE 5: Validation & Navigation

1.  **Run Dev Server:**
    ```bash
    npm run dev
    ```
2.  **Check the URL:** Go to `http://localhost:3000/city-slug`.
    *   Does the rainfall looking realistic? (If too high for a dry season, check coords).
    *   Is the "Verdict" accurate?
    *   Does the Solar Chart show high noon correctly? (If skewed, check Timezone).
3.  **Check Sitemap:** The new city should appear at `http://localhost:3000/sitemaps/city-slug.xml`.

---

## 🔧 TROUBLESHOOTING

**Problem:** "The rain probability seems way too high for Bali in August!"
**Fix:** You likely used **inland** coordinates (mountains/rainforest). Change `config.py` to use a coastal point (e.g., Kuta Beach), delete raw cache, and re-run ETL.

**Problem:** "Sun graph shows high noon at 6 AM."
**Fix:** The `timezone` in `config.py` is wrong. Update it to the correct IANA string (e.g., `Asia/Makassar` for Bali, not `Asia/Jakarta`).

**Problem:** "Image is missing on the card."
**Fix:** Ensure the filename matches `[slug]-hero.webp` exactly in `public/images`.

---

**Summary for Success:**
1. Config (Correct Coords!)
2. ETL (Run Python)
3. Frontend (Register Slug)
4. Images (WebP)
