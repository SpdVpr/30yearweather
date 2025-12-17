import { NextRequest, NextResponse } from 'next/server';
import { getCityData } from '@/lib/data';
import { trackApiRequest } from '@/lib/server-analytics';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const slug = params.slug;
        const data = await getCityData(slug);

        if (!data) {
            return NextResponse.json({ error: "City not found" }, { status: 404 });
        }

        // Parse query params
        const searchParams = request.nextUrl.searchParams;
        const minified = searchParams.get('minified') === 'true';

        // Optimize for LLM Context Window (Don't send 366 days of raw data if minified=true)
        // Otherwise, provide full rich data.


        const monthlyStats: Record<number, any> = {};

        // Calculate monthly averages
        for (let m = 1; m <= 12; m++) {
            const monthKey = m.toString().padStart(2, '0');
            const days = Object.entries(data.days).filter(([k]) => k.startsWith(monthKey));

            if (days.length === 0) continue;

            let tempMaxSum = 0;
            let tempMinSum = 0;
            let rainProbSum = 0;
            let windSum = 0;

            days.forEach(([_, day]) => {
                tempMaxSum += day.stats.temp_max;
                tempMinSum += day.stats.temp_min;
                rainProbSum += day.stats.precip_prob;
                windSum += day.stats.wind_kmh;
            });

            const count = days.length;
            monthlyStats[m] = {
                month_name: new Date(2024, m - 1, 1).toLocaleString('en-US', { month: 'long' }),
                temp_high: Math.round(tempMaxSum / count),
                temp_low: Math.round(tempMinSum / count),
                rain_chance: Math.round(rainProbSum / count),
                wind_avg: Math.round(windSum / count),
                verdict: (tempMaxSum / count) > 20 && (rainProbSum / count) < 30 ? "Good for travel" : "Neutral"
            };
        }

        // Calculate Summary Statistics for AI
        const monthsVal = Object.values(monthlyStats);
        const bestMonths = monthsVal.filter(m => m.verdict === "Good for travel").map(m => m.month_name);

        // Fallback for best months if strict criteria returns none
        if (bestMonths.length === 0) {
            monthsVal.sort((a, b) => b.temp_high - a.temp_high); //Sort by warmest as fallback
            bestMonths.push(...monthsVal.slice(0, 3).map(m => m.month_name));
        }

        const driest = monthsVal.reduce((prev, curr) => prev.rain_chance < curr.rain_chance ? prev : curr);
        const wettest = monthsVal.reduce((prev, curr) => prev.rain_chance > curr.rain_chance ? prev : curr);
        const warmest = monthsVal.reduce((prev, curr) => prev.temp_high > curr.temp_high ? prev : curr);
        const coldest = monthsVal.reduce((prev, curr) => prev.temp_low < curr.temp_low ? prev : curr);

        const aiResponse = {
            name: data.meta.name,
            country: data.meta.country,
            location: { lat: data.meta.lat, lon: data.meta.lon },
            // Safety Profile is crucial for AI agents planning trips
            safety: data.meta.safety_profile || "No safety data available",

            summary: {
                best_months: bestMonths,
                driest_month: `${driest.month_name} (${driest.rain_chance}% rain prob)`,
                wettest_month: `${wettest.month_name} (${wettest.rain_chance}% rain prob)`,
                coldest_month: `${coldest.month_name} (avg low ${coldest.temp_low}°C)`,
                warmest_month: `${warmest.month_name} (avg high ${warmest.temp_high}°C)`,
                avg_temp_range: `${coldest.temp_low}°C to ${warmest.temp_high}°C`,
                rain_probability_range: `${driest.rain_chance}% to ${wettest.rain_chance}%`,
                data_source: "NASA POWER API (1994-2024)",
                citation: "30YearWeather.com - Historical Weather Intelligence"
            },

            yearly_stats: data.yearly_stats,
            monthly_climate: monthlyStats,

            // FULL DATA DUMP (Unless minified)
            // Enrichment: Calculate derived metrics that are normally done on the frontend
            daily_forecast: minified ? "Use ?minified=false to get full 365-day data" : Object.fromEntries(
                Object.entries(data.days).map(([key, day]) => {
                    // 1. Calculate Meteo-Health Score (0-100)
                    let healthScore = 100;
                    if (day.health_impact?.migraine_risk === 'High') healthScore -= 30;
                    if (day.health_impact?.migraine_risk === 'Medium') healthScore -= 15;
                    if (day.health_impact?.joint_pain_risk === 'High') healthScore -= 30;
                    if (day.health_impact?.joint_pain_risk === 'Medium') healthScore -= 15;
                    healthScore = Math.max(0, healthScore);

                    // 2. Verdict Logic
                    let verdict = "Mixed";
                    if (day.scores.wedding > 80) verdict = "Excellent";
                    else if (day.scores.wedding > 60) verdict = "Good";
                    else if (day.scores.wedding < 40) verdict = "Poor";

                    // 3. Marine Status (if coastal)
                    let marineStatus = "N/A";
                    if (day.marine) {
                        if (day.marine.water_temp > 21 && day.marine.wave_height < 1.0) marineStatus = "Excellent Swim";
                        else if (day.marine.water_temp < 18) marineStatus = "Cold Water";
                        else marineStatus = "Mixed Conditions";
                    }

                    return [key, {
                        ...day,
                        calculated_metrics: {
                            health_score: healthScore,
                            verdict: verdict,
                            marine_status: marineStatus
                            // Feels like could be added here too if we want to duplicate the formula
                        }
                    }];
                })
            ),

            note: "Data based on 30-year historical analysis (1994-2024)."
        };

        // LOGGING
        trackApiRequest(request, `/api/v1/city/${slug}`, { slug });

        return NextResponse.json(aiResponse);

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
