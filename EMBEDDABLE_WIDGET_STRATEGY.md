# 🔌 Embeddable Widget Strategy - Passive Backlinks

## 🎯 Co je "Embeddable Widget"?

**Definice:** Kousek kódu (iframe nebo JavaScript), který travel bloggeři mohou vložit na svůj web a zobrazí se jim váš interaktivní nástroj.

**Analogie:** Jako když blog má Google Maps embed, nebo YouTube video embed - je to "živý" obsah z vašeho webu, který běží na cizím webu.

---

## 💡 Proč to funguje?

### **Výhody pro bloggera:**
✅ Free užitečný nástroj pro jejich čtenáře
✅ Interaktivní content (zvyšuje engagement)
✅ Nemusí nic programovat
✅ Automaticky aktualizovaná data

### **Výhody pro vás:**
✅ **Backlink** (iframe/script tag = odkaz na váš web)
✅ **Pasivní** (widget zůstává na jejich webu roky)
✅ **Scaled** (1 widget = tisíce bloggerů můžou použít)
✅ **Traffic** (některé uživatelé kliknou "Powered by 30YearWeather")

---

## 📊 Příklad: "Best Time to Visit" Widget

### Jak to vypadá na bloggera webu:

```html
<!-- Travel blogger si vloží tento kód -->
<iframe 
  src="https://30yearweather.com/widget/best-time/prague" 
  width="100%" 
  height="500px"
  frameborder="0">
</iframe>
```

### Co se zobrazí návštěvníkům blogu:

```
┌─────────────────────────────────────┐
│  Best Time to Visit Prague          │
│                                     │
│  🌡️ Temperature: 18-22°C            │
│  ☔ Rain Risk: 15%                  │
│  👥 Crowds: Moderate                │
│  💰 Prices: Mid-range               │
│                                     │
│  📊 [Monthly Chart]                 │
│                                     │
│  Powered by 30YearWeather.com  →   │ ← BACKLINK!
└─────────────────────────────────────┘
```

**Výsledek:**
- Blogger dostane užitečný widget
- Vy dostanete backlink + brand exposure
- Widget zůstane na jejich webu roky (evergreen backlink!)

---

## 🛠️ Jaké Widgety Vytvořit?

### **Widget 1: "Best Time to Visit Badge"** ⭐ PRIORITA #1

**Účel:** Ukáže nejlepší měsíce pro návštěvu města

**Použití:** Travel bloggeři vloží na "Best time to visit [City]" články

**Design:**
```
┌───────────────────────────┐
│ BEST TIME TO VISIT PRAGUE │
├───────────────────────────┤
│                           │
│  🌸 May     ⭐⭐⭐⭐⭐     │
│  ☀️ June    ⭐⭐⭐⭐☆     │
│  🍂 Sept    ⭐⭐⭐⭐⭐     │
│                           │
│  Based on 30 years data   │
│  → 30YearWeather.com      │
└───────────────────────────┘
```

**Embed kód:**
```html
<iframe 
  src="https://30yearweather.com/widgets/best-time/prague" 
  width="300" 
  height="400" 
  style="border: 1px solid #ddd; border-radius: 8px;">
</iframe>
```

**Target bloggeři:**
- "Best time to visit Prague" articles (tisíce článků na Google)
- "Prague travel guide" 
- "Europe itinerary" blogs

---

### **Widget 2: "Rain Probability Calculator"**

**Účel:** Interaktivní - uživatel vybere měsíc, zobrazí se šance deště

**Design:**
```
┌────────────────────────────────┐
│  PRAGUE RAIN PROBABILITY       │
├────────────────────────────────┤
│                                │
│  Select Month: [May ▼]         │
│                                │
│  ☔ Rain Chance: 15%            │
│  📊 [Bar chart by week]        │
│                                │
│  Based on 30 years of data     │
│  Powered by 30YearWeather →    │
└────────────────────────────────┘
```

**Použití:**
- "Outdoor wedding planning" blogs
- "Festival weather" guides
- " Photography location" sites

---

### **Widget 3: "Temperature Chart"**

**Účel:** Interaktivní graf teplot pro celý rok

**Design:**
```
┌─────────────────────────────────┐
│  PRAGUE TEMPERATURE YEAR-ROUND  │
├─────────────────────────────────┤
│                                 │
│      📈 [12-month line chart]   │
│                                 │
│  Coldest: Jan (-2°C)            │
│  Warmest: July (24°C)           │
│                                 │
│  → See detailed forecast        │
│  30YearWeather.com              │
└─────────────────────────────────┘
```

**Použití:**
- "What to pack for Prague" articles
- "Prague weather guide"
- "Study abroad" blogs

---

## 📧 Outreach Template - Blogger Pitch

### Email Subject:
```
Free Weather Widget for Your [City] Travel Blog
```

### Email Body:
```
Hi [Name],

I came across your article "[Article Title]" and loved your tips about [specific detail you genuinely liked].

I noticed you mentioned weather/best time to visit, and I thought you might like this:

I built a free embeddable weather widget specifically for travel bloggers. It shows historical weather data (30 years of NASA satellite info) in a clean, interactive format.

Here's what it looks like: [Screenshot or demo link]

**It's:**
✅ 100% free
✅ Auto-updating (you never touch it again)
✅ Customizable for any city
✅ Mobile-responsive
✅ No ads, no popups

Your readers would get a helpful tool, and it would save you from having to manually update weather info.

Interested? I can send you the embed code - it's literally copy-paste, takes 30 seconds to add.

Happy to customize the colors to match your blog's style too!

Cheers,
Michael
Founder, 30YearWeather.com

P.S. If you're interested, I can also create a custom widget for your top 5 destination cities.
```

