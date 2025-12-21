# 🤖 Social Content Generator - Quick Start

## ✨ Co to dělá?

Automaticky generuje Pinterest/Instagram content pro všech 123 měst:
- ✅ SEO-optimized descriptions
- ✅ Ready-to-upload metadata (titles, links, hashtags)
- ✅ (Optional) Programmically generated images

**Časová úspora: 20+ hodin → 5 minut** 🎉

---

## 🚀 Quick Start (Metadata Only - 5 minut)

### 1. Install tsx (TypeScript runner)

```bash
npm install -D tsx
```

### 2. Add script to package.json

Otevřít `package.json` a přidat:

```json
{
  "scripts": {
    "generate:social": "tsx scripts/generate-social-content.ts"
  }
}
```

### 3. Run Generator

```bash
npm run generate:social
```

### 4. Check Output

```
output/social-content/pinterest/
  ├── prague-general.json       ← Pinterest metadata
  ├── prague-wedding.json
  ├── paris-general.json
  ├── paris-wedding.json
  └── ... (246 files for 123 cities × 2 variants)
```

**Example JSON:**
```json
{
  "title": "Best Time to Visit Prague - 30 Year Weather Analysis",
  "description": "Planning a Prague trip? Our 30-year weather analysis shows:\n✨ Best months: May & September (perfect temperatures!)\n🌧️ Rain risk: Only 15% historically\n🌡️ Ideal temps: 18-22°C for comfortable sightseeing\n\nBased on actual NASA satellite data, not guesses. Plan your perfect trip with confidence.\n\nExplore day-by-day weather → 30yearweather.com/prague\n\n#prague #besttimetovisit #travelplanning #weatherdata #traveltips #travelguide",
  "link": "https://30yearweather.com/prague?utm_source=pinterest&utm_medium=pin&utm_campaign=best-time",
  "hashtags": [
    "prague",
    "besttimetovisit",
    "travelplanning",
    "weatherdata",
    "traveltips",
    "praguetravel",
    "travelguide"
  ],
  "board": "Best Time to Visit - Travel Planning"
}
```

---

## 📸 Phase 2: Image Generation (Optional - 2-3 hodiny setup)

### Why Optional?

- Metadata generation (Phase 1) už vám dává 90% hodnoty
- Můžete upload obrázky manuálně z Canvy, ale použít auto-generated descriptions
- Image generation vyžaduje komplexnější setup (Canvas API, fonts)

### When to Do This:

- Pokud chcete **plně automatizovat** (0 manual work)
- Pokud plánujete **často přidávat nová města**
- Pokud chcete **re-generate všechny piny** při rebrandingu

### Setup Steps:

#### 1. Install Canvas

```bash
npm install canvas sharp
```

**Note:** Canvas má native dependencies. Na Windows může vyžadovat:
- Build tools: `npm install --global windows-build-tools` (jako admin)
- Nebo použít WSL2 (Linux subsystem)

#### 2. Download Fonts

```bash
# Create fonts directory
mkdir public\fonts

# Download these Google Fonts:
# - Montserrat Bold
# - Inter Regular 
# - Inter SemiBold

# Paste .ttf files to public/fonts/
```

**Free fonts:** https://fonts.google.com/

#### 3. Implement Image Renderer

Vytvořit `lib/social-generators/pinterest-generator.ts`:

```typescript
import { createCanvas, loadImage, registerFont } from 'canvas';
import type { CityData } from './types';

// Register fonts
registerFont('public/fonts/Montserrat-Bold.ttf', { 
  family: 'Montserrat', 
  weight: 'bold' 
});

export async function generatePinterestPin(
  city: CityData
): Promise<Buffer> {
  const canvas = createCanvas(1000, 1500);
  const ctx = canvas.getContext('2d');
  
  // 1. Load hero image
  const heroImage = await loadImage(city.heroImagePath);
  ctx.drawImage(heroImage, 0, 0, 1000, 375);
  
  // 2. Add white box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(50, 325, 900, 600);
  
  // 3. Add text
  ctx.fillStyle = '#ea580c';
  ctx.font = 'bold 70px Montserrat';
  ctx.textAlign = 'center';
  ctx.fillText(`BEST TIME TO VISIT ${city.name.toUpperCase()}`, 500, 450);
  
  // 4. Add data
  ctx.fillStyle = '#475569';
  ctx.font = '28px Inter';
  ctx.fillText('Based on 30 Years of NASA Data', 500, 520);
  
  // ... (add more styling)
  
  return canvas.toBuffer('image/png');
}
```

#### 4. Uncomment Image Generation

In `scripts/generate-social-content.ts`:

```typescript
// Uncomment this:
const imageBuffer = await generatePinterestPin(city, variant);
await fs.writeFile(path.join(outputDir, `${filename}.png`), imageBuffer);
```

#### 5. Run Full Generation

```bash
npm run generate:social
```

