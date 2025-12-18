import { getAllCities, getCityData } from '@/lib/data';

const BASE_URL = 'https://30yearweather.com';

export async function GET() {
    const citySlugs = await getAllCities();

    // We'll fetch data for the first few cities to populate the feed properly if needed,
    // but for performance, we might just list them.
    // However, an RSS feed usually needs a title and description for each item.
    // Let's fetch data for all? If it's 100+ cities, might be slow on demand.
    // But this is a static route (can be cached).

    // Let's stick to simple generation to ensure speed.
    // We will generate the XML string manually.

    const items = await Promise.all(citySlugs.map(async (slug) => {
        const data = await getCityData(slug);
        if (!data) return '';

        return `
        <item>
            <title>${data.meta.name} Weather Forecast & Climate Guide</title>
            <link>${BASE_URL}/${slug}</link>
            <guid>${BASE_URL}/${slug}</guid>
            <description><![CDATA[${data.meta.desc || `30-year historical weather analysis for ${data.meta.name}. Plan your trip with data-backed confidence.`}]]></description>
            <pubDate>${new Date().toUTCString()}</pubDate>
        </item>`;
    }));

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>30YearWeather - Historical Weather Intelligence</title>
        <link>${BASE_URL}</link>
        <description>Data-backed weather forecasts based on 30 years of NASA satellite data. Plan your perfect trip.</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
        ${items.join('')}
    </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        },
    });
}
