# Google Analytics 4 Implementation

## ✅ Implementováno

Google Analytics 4 (GA4) je plně implementován v aplikaci s měřícím ID: **G-Y35GH3GBEV**

### Co bylo přidáno:

1. **Google Analytics komponenta** (`src/components/GoogleAnalytics.tsx`)
   - Načítá gtag.js script
   - Inicializuje GA4 s vaším měřícím ID
   - Automaticky trackuje page views

2. **Analytics Tracker** (`src/components/AnalyticsTracker.tsx`)
   - Automaticky trackuje změny URL (client-side navigation)
   - Funguje s Next.js App Router

3. **Analytics knihovna** (`src/lib/analytics.ts`)
   - Funkce pro tracking custom events
   - Předpřipravené funkce pro tracking:
     - `trackCityView()` - zobrazení města
     - `trackDateView()` - zobrazení konkrétního data
     - `trackVerdictView()` - zobrazení weather verdict
     - `trackCalendarClick()` - kliknutí na kalendář
     - `trackTourismView()` - zobrazení tourism dat
     - `trackSearch()` - vyhledávání
     - `trackExternalLink()` - kliknutí na externí odkazy
     - `trackShare()` - sdílení na sociálních sítích
     - `trackWeatherCardExpand()` - rozbalení weather karet
     - `trackTimeOnPage()` - čas strávený na stránce

4. **Page Trackers**
   - `CityPageTracker` - trackuje zobrazení city pages
   - `DatePageTracker` - trackuje zobrazení date pages a month views

## 📊 Co se měří automaticky:

### Základní metriky (automaticky):
- ✅ Page views (všechny stránky)
- ✅ Session duration
- ✅ Bounce rate
- ✅ User demographics (pokud povoleno v GA4)
- ✅ Device type (mobile/desktop/tablet)
- ✅ Geographic location
- ✅ Traffic sources

### Custom events (implementováno):
- ✅ City views - když uživatel zobrazí město
- ✅ Date views - když uživatel zobrazí konkrétní datum
- ✅ Verdict views - když uživatel vidí weather verdict (YES/NO/MAYBE)
- ✅ Month views - když uživatel zobrazí měsíční kalendář

### Připraveno k použití (stačí zavolat funkci):
- Calendar clicks
- Tourism data views
- Search queries
- External link clicks
- Social shares
- Weather card expansions
- Time on page tracking

## 🚀 Jak používat custom tracking

### Příklad 1: Track kliknutí na kalendář
```typescript
import { trackCalendarClick } from '@/lib/analytics';

// V komponentě:
<button onClick={() => trackCalendarClick('Prague', 'January')}>
  View January
</button>
```

### Příklad 2: Track sdílení
```typescript
import { trackShare } from '@/lib/analytics';

// Při sdílení:
trackShare('facebook', 'Prague', '01-15');
```

### Příklad 3: Track čas na stránce
```typescript
import { trackTimeOnPage } from '@/lib/analytics';

useEffect(() => {
  const startTime = Date.now();
  
  return () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackTimeOnPage('Prague', timeSpent);
  };
}, []);
```

## 🔍 Kde najít data v Google Analytics

1. **Přihlaste se do Google Analytics**: https://analytics.google.com/
2. **Vyberte property**: historical-weather (G-Y35GH3GBEV)
3. **Reports**:
   - **Realtime** - živá data (uvidíte návštěvníky hned)
   - **Engagement > Pages and screens** - nejnavštěvovanější stránky
   - **Engagement > Events** - custom events (city views, date views, atd.)
   - **Acquisition > Traffic acquisition** - odkud přicházejí uživatelé
   - **User attributes** - demografické údaje

## 📈 Doporučené reporty k sledování

### 1. Nejpopulárnější města
- **Report**: Events > view_city
- **Metric**: Event count
- **Dimension**: Event label (obsahuje název města)

### 2. Nejhledanější data
- **Report**: Events > view_date
- **Metric**: Event count
- **Dimension**: Event label (obsahuje město + datum)

### 3. Weather verdicts
- **Report**: Events > view_verdict
- **Metric**: Event count
- **Dimension**: Event label (YES/NO/MAYBE)

### 4. Conversion funnel
1. Homepage view
2. City view (view_city event)
3. Date view (view_date event)
4. Verdict view (view_verdict event)

## 🧪 Testování

### Jak otestovat, že GA4 funguje:

1. **Spusťte aplikaci lokálně**:
   ```bash
   npm run dev
   ```

2. **Otevřete v prohlížeči**: http://localhost:3000

3. **Otevřete Google Analytics Realtime**:
   - Jděte na https://analytics.google.com/
   - Vyberte property "historical-weather"
   - Klikněte na "Realtime"

4. **Navigujte po aplikaci**:
   - Klikněte na město
   - Klikněte na datum
   - Měli byste vidět události v Realtime reportu

5. **Zkontrolujte Console**:
   - Otevřete Developer Tools (F12)
   - V Console by neměly být žádné chyby
   - Můžete vidět gtag() volání

### Debug mode

Pro detailní debugging přidejte do URL: `?debug_mode=true`

Nebo v konzoli prohlížeče:
```javascript
window.gtag('config', 'G-Y35GH3GBEV', {
  debug_mode: true
});
```

## 🔒 Privacy & GDPR

Aktuálně je GA4 aktivní bez cookie consent banneru. Pro GDPR compliance doporučuji:

1. **Přidat cookie consent banner** (např. pomocí knihovny jako `react-cookie-consent`)
2. **Anonymizovat IP adresy** (GA4 to dělá automaticky)
3. **Přidat Privacy Policy** stránku
4. **Povolit opt-out** pro uživatele

### Příklad cookie consent:
```bash
npm install react-cookie-consent
```

```typescript
import CookieConsent from "react-cookie-consent";

<CookieConsent
  enableDeclineButton
  onAccept={() => {
    // Enable GA4
  }}
  onDecline={() => {
    // Disable GA4
    window['ga-disable-G-Y35GH3GBEV'] = true;
  }}
>
  This website uses cookies to enhance the user experience.
</CookieConsent>
```

## 📝 Environment Variables

Ujistěte se, že máte v `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Y35GH3GBEV
```

✅ Toto už máte nastaveno!

## 🎯 Next Steps

1. **Počkejte 24-48 hodin** - GA4 potřebuje čas na sběr dat
2. **Zkontrolujte Realtime report** - měli byste vidět živá data hned
3. **Nastavte Goals/Conversions** v GA4 (např. "User viewed 3+ cities")
4. **Vytvořte custom dashboards** pro klíčové metriky
5. **Propojte s Google Search Console** pro SEO insights

## 🐛 Troubleshooting

### GA4 neměří data:

1. **Zkontrolujte Measurement ID**:
   - Mělo by být `G-Y35GH3GBEV`
   - Zkontrolujte v `.env.local`

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

## ✅ Hotovo!

Google Analytics 4 je plně implementován a měří:
- ✅ Page views
- ✅ City views
- ✅ Date views
- ✅ Verdict views
- ✅ Month views
- ✅ User behavior
- ✅ Traffic sources
- ✅ Device types
- ✅ Geographic data

Stačí počkat na data a můžete začít analyzovat! 🎉

