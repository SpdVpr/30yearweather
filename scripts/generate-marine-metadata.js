/**
 * Script to generate marine metadata for all cities that have marine data
 * This creates marine-metadata.json with sea/ocean names for frontend display
 * 
 * Usage: node scripts/generate-marine-metadata.js
 */

const fs = require('fs');
const path = require('path');
const { COASTAL_CITIES_MARINE } = require('./coastal-cities-marine-config.js');

const RAW_MARINE_DIR = path.join(__dirname, '..', 'backend', 'data', 'raw_marine');
const METADATA_FILE = path.join(__dirname, '..', 'src', 'lib', 'marine-metadata.json');

function main() {
    console.log('=== Generating Marine Metadata ===\n');

    // Get all existing marine data files
    const marineFiles = fs.readdirSync(RAW_MARINE_DIR)
        .filter(f => f.endsWith('_marine.json'))
        .map(f => f.replace('_marine.json', ''));

    console.log(`Found ${marineFiles.length} cities with marine data\n`);

    const metadata = {};
    const missing = [];

    for (const slug of marineFiles) {
        const config = COASTAL_CITIES_MARINE[slug];

        if (config) {
            metadata[slug] = {
                sea_name: config.sea_name,
                sea_name_local: config.sea_name_local,
                marine_lat: config.marine_lat,
                marine_lon: config.marine_lon
            };
            console.log(`✅ ${slug}: ${config.sea_name}`);
        } else {
            missing.push(slug);
            console.log(`⚠️  ${slug}: No config found`);
        }
    }

    // Save metadata
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

    console.log(`\n=== SUMMARY ===`);
    console.log(`✅ Cities with metadata: ${Object.keys(metadata).length}`);
    console.log(`⚠️  Cities missing config: ${missing.length}`);

    if (missing.length > 0) {
        console.log('\nMissing configs for:');
        missing.forEach(m => console.log(`  - ${m}`));
        console.log('\nPlease add these to coastal-cities-marine-config.js');
    }

    console.log(`\n📝 Saved to: ${METADATA_FILE}`);
}

main();
