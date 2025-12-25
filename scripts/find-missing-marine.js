/**
 * Script to find coastal cities that are missing marine data
 */

const fs = require('fs');
const path = require('path');

// Cities list from frontend
const citiesListPath = path.join(__dirname, '..', 'src', 'lib', 'cities-list.json');
let citiesRaw = fs.readFileSync(citiesListPath, 'utf8');
// Remove BOM if present
if (citiesRaw.charCodeAt(0) === 0xFEFF) {
    citiesRaw = citiesRaw.slice(1);
}
const cities = JSON.parse(citiesRaw);

// Get marine data files
const marineDir = path.join(__dirname, '..', 'backend', 'data', 'raw_marine');
const marineFiles = fs.readdirSync(marineDir).map(f => f.replace('_marine.json', ''));

// Define known coastal cities that SHOULD have marine data
// These are cities definitely by the ocean/sea that don't have raw_marine data
const knownCoastalCities = [
    // Canary Islands & Atlantic Islands
    'tenerife',       // Atlantic Ocean - Canary Islands
    'fuerteventura',  // Atlantic Ocean - Canary Islands
    'madeira',        // Atlantic Ocean - Portugal

    // Mediterranean & Adriatic  
    'bodrum',         // Aegean Sea - Turkey
    'budva',          // Adriatic Sea - Montenegro
    'kotor',          // Adriatic Sea - Montenegro
    'sarande',        // Ionian Sea - Albania
    'ibiza',          // Mediterranean - Spain
    'valencia',       // Mediterranean - Spain

    // Red Sea
    'hurghada',       // Red Sea - Egypt
    'sharm-el-sheikh', // Red Sea - Egypt
    'jeddah',         // Red Sea - Saudi Arabia

    // Caribbean
    'antigua',        // Caribbean Sea
    'dominica',       // Caribbean Sea
    'st-lucia',       // Caribbean Sea
    'turks-caicos',   // Atlantic Ocean
    'limon',          // Caribbean Sea - Costa Rica

    // Southeast Asia & Pacific
    'da-nang',        // South China Sea - Vietnam
    'krabi',          // Andaman Sea - Thailand
    'penang',         // Strait of Malacca - Malaysia
    'panglao',        // Bohol Sea - Philippines
    'siargao',        // Philippine Sea - Philippines

    // Pacific Islands
    'maui',           // Pacific Ocean - Hawaii
    'suva',           // Pacific Ocean - Fiji

    // Atlantic Europe
    'bilbao',         // Bay of Biscay - Spain
    'santander',      // Bay of Biscay - Spain
    'rotterdam',      // North Sea - Netherlands (near coast)
    'nantucket',      // Atlantic Ocean - USA
    'hamilton',       // Atlantic - Bermuda

    // Indian Ocean
    'trivandrum',     // Arabian Sea - India
    'pondicherry',    // Bay of Bengal - India
    'somnath',        // Arabian Sea - India

    // Costa Rica Pacific
    'quepos',         // Pacific Ocean - Costa Rica
];

// Find cities without marine data
const citiesWithoutMarine = cities.filter(c => !marineFiles.includes(c));

console.log('=== ANALYSIS: Cities without marine data ===\n');
console.log(`Total cities: ${cities.length}`);
console.log(`Cities with marine data: ${marineFiles.length}`);
console.log(`Cities WITHOUT marine data: ${citiesWithoutMarine.length}\n`);

console.log('--- All cities without marine data ---');
citiesWithoutMarine.forEach(c => console.log(`  - ${c}`));

console.log('\n--- COASTAL cities that SHOULD have marine data ---');
const coastalMissing = citiesWithoutMarine.filter(c => knownCoastalCities.includes(c));
coastalMissing.forEach(c => console.log(`  ⚠️  ${c}`));

console.log('\n--- Total coastal cities missing marine data: ' + coastalMissing.length + ' ---');
