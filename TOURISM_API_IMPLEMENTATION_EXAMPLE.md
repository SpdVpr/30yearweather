# Praktický příklad implementace - Tourism API Integration

## Quick Start: World Bank API Integration

Tento dokument obsahuje **ready-to-use** kód pro integraci World Bank Tourism API do vašeho projektu.

---

## 1. Backend API Route

Vytvořte nový API endpoint pro získání tourism dat.

**Soubor:** `frontend/src/app/api/tourism/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

interface WorldBankResponse {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

interface WorldBankIndicator {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

const COUNTRY_CODES: Record<string, string> = {
  'prague-cz': 'CZ',
  'berlin-de': 'DE',
  'paris-fr': 'FR',
  'vienna-at': 'AT',
  // Přidejte další města/země podle potřeby
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location') || 'prague-cz';
  const year = searchParams.get('year') || new Date().getFullYear().toString();

  const countryCode = COUNTRY_CODES[location] || 'CZ';
  
  try {
    // World Bank API - Tourism arrivals
    const worldBankUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/ST.INT.ARVL?format=json&date=${year}:${year}`;
    
    const response = await fetch(worldBankUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`World Bank API error: ${response.status}`);
    }

    const data = await response.json();
    
    // World Bank vrací array kde [0] je metadata, [1] je actual data
    const indicators: WorldBankIndicator[] = data[1] || [];
    
    // Najdeme nejnovější dostupná data
    const latestData = indicators.find(item => item.value !== null);
    
    if (!latestData) {
      return NextResponse.json({ 
        error: 'No tourism data available',
        fallback: true,
        touristArrivals: 0
      });
    }

    return NextResponse.json({
      countryCode,
      year: latestData.date,
      touristArrivals: latestData.value,
      unit: latestData.unit,
      source: 'World Bank / UN Tourism',
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tourism API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tourism data',
        fallback: true 
      },
      { status: 500 }
    );
  }
}
```

---

## 2. Enhanced Tourism Library

Upravte `src/lib/tourism.ts` pro integraci s API.

```typescript
import { DayData } from "./data";

export interface TourismIndex {
    walkability: number;
    beerGarden: number;
    crowds: number;
    price: number;
    reliability: number;
}

export interface TourismAPIData {
    touristArrivals: number;
    countryCode: string;
    year: string;
    fallback?: boolean;
}

// Seasonal koeficienty (zachováno jako fallback)
const SEASONALITY_PRAGUE = [
    { crowd: 40, price: 50 }, // Jan
    { crowd: 35, price: 45 }, // Feb
    { crowd: 50, price: 60 }, // Mar
    { crowd: 70, price: 75 }, // Apr
    { crowd: 85, price: 85 }, // May
    { crowd: 90, price: 90 }, // Jun
    { crowd: 95, price: 95 }, // Jul
    { crowd: 100, price: 100 }, // Aug
    { crowd: 85, price: 90 }, // Sep
    { crowd: 70, price: 75 }, // Oct
    { crowd: 50, price: 60 }, // Nov
    { crowd: 80, price: 95 }, // Dec
];

// Reference hodnota pro normalizaci (průměrná roční návštěvnost ČR)
const REFERENCE_ARRIVALS = 10_000_000; // 10M tourists/year baseline

/**
 * Vypočítá crowd score z real tourism dat
 */
export function calculateCrowdScore(
    month: number, 
    tourismData?: TourismAPIData
): number {
    // Fallback na statická data pokud API není dostupné
    if (!tourismData || tourismData.fallback) {
        return SEASONALITY_PRAGUE[month].crowd;
    }

    // Normalizujeme roční příjezdy na 0-100 scale
    const arrivalsFactor = Math.min(
        (tourismData.touristArrivals / REFERENCE_ARRIVALS) * 100,
        150 // Cap na 150 pro extreme cases
    );

    // Aplikujeme seasonal multiplier
    const seasonalMultiplier = SEASONALITY_PRAGUE[month].crowd / 100;
    
    // Final score
    const crowdScore = arrivalsFactor * seasonalMultiplier;
    
    return Math.max(0, Math.min(100, Math.round(crowdScore)));
}

