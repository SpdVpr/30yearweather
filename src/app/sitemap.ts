import { MetadataRoute } from 'next';
import { getAllCities } from '@/lib/data';

// CHANGE THIS TO YOUR PRODUCTION DOMAIN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://historical-weather-app.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const cities = await getAllCities();
    const urls: MetadataRoute.Sitemap = [];

    // 1. Homepage
    urls.push({
        url: `${BASE_URL}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
    });

    // 2. City Pages (Archives/Index)
    // Assuming you might have a page like /prague-cz later
    // For now, valid pages are /city/date

    // 3. Daily Pages (City * 366 days)
    for (const city of cities) {
        // Generate dates for current year (taking leap year into account to be safe, e.g. 2024)
        const year = 2024;
        const startDate = new Date(year, 0, 1); // Jan 1
        const endDate = new Date(year, 11, 31); // Dec 31

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const dateSlug = `${month}-${day}`;

            urls.push({
                url: `${BASE_URL}/${city}/${dateSlug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly', // Historical data rarely changes
                priority: 0.8,
            });
        }
    }

    return urls;
}
