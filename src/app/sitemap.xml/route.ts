import { NextResponse } from 'next/server';
import { getAllCities } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

export async function GET() {
    const cities = await getAllCities();
    
    // Generate sitemap index XML
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap/main.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
${cities.map(city => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${city}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
            // Cache for 1 hour - when you add a new city, it will appear in sitemap.xml within 1 hour
            // Set to 0 if you want it to regenerate on every request (not recommended for production)
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}

