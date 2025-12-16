import { NextResponse } from 'next/server';
import { getAllCities } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

export async function GET() {
    const cities = await getAllCities();
    
    // Generate sitemap index XML
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemaps/main.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
${cities.map(city => `  <sitemap>
    <loc>${BASE_URL}/sitemaps/${city}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(sitemapIndex, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}

