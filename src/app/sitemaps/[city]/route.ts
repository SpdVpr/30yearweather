import { NextResponse } from 'next/server';
import { getAllCities } from '@/lib/data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  const cityId = params.city.replace('.xml', ''); // Remove .xml extension

  const urls: string[] = [];

  // 1. Main Sitemap (Homepage, static pages)
  if (cityId === 'main') {
    urls.push(`
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }

  // 2. City Specific Sitemaps
  const city = cityId;

  // A. City Overview Page (/prague-cz)
  urls.push(`
  <url>
    <loc>${BASE_URL}/${city}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);

  // B. Monthly Pages (/prague-cz/january)
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  for (const month of months) {
    urls.push(`
  <url>
    <loc>${BASE_URL}/${city}/${month}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`);
  }

  // C. Daily Pages (/prague-cz/january/01) - 366 pages
  const year = 2024; // Use leap year to capture Feb 29
  const startDate = new Date(year, 0, 1); // Jan 1
  const endDate = new Date(year, 11, 31); // Dec 31

  // Iterate through every day of the year
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // format: "MMMM" gives full month name, e.g., "January"
    // We need it lowercase for the URL
    const monthName = d.toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const day = d.getDate().toString().padStart(2, '0');

    urls.push(`
  <url>
    <loc>${BASE_URL}/${city}/${monthName}/${day}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// Generate static params for all cities
export async function generateStaticParams() {
  const cities = await getAllCities();
  return [
    { city: 'main.xml' },
    ...cities.map(city => ({ city: `${city}.xml` }))
  ];
}

