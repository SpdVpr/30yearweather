"""
TOURISM DATA INTEGRATION - Implementation Guide
================================================

Tento dokument popisuje jak integrovat nový tourism ETL do projektu.

## 📋 Checklist

### 1. Backend Setup (Python)

#### A. Install dependencies
```bash
cd backend
pip install requests pandas firebase-admin
```

#### B. Set environment variable (optional, pro OpenTripMap)
Windows PowerShell:
```powershell
$env:OPENTRIPMAP_API_KEY="your_key_here"
```

Linux/Mac:
```bash
export OPENTRIPMAP_API_KEY="your_key_here"
```

#### C. Run tourism ETL
```bash
cd backend
python etl_tourism.py
```

**Expected output:**
- Stáhne World Bank data (roční tourist arrivals)
- Stáhne OpenTripMap data (attractions) - pokud máte API key
- Zkombinuje s existujícími weather daty
- Vytvoří měsíční tourism scores (12 měsíců místo 365  dní)
- Uloží do: `backend/data/tourism/{slug}_tourism.json`
- Uloží do Firestore: `tourism/{slug}`

---

### 2. Frontend Setup (Next.js)

#### A. Install firebase-admin (pokud není)
```bash
cd frontend
npm install firebase-admin
```

#### B. Set environment variables
File: `frontend/.env.local`
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANT:** Private key musí mít `\n` jako literal string (ne newline)

#### C. Test API route
```bash
# Start dev server
npm run dev

# Test API
curl http://localhost:3005/api/tourism/prague-cz
```

**Expected response:**
```json
{
  "meta": {
    "location_slug": "prague-cz",
    "location_name": "Prague",
    "country_code": "CZ",
    "data_sources": ["World Bank (UN Tourism)", "OpenTripMap", "Proprietary Weather Intelligence"]
  },
  "annual_stats": {
    "tourist_arrivals": 37202000,
    "tourist_arrivals_year": 2019,
    "total_attractions": 245,
    "attraction_density": 12.5
  },
  "monthly_scores": {
    "1": { "crowd_score": 45, "price_score": 52, ... },
    ...
  }
}
```

---

### 3. Frontend Integration

Současná implementace již zahrnuje:
- ✅ `lib/tourism.ts` - Enhanced s fetchTourismData()
- ✅ `components/TourismScoreCard.tsx` - Updated s insights/attribution
- ✅ `api/tourism/[slug]/route.ts` - API route pro Firestore fetch

**CO ZBÝVÁ UDĚLAT:**

#### Option A: Server Component (doporučeno)
Upravit `app/[city]/[date]/page.tsx` aby předal tourism data:

```typescript
// V page.tsx (server component)
import { fetchTourismDataServer } from '@/lib/tourism-server';

export default async function CityDatePage({ params }) {
  const { city, date } = params;
  const data = await getCityData(city);
  const tourismData = await fetchTourismDataServer(city); // NEW
  
  return (
    <WeatherDashboard 
      dayData={dayData}
      tourismData={tourismData}  // NEW prop
      ...
    />
  );
}
```

#### Option B: Client Hook (jednodušší, ale méně optimální)
Vytvořit hook `hooks/useTourismData.ts`:

```typescript
'use client';
import { useEffect, useState } from 'react';
import { fetchTourismData, TourismDataset } from '@/lib/tourism';

export function useTourismData(locationSlug: string) {
  const [data, setData] = useState<TourismDataset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTourismData(locationSlug)
      .then(setData)
      .finally(() => setLoading(false));
  }, [locationSlug]);

  return { data, loading };
}
```

Potom v `WeatherDashboard.tsx`:
```typescript
'use client';
import { useTourismData } from '@/hooks/useTourismData';

export default function WeatherDashboard({ dayData, citySlug, ... }) {
  const { data: tourismData } = useTourismData(citySlug);
  
  const tourismScores = calculateTourismScores(
    dayData, 
    dateId,
    tourismData  // Pass real data
  );
  
  return (
    <TourismScoreCard 
      scores={tourismScores}
      insights={getTourismInsights(tourismData, month)}
      attribution={getTourismAttribution(tourismData)}
    />
  );
}
```

---

### 4. Testování

#### Test 1: Backend data generation
```bash
cd backend
python etl_tourism.py
```

Zkontrolovat:
- `backend/data/tourism/prague-cz_tourism.json` existuje
- Obsahuje monthly_scores pro všech 12 měsíců
- Crowd scores se liší podle sezóny

#### Test 2: Frontend API
```bash
curl http://localhost:3005/api/tourism/prague-cz | jq
```

#### Test 3: UI display
1. Otevřít `http://localhost:3005/prague-cz/08-15`
2. Travel Comfort Index card by měl zobrazovat:
   - Radar chart s reálnými daty
   - Insights: "⚠️ Peak tourist season • 37.2M annual visitors (2019) • 245 attractions nearby"
   - Attribution: "Data: World Bank (UN Tourism), OpenTripMap, Proprietary Weather Intelligence"

---

### 5. Production Deployment

```bash
# Run ETL before deployment
cd backend
python etl.py         # Weather data
python etl_tourism.py # Tourism data

# Deploy to production
cd frontend
npm run build
npm run start
```

**Cron job pro updates (optional):**
Tourism data se mění pomalu (roční updates), takže stačí spustit:
- etl_tourism.py: 1x ročně (když World Bank vydá nová data)
- etl.py: 1x denně (pro nové weather data)

---

## 🎯 Klíčové výhody tohoto přístupu

1. **❌ Žádné rate limity na frontend calls**
   - Data jsou předpočítaná v backendu
   - Frontend jen čte z Firebase/cache

2. **✅ Smart měsíční granularita**
   - 12 requests místo 365 = 30x úspora
   - World Bank + OpenTripMap free tier bez problémů

3. **🧠 Unikátní proprietary algoritmus**
   - Kombinujeme 3+ zdroje dat
   - Není to jen "raw API data"
   - Naše vlastní interpretace

4. **⚡ Performance**
   - Client-side cache (24h localStorage)
   - Firestore cache
   - Static generation možná

5. **🔒 No API keys exposed**
   - Vše se děje na backendu
   - Frontend je čistý

---

## 🐛 Troubleshooting

### "Cannot find module 'firebase-admin'"
```bash
cd frontend
npm install firebase-admin
```

### Tourism data je null
- Zkontrolujte že `etl_tourism.py` běžel úspěšně
- Zkontrolujte Firebase credentials
- Zkontrolujte API route ve frontend

### OpenTripMap API error
- Je to optional - script funguje i bez toho
- Pokud chcete: registrujte free key na https://opentripmap.io

### World Bank API vrací old data
- To je OK - data pro 2020-2023 ještě nejsou dostupná (COVID)
- Používáme 2019 jako latest available

---

## 📚 Reference

- Backend script: `backend/etl_tourism.py`
- Frontend library: `frontend/src/lib/tourism.ts`
- API route: `frontend/src/app/api/tourism/[slug]/route.ts`
- Component: `frontend/src/components/TourismScoreCard.tsx`

---

_Vytvořeno: 2025-12-15_
_Author: Tourism Intelligence ETL Pipeline_
