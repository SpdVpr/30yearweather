# 🤖 Automated Social Content Generator - Technical Plan

## 🎯 Cíl

**Automaticky generovat Pinterest/Instagram content pro všech 123 měst:**
- 369+ obrázků (3 varianty × 123 měst)
- SEO-optimized descriptions
- Ready-to-upload formát
- **Časová úspora: 50+ hodin → 5 minut**

---

## 🏗️ Architektura

### Stack:
```
Next.js 14 (existing)
node-canvas (pro rendering obrázků)
Sharp (image optimization)
OpenAI API (optional: AI-generated descriptions)
```

### Struktura:
```
/scripts/
  └── generate-social-content.ts    ← Main script
  
/lib/
  └── social-generators/
      ├── pinterest-generator.ts    ← Pinterest pin renderer
      ├── instagram-generator.ts    ← Instagram post renderer
      └── description-generator.ts  ← SEO description creator
      
/templates/
  └── social/
      ├── template-a-data-driven.ts
      ├── template-b-minimal.ts
      └── template-c-wedding.ts
      
/output/
  └── social-content/
      ├── pinterest/
      │   ├── prague-best-time.png
      │   ├── prague-best-time.json
      │   └── ...
      └── instagram/
          ├── prague-square.png
          ├── prague-square.json
          └── ...
```

---

## 🎨 Template Rendering - Canvas API

### Example: Template A Renderer

```typescript
// lib/social-generators/pinterest-generator.ts
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';

interface CityData {
  name: string;
  slug: string;
  bestMonths: string[];
  avgTemp: string;
  rainProbability: number;
  crowds: 'Low' | 'Moderate' | 'High';
  heroImagePath: string;
}

export async function generatePinterestPin(
  cityData: CityData,
  variant: 'A' | 'B' | 'C'
): Promise<Buffer> {
  
  const WIDTH = 1000;
  const HEIGHT = 1500;
  
  // Create canvas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  
  // Register fonts (download Google Fonts locally first)
  registerFont(path.join(process.cwd(), 'public/fonts/Montserrat-Bold.ttf'), { 
    family: 'Montserrat', 
    weight: 'bold' 
  });
  registerFont(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), { 
    family: 'Inter' 
  });
  
  if (variant === 'A') {
    return renderTemplateA(ctx, cityData, WIDTH, HEIGHT);
  } else if (variant === 'B') {
    return renderTemplateB(ctx, cityData, WIDTH, HEIGHT);
  } else {
    return renderTemplateC(ctx, cityData, WIDTH, HEIGHT);
  }
}

async function renderTemplateA(
  ctx: CanvasRenderingContext2D, 
  city: CityData,
  width: number,
  height: number
): Promise<Buffer> {
  
  // 1. BACKGROUND - White
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // 2. HERO IMAGE (top 25%)
  const heroImage = await loadImage(city.heroImagePath);
  const heroHeight = height * 0.25;
  ctx.drawImage(heroImage, 0, 0, width, heroHeight);
  
  // 3. GRADIENT OVERLAY on hero (for text readability)
  const gradient = ctx.createLinearGradient(0, 0, 0, heroHeight);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, heroHeight);
  
  // 4. WHITE CONTENT BOX (middle section)
  const boxY = heroHeight - 50;
  const boxHeight = 600;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  roundRect(ctx, 50, boxY, width - 100, boxHeight, 15);
  ctx.fill();
  
  // Add subtle shadow
  ctx.shadowColor = 'rgba(0,0,0,0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 10;
  
  // 5. HEADLINE - Orange
  ctx.shadowColor = 'transparent'; // Reset shadow
  ctx.fillStyle = '#ea580c';
  ctx.font = 'bold 70px Montserrat';
  ctx.textAlign = 'center';
  const headlineText = `BEST TIME TO VISIT ${city.name.toUpperCase()}`;
  wrapText(ctx, headlineText, width / 2, boxY + 80, width - 150, 80);
  
  // 6. SUBHEADLINE - Gray
  ctx.fillStyle = '#475569';
  ctx.font = '28px Inter';
  ctx.fillText('Based on 30 Years of NASA Data', width / 2, boxY + 200);
  
  // 7. DATA CARDS (2x2 grid)
  const cardWidth = 200;
  const cardHeight = 120;
  const cardSpacing = 40;
  const cardsStartY = boxY + 260;
  
  const cards = [
    { emoji: '🌡️', label: 'Perfect Temps', value: city.avgTemp },
    { emoji: '☔', label: 'Low Rain Risk', value: `${city.rainProbability}% Chance` },
    { emoji: '☀️', label: 'Best Months', value: city.bestMonths.join(' & ') },
    { emoji: '👥', label: 'Crowds', value: city.crowds }
  ];
  
  cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = (width / 2) - cardWidth - cardSpacing / 2 + (col * (cardWidth + cardSpacing));
    const y = cardsStartY + (row * (cardHeight + 30));
    
    // Card background
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, cardWidth, cardHeight, 10);
    ctx.fill();
    ctx.stroke();
    
    // Emoji
    ctx.font = '48px Arial';
    ctx.fillText(card.emoji, x + cardWidth / 2, y + 50);
    
    // Label
    ctx.fillStyle = '#1e293b';
    ctx.font = '600 20px Inter';
    ctx.fillText(card.label, x + cardWidth / 2, y + 75);
    
    // Value
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 22px Inter';
    ctx.fillText(card.value, x + cardWidth / 2, y + 105);
  });
  
  // 8. BOTTOM GRADIENT BACKGROUND
  const bottomGradient = ctx.createLinearGradient(0, height - 250, 0, height);
  bottomGradient.addColorStop(0, '#ffffff');
  bottomGradient.addColorStop(1, '#fff7ed');
  ctx.fillStyle = bottomGradient;
  ctx.fillRect(0, height - 250, width, 250);
  
  // 9. MINI WEATHER CHART (placeholder - můžete implementovat skutečný graf)
  // For now, simple line
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, height - 200);
  ctx.lineTo(200, height - 170);
  ctx.lineTo(300, height - 180);
  ctx.lineTo(400, height - 150);
  // ... (můžete použít skutečná měsíční data)
  ctx.stroke();
  
  // 10. BRANDING - Bottom center
  ctx.fillStyle = '#ea580c';
  ctx.font = '24px Inter';
  ctx.fillText('30YearWeather.com →', width / 2, height - 40);
  
  // Return as buffer
  return canvas.toBuffer('image/png');
}

// Helper: Rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper: Text wrapping
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
```