**Conversion rate:** ~10-20% (1 in 5-10 bloggers will say yes)

---

## 🎯 Target Bloggers - Where to Find Them

### **Google Search:**
```
"best time to visit prague" blog
"prague travel guide" 
"europe travel blog"
"outdoor wedding planning blog"
"destination wedding blog"
```

### **Find Contact Info:**
1. Look for "About" or "Contact" page
2. Search for email in footer
3. Use hunter.io to find email addresses

### **Quality Check:**
- Domain Authority 20+ (use Ahrefs or Moz)
- Active blog (posted in last 3 months)
- Has travel/weather articles
- Gets some traffic (not a ghost blog)

---

## 💻 Technical Implementation (NEXT.js)

### Step 1: Create Widget Routes

**File:** `src/app/widgets/best-time/[city]/page.tsx`

```typescript
// Minimalist widget page (iframe-able)
export default async function BestTimeWidget({ params }: { params: { city: string } }) {
  const cityData = await getCityData(params.city);
  
  return (
    <div className="widget-container">
      {/* No header, no footer, just widget content */}
      <BestTimeDisplay data={cityData} />
      
      {/* Branding link (backlink!) */}
      <a href="https://30yearweather.com" target="_blank">
        Powered by 30YearWeather
      </a>
    </div>
  );
}
```

### Step 2: Create Widget Component

**File:** `src/components/widgets/BestTimeDisplay.tsx`

```typescript
export default function BestTimeDisplay({ data }) {
  const bestMonths = getBestMonths(data); // Your logic
  
  return (
    <div className="best-time-widget">
      <h3>Best Time to Visit {data.meta.name}</h3>
      
      {bestMonths.map(month => (
        <div key={month.number} className="month-card">
          <span className="month-name">{month.name}</span>
          <span className="rating">{'⭐'.repeat(month.rating)}</span>
          <span className="temp">{month.avgTemp}°C</span>
          <span className="rain">{month.rainProb}% rain</span>
        </div>
      ))}
      
      <p className="data-source">Based on 30 years of NASA data</p>
    </div>
  );
}
```

### Step 3: Widget Landing Page

**File:** `src/app/widgets/page.tsx`

```typescript
// Main widgets page with embed codes
export default function WidgetsPage() {
  return (
    <div className="widgets-landing">
      <h1>Free Embeddable Weather Widgets</h1>
      <p>Add interactive weather tools to your blog</p>
      
      {/* Widget showcase */}
      <WidgetShowcase />
      
      {/* Embed code generator */}
      <EmbedCodeGenerator />
      
      {/* CTA for bloggers */}
      <BloggerCTA />
    </div>
  );
}
```

---

## 📈 Expected Results

### **Month 1 (Setup + Outreach):**
- Create 3 widgets
- Email 50 bloggers
- Get 5-10 embeds

**Result:** 5-10 passive backlinks

### **Month 3 (Scaled Outreach):**
- Email 200 bloggers
- Get 30-40 embeds
- Some bloggers share with colleagues

**Result:** 30-40 backlinks + word-of-mouth growth

### **Month 6 (Virální růst):**
- Bloggers discover widgets organically (Google search "free weather widget")
- 100+ embeds on travel blogs
- Domain Authority boost from diverse backlinks

**Result:** 100+ evergreen backlinks, passive traffic

---

## 🚀 Quick Start Action Plan

### **This Week:**
1. ✅ Create basic widget page (`/widgets/best-time/[city]`)
2. ✅ Test with Prague, Paris, Tokyo
3. ✅ Create landing page with embed codes
4. ✅ Take screenshots for outreach

### **Next Week:**
1. ✅ Find 50 travel bloggers (use Google search)
2. ✅ Send 10 outreach emails/day
3. ✅ Track responses in spreadsheet

### **Following Weeks:**
1. ✅ Respond to interested bloggers
2. ✅ Track embeds (Google Analytics referrers)
3. ✅ Scale outreach to 100+ bloggers

---

## 💡 Pro Tips

### **Make It Easy:**
- Provide copy-paste embed code
- No registration required
- No API keys needed
- Just works™

### **Show Value First:**
- Demo on your own site
- Screenshot for emails
- Live preview link

### **Track Everything:**
```
// Add UTM to widget backlinks
Powered by 30YearWeather.com?utm_source=widget&utm_medium=embed&utm_campaign=blogger_[blogname]
```

### **Iterate Based on Feedback:**
- Ask bloggers what they want
- Add requested features
- Build relationships (they'll link to you again!)

---

## 🎁 Bonus: Widget Variations

### For Different Niches:

1. **Wedding blogs:** "Perfect Wedding Dates" widget
2. **Photography:** "Golden Hour Times" widget
3. **Festivals:** "Event Weather Risk" widget
4. **Students:** "Study Abroad Weather Guide" widget

Each niche = different blogger audience = more backlinks!

---

## TL;DR

**Embeddable Widget =**
- Free tool bloggers vložá na svůj web
- Zobrazuje vaše data
- Obsahuje link zpět na váš site (backlink!)
- Zůstává tam roky (passive backlinks)

**Effort:** Medium (build once, outreach ongoing)
**Reward:** High (100+ evergreen backlinks within 6 months)

**Next step:** Build simple "Best Time to Visit" widget for top 10 cities, email 50 bloggers, see if there's interest!

Want me to help build the actual widget code? 🔧
