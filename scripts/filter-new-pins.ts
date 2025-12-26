
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const oldDir = path.join(process.cwd(), 'output', 'pinterest-by-region');
    const newDir = path.join(process.cwd(), 'output', 'pinterest-fixed');

    console.log('🧹 Filtering Pinterest CSVs...');

    // 1. Load existing slugs
    const existingSlugs = new Set<string>();

    try {
        const oldFiles = await fs.readdir(oldDir);
        for (const file of oldFiles) {
            if (!file.endsWith('.csv')) continue;

            const content = await fs.readFile(path.join(oldDir, file), 'utf-8');
            const lines = content.split('\n');

            // Old format: image_url,title,description,link,board
            // Skip header
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim()) continue;

                // Simple regex to find link (it's the 4th quoted field usually)
                // But let's look for https://30yearweather.com/SLUG?
                const match = line.match(/https:\/\/30yearweather\.com\/([a-z0-9-]+)\?/);
                if (match) {
                    existingSlugs.add(match[1]);
                }
            }
        }
        console.log(`📍 Found ${existingSlugs.size} existing cities in ${oldDir}`);
    } catch (e) {
        console.warn('⚠️ No previous region files found, skipping filtering.');
        return;
    }

    // 2. Filter new files
    const newFiles = await fs.readdir(newDir);
    const regions: string[] = []; // Track regions for summary

    const allNewLines: string[] = [];
    let keptCount = 0;
    let removedCount = 0;

    // Header for new files
    const newHeader = 'Title,Media URL,Pinterest board,Description,Link,Keywords';

    for (const file of newFiles) {
        // Skip pinterest-all.csv and any batch files, work on region files
        // We assume region files are named pinterest-{server}.csv etc. 
        // Actually, we should just filter everything EXCEPT pinterest-all.csv
        if (!file.endsWith('.csv')) continue;
        if (file === 'pinterest-all.csv') continue;
        if (file.includes('batch')) continue; // Skip backup/batch files

        const filePath = path.join(newDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const lines = content.split('\n');

        // Header check
        if (!lines[0].startsWith('Title,Media URL')) {
            console.log(`⚠️ Skipping ${file} (unexpected header)`);
            continue;
        }

        const keptLines: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            const match = line.match(/https:\/\/30yearweather\.com\/([a-z0-9-]+)(\?|"|$)/);
            if (match) {
                const slug = match[1];
                if (existingSlugs.has(slug)) {
                    removedCount++;
                } else {
                    keptLines.push(line);
                    allNewLines.push(line);
                    keptCount++;
                }
            } else {
                // If can't parse slug, keep it to be safe
                keptLines.push(line);
                allNewLines.push(line);
            }
        }

        // Overwrite the file with filtered content
        if (keptLines.length > 0) {
            await fs.writeFile(filePath, [newHeader, ...keptLines].join('\n'));
            console.log(`✅ ${file}: Kept ${keptLines.length} (Removed ${lines.length - 1 - keptLines.length})`);
        } else {
            console.log(`⚠️ ${file}: All entries removed (already uploaded)`);
            // Optionally delete the file if empty? Or keep header only.
            await fs.writeFile(filePath, newHeader);
        }
    }

    // 3. Update pinterest-all.csv
    await fs.writeFile(
        path.join(newDir, 'pinterest-all.csv'),
        [newHeader, ...allNewLines].join('\n')
    );

    console.log('\n' + '═'.repeat(50));
    console.log(`🎉 Filtering complete.`);
    console.log(`   Kept (New): ${keptCount}`);
    console.log(`   Removed (Old): ${removedCount}`);
    console.log(`   Updated: output/pinterest-fixed/pinterest-all.csv`);
    console.log('═'.repeat(50));
}

main().catch(console.error);