---

## 📝 Description Generator

```typescript
// lib/social-generators/description-generator.ts

interface PinDescription {
  title: string;
  description: string;
  link: string;
  hashtags: string[];
}

export function generatePinterestDescription(
  cityData: CityData,
  variant: 'general' | 'monthly' | 'wedding'
): PinDescription {
  
  if (variant === 'general') {
    return {
      title: `Best Time to Visit ${cityData.name} - 30 Year Weather Analysis`,
      description: `Planning a ${cityData.name} trip? Our 30-year weather analysis shows:
✨ Best months: ${cityData.bestMonths.join(' & ')} (perfect temperatures)
🌧️ Rain risk: Only ${cityData.rainProbability}% historically
🌡️ Ideal temps: ${cityData.avgTemp} for comfortable sightseeing

Based on actual NASA satellite data, not guesses. Plan your perfect trip with confidence.

Explore day-by-day weather → 30yearweather.com/${cityData.slug}`,
      link: `https://30yearweather.com/${cityData.slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=best-time`,
      hashtags: [
        cityData.slug,
        'besttimetovisit',
        'travelplanning',
        'weatherdata',
        'traveltips',
        `${cityData.slug}travel`,
        'travelguide'
      ]
    };
  }
  
  // Wedding variant
  if (variant === 'wedding') {
    return {
      title: `Perfect Wedding Weather in ${cityData.name}`,
      description: `Planning a destination wedding in ${cityData.name}?

💍 Best wedding months: ${cityData.bestMonths.join(' & ')}
☀️ Rain probability: ${cityData.rainProbability}% (low risk!)
🌡️ Perfect temps: ${cityData.avgTemp}
👰 Outdoor ceremony friendly

Based on 30 years of historical data. Plan your dream day with confidence.

→ 30yearweather.com/${cityData.slug}`,
      link: `https://30yearweather.com/${cityData.slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=wedding`,
      hashtags: [
        'destinationwedding',
        'weddingweather',
        'outdoorwedding',
        cityData.slug + 'wedding',
        'weddingplanning',
        'bridetobe'
      ]
    };
  }
  
  // Monthly variant - implementovat podle potřeby
  return generateMonthlyDescription(cityData);
}
```

---

## 🚀 Main Generator Script

```typescript
// scripts/generate-social-content.ts

import fs from 'fs/promises';
import path from 'path';
import { generatePinterestPin } from '@/lib/social-generators/pinterest-generator';
import { generatePinterestDescription } from '@/lib/social-generators/description-generator';
import { getAllCities } from '@/lib/data/cities'; // Vaše existing function

