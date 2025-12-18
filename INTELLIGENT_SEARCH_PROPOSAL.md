# Návrh: Next-Gen Inteligentní Vyhledávač (Intelligent Travel Finder)

## 1. Koncept a Vize
Cílem je vytvořit nástroj, který nefunguje jen jako databázový filtr, ale jako **osobní cestovní asistent**. Uživatel by neměl zadávat technické parametry ("teplota nad 25°C"), ale spíše své touhy a potřeby ("chci se ohřát, surfovat a mít klid").

### Klíčové odlišení od konkurence
*   **Match skóre**: Místo prostého filtrování vypočítáme "procento shody" (např. "Bali je pro tebe v prosinci 94% match").
*   **Přirozený jazyk (NLP lite)**: Možnost napsat "Levné teplo v únoru bez dětí".
*   **Reálná data**: Využití existujícího 30letého datasetu pro přesné určení pravděpodobnosti srážek a teploty, kombinované s novým indexem turismu (davy/ceny).

---

## 2. Způsob Implementace (Architektura)

Protože aplikaci provozujeme na Next.js a máme statická data (JSON), je nejefektivnější řešení **Client-Side Search Index**.

### A. Generování Indexu (`search-index.json`)
Vytvoříme skript, který při `build` procesu projde všechna města v `d:\historical-weather\data\` a vytvoří lehký index.

**Struktura Indexu (příklad):**
```json
[
  {
    "slug": "bali-id",
    "name": "Bali",
    "country": "Indonesia",
    "coords": { "lat": -8.409, "lon": 115.188 },
    "tags": ["surf", "tropical", "nightlife", "nature"],
    "months": [
      {
        "m": 12, 
        "temp_max": 28.5, 
        "rain_days": 15, 
        "crowd_score": 85, 
        "price_score": 90,
        "wind_avg": 25,     // Pro surf
        "water_temp": 27    // Pokud máme marine data
      },
      ...
    ]
  }
]
```

### B. Vyhledávací Algoritmus (Frontend)
Na klientovi načteme tento JSON (bude malý, cca 50-100kb pro 100 měst) a budeme filtrovat v reálném čase.

**Logika vypočtu shody (Match Score):**
Algoritmus oboduje každé město pro vybraný měsíc:
1.  **Teplota**: 100 bodů, pokud je přesně v preferovaném rozmezí, klesá se vzdáleností.
2.  **Déšť**: Penalizace za vysokou pravděpodobnost srážek, pokud uživatel chce "slunce".
3.  **Davy (Crowds)**: Pokud uživatel chce "klid", města s `crowd_score > 70` dostanou penalizaci.
4.  **Vzdálenost**: Vypočítáme "Great Circle Distance" z Prahy (nebo zadaného města) do destinace. Přibližný letový čas = `vzdálenost / 800 km/h`.

---

## 3. Uživatelské Rozhraní (UI/UX)

Navrhuji vytvořit novou stránku `/finder` (nebo `/explore`), která bude mít dvě vizuální podoby:

### Režim 1: "Průvodce" (Wizard)
Série 3-4 jednoduchých otázek s velkými, vizuálními kartami:
1.  **Kdy chceš jet?** (Tento měsíc / Konkrétní měsíc / Je mi to jedno)
2.  **Po čem toužíš?** (Pláž & Moře / Hory & Turistika / Město & Kultura / Surf & Adrenalin)
3.  **Jaké počasí?** (Horko / Příjemně / Chladno)
4.  **Speciální přání?** (Bez davů / Levně / Krátký let)

### Režim 2: "Dashboard" (Smart Filter)
Panel na boku obrazovky, kde si uživatel "namíchá" ideální dovolenou:
*   **Posuvníky (Sliders)**: Teplota (15-35°C), Max. délka letu (hodiny).
*   **Přepínače (Toggles)**: "Chci moře", "Bez deště", "Surfování".
*   **Výsledky**: Zobrazují se okamžitě jako mřížka karet seřazená podle "% shody".

---

## 4. Budoucí Rozšíření (Letenky a Zájezdy)

Jakmile budeme mít tento základ, snadno napojíme externí API:
1.  **Letenky**: Pro "Top 3" výsledky pošleme dotaz na API (např. Kiwi Tequila API nebo Skyscanner) s parametry: `origin=PRG`, `dest=DPS`, `date=2025-12-01`.
    *   *Zobrazíme*: "Nejlevnější letenka od 15.000 Kč".
2.  **Zájezdy**: Napojení na XML feedy cestovních agentur (Invia, Booking).

---

## 5. Konkrétní kroky pro teď

Pokud souhlasíš, můžeme začít takto:

1.  **Analýza dat**:
    *   Vytvořím skript `scripts/generate-search-index.js`, který z `d:\historical-weather\data` vytáhne potřebná data.
    *   Musíme vyřešit, kde vzít data pro "Surfování" (můžeme odvodit z "Coastal" + síly větru, nebo ručně otagovat).
2.  **Frontend prototyp**:
    *   Vytvořím komponentu `IntelligentSearch.tsx` s logikou "Match Score".
    *   Implementuji výpočet vzdálenosti z Prahy (hardcoded pro začátek).

Co na to říkáš? Mám připravit ten skript pro generování indexu?
