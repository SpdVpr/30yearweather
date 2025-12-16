import { NextRequest, NextResponse } from 'next/server';
import { getAllCities, getCityData } from '@/lib/data';
import { trackApiRequest } from '@/lib/server-analytics';

export const dynamic = 'force-dynamic'; // Search is dynamic based on query params

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // 1. Parse Query Parameters
        const monthParam = searchParams.get('month');
        const minTempParam = searchParams.get('min_temp');
        const maxRainParam = searchParams.get('max_rain_prob');
        const regionParam = searchParams.get('region'); // 'europe', 'asia', etc.

        if (!monthParam) {
            return NextResponse.json(
                { error: "Parameter 'month' (1-12) is required. Weather is seasonal." },
                { status: 400 }
            );
        }

        const month = parseInt(monthParam);
        if (isNaN(month) || month < 1 || month > 12) {
            return NextResponse.json({ error: "Invalid month. Use 1-12." }, { status: 400 });
        }

        // Logic thresholds
        const minTemp = minTempParam ? parseFloat(minTempParam) : -100;
        const maxRainProb = maxRainParam ? parseFloat(maxRainParam) : 100;

        // 2. Load Data (In a real DB this would be a SQL query, here we iterate in-memory which is fine for <1000 cities)
        const citySlugs = await getAllCities();
        const results = [];

        for (const slug of citySlugs) {
            const data = await getCityData(slug);
            if (!data) continue;

            // Region filtering (if region is implemented in meta)
            // if (regionParam && data.meta.region !== regionParam) continue;

            const monthKey = month.toString().padStart(2, '0');

            // We need to calculate monthly averages from daily data for the filter
            // Or use pre-calculated monthly stats if available. 
            // Let's aggregate daily stats for the requested month on the fly.

            let tempSum = 0;
            let rainProbSum = 0;
            let daysCount = 0;
            let rainDaysSum = 0;

            const daysInMonth = Object.entries(data.days).filter(([dateid]) => dateid.startsWith(monthKey));

            if (daysInMonth.length === 0) continue;

            for (const [_, dayData] of daysInMonth) {
                tempSum += dayData.stats.temp_max;
                rainProbSum += dayData.stats.precip_prob;
                if (dayData.stats.precip_mm > 0.1) rainDaysSum++;
                daysCount++;
            }

            const avgTemp = tempSum / daysCount;
            const avgRainProb = rainProbSum / daysCount;

            // 3. Apply Filters
            if (avgTemp < minTemp) continue;
            if (avgRainProb > maxRainProb) continue;

            // 4. Construct Result Object (Lightweight for AI)
            results.push({
                city: data.meta.name,
                slug: slug,
                country: data.meta.country,
                match_score: 100, // Placeholder for weighted score
                month_stats: {
                    avg_temp: Math.round(avgTemp * 10) / 10,
                    rain_probability: Math.round(avgRainProb),
                    condition: avgRainProb > 40 ? "Rainy" : (avgTemp > 25 ? "Sunny" : "Mild") // Simplified logic
                },
                tags: [
                    avgTemp > 25 ? "Warm" : "Cool",
                    avgRainProb < 20 ? "Dry" : "Wet"
                ]
            });
        }

        // Sort by temperature descending (default)
        results.sort((a, b) => b.month_stats.avg_temp - a.month_stats.avg_temp);

        // LOGGING
        trackApiRequest(request, '/api/v1/search', {
            month,
            min_temp: minTemp,
            count: results.length
        });

        return NextResponse.json({
            count: results.length,
            parameters: { month, min_temp: minTemp, max_rain_prob: maxRainProb },
            results: results
        });

    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
