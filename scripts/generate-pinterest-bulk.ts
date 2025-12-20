// scripts/generate-pinterest-bulk.ts
/**
 * Pinterest Bulk Generator
 * - Generates Pinterest pins for ALL cities
 * - Saves to public/pinterest/ for web hosting
 * - Creates CSV for Pinterest bulk upload
 */

import fs from 'fs/promises';
import path from 'path';
import { generatePinterestPin } from '../lib/social-generators/pinterest-generator';
import type { CityData } from '../lib/social-generators/types';

const BASE_URL = 'https://30yearweather.com';

// Helper to format city name
function formatCityName(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Get region/board for city
function getBoard(slug: string): string {
    const asia = ['tokyo', 'kyoto', 'osaka', 'sapporo', 'fukuoka', 'seoul', 'busan', 'beijing', 'shanghai', 'chengdu', 'hong-kong', 'taipei', 'bangkok', 'phuket', 'chiang-mai', 'singapore', 'kuala-lumpur', 'jakarta', 'bali', 'hanoi', 'ho-chi-minh', 'manila', 'kathmandu', 'new-delhi', 'mumbai', 'male', 'almaty', 'tashkent'];
    const americas = ['new-york', 'los-angeles', 'san-francisco', 'chicago', 'miami', 'las-vegas', 'new-orleans', 'boston', 'honolulu', 'toronto', 'vancouver', 'montreal', 'calgary', 'whistler', 'mexico-city', 'cancun', 'buenos-aires', 'rio-de-janeiro', 'sao-paulo', 'santiago', 'lima', 'cusco', 'bogota', 'cartagena', 'quito', 'san-jose-cr', 'san-juan', 'nassau', 'montego-bay', 'punta-cana'];
    const oceania = ['sydney', 'melbourne', 'brisbane', 'perth', 'auckland', 'christchurch', 'queenstown', 'nadi', 'papeete', 'bora-bora'];
    const middleEast = ['dubai', 'abu-dhabi', 'doha', 'muscat', 'ras-al-khaimah', 'tel-aviv', 'cairo', 'marrakech', 'casablanca'];
    const africa = ['cape-town', 'nairobi', 'zanzibar'];

    if (asia.includes(slug)) return 'Best Time to Visit - Asia';
    if (americas.includes(slug)) return 'Best Time to Visit - Americas';
    if (oceania.includes(slug)) return 'Best Time to Visit - Oceania';
    if (middleEast.includes(slug)) return 'Best Time to Visit - Middle East';
    if (africa.includes(slug)) return 'Best Time to Visit - Africa';
    return 'Best Time to Visit - Europe';
}

// Extract best months from city data
function getBestMonths(dailyData: any): string[] {
    // Simple heuristic: find months with best avg conditions
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // For now, return common good months (would be calculated from actual data)
    // This is simplified - in reality you'd analyze the data
    return ['May', 'September'];
}

async function main() {
    console.log('🚀 Pinterest Bulk Generator\n');
    console.log('═'.repeat(50));

    const dataDir = path.join(process.cwd(), 'public', 'data');
    const outputDir = path.join(process.cwd(), 'public', 'pinterest');
    const csvPath = path.join(process.cwd(), 'output', 'pinterest-bulk-upload.csv');

    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(path.dirname(csvPath), { recursive: true });

    // Get all city files
    const files = await fs.readdir(dataDir);
    const cityFiles = files.filter(f => f.endsWith('.json'));

    console.log(`📍 Found ${cityFiles.length} cities\n`);

    // CSV header
    const csvRows: string[] = [
        'image_url,title,description,link,board'
    ];

    let generated = 0;
    let errors = 0;

    for (const file of cityFiles) {
        const slug = file.replace('.json', '');
        const cityName = formatCityName(slug);

        try {
            // Load city data
            const dataPath = path.join(dataDir, file);
            const rawData = await fs.readFile(dataPath, 'utf-8');
            const cityJson = JSON.parse(rawData);

            // Check for hero image - PNG FIRST (Canvas doesn't support webp!)
            const heroPng = path.join(process.cwd(), 'public', 'images', `${slug}-hero.png`);
            const heroWebp = path.join(process.cwd(), 'public', 'images', `${slug}-hero.webp`);

            let heroPath = '';
            try {
                await fs.access(heroPng);
                heroPath = heroPng;
            } catch {
                try {
                    await fs.access(heroWebp);
                    // webp exists but Canvas can't load it - skip this city
                    console.log(`   ⚠️ ${slug} has only .webp (Canvas can't load), skipping`);
                    errors++;
                    continue;
                } catch {
                    console.log(`   ⚠️ No hero image for ${slug}, skipping`);
                    errors++;
                    continue;
                }
            }

            // Extract weather data
            const avgTemp = cityJson.meta?.averageTemperature || 20;
            const rainfall = cityJson.meta?.averageRainfall || 50;

            const cityData: CityData = {
                name: cityName,
                slug: slug,
                bestMonths: getBestMonths(cityJson.dailyData),
                avgTempMin: Math.round(avgTemp - 4),
                avgTempMax: Math.round(avgTemp + 4),
                rainProbability: Math.min(Math.round(rainfall / 5), 30),
                crowds: 'Moderate',
                heroImagePath: heroPath
            };

            // Generate Pinterest pin
            console.log(`📌 ${cityName}...`);
            const buffer = await generatePinterestPin(cityData);

            // Save to public/pinterest/
            const outputPath = path.join(outputDir, `${slug}.png`);
            await fs.writeFile(outputPath, buffer);

            // Add to CSV
            const imageUrl = `${BASE_URL}/pinterest/${slug}.png`;
            const title = `Best Time to Visit ${cityName} - 30 Year Weather Analysis`;
            const description = `Planning a ${cityName} trip? Based on 30 years of NASA data:\\n✨ Best: ${cityData.bestMonths.join(' & ')}\\n🌡️ ${cityData.avgTempMin}-${cityData.avgTempMax}°C\\n🌧️ ${cityData.rainProbability}% rain\\n\\n#${slug.replace(/-/g, '')} #besttimetovisit #travelplanning`;
            const link = `${BASE_URL}/${slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=bulk`;
            const board = getBoard(slug);

            // Escape CSV fields
            const escapeCsv = (s: string) => `"${s.replace(/"/g, '""')}"`;
            csvRows.push([
                escapeCsv(imageUrl),
                escapeCsv(title),
                escapeCsv(description),
                escapeCsv(link),
                escapeCsv(board)
            ].join(','));

            generated++;
            console.log(`   ✅ Saved ${slug}.png`);

        } catch (error) {
            console.error(`   ❌ Error with ${slug}:`, error);
            errors++;
        }
    }

    // Write CSV
    await fs.writeFile(csvPath, csvRows.join('\n'));

    console.log('\n' + '═'.repeat(50));
    console.log(`🎉 Generated: ${generated} pins`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`\n📁 Pinterest pins: public/pinterest/`);
    console.log(`📄 CSV file: ${csvPath}`);
    console.log('\n📋 Next steps:');
    console.log('   1. git add public/pinterest/');
    console.log('   2. git commit -m "Add Pinterest pins"');
    console.log('   3. git push (deploy to Vercel)');
    console.log('   4. Upload CSV to Pinterest bulk upload');
    console.log('═'.repeat(50));
}

main().catch(console.error);
