// scripts/split-pinterest-csv.ts
/**
 * Splits Pinterest bulk CSV into separate files per board/region
 */

import fs from 'fs/promises';
import path from 'path';

const BOARDS = [
    'Best Time to Visit - Europe',
    'Best Time to Visit - Asia',
    'Best Time to Visit - Americas',
    'Best Time to Visit - Oceania',
    'Best Time to Visit - Middle East',
    'Best Time to Visit - Africa'
];

async function main() {
    const csvPath = path.join(process.cwd(), 'output', 'pinterest-bulk-upload.csv');
    const outputDir = path.join(process.cwd(), 'output', 'pinterest-by-region');

    await fs.mkdir(outputDir, { recursive: true });

    // Read original CSV
    const csv = await fs.readFile(csvPath, 'utf-8');
    const lines = csv.split('\n');
    const header = lines[0];
    const dataLines = lines.slice(1);

    console.log('📊 Splitting Pinterest CSV by region...\n');

    // Group by board
    const byBoard: Record<string, string[]> = {};
    BOARDS.forEach(b => byBoard[b] = []);

    for (const line of dataLines) {
        if (!line.trim()) continue;

        // Find which board this line belongs to
        for (const board of BOARDS) {
            if (line.includes(board)) {
                byBoard[board].push(line);
                break;
            }
        }
    }

    // Write separate CSV files
    for (const [board, cityLines] of Object.entries(byBoard)) {
        if (cityLines.length === 0) continue;

        const slug = board.replace('Best Time to Visit - ', '').toLowerCase().replace(/\s+/g, '-');
        const filename = `pinterest-${slug}.csv`;
        const content = [header, ...cityLines].join('\n');

        await fs.writeFile(path.join(outputDir, filename), content);
        console.log(`✅ ${filename} - ${cityLines.length} cities`);
    }

    console.log(`\n📁 Output: ${outputDir}`);
    console.log('\n📋 Upload each CSV separately to Pinterest:');
    console.log('   1. Go to Pinterest Bulk Upload');
    console.log('   2. Upload pinterest-europe.csv → Board "Best Time to Visit - Europe"');
    console.log('   3. Upload pinterest-asia.csv → Board "Best Time to Visit - Asia"');
    console.log('   4. etc...\n');
}

main().catch(console.error);
