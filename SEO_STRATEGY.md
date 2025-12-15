# 🚀 SEO & Growth Strategy pro 30YearWeather

## 📊 Současný stav (Prosinec 2024)

### ✅ Silné stránky:
- **Unikátní data**: 30 let NASA POWER satelitních dat
- **Technické SEO**: JSON-LD, sitemap, metadata ✅
- **765 statických stránek**: Skvělé pro indexaci
- **Rychlý web**: Next.js SSG na Vercelu
- **Moderní design**: Lepší než konkurence

### 🔴 Slabé stránky:
- **Nulová autorita**: Nový web bez backlinků
- **Chybí content marketing**: Jen data, žádné články
- **Malý počet měst**: Jen Praha a Berlín
- **Žádná komunita**: Žádné sociální sítě, žádné recenze

---

## 🎯 PRIORITA 1: Opravit technické chyby (HNED)

### 1.1 Opravit sitemap.ts
**Problém**: Sitemap neobsahuje city overview pages a měsíční pages

**Řešení**:
```typescript
// Přidat do sitemap.ts:

// City overview pages
for (const city of cities) {
    urls.push({
        url: `${BASE_URL}/${city}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    });
}

// Monthly pages (01-12)
for (const city of cities) {
    for (let month = 1; month <= 12; month++) {
        const monthSlug = month.toString().padStart(2, '0');
        urls.push({
            url: `${BASE_URL}/${city}/${monthSlug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.85,
        });
    }
}
```

### 1.2 Přidat FAQ schema na homepage
**Proč**: Google miluje FAQ schema - zobrazuje se přímo ve výsledcích

**Příklad FAQ**:
- "What is 30-year weather data?"
- "How accurate is historical weather for planning?"
- "When is the best time to visit Prague?"
- "Can I use this for wedding planning?"

### 1.3 Přidat HowTo schema
**Kde**: Na city pages
**Příklad**: "How to pick the perfect wedding date in Prague"

---

## 🎯 PRIORITA 2: Content Marketing (1-3 měsíce)

### 2.1 Blog s long-tail keywords
**Cíl**: Získat organický traffic z Google

**Témata článků** (seřazeno podle priority):

#### Tier 1: Wedding Planning (vysoká konverze)
1. **"Best Months to Get Married in Prague: 30-Year Weather Analysis"**
   - Keywords: "prague wedding weather", "best month to get married prague"
   - Difficulty: Medium
   - Volume: 500-1000/měsíc

2. **"Outdoor Wedding Weather Planning: How to Avoid Rain on Your Big Day"**
   - Keywords: "outdoor wedding weather planning", "wedding rain probability"
   - Difficulty: Low
   - Volume: 2000-5000/měsíc

3. **"Prague vs Berlin: Which City Has Better Wedding Weather?"**
   - Keywords: "prague vs berlin weather", "best european city for outdoor wedding"

#### Tier 2: Travel Planning (vysoký volume)
4. **"Best Time to Visit Prague: Month-by-Month Weather Guide (2025)"**
   - Keywords: "best time to visit prague", "prague weather by month"
   - Difficulty: High
   - Volume: 10,000+/měsíc

5. **"Berlin Weather Guide: When to Visit for Perfect Weather"**
   - Keywords: "best time to visit berlin", "berlin weather guide"
   - Volume: 8,000+/měsíc

6. **"How to Use Historical Weather Data for Trip Planning"**
   - Keywords: "historical weather data", "weather planning vacation"

#### Tier 3: Niche Topics (nízká konkurence)
7. **"Marathon Weather Planning: Best Months for Running in European Cities"**
   - Keywords: "marathon weather planning", "best weather for running"

8. **"Photography Weather Guide: Golden Hour & Cloud Cover Analysis"**
   - Keywords: "photography weather planning", "best weather for photography"

9. **"Festival Season Weather: Europe's Best Outdoor Event Months"**
   - Keywords: "outdoor festival weather", "best months for festivals europe"

### 2.2 Interaktivní nástroje (virální potenciál)
1. **"Wedding Date Picker"** - Zadáš měsíc, dostaneš nejlepší dny
2. **"Rain Probability Calculator"** - Jaká je šance deště na tvůj termín?
3. **"City Weather Comparison Tool"** - Porovnej 2-3 města najednou

---

## 🎯 PRIORITA 3: LLM Optimization (AI vyhledávače)

### 3.1 Optimalizace pro ChatGPT, Claude, Perplexity
**Proč**: 40% mladých lidí používá AI místo Googlu

**Jak na to**:

#### A) Strukturovaná data v markdown
Vytvořit `/public/data/city-summaries.md`:
```markdown
# Prague Weather Summary

Prague has a temperate continental climate with:
- **Best months to visit**: May, June, September (20-25°C, low rain)
- **Avoid**: January-February (cold, -2°C avg), July-August (crowds, 30°C+)
- **Wedding season**: May-June, September (15% rain probability)
- **Cheapest months**: November-March (off-season)

Based on 30 years of NASA POWER satellite data (1991-2021).
```

#### B) Přidat "AI-friendly" metadata
```typescript
// V layout.tsx přidat:
export const metadata = {
  // ... existing
  other: {
    'ai:summary': 'Historical weather intelligence based on 30 years of NASA satellite data',
    'ai:data_source': 'NASA POWER API, 1991-2021',
    'ai:use_cases': 'wedding planning, vacation planning, event planning'
  }
}
```

#### C) Vytvořit `/api/ai-summary` endpoint
- LLM crawlery mohou volat API pro strukturovaná data
- Vrací JSON s agregovanými statistikami

### 3.2 Citovatelné statistiky
**Proč**: AI asistenti rádi citují konkrétní čísla

**Příklady**:
- "Prague has a 23% chance of rain in May, based on 30 years of data"
- "Berlin is 3°C warmer than Prague in July on average"
- "The driest month in Prague is February with only 12% rain probability"

Tyto statistiky dát do:
- Meta descriptions
- H2 nadpisů
- FAQ odpovědí

---

## 🎯 PRIORITA 4: Backlink Strategy (3-6 měsíců)

### 4.1 Low-hanging fruit
1. **Reddit**: r/Prague, r/Berlin, r/weddingplanning, r/travel
   - Odpovídat na otázky typu "When to visit Prague?"
   - Přidat link na váš nástroj

2. **Quora**: "Best time to visit Prague?"
   - 500+ otázek o Prague weather
   - Kvalitní odpověď + link

3. **TripAdvisor fóra**: Odpovídat na weather questions

4. **Wedding planning fóra**: WeddingWire, The Knot
   - "How to pick outdoor wedding date"

### 4.2 PR & Media outreach
1. **Travel bloggers**: Nabídnout widget "Best time to visit"
2. **Wedding magazines**: Článek o weather planning
3. **Tech media**: "Startup používá NASA data pro plánování svateb"

### 4.3 Partnerships
1. **Booking.com / Airbnb**: Integrace weather dat
2. **Wedding venues**: "Check weather for your date"
3. **Travel agencies**: White-label řešení

---

## 🎯 PRIORITA 5: Škálování měst (6-12 měsíců)

### 5.1 Strategie rozšíření
**Fáze 1** (Q1 2025): Top 20 evropských měst
- Paříž, Řím, Barcelona, Amsterdam, Vídeň, Budapešť...
- Cíl: 20 měst × 366 dní = 7,320 stránek

**Fáze 2** (Q2 2025): Top 100 světových destinací
- New York, Tokyo, Bali, Santorini...
- Cíl: 100 měst × 366 dní = 36,600 stránek

**Fáze 3** (Q3-Q4 2025): Všechna města 100k+ obyvatel
- Cíl: 4,000+ měst = 1,464,000 stránek
- **Dominance v long-tail searches**

### 5.2 Automatizace content generace
Pro každé nové město automaticky vytvořit:
1. City overview page s AI-generovaným popisem
2. 12 měsíčních pages
3. 366 denních pages
4. Blog článek "Best time to visit {City}"
5. FAQ schema s city-specific otázkami

---

## 📈 KPI & Metriky

### Měsíc 1-3 (Technické SEO)
- ✅ Sitemap opravena
- ✅ FAQ schema přidáno
- ✅ 5 blog článků publikováno
- 🎯 Cíl: 1,000 návštěv/měsíc

### Měsíc 4-6 (Content & Backlinks)
- ✅ 20 blog článků
- ✅ 50+ backlinků
- ✅ Reddit/Quora presence
- 🎯 Cíl: 10,000 návštěv/měsíc

### Měsíc 7-12 (Škálování)
- ✅ 100+ měst
- ✅ 200+ blog článků
- ✅ 500+ backlinků
- 🎯 Cíl: 100,000 návštěv/měsíc

---

## 🤖 Konkurenční analýza

### WeatherSpark.com
- **Silné stránky**: Velká databáze měst, detailní grafy
- **Slabé stránky**: Zastaralý design, pomalý web, žádný tourism context
- **Jak je porazit**: Lepší UX, tourism data, moderní design ✅

### WeatherPlanner.com
- **Silné stránky**: 365-day forecast, Fortune 500 klienti
- **Slabé stránky**: Placený model, složitý UX, žádné free tier
- **Jak je porazit**: Free model, jednoduchý UX, lepší SEO

### Weather365 App
- **Silné stránky**: Mobilní app, wedding focus
- **Slabé stránky**: Jen iOS, žádný web, špatné reviews
- **Jak je porazit**: Web-first, cross-platform, lepší data

---

## 💡 Unikátní selling points (USP)

1. **"30 Years of Truth, Not 7 Days of Guesses"**
   - Konkurence: 7-14 day forecasts (nepřesné)
   - Vy: 30 let historických dat (fakta)

2. **"NASA-Powered Weather Intelligence"**
   - Důvěryhodnost: NASA POWER API
   - Konkurence: nespecifikuje zdroje

3. **"Tourism + Weather = Perfect Trip"**
   - Unikátní: Kombinace weather + crowds + pricing
   - Konkurence: jen weather

4. **"Free Forever"**
   - Monetizace: API, partnerships, ads
   - Konkurence: paywall


