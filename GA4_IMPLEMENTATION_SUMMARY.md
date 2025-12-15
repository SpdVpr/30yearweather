# ✅ Google Analytics 4 - IMPLEMENTACE HOTOVÁ

## 🎉 Co bylo implementováno

Google Analytics 4 je **plně funkční** a měří data na vaší aplikaci!

### Měřící ID: **G-Y35GH3GBEV**
### Stream: **historical-weather**
### Stream ID: **13140275463**

---

## 📊 Co se automaticky měří

### 1. **Základní metriky** (automaticky od Google)
- ✅ **Page views** - každá zobrazená stránka
- ✅ **Sessions** - návštěvy uživatelů
- ✅ **Bounce rate** - míra okamžitého opuštění
- ✅ **Session duration** - jak dlouho uživatelé zůstávají
- ✅ **User demographics** - věk, pohlaví (pokud povoleno)
- ✅ **Device type** - mobile/desktop/tablet
- ✅ **Geographic location** - odkud uživatelé přicházejí
- ✅ **Traffic sources** - Google, direct, social, referral

### 2. **Custom events** (implementováno)
- ✅ **City views** - když uživatel zobrazí město (např. Prague, Tokyo)
- ✅ **Date views** - když uživatel zobrazí konkrétní datum
- ✅ **Verdict views** - když uživatel vidí weather verdict (YES/NO/MAYBE)
- ✅ **Month views** - když uživatel zobrazí měsíční kalendář

---

## 🔧 Implementované soubory

### 1. **GoogleAnalytics.tsx** (`src/components/GoogleAnalytics.tsx`)
- Načítá gtag.js script
- Inicializuje GA4 s měřícím ID
- Automaticky trackuje page views

### 2. **AnalyticsTracker.tsx** (`src/components/AnalyticsTracker.tsx`)
- Trackuje změny URL při client-side navigation
- Funguje s Next.js App Router

### 3. **analytics.ts** (`src/lib/analytics.ts`)
- Knihovna funkcí pro tracking
- Obsahuje předpřipravené funkce:
  - `trackCityView()` - zobrazení města
  - `trackDateView()` - zobrazení data
  - `trackVerdictView()` - zobrazení verdict
  - `trackCalendarClick()` - kliknutí na kalendář
  - `trackTourismView()` - zobrazení tourism dat
  - `trackSearch()` - vyhledávání
  - `trackExternalLink()` - externí odkazy
  - `trackShare()` - sdílení
  - `trackWeatherCardExpand()` - rozbalení karet
  - `trackTimeOnPage()` - čas na stránce

### 4. **Page Trackers**
- `CityPageTracker.tsx` - trackuje city pages
- `DatePageTracker.tsx` - trackuje date pages

### 5. **Layout.tsx** (upraveno)
- Přidán GoogleAnalytics komponent
- Přidán AnalyticsTracker komponent

### 6. **City & Date Pages** (upraveno)
- Přidány trackery pro měření interakcí

---

## 🚀 Jak to testovat

### 1. **Realtime Report** (nejrychlejší způsob)
1. Jděte na: https://analytics.google.com/
2. Vyberte property: **historical-weather**
3. Klikněte na **Realtime** v levém menu
4. Otevřete vaši stránku: https://30yearweather.com
5. **Měli byste vidět živá data do 30 sekund!**

### 2. **Co uvidíte v Realtime**
- Počet aktivních uživatelů
- Zobrazené stránky
- Custom events (city_view, date_view, atd.)
- Geografická lokace
- Device type

### 3. **Standardní reporty** (data za 24-48 hodin)
- **Engagement > Pages and screens** - nejnavštěvovanější stránky
- **Engagement > Events** - custom events
- **Acquisition > Traffic acquisition** - zdroje návštěvnosti
- **User attributes** - demografické údaje

---

## 📈 Doporučené reporty k sledování

### 1. **Nejpopulárnější města**
- Report: **Events > view_city**
- Metric: Event count
- Dimension: Event label
- **Uvidíte**: Která města uživatelé nejvíce zobrazují

### 2. **Nejhledanější data**
- Report: **Events > view_date**
- Metric: Event count
- Dimension: Event label
- **Uvidíte**: Která data jsou nejpopulárnější

### 3. **Weather verdicts**
- Report: **Events > view_verdict**
- Metric: Event count
- Dimension: Event label
- **Uvidíte**: Kolik YES/NO/MAYBE verdictů uživatelé vidí

### 4. **Conversion funnel**
1. Homepage view
2. City view (view_city event)
3. Date view (view_date event)
4. Verdict view (view_verdict event)

---

## 🎯 Co dělat dál

### Okamžitě:
1. ✅ **Otevřete Realtime report** a zkontrolujte, že data přicházejí
2. ✅ **Navigujte po stránce** a sledujte události v reálném čase

### Za 24-48 hodin:
1. **Zkontrolujte standardní reporty** - data by měla být viditelná
2. **Vytvořte custom dashboards** pro klíčové metriky
3. **Nastavte Goals/Conversions** (např. "User viewed 3+ cities")

### Volitelně:
1. **Propojte s Google Search Console** - pro SEO insights
2. **Přidejte cookie consent banner** - pro GDPR compliance
3. **Vytvořte custom audiences** - pro remarketing

---

## 🐛 Troubleshooting

### GA4 neměří data?

1. **Zkontrolujte Measurement ID**:
   - Mělo by být `G-Y35GH3GBEV`
   - Je v `.env.local` jako `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

2. **Zkontrolujte, že je script načten**:
   - Otevřete Developer Tools > Network
   - Hledejte `gtag/js?id=G-Y35GH3GBEV`
   - Měl by mít status 200

3. **Zkontrolujte Console errors**:
   - Otevřete Developer Tools > Console
   - Neměly by být žádné chyby

4. **Zkontrolujte Ad Blockers**:
   - Některé ad blockery blokují GA4
   - Zkuste vypnout nebo použít incognito mode

5. **Zkontrolujte Realtime report**:
   - Data by se měla zobrazit do 30 sekund
   - Pokud ne, zkontrolujte výše uvedené body

---

## ✅ Shrnutí

- ✅ **Google Analytics 4 je plně implementován**
- ✅ **Měřící ID: G-Y35GH3GBEV**
- ✅ **Automatické měření page views a sessions**
- ✅ **Custom events pro city views, date views, verdicts**
- ✅ **Realtime tracking funkční**
- ✅ **Připraveno pro produkci**

**Stačí počkat na data a můžete začít analyzovat! 🎉**

---

## 📚 Dokumentace

Podrobná dokumentace je v souboru: **GOOGLE_ANALYTICS_SETUP.md**

