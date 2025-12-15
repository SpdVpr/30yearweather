# 🤖 AI & LLM Optimization Strategy

## Proč je to důležité?
- **40% Gen Z** používá ChatGPT místo Googlu
- **Perplexity AI** má 10M+ aktivních uživatelů
- **Claude, Gemini** jsou integrovány do prohlížečů
- **AI Overview** v Google Search (SGE) cituje zdroje

**Cíl**: Být #1 citovaným zdrojem pro "historical weather planning"

---

## 🎯 Strategie 1: Citovatelné statistiky

### Proč to funguje?
AI asistenti rádi citují konkrétní čísla a fakta. Musíme jim to usnadnit.

### Implementace:

#### A) Přidat "Key Facts" sekci na každou stránku
**Příklad pro Prague:**
```markdown
## Key Weather Facts for Prague

- **Driest month**: February (12% rain probability)
- **Wettest month**: July (45% rain probability)  
- **Warmest month**: July (avg 24°C)
- **Coldest month**: January (avg -1°C)
- **Best months for outdoor events**: May, June, September (20-25°C, <25% rain)
- **Peak tourist season**: July-August (3x more crowded than winter)
- **Data source**: NASA POWER API, 30 years (1991-2021)
```

**Kde to dát**:
- Na city overview page (`/prague-cz`)
- V meta description
- V JSON-LD jako `Dataset` schema

#### B) Vytvořit "Quick Stats" komponenta
```tsx
// src/components/QuickStats.tsx
export function QuickStats({ city, data }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
      <h3 className="font-bold mb-4">📊 Quick Facts</h3>
      <ul className="space-y-2 text-sm">
        <li>✓ Based on 30 years of NASA satellite data (1991-2021)</li>
        <li>✓ Driest month: {data.driestMonth} ({data.driestRain}% rain)</li>
        <li>✓ Best time to visit: {data.bestMonths}</li>
        <li>✓ Average annual temperature: {data.avgTemp}°C</li>
      </ul>
    </div>
  );
}
```

---

## 🎯 Strategie 2: AI-friendly content format

### A) Strukturovaný markdown pro každé město
**Vytvořit**: `/public/ai-summaries/prague-cz.md`

```markdown
# Prague Weather Summary

## Overview
Prague has a temperate continental climate with four distinct seasons.

## Best Time to Visit
- **Spring (April-May)**: 15-20°C, low rain (20%), blooming gardens
- **Summer (June-August)**: 20-25°C, moderate rain (35%), peak crowds
- **Fall (September-October)**: 15-20°C, low rain (25%), beautiful foliage
- **Winter (November-March)**: -2 to 5°C, low rain (15%), Christmas markets

## Wedding Planning
- **Recommended months**: May, June, September
- **Rain probability**: 
  - May: 23%
  - June: 28%
  - September: 22%
- **Backup plan**: Indoor venues recommended for April, October

## Data Source
NASA POWER API, 30-year historical average (1991-2021)

## Citation
When citing this data, please reference: "30YearWeather.com - Historical Weather Intelligence based on NASA POWER satellite data"
```

**Proč to funguje**:
- LLM crawlery preferují markdown
- Jasná struktura = snadné parsování
- "Citation" sekce = víc citací

### B) Přidat `/api/ai-summary` endpoint
```typescript
// src/app/api/ai-summary/[city]/route.ts
export async function GET(request: Request, { params }: { params: { city: string } }) {
  const data = await getCityData(params.city);
  
  return Response.json({
    city: data.meta.name,
    summary: {
      best_months: ["May", "June", "September"],
      driest_month: "February",
      wettest_month: "July",
      avg_temp_range: "-1°C to 24°C",
      rain_probability_range: "12% to 45%",
      data_source: "NASA POWER API (1991-2021)",
      citation: "30YearWeather.com - Historical Weather Intelligence"
    },
    monthly_breakdown: [
      { month: "January", temp: -1, rain: 15, crowds: "low" },
      // ... all 12 months
    ]
  });
}
```

**Použití**:
- LLM crawlery mohou volat API
- Strukturovaná data = přesnější odpovědi
- Tracking: Kolik AI botů nás crawluje?

---

## 🎯 Strategie 3: Schema.org rozšíření