/**
 * Hlavní funkce pro výpočet tourism scores
 */
export async function calculateTourismScores(
    dayData: DayData, 
    date: string,
    location: string = 'prague-cz'
): Promise<TourismIndex> {
    const { temp_max, precip_prob, wind_kmh, precip_mm } = dayData.stats;
    const [monthStr] = date.split('-');
    const month = parseInt(monthStr) - 1; // 0-indexed
    const year = new Date().getFullYear();

    // Fetch real tourism data
    let tourismData: TourismAPIData | undefined;
    try {
        const response = await fetch(
            `/api/tourism?location=${location}&year=${year}`,
            { next: { revalidate: 86400 } } // Cache 24h
        );
        if (response.ok) {
            tourismData = await response.json();
        }
    } catch (error) {
        console.warn('Failed to fetch tourism API, using fallback:', error);
    }

    // 1. Walkability Algorithm (beze změny)
    let walkScore = 100;
    if (temp_max < 10) walkScore -= (10 - temp_max) * 4;
    else if (temp_max > 28) walkScore -= (temp_max - 28) * 5;
    else if (temp_max > 32) walkScore -= 30;
    walkScore -= precip_prob * 0.5;
    if (precip_mm > 2) walkScore -= 20;
    if (wind_kmh > 20) walkScore -= (wind_kmh - 20);

    // 2. Beer Garden Index (beze změny)
    let beerScore = 0;
    if (temp_max > 16) {
        beerScore = 100;
        if (temp_max < 20) beerScore -= (20 - temp_max) * 5;
        if (temp_max > 30) beerScore -= 10;
        beerScore -= precip_prob * 0.8;
        if (wind_kmh > 15) beerScore -= 15;
    }

    // 3. Reliability Index (beze změny)
    let reliabilityScore = 100 - (precip_prob * 0.8);

    // 4. Crowds - nyní s real data!
    const crowdsScore = calculateCrowdScore(month, tourismData);

    // 5. Price - zatím fallback (připraveno pro Amadeus API)
    const priceScore = SEASONALITY_PRAGUE[month].price;

    return {
        walkability: Math.max(0, Math.min(100, Math.round(walkScore))),
        beerGarden: Math.max(0, Math.min(100, Math.round(beerScore))),
        crowds: crowdsScore,
        price: priceScore,
        reliability: Math.max(0, Math.min(100, Math.round(reliabilityScore))),
    };
}

// Synchronní verze pro backward compatibility
export function calculateTourismScoresSync(
    dayData: DayData, 
    date: string
): TourismIndex {
    const { temp_max, precip_prob, wind_kmh, precip_mm } = dayData.stats;
    const [monthStr] = date.split('-');
    const month = parseInt(monthStr) - 1;

    let walkScore = 100;
    if (temp_max < 10) walkScore -= (10 - temp_max) * 4;
    else if (temp_max > 28) walkScore -= (temp_max - 28) * 5;
    else if (temp_max > 32) walkScore -= 30;
    walkScore -= precip_prob * 0.5;
    if (precip_mm > 2) walkScore -= 20;
    if (wind_kmh > 20) walkScore -= (wind_kmh - 20);

    let beerScore = 0;
    if (temp_max > 16) {
        beerScore = 100;
        if (temp_max < 20) beerScore -= (20 - temp_max) * 5;
        if (temp_max > 30) beerScore -= 10;
        beerScore -= precip_prob * 0.8;
        if (wind_kmh > 15) beerScore -= 15;
    }

    let reliabilityScore = 100 - (precip_prob * 0.8);
    const seasonality = SEASONALITY_PRAGUE[month] || { crowd: 50, price: 50 };

    return {
        walkability: Math.max(0, Math.min(100, Math.round(walkScore))),
        beerGarden: Math.max(0, Math.min(100, Math.round(beerScore))),
        crowds: seasonality.crowd,
        price: seasonality.price,
        reliability: Math.max(0, Math.min(100, Math.round(reliabilityScore))),
    };
}
```

---

## 3. Test API Endpoint

Otestujte API pomocí příkazu:

```bash
# V development mode (npm run dev)
curl "http://localhost:3005/api/tourism?location=prague-cz&year=2023"
```

**Očekávaný response:**
```json
{
  "countryCode": "CZ",
  "year": "2023",
  "touristArrivals": 12500000,
  "unit": "",
  "source": "World Bank / UN Tourism",
  "lastUpdated": "2025-12-15T09:00:00.000Z"
}
```

---

## 4. Bonus: OpenTripMap Integration

Pro attraction density můžete přidat další API call:

```typescript
// V souboru: frontend/src/app/api/tourism/route.ts

