# Doporučení Free API pro Travel Comfort Index

## Přehled
Tento dokument obsahuje analýzu a doporučení free API pro integraci historických turistických dat do komponenty **Travel Comfort Index**. Cílem je nahradit statická data (`SEASONALITY_PRAGUE`) v `src/lib/tourism.ts` reálnými daty o návštěvnosti, cenách a dalších turistických metrikách.

---

## 🎯 Aktuální stav projektu

### Metriky v Travel Comfort Index:
1. **Walkability** (0-100) - Počítáno z weather dat
2. **Beer Garden Index** (0-100) - Počítáno z weather dat
3. **Reliability** (0-100) - Počítáno z weather dat
4. **Crowds** (0-100) - ❌ **Momentálně statická data**
5. **Price** (0-100) - ❌ **Momentálně statická data**

### Potřeba:
- Historická data o **návštěvnosti turistů** (crowds)
- Historická data o **cenách hotelů/letů** (price)
- Ideálně s měsíční nebo denní granularitou
- Pokrytí pro různá města (zejména Praha, ale také ostatní)

---

## 📊 Doporučené API řešení

### ⭐ **1. World Bank Tourism API** (Nejvíce doporučené)

**Výhody:**
- ✅ **Zcela zdarma** bez API key
- ✅ Historická data od roku 1995
- ✅ Oficiální data od UN Tourism (WTO)
- ✅ Žádné rate limity pro základní použití
- ✅ Jednoduchá REST API
- ✅ Pokrytí pro většinu zemí světa

**Pokryté metriky:**
- International tourism arrivals (počet příjezdů turistů)
- Tourism expenditure/receipts
- Roční data po jednotlivých zemích

**Implementace:**
```javascript
// Příklad API volání
const response = await fetch(
  'https://api.worldbank.org/v2/country/CZ/indicator/ST.INT.ARVL?format=json&date=2010:2023'
);
```

**Limitace:**
- ⚠️ Pouze roční data (ne měsíční)
- ⚠️ Data na úrovni celé země (ne jednotlivá města)
- ⚠️ Nezahrnuje ceny hotelů/letů

**Použití v projektu:**
- Využít pro base-line crowds score pro celou zemi
- Kombinovat s vlastními seasonal koeficienty pro jednotlivé měsíce

**Dokumentace:**
- https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation

---

### ⭐ **2. Avoid Crowds API** (Nejrelevantnější pro crowds)

**Výhody:**
- ✅ Specializováno přímo na crowd prediction
- ✅ "Avoid Crowds Score" - přesně odpovídá vaší metrice
- ✅ Historická data podporována
- ✅ Pokrytí různých destinací
- ✅ Zohledňuje svátky, školní prázdniny, cruise ships

**Pokryté metriky:**
- Crowd levels (0-100)
- Date-based filtering (historical queries)

**Implementace:**
```javascript
// Příklad API volání
const response = await fetch(
  'https://api.avoid-crowds.com/v1/crowds?filter[date]=2023-07-15&apikey=YOUR_KEY'
);
```

**Limitace:**
- ⚠️ Vyžaduje API key (musíte požádat o přístup)
- ⚠️ Free tier není explicitně specifikovaný
- ⚠️ Může mít omezené rate limity

**Použití v projektu:**
- **Ideální pro crowds metríku** - přímá náhrada za `SEASONALITY_PRAGUE[month].crowd`
- Historické dotazy pomocí `filter[date]` parametru

**Dokumentace:**
- https://avoid-crowds.dev
- Kontakt pro API key: přes jejich web

---

### ⭐ **3. OpenTripMap API** (Pro POI a context data)

**Výhody:**
- ✅ Zcela zdarma s free API key
- ✅ 10+ milionů turistických POI
- ✅ 150+ typů atrakcí
- ✅ Data z OpenStreetMap, Wikidata, Wikimedia
- ✅ Žádné explicitní rate limity ve free tier

**Pokryté metriky:**
- Points of Interest (museums, parks, churches, etc.)
- Attraction descriptions
- Geographic data

**Implementace:**
```javascript
// Příklad API volání - získání atrakcí v Praze
const response = await fetch(
  'https://api.opentripmap.com/0.1/en/places/bbox?lon_min=14.22&lat_min=49.94&lon_max=14.71&lat_max=50.18&kinds=museums,churches&apikey=YOUR_KEY'
);
```

**Limitace:**
- ⚠️ Neposkytuje crowd levels
- ⚠️ Neposkytuje historická návštěvnická data
- ⚠️ Neposkytuje pricing

**Použití v projektu:**
- Využít pro výpočet "attraction density" jako proxy pro potenciální crowds
- Více atrakcí = vyšší pravděpodobnost davů
- Vytvořit vlastní weighted score

**Registrace API key:**
- https://opentripmap.io/product (Free plan dostupný)

---

### 4. **Amadeus Travel API** (Pro flight/hotel prices)

**Výhody:**
- ✅ Free test environment s quotas
- ✅ Historical flight price data (Flight Price Analysis API)
- ✅ Hotel search API (real-time, ale lze sbírat historicky)
- ✅ Oficiální data od leteckých společností

