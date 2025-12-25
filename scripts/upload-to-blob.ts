/**
 * Upload all city JSON files to Vercel Blob Storage
 * 
 * Prerequisites:
 * 1. Create a Blob store in Vercel Dashboard (Storage > Create > Blob)
 * 2. Get the BLOB_READ_WRITE_TOKEN from the Blob store settings
 * 3. Set it as environment variable or in .env.local
 * 
 * Usage:
 *   $env:BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_..."
 *   npx tsx scripts/upload-to-blob.ts
 */

import { put, list, del } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const BLOB_PATH_PREFIX = 'cities/'; // Prefix for all city JSONs in blob storage

interface UploadResult {
    slug: string;
    url: string;
    size: number;
}

async function uploadAllCities(): Promise<void> {
    console.log('='.repeat(70));
    console.log('🚀 UPLOADING CITY DATA TO VERCEL BLOB');
    console.log('='.repeat(70));

    // Check for token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('❌ BLOB_READ_WRITE_TOKEN not set!');
        console.log('\nTo set it:');
        console.log('  1. Go to Vercel Dashboard > Storage > Your Blob Store');
        console.log('  2. Copy the BLOB_READ_WRITE_TOKEN');
        console.log('  3. Run: $env:BLOB_READ_WRITE_TOKEN = "your_token"');
        process.exit(1);
    }

    // Get list of JSON files
    const files = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith('.json'));

    console.log(`\n📂 Found ${files.length} JSON files in public/data/`);
    console.log(`📦 Total size: ${getTotalSize(files)} MB\n`);

    const results: UploadResult[] = [];
    const errors: string[] = [];
    let uploadedCount = 0;

    for (const file of files) {
        const slug = file.replace('.json', '');
        const filePath = path.join(DATA_DIR, file);
        const content = fs.readFileSync(filePath);
        const blobPath = `${BLOB_PATH_PREFIX}${file}`;

        try {
            const blob = await put(blobPath, content, {
                access: 'public',
                contentType: 'application/json',
                addRandomSuffix: false, // Keep exact filename
            });

            results.push({
                slug,
                url: blob.url,
                size: content.length,
            });

            uploadedCount++;
            const sizeKB = Math.round(content.length / 1024);
            console.log(`✅ [${uploadedCount}/${files.length}] ${slug} (${sizeKB} KB)`);

        } catch (error: any) {
            console.error(`❌ Failed to upload ${slug}: ${error.message}`);
            errors.push(slug);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 UPLOAD SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Uploaded: ${results.length}/${files.length}`);
    console.log(`❌ Failed: ${errors.length}`);

    if (results.length > 0) {
        // Save URL mapping
        const urlMap: Record<string, string> = {};
        for (const r of results) {
            urlMap[r.slug] = r.url;
        }

        const mapPath = path.join(process.cwd(), 'src', 'lib', 'blob-urls.json');
        fs.writeFileSync(mapPath, JSON.stringify(urlMap, null, 2));
        console.log(`\n💾 URL mapping saved to: ${mapPath}`);

        // Show sample URLs
        console.log('\n📎 Sample URLs:');
        results.slice(0, 3).forEach(r => {
            console.log(`   ${r.slug}: ${r.url}`);
        });
    }

    if (errors.length > 0) {
        console.log('\n❌ Failed uploads:', errors.join(', '));
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ DONE! Update data.ts to use blob URLs.');
    console.log('='.repeat(70));
}

function getTotalSize(files: string[]): string {
    let total = 0;
    for (const file of files) {
        const stats = fs.statSync(path.join(DATA_DIR, file));
        total += stats.size;
    }
    return (total / (1024 * 1024)).toFixed(1);
}

// Run
uploadAllCities().catch(console.error);
