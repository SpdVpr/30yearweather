---
description: How to add a new city to 30YearWeather
---

# Adding a New City to 30YearWeather

This workflow describes the complete process for adding a new city to the platform.

## Prerequisites

You need the following information:
1. **City name** (e.g., "Berlin")
2. **Country** (e.g., "Germany")
3. **Coordinates** (lat, lon) - Use Google Maps or similar
4. **Country ISO code** (2-letter, e.g., "DE") - For World Bank API
5. **Slug** (lowercase, e.g., "berlin-de")

## Step 1: Update Backend ETL Scripts

### 1.1 Add City to Weather ETL (`backend/config.py`)

Add the new city to the `LOCATIONS` dictionary:

```python
LOCATIONS = [
    {
        "name": "Prague",
        "country": "Czech Republic",
        "lat": 50.0755,
        "lon": 14.4378,
        "slug": "prague-cz",
        "desc": "Central European gem with rich history and stunning architecture."
    },
    {
        "name": "Berlin",
        "country": "Germany", 
        "lat": 52.5200,
        "lon": 13.4050,
        "slug": "berlin-de",
        "desc": "Germany's vibrant capital blending history, culture, and modern innovation."
    }
]
```

### 1.2 Add City to Tourism ETL (`backend/etl_tourism.py`)

Add the new city to the `LOCATIONS` list with the **country ISO code**:

```python
LOCATIONS = [
    {
        "slug": "prague-cz",
        "name": "Prague",
        "country_code": "CZ",
        "lat": 50.0755,
        "lon": 14.4378
    },
    {
        "slug": "berlin-de",
        "name": "Berlin",
        "country_code": "DE",
        "lat": 52.5200,
        "lon": 13.4050
    }
]
```

## Step 2: Run ETL Pipelines

// turbo
### 2.1 Generate Weather Data
```bash
python backend/etl.py
```

This will create: `public/data/berlin-de.json`

// turbo
### 2.2 Generate Tourism Data
```bash
python fix_missing_tourism.py
```

This will create: `backend/data/tourism/berlin-de_tourism.json`.

## Step 3: Add City Image (Optional but Recommended)

### 3.1 Generate or Find City Image

Option A: Use AI to generate:
```
Prompt: "Cinematic cityscape photo of [CITY], iconic landmarks, golden hour lighting, warm tones, premium travel photography, 8k"
```

Option B: Use free stock photo from Unsplash/Pexels

### 3.2 Save Image
Save the image as: `frontend/public/images/[slug]-hero.png`
Example: `frontend/public/images/berlin-de-hero.png`

### 3.3 Update Homepage Image Mapping

In `frontend/src/app/page.tsx`, update the `cityImage` logic:

```typescript
const cityImage = 
    city.slug === 'prague-cz' ? '/images/prague-hero.png' :
    city.slug === 'berlin-de' ? '/images/berlin-de-hero.png' :
    null;
```

### 3.4 **CRITICAL: Update City List in Frontend**

In `frontend/src/lib/data.ts`, add the new city to `getAllCities()`:

```typescript
export async function getAllCities(): Promise<string[]> {
    return ['prague-cz', 'berlin-de']; // Add new cities here
}
```

**⚠️ Without this step, the city will NOT appear on the homepage!**

## Step 4: Verify

// turbo
### 4.1 Check Generated Files
```bash
ls frontend/public/data/berlin-de.json
ls backend/data/tourism/berlin-de_tourism.json
```

### 4.2 Test Locally

Navigate to:
- Homepage: `http://localhost:3005` (should show Berlin card)
- City Index: `http://localhost:3005/berlin-de`
- Month View: `http://localhost:3005/berlin-de/08`
- Day View: `http://localhost:3005/berlin-de/08-15`

## Step 5: Deploy

Once verified locally:
1. Commit all changes to Git
2. Push to repository
3. Deploy to Vercel (auto-deploy if connected)
4. Verify production URLs

## Troubleshooting

**Issue:** City doesn't appear on homepage
- **Solution:** Check that `frontend/public/data/[slug].json` exists with valid data

**Issue:** Tourism data missing
- **Solution:** Run `python fix_missing_tourism.py` again or check `backend/data/tourism/[slug]_tourism.json`

**Issue:** Image not loading
- **Solution:** Verify image path and filename match exactly (case-sensitive)

## Bulk Adding Cities

To add multiple cities at once:
1. Update `LOCATIONS` dictionary in `backend/config.py`
2. Run `python backend/etl.py` then `python fix_missing_tourism.py`
3. Add all city images to `public/images/`
4. Update the image mapping in `page.tsx` with a switch/object lookup

---

**Time estimate:** ~5-10 minutes per city (excluding image generation)
