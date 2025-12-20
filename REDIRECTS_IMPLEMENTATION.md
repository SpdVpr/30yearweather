# URL Redirects Implementation

**Datum:** 20. prosince 2024  
**Status:** ✅ HOTOVO

## 🎯 Problém

Google má zaindexované staré URL s country code suffixem (např. `helsinki-fi`, `marrakech-ma`, `lyon-fr`), ale po migraci slugů tyto URL nefungují. Potřebujeme 301 redirecty pro SEO.

## ✅ Řešení

### 1. Přidány Redirecty v `src/middleware.ts`

**Důležité:** Původně byly redirecty v `next.config.js`, ale ~95,740 statických redirectů překračovalo 5MB limit na Vercelu. Proto byly přesunuty do middleware pro dynamické zpracování.

Implementovány kompletní redirecty pro všechny staré URL formáty:

#### A. Staré slugy s country code → Nové slugy
```
/helsinki-fi → /helsinki
/marrakech-ma → /marrakech
/lyon-fr → /lyon
/bali-id → /bali
```

#### B. Staré slugy + měsíc (název)
```
/helsinki-fi/december → /helsinki/december
/marrakech-ma/january → /marrakech/january
```

#### C. Staré slugy + měsíc (číslo)
```
/marrakech-ma/12 → /marrakech/december
/helsinki-fi/01 → /helsinki/january
```

#### D. Staré slugy + datum (MM-DD)
```
/marrakech-ma/12-25 → /marrakech/december/25
/helsinki-fi/01-15 → /helsinki/january/15
```

#### E. Staré slugy + měsíc + den
```
/helsinki-fi/december/25 → /helsinki/december/25
```

#### F. Nové slugy s číselným formátem (zpětná kompatibilita)
```
/prague/07-15 → /prague/july/15
/prague/07 → /prague/july
```

### 2. Opraveno `lyon-fr` → `lyon` v `backend/config.py`

Lyon bylo poslední město s country code suffixem v konfiguraci.

### 3. Přejmenovány datové soubory pro Lyon

```
backend/data/air_quality/lyon-fr_monthly_aqi.json → lyon_monthly_aqi.json
backend/data/raw_flights_seasonal/lyon-fr_seasonal.json → lyon_seasonal.json
backend/data/raw_holidays/lyon-fr_holidays.json → lyon_holidays.json
backend/data/raw_weather/lyon-fr_raw.json → lyon_raw.json
backend/data/tourism/lyon-fr_tourism.json → lyon_tourism.json
public/data/lyon-fr.json → lyon.json
public/images/lyon-fr-hero.png → lyon-hero.png
public/images/lyon-fr-hero.webp → lyon-hero.webp
```

## 📊 Statistiky

- **Implementace:** Edge Middleware (dynamické redirecty)
- **Velikost middleware:** 28.1 kB (místo 5MB+ statických redirectů)
- **Starých slugů:** ~150 měst
- **Typů redirectů:** 6 různých formátů
- **HTTP status:** 301 (Permanent Redirect) - důležité pro SEO
- **Performance:** O(1) lookup díky hash mapě

## 🚀 Deployment

Po nasazení na produkci:

1. **Google Search Console:**
   - Staré URL budou automaticky přesměrovány
   - Google postupně aktualizuje index (může trvat 1-4 týdny)
   - PageRank a SEO hodnota se přenese díky 301 redirectu

2. **Monitoring:**
   - Sledovat 404 chyby v Google Search Console
   - Zkontrolovat, že redirecty fungují správně

## 🧪 Testování

Build proběhl úspěšně:
```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (145/145)
```

### Manuální test redirectů:

Po nasazení otestovat:
- https://30yearweather.com/helsinki-fi → /helsinki
- https://30yearweather.com/marrakech-ma/december → /marrakech/december
- https://30yearweather.com/lyon-fr → /lyon
- https://30yearweather.com/bali-id/07-15 → /bali/july/15

## ⚠️ Poznámky

- **Performance:** Edge Middleware běží na Vercel Edge Network, takže redirecty jsou velmi rychlé
- **Vercel Limit:** Původní řešení se statickými redirecty v `next.config.js` překračovalo 5MB limit
- **Řešení:** Přesun do middleware umožňuje dynamické zpracování bez limitů
- **Monitoring:** Sledovat response times po nasazení (očekáváme <50ms overhead)

## 📝 Soubory změněny

1. `src/middleware.ts` - přidána logika pro dynamické redirecty (28.1 kB)
2. `next.config.js` - zjednodušeno (redirecty přesunuty do middleware)
3. `backend/config.py` - opraveno `lyon-fr` → `lyon`
4. Datové soubory pro Lyon přejmenovány
5. `generate_old_slug_mapping.py` - helper script s kompletním mappingem

## ✅ Checklist

- [x] Redirecty implementovány v `src/middleware.ts`
- [x] `next.config.js` zjednodušeno (prázdné redirects)
- [x] Lyon slug opraven v `backend/config.py`
- [x] Lyon datové soubory přejmenovány
- [x] Build test úspěšný (middleware 28.1 kB)
- [x] Vyřešen Vercel 5MB limit problém
- [ ] Deploy na produkci
- [ ] Verifikace v Google Search Console
- [ ] Monitoring 404 errors

---

**Výsledek:** Všechny staré URL z Google indexu budou nyní správně přesměrovány na nové URL s 301 redirectem, což zachová SEO hodnotu.

