// scripts/generate-social-content.ts
/**
 * Social Content Generator
 * 
 * Generates 4 images per city:
 * - 1x Feed (1:1, 1080x1080) - Instagram Feed
 * - 1x Pinterest (2:3, 1000x1500) - Pinterest
 * - 2x Stories (9:16, 1080x1920) - Best Day + Worst Day
 * 
 * Usage: npm run generate:social
 */

import fs from 'fs/promises';
import path from 'path';
import { generatePinterestDescription } from '../lib/social-generators/description-generator';
import {
    generateFeedPost,
    generatePinterestPin,
    generateBestDayPost,
    generateWorstDayPost
} from '../lib/social-generators/pinterest-generator';
import type { CityData } from '../lib/social-generators/types';

async function getAllCities(): Promise<CityData[]> {
    return [
        {
            name: 'Prague',
            slug: 'prague',
            bestMonths: ['May', 'September'],
            avgTempMin: 18,
            avgTempMax: 22,
            rainProbability: 15,
            crowds: 'Moderate',
            heroImagePath: path.join(process.cwd(), 'public', 'images', 'prague-hero.png')
        },
        {
            name: 'Paris',
            slug: 'paris',
            bestMonths: ['April', 'September'],
            avgTempMin: 15,
            avgTempMax: 20,
            rainProbability: 20,
            crowds: 'High',
            heroImagePath: path.join(process.cwd(), 'public', 'images', 'paris-hero.webp')
        },
        {
            name: 'Tokyo',
            slug: 'tokyo',
            bestMonths: ['March', 'November'],
            avgTempMin: 15,
            avgTempMax: 22,
            rainProbability: 18,
            crowds: 'Moderate',
            heroImagePath: path.join(process.cwd(), 'public', 'images', 'tokyo-hero.png')
        }
    ];
}

async function main() {
    console.log('🚀 Starting social content generation...\n');
    console.log('📐 Generating 4 formats per city:\n');
    console.log('   📱 1:1 (1080x1080)  - Instagram Feed');
    console.log('   📌 2:3 (1000x1500)  - Pinterest');
    console.log('   📱 9:16 (1080x1920) - Stories Best Day');
    console.log('   📱 9:16 (1080x1920) - Stories Worst Day\n');

    const cities = await getAllCities();

    // Create output directories
    const feedDir = path.join(process.cwd(), 'output', 'social-content', 'instagram-feed');
    const pinterestDir = path.join(process.cwd(), 'output', 'social-content', 'pinterest');
    const storiesDir = path.join(process.cwd(), 'output', 'social-content', 'instagram-stories');

    await fs.mkdir(feedDir, { recursive: true });
    await fs.mkdir(pinterestDir, { recursive: true });
    await fs.mkdir(storiesDir, { recursive: true });

    let generated = 0;
    const total = cities.length * 4;

    for (const city of cities) {
        console.log(`\n📍 Processing ${city.name}...`);

        // 1. FEED (1:1)
        try {
            const buffer = await generateFeedPost(city);
            await fs.writeFile(path.join(feedDir, `${city.slug}-feed.png`), buffer);
            console.log(`   ✅ ${city.slug}-feed.png (1:1)`);
            generated++;
        } catch (e) { console.error(`   ❌ Feed error:`, e); }

        // 2. PINTEREST (2:3)
        try {
            const buffer = await generatePinterestPin(city);
            await fs.writeFile(path.join(pinterestDir, `${city.slug}-pinterest.png`), buffer);
            console.log(`   ✅ ${city.slug}-pinterest.png (2:3)`);
            generated++;
        } catch (e) { console.error(`   ❌ Pinterest error:`, e); }

        // 3. STORIES - BEST DAY (9:16)
        try {
            const buffer = await generateBestDayPost(city);
            await fs.writeFile(path.join(storiesDir, `${city.slug}-best-day.png`), buffer);
            console.log(`   ✅ ${city.slug}-best-day.png (9:16)`);
            generated++;
        } catch (e) { console.error(`   ❌ Best day error:`, e); }

        // 4. STORIES - WORST DAY (9:16)
        try {
            const buffer = await generateWorstDayPost(city);
            await fs.writeFile(path.join(storiesDir, `${city.slug}-worst-day.png`), buffer);
            console.log(`   ✅ ${city.slug}-worst-day.png (9:16)`);
            generated++;
        } catch (e) { console.error(`   ❌ Worst day error:`, e); }

        // 5. METADATA - Formatted .txt files
        const metadata = generatePinterestDescription(city, 'general');

        // Pinterest .txt
        const pinterestTxt = `════════════════════════════════════════════════════════
📌 PINTEREST PIN - ${city.name.toUpperCase()}
════════════════════════════════════════════════════════

📝 TITLE:
${metadata.title}

────────────────────────────────────────────────────────

📋 DESCRIPTION (copy & paste):

${metadata.description}

────────────────────────────────────────────────────────

🔗 LINK:
${metadata.link}

────────────────────────────────────────────────────────

#️⃣ HASHTAGS:
${metadata.hashtags.map(h => '#' + h).join(' ')}

────────────────────────────────────────────────────────

📂 BOARD:
${metadata.board}

════════════════════════════════════════════════════════
`;
        await fs.writeFile(path.join(pinterestDir, `${city.slug}-caption.txt`), pinterestTxt);

        // Instagram Feed .txt
        const instagramTxt = `════════════════════════════════════════════════════════
📱 INSTAGRAM FEED - ${city.name.toUpperCase()}
════════════════════════════════════════════════════════

📋 CAPTION (copy & paste):

Best time to visit ${city.name}? ${metadata.hashtags[0] ? metadata.hashtags[0].charAt(0).toUpperCase() + metadata.hashtags[0].slice(1) : city.name} lovers, this one's for you! 🌍✨

Here's what 30 years of weather data tells us:

📅 Best Month: ${city.bestMonths[0]}
🌡️ Temperature: ${city.avgTempMin}-${city.avgTempMax}°C
🌧️ Rain Risk: Only ${city.rainProbability}%
👥 Crowds: ${city.crowds}

Planning your trip? Check out the link in bio for day-by-day forecasts! 📊

────────────────────────────────────────────────────────

#️⃣ HASHTAGS (paste in comment):

#${city.slug} #besttimetovisit #travelplanning #weatherdata 
#traveltips #${city.slug}travel #travelguide #wanderlust 
#travelgram #instatravel #explore${city.name.replace(/\s/g, '')} 
#traveleurope #tripplanning #vacationplanning

────────────────────────────────────────────────────────

🔗 BIO LINK:
30yearweather.com/${city.slug}

════════════════════════════════════════════════════════
`;
        await fs.writeFile(path.join(feedDir, `${city.slug}-caption.txt`), instagramTxt);

        console.log(`   📝 ${city.slug}-caption.txt (Pinterest + Instagram)`);
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`🎉 Success! Generated ${generated}/${total} images.`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\n📁 Output folders:`);
    console.log(`   📱 Instagram Feed:    ${feedDir}`);
    console.log(`   📌 Pinterest:         ${pinterestDir}`);
    console.log(`   📱 Instagram Stories: ${storiesDir}`);
    console.log(`\n✨ Ready for upload!\n`);
}

main().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
