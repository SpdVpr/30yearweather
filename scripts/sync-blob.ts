/**
 * Sync script for adding new cities to Vercel Blob
 * 
 * This script checks which cities are missing from Blob storage
 * and uploads only the new ones.
 * 
 * Usage:
 *   $env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."
 *   npx tsx scripts/sync-blob.ts
 */

import { put, list, head } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const BLOB_PATH_PREFIX = 'cities/';

async function syncNewCities(): Promise<void> {
    console.log('='.repeat(70));
    console.log('🔄 SYNCING NEW CITIES TO VERCEL BLOB');
    console.log('='.repeat(70));

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ BLOB_READ_WRITE_TOKEN not set!');
        process.exit(1);
    }

    // Get local files
    const localFiles = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));

    console.log(`\n📂 Local cities: ${localFiles.length}`);

    // Get existing blob files
    const { blobs } = await list({ prefix: BLOB_PATH_PREFIX });
    const existingBlobs = new Set(
        blobs.map(b => {
            const name = b.pathname.replace(BLOB_PATH_PREFIX, '').replace('.json', '');
            return name;
        })
    );

    console.log(`☁️  Blob cities: ${existingBlobs.size}`);

    // Find missing
    const missing = localFiles.filter(slug => !existingBlobs.has(slug));

    if (missing.length === 0) {
        console.log('\n✅ All cities are already synced!');
        return;
    }

    console.log(`\n🆕 New cities to upload: ${missing.length}`);
    missing.forEach(slug => console.log(`   - ${slug}`));

    // Upload missing
    console.log('\n📤 Uploading...\n');

    let uploaded = 0;
    const urlMap: Record<string, string> = {};

    for (const slug of missing) {
        const filePath = path.join(DATA_DIR, `${slug}.json`);
        const content = fs.readFileSync(filePath);
        const blobPath = `${BLOB_PATH_PREFIX}${slug}.json`;

        try {
            const blob = await put(blobPath, content, {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false,
            });

            urlMap[slug] = blob.url;
            uploaded++;
            console.log(`✅ ${slug}`);
        } catch (error: any) {
            console.error(`❌ ${slug}: ${error.message}`);
        }
    }

    // Update URL mapping file
    const mapPath = path.join(process.cwd(), 'src', 'lib', 'blob-urls.json');
    let existingMap: Record<string, string> = {};

    if (fs.existsSync(mapPath)) {
        existingMap = JSON.parse(fs.readFileSync(mapPath, 'utf-8'));
    }

    const mergedMap = { ...existingMap, ...urlMap };
    fs.writeFileSync(mapPath, JSON.stringify(mergedMap, null, 2));

    console.log(`\n✅ Uploaded ${uploaded} new cities`);
    console.log(`💾 Updated: ${mapPath}`);
}

syncNewCities().catch(console.error);