async function main() {
  console.log('🚀 Starting social content generation...\n');
  
  const cities = await getAllCities(); // Load all 123 cities
  const outputDir = path.join(process.cwd(), 'output', 'social-content', 'pinterest');
  
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });
  
  let generated = 0;
  const total = cities.length * 3; // 3 variants per city
  
  for (const city of cities) {
    console.log(`\n📍 Processing ${city.meta.name}...`);
    
    // Load city weather data
    const cityData = {
      name: city.meta.name,
      slug: city.meta.slug,
      bestMonths: getBestMonths(city), // Your logic
      avgTemp: getAvgTempRange(city),
      rainProbability: getAvgRainProbability(city),
      crowds: getCrowdLevel(city),
      heroImagePath: path.join(process.cwd(), 'public', 'images', `${city.meta.slug}-hero.webp`)
    };
    
    // Generate 3 variants
    for (const variant of ['A', 'B', 'C'] as const) {
      const filename = `${city.meta.slug}-variant-${variant.toLowerCase()}`;
      
      console.log(`  ⚙️  Generating variant ${variant}...`);
      
      // Generate image
      const imageBuffer = await generatePinterestPin(cityData, variant);
      await fs.writeFile(
        path.join(outputDir, `${filename}.png`),
        imageBuffer
      );
      
      // Generate metadata
      const metadata = generatePinterestDescription(
        cityData,
        variant === 'C' ? 'wedding' : 'general'
      );
      await fs.writeFile(
        path.join(outputDir, `${filename}.json`),
        JSON.stringify(metadata, null, 2)
      );
      
      generated++;
      console.log(`  ✅ ${filename}.png (${generated}/${total})`);
    }
  }
  
  console.log(`\n🎉 Success! Generated ${generated} Pinterest pins.`);
  console.log(`📁 Output: ${outputDir}`);
}

main().catch(console.error);
```

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
npm install canvas sharp
npm install -D @types/node
```

### 2. Download Fonts

Download Google Fonts locally:
```bash
mkdir -p public/fonts
# Download:
# - Montserrat-Bold.ttf
# - Montserrat-SemiBold.ttf
# - Inter-Regular.ttf
# - Inter-SemiBold.ttf
# Paste to public/fonts/
```

### 3. Add to package.json

```json
{
  "scripts": {
    "generate:social": "tsx scripts/generate-social-content.ts"
  }
}
```

### 4. Run Generator

```bash
npm run generate:social
```

**Output:**
```
output/social-content/pinterest/
  ├── prague-variant-a.png
  ├── prague-variant-a.json
  ├── paris-variant-a.png
  ├── paris-variant-a.json
  └── ... (369 files)
```

---

## 🎨 Optional: OpenAI Integration for Smart Descriptions

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAIDescription(cityData: CityData): Promise<string> {
  const prompt = `Create a compelling Pinterest pin description for:
City: ${cityData.name}
Best months: ${cityData.bestMonths.join(', ')}
Average temp: ${cityData.avgTemp}
Rain probability: ${cityData.rainProbability}%

Make it engaging, include emojis, SEO-optimized, max 500 characters.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
  
  return completion.choices[0].message.content || '';
}
```

---

## 💡 Advantages

### Time Savings:
- **Manual (Canva):** 3-5 min/pin × 369 pins = **20-30 hours**
- **Automated:** 2-3 seconds/pin × 369 pins = **~20 minutes**
- **Úspora: 98% času!**

### Consistency:
- Všechny piny mají stejný style
- Žádné typos v ručně psaných textech
- Automaticky používá vaše brand colors

### Scalability:
- Přidáte nové město? → Spusťte script → Done
- Změníte template? → Re-run na všech → Done
- Chcete Instagram verzi? → Adjust canvas size → Done

---

## 🚀 Next Steps

1. ✅ Implementovat renderTemplateA() (První template)
2. ✅ Test na 1 městě (Prague)
3. ✅ Když funguje → Add templateB & templateC
4. ✅ Run na všech 123 městech
5. ✅ Bulk upload do Pinterest (they support CSV import!)

---

## 📊 Estimated Timeline

- **Setup (fonts, dependencies):** 30 minut
- **Implement Template A:** 2-3 hodiny
- **Test & refine:** 1 hodina
- **Templates B & C:** 2 hodiny
- **Full generation:** 20 minut run time

**Total:** ~1 pracovní den → **369 ready pins**

vs.

**Manual Canva:** 20-30 hodin

**ROI: Saves you 95% of time! 🎉**

---

Chcete, abych to začal implementovat? Můžu vytvořit funkční prototyp Template A! 🚀