**Pokryté metriky:**
- Historical flight prices by route and date
- Hotel prices and availability
- Min/max/avg price ranges

**Implementace:**
```javascript
// Příklad - Historical flight prices
const response = await fetch(
  'https://test.api.amadeus.com/v1/analytics/air-traffic/traveled?originCityCode=PRG&period=2023-07',
  { headers: { 'Authorization': 'Bearer YOUR_TOKEN' }}
);
```

**Limitace:**
- ⚠️ Free quota je omezená (test environment)
- ⚠️ Production vyžaduje platbu
- ⚠️ Komplexnější authentication (OAuth)
- ⚠️ Rate limits v test mode

**Použití v projektu:**
- Využít pro price metríku (hotel/flight costs)
- Sbírat data pro různé destinace a datumy
- Vytvořit seasonal price index

**Registrace:**
- https://developers.amadeus.com/register

---

## 🎯 **Doporučená implementační strategie**

### **Fáze 1: Quick Win (1-2 dny)**
Implementujte kombinaci:

1. **World Bank API** pro base-line crowds
   - Cache roční data pro jednotlivé země
   - Vytvořte seasonal koeficienty (váš současný SEASONALITY_PRAGUE)
   
2. **OpenTripMap API** pro attraction density
   - Spočítejte počet POI v dané destinaci
   - Higher density = higher potential crowds

```typescript
// Pseudo-kód
const baseCrowds = await getWorldBankArrivalData('CZ', year);
const attractionDensity = await getOpenTripMapPOICount(lat, lon);
const seasonalMultiplier = SEASONALITY_PRAGUE[month].crowd / 100;

const finalCrowdScore = baseCrowds * seasonalMultiplier * (1 + attractionDensity * 0.2);
```

### **Fáze 2: Enhanced Data (3-5 dní)**
Pokud chcete přesnější data:

1. **Avoid Crowds API** (pokud získáte API key)
   - Direct replacement pro crowds metríku
   - Nejpřesnější historická crowd data

2. **Amadeus API** pro pricing
   - Historické ceny letů a hotelů
   - Vytvořit price index pro jednotlivé destinace/měsíce

---

## 📝 **Implementační checklist**

### Minimální implementace (World Bank + OpenTripMap):
- [ ] Registrovat free API key pro OpenTripMap
- [ ] Vytvořit `/api/tourism` endpoint v Next.js
- [ ] Implementovat cache layer (např. v Redis nebo lokální DB)
- [ ] Stáhnout World Bank data pro CZ (a další země)
- [ ] Napojit OpenTripMap API pro získání POI count
- [ ] Upravit `calculateTourismScores()` v `tourism.ts`
- [ ] Update `TourismScoreCard` pro zobrazení source ("Data: World Bank + OpenTripMap")

### Rozšířená implementace (+Avoid Crowds):
- [ ] Požádat o API key pro Avoid Crowds
- [ ] Testovat API response format
- [ ] Integrovat do stávajícího flow
- [ ] Implementovat fallback na World Bank pokud API selže

### Pro pricing (+Amadeus):
- [ ] Registrovat Amadeus developer account
- [ ] Získat OAuth credentials
- [ ] Implementovat token refresh logic
- [ ] Sbírat historická data pro top destinace
- [ ] Vytvořit price index database

---

## 🔗 **Reference a odkazy**

### API dokumentace:
- **World Bank API**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- **Avoid Crowds**: https://avoid-crowds.dev (vyžaduje kontakt)
- **OpenTripMap**: https://opentripmap.io/docs
- **Amadeus**: https://developers.amadeus.com/self-service

### Dataset zdroje:
- UN Tourism Statistics: https://www.unwto.org/tourism-statistics/key-tourism-statistics
- Eurostat Tourism: https://ec.europa.eu/eurostat/web/tourism

---

## 💡 **Alternativní přístup: Vlastní data collection**

Pokud API nejsou dostačující, můžete implementovat:

1. **Web scraping** booking.com/airbnb pro ceny (⚠️ zkontrolovat ToS)
2. **Google Trends API** jako proxy pro tourist interest
3. **Wikipedia pageviews API** pro destinace jako crowd proxy

```javascript
// Příklad - Wikipedia pageviews jako crowd indicator
const response = await fetch(
  'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/Prague/daily/20230701/20230731'
);
```

---

## ✅ **Závěr a doporučení**

**Pro rychlou implementaci:**
➡️ **World Bank API** (crowds baseline) + **OpenTripMap API** (attraction density)
- Zcela zdarma
- Žádné API key requesty
- Good enough pro MVP

**Pro optimální výsledky:**
➡️ **Avoid Crowds API** (direct crowd data) + **Amadeus API** (pricing data)
- Vyžaduje registraci
- Přesnější data
- Production-ready solution

**Hybrid approach:**
➡️ Začít s World Bank + OpenTripMap, postupně integrovat Avoid Crowds když získáte API key

---

_Dokument vytvořen: 2025-12-15_
_Projekt: Historical Weather Intelligence - Travel Comfort Index_
