/**
 * Script to fetch marine data for coastal cities
 * Uses Open-Meteo Marine API
 * 
 * IMPORTANT: Don't use era5_ocean model - it has limited coverage for enclosed seas!
 * The default model has better coverage but limited historical range.
 * 
 * For historical data, we fetch year by year chunks.
 * 
 * Usage: node scripts/fetch-missing-marine.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { COASTAL_CITIES_MARINE } = require('./coastal-cities-marine-config.js');

const OUTPUT_DIR = path.join(__dirname, '..', 'backend', 'data', 'raw_marine');
const METADATA_FILE = path.join(__dirname, '..', 'src', 'lib', 'marine-metadata.json');

// Open-Meteo Marine API
const API_BASE = 'https://marine-api.open-meteo.com/v1/marine';

// Cities that we need to fetch - ONLY the 6 broken ones
const CITIES_TO_FETCH = [
    'tenerife',
    'fuerteventura',
    'madeira',
    'bodrum',
    'budva',
    'kotor',
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchMarineData(slug, config, startDate, endDate) {
    // DON'T specify models=era5_ocean - it has limited coverage!
    const url = `${API_BASE}?latitude=${config.marine_lat}&longitude=${config.marine_lon}&hourly=sea_surface_temperature&start_date=${startDate}&end_date=${endDate}`;

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.error) {
                        reject(new Error(`API Error: ${json.reason || json.error}`));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(new Error(`Parse error: ${e.message}`));
                }
            });
        }).on('error', reject);
    });
}

async function fetchAndMergeYears(slug, config) {
    console.log(`  Fetching: ${slug} (${config.marine_lat}, ${config.marine_lon}) - ${config.sea_name}`);

    // Fetch data year by year from 2022 to 2025 (Marine API only has data from 2022)
    const years = [2022, 2023, 2024, 2025];

    let allTimes = [];
    let allTemps = [];
    let baseData = null;

    for (const year of years) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;

        try {
            process.stdout.write(`    ${year}...`);
            const data = await fetchMarineData(slug, config, startDate, endDate);

            if (data.hourly?.sea_surface_temperature) {
                const validCount = data.hourly.sea_surface_temperature.filter(t => t !== null).length;
                if (validCount > 0) {
                    process.stdout.write(` ✓ (${validCount} readings)\n`);
                    allTimes = allTimes.concat(data.hourly.time);
                    allTemps = allTemps.concat(data.hourly.sea_surface_temperature);
                    if (!baseData) baseData = data;
                } else {
                    process.stdout.write(` ✗ (no data)\n`);
                }
            } else {
                process.stdout.write(` ✗ (no response)\n`);
            }

            // Rate limiting - 1 second between requests
            await sleep(1000);

        } catch (error) {
            process.stdout.write(` ❌ ${error.message}\n`);

            if (error.message.includes('rate') || error.message.includes('limit')) {
                console.log(`    ⏳ Rate limited - waiting 60 seconds...`);
                await sleep(60000);
            }
        }
    }

    if (baseData && allTemps.length > 0) {
        // Merge all data
        baseData.hourly.time = allTimes;
        baseData.hourly.sea_surface_temperature = allTemps;
        return baseData;
    }

    return null;
}

async function main() {
    console.log('=== Fetching Marine Data for Coastal Cities ===\n');
    console.log(`Cities to fetch: ${CITIES_TO_FETCH.length}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log(`NOTE: Fetching year by year (2022-2025)\n`);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load or create metadata
    let metadata = {};
    if (fs.existsSync(METADATA_FILE)) {
        try {
            metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
        } catch (e) {
            metadata = {};
        }
    }

    const results = { success: [], skipped: [], noData: [], failed: [] };

    for (let i = 0; i < CITIES_TO_FETCH.length; i++) {
        const slug = CITIES_TO_FETCH[i];
        const config = COASTAL_CITIES_MARINE[slug];

        if (!config) {
            console.log(`[${i + 1}/${CITIES_TO_FETCH.length}] ⚠️  ${slug} - No config found`);
            continue;
        }

        const outputFile = path.join(OUTPUT_DIR, `${slug}_marine.json`);

        console.log(`\n[${i + 1}/${CITIES_TO_FETCH.length}] ${slug.toUpperCase()}`);

        // Check if file exists and is valid
        if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            if (stats.size > 1000000) {
                console.log(`  ⏭️  Already exists (${(stats.size / 1024 / 1024).toFixed(2)} MB), skipping`);

                metadata[slug] = {
                    sea_name: config.sea_name,
                    sea_name_local: config.sea_name_local,
                    marine_lat: config.marine_lat,
                    marine_lon: config.marine_lon
                };

                results.skipped.push(slug);
                continue;
            } else {
                fs.unlinkSync(outputFile);
                console.log(`  🗑️  Deleted invalid file`);
            }
        }

        try {
            const data = await fetchAndMergeYears(slug, config);

            if (data) {
                const validTemps = data.hourly.sea_surface_temperature.filter(t => t !== null);
                console.log(`  ✅ Total: ${validTemps.length} valid readings`);

                fs.writeFileSync(outputFile, JSON.stringify(data));

                metadata[slug] = {
                    sea_name: config.sea_name,
                    sea_name_local: config.sea_name_local,
                    marine_lat: config.marine_lat,
                    marine_lon: config.marine_lon
                };

                results.success.push(slug);
            } else {
                console.log(`  ⚠️  No valid data retrieved`);
                results.noData.push({ slug, config });
            }

            // Extra delay between cities
            console.log(`  ⏳ Waiting 5 seconds before next city...`);
            await sleep(5000);

        } catch (error) {
            console.log(`  ❌ Failed: ${error.message}`);
            results.failed.push({ slug, reason: error.message });
        }
    }

    // Save metadata
    fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
    console.log(`\n📝 Saved marine metadata to ${METADATA_FILE}`);

    console.log('\n=== SUMMARY ===');
    console.log(`✅ Successfully fetched: ${results.success.length} cities`);
    console.log(`⏭️  Skipped: ${results.skipped.length} cities`);
    console.log(`⚠️  No data: ${results.noData.length} cities`);
    console.log(`❌ Failed: ${results.failed.length} cities`);

    if (results.success.length > 0) {
        console.log('\nSuccessfully fetched:');
        results.success.forEach(s => console.log(`  ✅ ${s} (${metadata[s]?.sea_name})`));
    }
}

main().catch(console.error);
