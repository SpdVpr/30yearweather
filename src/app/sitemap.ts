import { MetadataRoute } from 'next';
import { getAllCities } from '@/lib/data';

// CHANGE THIS TO YOUR PRODUCTION DOMAIN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

export async function generateSitemaps() {
    const cities = await getAllCities();
    // Add 'main' as the first sitemap for static pages
    // Returns array of objects with id property: [{ id: 'main' }, { id: 'prague-cz' }, ...]
    return [{ id: 'main' }, ...cities.map(city => ({ id: city }))];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = [];

    // 1. Main Sitemap (Homepage, static pages)
    if (id === 'main') {
        urls.push({
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        });
        // You can add /about, /contact here in the future
        return urls;
    }

    // 2. City Specific Sitemaps
    // 'id' corresponds to the city slug provided by generateSitemaps
    const city = id;

    // A. City Overview Page (/prague-cz)
    urls.push({
        url: `${BASE_URL}/${city}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    });

    // B. Monthly Pages (/prague-cz/01)
    for (let month = 1; month <= 12; month++) {
        const monthSlug = month.toString().padStart(2, '0');
        urls.push({
            url: `${BASE_URL}/${city}/${monthSlug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.85,
        });
    }

    // C. Daily Pages (/prague-cz/01-01) - 366 pages
    const year = 2024; // Use leap year to capture Feb 29
    const startDate = new Date(year, 0, 1); // Jan 1
    const endDate = new Date(year, 11, 31); // Dec 31

    // Iterate through every day of the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const dateSlug = `${month}-${day}`;

        urls.push({
            url: `${BASE_URL}/${city}/${dateSlug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly', // Historical data rarely changes
            priority: 0.7,
        });
    }

    return urls;
}