**Output:**
```
output/social-content/pinterest/
  ├── prague-general.png    ← Pinterest image!
  ├── prague-general.json
  ├── prague-wedding.png
  ├── prague-wedding.json
  └── ...
```

---

## 📋 Integration s vaší databází

### Current: Mock Data

```typescript
// scripts/generate-social-content.ts
async function getAllCities(): Promise<CityData[]> {
  return [
    { name: 'Prague', slug: 'prague', ... }  // Hardcoded
  ];
}
```

### TODO: Load Real Data

```typescript
import { getCities } from '@/lib/data/cities'; // Your existing function

async function getAllCities(): Promise<CityData[]> {
  const citiesData = await getCities(); // Load from DB/JSON
  
  return citiesData.map(city => ({
    name: city.meta.name,
    slug: city.meta.slug,
    bestMonths: getBestMonths(city.dailyData), // Your logic
    avgTempMin: getAvgTemp(city.dailyData, 'min'),
    avgTempMax: getAvgTemp(city.dailyData, 'max'),
    rainProbability: getAvgRainProb(city.dailyData),
    crowds: getCrowdLevel(city.tourism),
    heroImagePath: `public/images/${city.meta.slug}-hero.webp`
  }));
}
```

Helper functions můžete vytvořit v `lib/social-generators/data-helpers.ts`.

---

## 🎯 Usage Workflow

### One-Time Setup:
1. ✅ Install dependencies
2. ✅ Connect to your city data
3. ✅ (Optional) Setup image generation

### Regular Usage:

```bash
# Generate content for all cities
npm run generate:social

# Output includes JSON files with:
# - Title
# - Description
# - Link (with UTM parameters)
# - Hashtags
# - Board name

# Then:
# 1. Open Pinterest
# 2. Bulk upload (or one by one)
# 3. Copy-paste from JSON files
```

---

## 💡 Advanced: Bulk Pinterest Upload

Pinterest podporuje bulk upload přes CSV!

### Generate CSV:

Vytvořit `scripts/export-to-csv.ts`:

```typescript
import fs from 'fs';
import path from 'path';

const pinsDir = 'output/social-content/pinterest';
const files = fs.readdirSync(pinsDir).filter(f => f.endsWith('.json'));

const csvRows = ['Title,Description,Link,ImagePath,Board'];

for (const file of files) {
  const metadata = JSON.parse(fs.readFileSync(path.join(pinsDir, file), 'utf-8'));
  const imagePath = file.replace('.json', '.png');
  
  csvRows.push([
    metadata.title,
    metadata.description,
    metadata.link,
    imagePath,
    metadata.board
  ].join(','));
}

fs.writeFileSync('pinterest-bulk-upload.csv', csvRows.join('\n'));
console.log('✅ CSV created: pinterest-bulk-upload.csv');
```

Run:
```bash
tsx scripts/export-to-csv.ts
```

Upload CSV do Pinterest → All pins uploaded at once! 🚀

---

## 📊 Expansion Ideas

### Instagram Support:

```typescript
// lib/social-generators/instagram-generator.ts

export async function generateInstagramPost(city: CityData): Promise<Buffer> {
  const canvas = createCanvas(1080, 1080); // Square format
  // ... similar logic but square layout
}
```

### Seasonal Variants:

```typescript
export function generateSeasonalDescription(
  city: CityData,
  season: 'spring' | 'summer' | 'fall' | 'winter'
): PinMetadata {
  // Generate season-specific pins
  // "Best Spring Destinations"
  // "Warm Winter Escapes"
}
```

### A/B Testing:

Generate multiple description variants, track which performs best in Pinterest Analytics.

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'tsx'"

```bash
npm install -D tsx
```

### Error: "Cannot find module 'canvas'"

Canvas má native dependencies. Try:

```bash
# Windows (as admin):
npm install --global windows-build-tools
npm install canvas

# Mac:
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm install canvas

# Linux:
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm install canvas
```

Or skip image generation and use Canva manually with auto-generated descriptions.

### Script runs but no output?

Check:
```bash
ls output/social-content/pinterest/
```

If empty, check console errors.

---

## 🎉 Success Metrics

Po implementaci:

**Before (Manual):**
- 20-30 hodin na 123 měst × 3 varianty
- Typos v descriptions
- Inconsistent formatting

**After (Automated):**
- 5-20 minut na všech 369 pins
- Zero typos
- Perfect consistency
- Easy to regenerate
- Scalable (přidáte měst → automatic)

**ROI: 95%+ time savings!** 💪

---

## 📝 Next Steps

1. **Dnes:** Run metadata generation (5 min)
2. **Víkend:** Hookup real city data (1-2 hodiny)
3. **Later:** (Optional) Setup image generation (2-3 hodiny)

**Quick win:** Už teď můžete použít auto-generated descriptions s manuálními Canva images! Best of both worlds. 🎨

Questions? Check `SOCIAL_CONTENT_GENERATOR_PLAN.md` pro detailní technical docs.

Happy automating! 🤖✨
