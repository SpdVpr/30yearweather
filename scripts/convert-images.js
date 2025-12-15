const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Convert PNG images to WebP format for better performance
 * Run: node scripts/convert-images.js
 */

const imagesToConvert = [
    { input: 'public/images/hero-travel.png', output: 'public/images/hero-travel.webp' },
    { input: 'public/images/prague-hero.png', output: 'public/images/prague-hero.webp' },
    { input: 'public/images/berlin-de-hero.png', output: 'public/images/berlin-de-hero.webp' },
];

async function convertImages() {
    console.log('🖼️  Converting PNG images to WebP...\n');

    for (const img of imagesToConvert) {
        try {
            if (!fs.existsSync(img.input)) {
                console.log(`⚠️  Skipping ${img.input} (not found)`);
                continue;
            }

            const inputStats = fs.statSync(img.input);
            const inputSize = (inputStats.size / 1024).toFixed(2);

            await sharp(img.input)
                .webp({ quality: 85 }) // High quality WebP
                .toFile(img.output);

            const outputStats = fs.statSync(img.output);
            const outputSize = (outputStats.size / 1024).toFixed(2);
            const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`✅ ${path.basename(img.input)}`);
            console.log(`   ${inputSize}KB → ${outputSize}KB (${savings}% smaller)\n`);
        } catch (error) {
            console.error(`❌ Error converting ${img.input}:`, error.message);
        }
    }

    console.log('✨ Image conversion complete!');
}

convertImages();
