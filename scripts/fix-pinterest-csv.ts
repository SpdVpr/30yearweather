// scripts/fix-pinterest-csv.ts
/**
 * Fixes Pinterest CSV format to match Pinterest requirements
 */

import fs from 'fs/promises';
import path from 'path';

async function main() {
    const inputPath = path.join(process.cwd(), 'output', 'pinterest-bulk-upload.csv');
    const outputDir = path.join(process.cwd(), 'output', 'pinterest-fixed');

    await fs.mkdir(outputDir, { recursive: true });

    const csv = await fs.readFile(inputPath, 'utf-8');
    const lines = csv.split('\n');

    // Pinterest required headers:
    // Title, Media URL, Pinterest board, Description, Link, Keywords
    const newHeader = 'Title,Media URL,Pinterest board,Description,Link,Keywords';

    const boards: Record<string, string[]> = {
        'europe': [],
        'asia': [],
        'americas': [],
        'oceania': [],
        'middle-east': [],
        'africa': []
    };

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Parse existing CSV line (handle quoted fields)
        const match = line.match(/^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)"$/);
        if (!match) continue;

        const [, imageUrl, title, description, link, board] = match;

        // Clean description (remove \n)
        const cleanDesc = description.replace(/\\n/g, ' ');

        // Extract keywords from hashtags
        const hashtagMatch = cleanDesc.match(/#\w+/g);
        const keywords = hashtagMatch ? hashtagMatch.map(h => h.replace('#', '')).join(', ') : '';

        // Determine board key
        let boardKey = 'europe';
        if (board.includes('Asia')) boardKey = 'asia';
        else if (board.includes('Americas')) boardKey = 'americas';
        else if (board.includes('Oceania')) boardKey = 'oceania';
        else if (board.includes('Middle East')) boardKey = 'middle-east';
        else if (board.includes('Africa')) boardKey = 'africa';

        // Create new CSV line with correct column order
        const newLine = [
            `"${title}"`,         // Title
            `"${imageUrl}"`,      // Media URL
            `"${board}"`,         // Pinterest board
            `"${cleanDesc}"`,     // Description  
            `"${link}"`,          // Link
            `"${keywords}"`       // Keywords
        ].join(',');

        boards[boardKey].push(newLine);
    }

    console.log('📊 Creating Pinterest CSV files with correct format...\n');

    // Write one file per region
    for (const [region, cityLines] of Object.entries(boards)) {
        if (cityLines.length === 0) continue;

        const filename = `pinterest-${region}.csv`;
        const content = [newHeader, ...cityLines].join('\n');

        await fs.writeFile(path.join(outputDir, filename), content);
        console.log(`✅ ${filename} - ${cityLines.length} cities`);
    }

    // Also write one combined file
    const allLines = Object.values(boards).flat();
    await fs.writeFile(
        path.join(outputDir, 'pinterest-all.csv'),
        [newHeader, ...allLines].join('\n')
    );
    console.log(`✅ pinterest-all.csv - ${allLines.length} total`);

    console.log(`\n📁 Output: ${outputDir}`);
    console.log('\n📋 Pinterest column format:');
    console.log('   Title, Media URL, Pinterest board, Description, Link, Keywords');
}

main().catch(console.error);