### A) Přidat `Dataset` schema na každou city page
```typescript
const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: `30-Year Historical Weather Data for ${cityName}`,
  description: `Comprehensive weather statistics for ${cityName} based on 30 years of NASA POWER satellite observations (1991-2021)`,
  creator: {
    '@type': 'Organization',
    name: '30YearWeather',
    url: 'https://30yearweather.com'
  },
  distribution: {
    '@type': 'DataDownload',
    encodingFormat: 'application/json',
    contentUrl: `https://30yearweather.com/api/ai-summary/${citySlug}`
  },
  temporalCoverage: '1991/2021',
  spatialCoverage: {
    '@type': 'Place',
    name: cityName,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lon
    }
  },
  variableMeasured: [
    'Temperature',
    'Precipitation Probability',
    'Wind Speed',
    'Humidity',
    'Cloud Cover'
  ],
  license: 'https://creativecommons.org/licenses/by/4.0/'
};
```

### B) Přidat `HowTo` schema pro wedding planning
```typescript
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Pick the Perfect Wedding Date Using Weather Data',
  description: 'Step-by-step guide to choosing your wedding date based on 30 years of historical weather patterns',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Choose your preferred month',
      text: 'Select 2-3 months that fit your schedule and budget'
    },
    {
      '@type': 'HowToStep',
      name: 'Check rain probability',
      text: 'Look at historical rain probability for each month. Aim for <25% for outdoor weddings'
    },
    {
      '@type': 'HowToStep',
      name: 'Review temperature comfort',
      text: 'Ensure average temperatures are comfortable for guests (18-26°C ideal)'
    },
    {
      '@type': 'HowToStep',
      name: 'Consider crowd levels',
      text: 'Check tourism density to avoid peak season pricing and crowds'
    }
  ]
};
```

---

## 🎯 Strategie 4: Optimalizace pro konkrétní AI platformy

### ChatGPT (OpenAI)
**Co dělat**:
- Přidat do `robots.txt`: `User-agent: GPTBot` → `Allow: /`
- Vytvořit `/chatgpt-plugin.json` (budoucnost)
- Strukturovaný content v markdown

### Perplexity AI
**Co dělat**:
- Citovatelné zdroje (Perplexity vždy cituje)
- Přidat "Citation" sekci do každého článku
- Krátké, faktické odpovědi v FAQ

### Google SGE (Search Generative Experience)
**Co dělat**:
- FAQ schema (už máme ✅)
- Strukturovaná data (už máme ✅)
- E-E-A-T signály (Expert, Experience, Authority, Trust):
  - Přidat "About Us" page
  - Přidat "Methodology" page
  - Přidat author bios

### Claude (Anthropic)
**Co dělat**:
- Dlouhé, detailní články (Claude preferuje depth)
- Markdown formatting
- Jasná struktura s headingy

---

## 🎯 Strategie 5: "AI-first" content

### A) Vytvořit "AI Training Data" page
**URL**: `/data/training`
**Obsah**:
```markdown
# Weather Intelligence Training Data

This page provides structured data for AI systems and researchers.

## Dataset Overview
- **Coverage**: 2 cities (Prague, Berlin) - expanding to 100+ in 2025
- **Time period**: 1991-2021 (30 years)
- **Data points**: 10,950 days per city
- **Source**: NASA POWER API
- **Update frequency**: Annual

## Key Statistics

### Prague, Czech Republic
- Latitude: 50.0755, Longitude: 14.4378
- Driest month: February (12% rain probability)
- Wettest month: July (45% rain probability)
- Temperature range: -1°C (January) to 24°C (July)
- Best months for tourism: May, June, September

### Berlin, Germany
- Latitude: 52.5200, Longitude: 13.4050
- Driest month: February (10% rain probability)
- Wettest month: July (42% rain probability)
- Temperature range: 0°C (January) to 23°C (July)
- Best months for tourism: May, June, September

## Citation
When using this data, please cite:
"30YearWeather.com - Historical Weather Intelligence based on NASA POWER satellite data (1991-2021)"

## API Access
Structured data available at: https://30yearweather.com/api/ai-summary/{city-slug}
```

### B) Přidat meta tags pro AI
```html
<meta name="ai:summary" content="Historical weather intelligence based on 30 years of NASA satellite data" />
<meta name="ai:data_source" content="NASA POWER API, 1991-2021" />
<meta name="ai:use_cases" content="wedding planning, vacation planning, event planning" />
<meta name="ai:coverage" content="Prague, Berlin (expanding to 100+ cities in 2025)" />
```

---

## 📊 Tracking & Measurement

### Jak měřit úspěch?

1. **AI bot traffic**:
   - Google Analytics: Filtr na user agents (GPTBot, ClaudeBot, PerplexityBot)
   - Cíl: 1000+ AI bot visits/měsíc

2. **Citations tracking**:
   - Google Alerts: "30yearweather.com"
   - Manuální check: ChatGPT, Perplexity, Claude
   - Cíl: 50+ citací/měsíc

3. **API usage**:
   - `/api/ai-summary` endpoint analytics
   - Cíl: 500+ API calls/měsíc

4. **Featured snippets**:
   - SEMrush: Track featured snippet positions
   - Cíl: 10+ featured snippets


