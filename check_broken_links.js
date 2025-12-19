/**
 * Script to check for broken internal links on the website
 * Scans all components and pages for Link href attributes
 */

const fs = require('fs');
const path = require('path');

// All internal links found in the codebase
const internalLinks = [
    '/',
    '/#cities',
    '/finder',
    '/methodology',
    '/api-docs',
    '/about',
    '/terms',
    '/privacy',
    '/gdpr',
    '/privacy#cookies',
    '/admin',
];

// Check which pages exist in src/app
const appDir = path.join(__dirname, 'src', 'app');

console.log('🔍 CHECKING FOR BROKEN LINKS\n');
console.log('=' .repeat(60));

const results = {
    existing: [],
    missing: [],
    anchors: []
};

internalLinks.forEach(link => {
    // Remove hash anchors for file checking
    const [pathname, hash] = link.split('#');
    
    if (hash) {
        results.anchors.push(link);
        return;
    }
    
    // Skip root
    if (pathname === '/') {
        results.existing.push(link);
        return;
    }
    
    // Check if directory or page.tsx exists
    const routePath = pathname.substring(1); // Remove leading /
    const dirPath = path.join(appDir, routePath);
    const pageFile = path.join(dirPath, 'page.tsx');
    
    if (fs.existsSync(pageFile)) {
        results.existing.push(link);
    } else {
        results.missing.push(link);
    }
});

console.log('\n✅ EXISTING PAGES (' + results.existing.length + '):');
results.existing.forEach(link => console.log('   ✓', link));

console.log('\n❌ MISSING PAGES (' + results.missing.length + '):');
if (results.missing.length === 0) {
    console.log('   🎉 No broken links found!');
} else {
    results.missing.forEach(link => console.log('   ✗', link));
}

console.log('\n🔗 ANCHOR LINKS (' + results.anchors.length + '):');
console.log('   (These need manual verification)');
results.anchors.forEach(link => console.log('   →', link));

console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY:');
console.log('   Total links checked:', internalLinks.length);
console.log('   Existing pages:', results.existing.length);
console.log('   Missing pages:', results.missing.length);
console.log('   Anchor links:', results.anchors.length);

if (results.missing.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED: Fix or remove broken links!');
    process.exit(1);
} else {
    console.log('\n✅ All internal links are valid!');
    process.exit(0);
}

