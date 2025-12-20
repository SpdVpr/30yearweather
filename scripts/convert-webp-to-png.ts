// scripts/convert-webp-to-png.ts
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const cities = ['athens', 'barcelona', 'london', 'paris', 'rome', 'vienna', 'zurich'];

async function main() {
    console.log('🔄 Converting webp to png...\n');

    for (const city of cities) {
        const webpPath = path.join(process.cwd(), 'public', 'images', `${city}-hero.webp`);
        const pngPath = path.join(process.cwd(), 'public', 'images', `${city}-hero.png`);

        try {
            await sharp(webpPath).png().toFile(pngPath);
            console.log(`✅ ${city}-hero.png created`);
        } catch (error) {
            console.error(`❌ Error converting ${city}:`, error);
        }
    }

    console.log('\n✨ Done!');
}

main();