export async function GET(request: NextRequest) {
  // ... existující World Bank kod ...

  // Přidat OpenTripMap call
  const OPENTRIPMAP_KEY = process.env.OPENTRIPMAP_API_KEY;
  
  if (OPENTRIPMAP_KEY) {
    try {
      // Coordinates for Prague (příklad)
      const coords = {
        'prague-cz': { lon_min: 14.22, lat_min: 49.94, lon_max: 14.71, lat_max: 50.18 }
      };
      
      const bbox = coords[location as keyof typeof coords];
      if (bbox) {
        const otmUrl = `https://api.opentripmap.com/0.1/en/places/bbox?lon_min=${bbox.lon_min}&lat_min=${bbox.lat_min}&lon_max=${bbox.lon_max}&lat_max=${bbox.lat_max}&kinds=museums,churches,theatres&apikey=${OPENTRIPMAP_KEY}`;
        
        const otmResponse = await fetch(otmUrl);
        const attractions = await otmResponse.json();
        
        return NextResponse.json({
          // ... existing World Bank data ...
          attractionCount: attractions.features?.length || 0,
          attractionDensity: (attractions.features?.length || 0) / 100, // per km²
        });
      }
    } catch (error) {
      console.warn('OpenTripMap failed, continuing without it:', error);
    }
  }
  
  // ... zbytek kódu ...
}
```

---

## 5. Environment Variables

Přidejte do `.env.local`:

```bash
# Optional - pokud chcete použít OpenTripMap
OPENTRIPMAP_API_KEY=your_api_key_here

# Pro production - můžete nastavit cache duration
TOURISM_DATA_CACHE_HOURS=24
```

---

## 6. Testing Checklist

- [ ] API route vytvořena (`/api/tourism`)
- [ ] World Bank API funguje (test curl)
- [ ] `tourism.ts` updated s async funkcí
- [ ] Komponenta `TourismScoreCard` zobrazuje data
- [ ] Fallback funguje když API není k dispozici
- [ ] Cache je nastavena správně (24h)
- [ ] Error handling implementován

---

## 7. Next Steps

1. **Získat OpenTripMap API key:**
   - Návštěvte: https://opentripmap.io/product
   - Zvolte Free plan
   - Přidejte key do `.env.local`

2. **Monitorovat API usage:**
   - World Bank nemá rate limits, ale sledujte response times
   - OpenTripMap free tier: 1000 requests/day

3. **Přidat více měst:**
   - Rozšiřte `COUNTRY_CODES` mapping
   - Přidejte coordinates pro OpenTripMap

4. **Implementovat Avoid Crowds API** (pokud získáte klíč):
   - Replace World Bank logic
   - Direct crowd score bez normalizace

---

## Troubleshooting

### World Bank API nevrací data
```typescript
// Check response format:
console.log('WB Response:', JSON.stringify(data, null, 2));

// Možné problémy:
// - Nevalidní country code
// - Year mimo rozsah dostupných dat
// - API je dočasně nedostupné (rate limit)
```

### TypeScript errors
```bash
# Ensure types are correct
npm install --save-dev @types/node
```

### CORS issues (pokud voláte z frontendu)
```typescript
// V API route přidat headers:
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ /* data */ });
  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
}
```

---

_Ready to implement! Začněte vytvořením API route a postupujte podle checklist._
