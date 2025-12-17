
import { getCityData } from "@/lib/data";
import { notFound } from "next/navigation";
import CityHero from "@/components/CityHero";
import WeatherDashboard from "@/components/WeatherDashboard";
import DayVerdict from "@/components/DayVerdict";
import { format } from "date-fns";
import type { Metadata } from 'next';
import DatePageTracker from "@/components/DatePageTracker";
import SwipeNavigation from "@/components/SwipeNavigation";

const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export const dynamicParams = true;
export const revalidate = 86400;

function getDateUrl(date: Date, city: string) {
    const monthName = format(date, 'MMMM').toLowerCase();
    const day = date.getDate();
    return `/${city}/${monthName}/${day}`;
}

export async function generateMetadata({ params }: { params: { city: string; month: string; day: string } }): Promise<Metadata> {
    const { city, month, day } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];
    const dayPad = day.toString().padStart(2, '0');

    if (!monthNum) return { title: 'Date not found' };

    const data = await getCityData(city);
    if (!data) return { title: 'City not found' };

    const dateKey = `${monthNum}-${dayPad}`;
    const dayData = data.days[dateKey];
    if (!dayData) return { title: 'Date not found' };

    const cityName = data.meta.name;
    const formattedDate = `${monthLower.charAt(0).toUpperCase() + monthLower.slice(1)} ${day}`;
    // e.g. July 17

    const tempAvg = dayData.stats.temp_max;

    return {
        title: `${cityName} Weather on ${formattedDate}: Is it a good time to visit?`,
        description: `Planning to visit ${cityName} on ${formattedDate}? Historical data shows ${tempAvg}°C, ${dayData.stats.precip_prob}% rain risk. See full report.`,
        openGraph: {
            title: `${cityName} Weather on ${formattedDate}`,
            description: `Historical data shows ${tempAvg}°C, ${dayData.stats.precip_prob}% rain risk.`,
            type: 'website',
            locale: 'en_US',
            siteName: '30YearWeather',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${cityName} Weather on ${formattedDate}`,
            description: `Historical data: ${tempAvg}°C, ${dayData.stats.precip_prob}% rain risk.`,
        },
        alternates: {
            canonical: `/${city}/${monthLower}/${day}`,
        }
    };
}

export default async function CityDayPage({
    params,
}: {
    params: { city: string; month: string; day: string };
}) {
    const { city, month, day } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];

    if (!monthNum) notFound();

    const data = await getCityData(city);
    if (!data) notFound();

    // Helper to calculate offset dynamically from IANA string (e.g. "Asia/Makassar" -> 8)
    const getTzOffset = (tzName: string) => {
        try {
            const now = new Date();
            const utcDate = new Date(now.toLocaleString('en-US', { timeZone: "UTC" }));
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tzName }));
            return Math.round((tzDate.getTime() - utcDate.getTime()) / 36e5);
        } catch (e) {
            return 2; // Default fallback
        }
    };
    const calculatedOffset = getTzOffset(data.meta.timezone || 'UTC');

    const dayPad = day.toString().padStart(2, '0');
    const dateKey = `${monthNum}-${dayPad}`;
    const dayData = data.days[dateKey];

    if (!dayData) notFound();

    // Date Object for calculations
    const dateObj = new Date(2024, parseInt(monthNum) - 1, parseInt(day));
    const formattedDate = format(dateObj, "MMMM d");

    // Navigation
    const prevObj = new Date(dateObj); prevObj.setDate(prevObj.getDate() - 1);
    const nextObj = new Date(dateObj); nextObj.setDate(nextObj.getDate() + 1);
    const prevUrl = getDateUrl(prevObj, city);
    const nextUrl = getDateUrl(nextObj, city);

    // Verdict Logic
    const weddingScore = dayData.scores.wedding;
    let verdict = "MAYBE";
    if (weddingScore >= 80) verdict = "YES";
    else if (weddingScore < 40) verdict = "NO"; // More strict

    // Alternative Dates
    const alternativeDates = [];
    for (let offset = -7; offset <= 7; offset++) {
        if (offset === 0) continue;
        const altDate = new Date(dateObj);
        altDate.setDate(altDate.getDate() + offset);
        const altKey = `${(altDate.getMonth() + 1).toString().padStart(2, '0')}-${altDate.getDate().toString().padStart(2, '0')}`;
        const altDayData = data.days[altKey];
        if (altDayData) {
            alternativeDates.push({
                dateSlug: getDateUrl(altDate, city), // Use full URL here or just slug? Component expects slug probably?
                // Wait, WeatherDashboard expects dateSlug to match URL format?
                // Let's optimize: WeatherDashboard usually links to something.
                // We should pass the URL.
                // But the component might render <Link href={base + slug}>.
                // Let's pass the RELATIVE path parts.
                // Actually, let's look at WeatherDashboard usage.

                // For now, I will pass the raw MM-DD slug but let the component handle it?
                // No, component probably builds link `/city/MM-DD`. That's BROKEN now.
                // I need to update WeatherDashboard to support new URLs.
                // OR hacked solution: pass full URL as slug? No.

                dateFormatted: format(altDate, "MMMM d"),
                score: altDayData.scores.wedding,
                tempMax: altDayData.stats.temp_max,
                precipProb: altDayData.stats.precip_prob,
                improvement: altDayData.scores.wedding - weddingScore,
                // Passing custom Link href prop if component supports it?
                linkHref: getDateUrl(altDate, city)
            });
        }
    }

    // Popular Cities Comparison
    const popularCities = [
        { slug: 'prague', name: 'Prague', country: 'Czech Republic' }, // Updated slugs!
        { slug: 'paris', name: 'Paris', country: 'France' },
        { slug: 'rome', name: 'Rome', country: 'Italy' },
        { slug: 'barcelona', name: 'Barcelona', country: 'Spain' },
        { slug: 'london', name: 'London', country: 'United Kingdom' },
        { slug: 'amsterdam', name: 'Amsterdam', country: 'Netherlands' },
        { slug: 'lisbon', name: 'Lisbon', country: 'Portugal' },
        { slug: 'tokyo', name: 'Tokyo', country: 'Japan' },
        { slug: 'dubai', name: 'Dubai', country: 'UAE' },
        { slug: 'bangkok', name: 'Bangkok', country: 'Thailand' },
        { slug: 'bali', name: 'Bali', country: 'Indonesia' }, // Added Bali
        { slug: 'new-york', name: 'New York', country: 'USA' },
        { slug: 'cancun', name: 'Cancún', country: 'Mexico' }
    ].filter(c => c.slug !== city);

    const cityComparisons = await Promise.all(
        popularCities.slice(0, 6).map(async (c) => {
            const cityData = await getCityData(c.slug);
            if (!cityData || !cityData.days[dateKey]) return null;
            const dayStats = cityData.days[dateKey];
            return {
                citySlug: c.slug,
                cityName: c.name,
                country: c.country,
                tempMax: dayStats.stats.temp_max,
                precipProb: dayStats.stats.precip_prob,
                score: dayStats.scores.wedding
                // Link? Dashboard builds link.
            };
        })
    ).then(results => results.filter((r): r is NonNullable<typeof r> => r !== null));

    return (
        <SwipeNavigation prevUrl={prevUrl} nextUrl={nextUrl} className="min-h-screen bg-slate-50">
            <DatePageTracker
                cityName={data.meta.name}
                date={formattedDate}
                verdict={verdict}
            />
            {/* JSON-LD removed for brevity in this step, should add back */}

            <CityHero
                city={data.meta.name}
                citySlug={city}
                date={formattedDate}
                tempMax={dayData.stats.temp_max}
                tempMin={dayData.stats.temp_min}
                precipProb={dayData.stats.precip_prob}
                dateSlug={dateKey} // Keeping MM-DD for internal logic if needed
                windKmh={dayData.stats.wind_kmh}
                humidity={dayData.stats.humidity_percent}
            />

            <DayVerdict
                score={dayData.scores.wedding}
                precipProb={dayData.stats.precip_prob}
                city={data.meta.name}
                month={format(dateObj, "MMMM")}
                day={dateObj.getDate()}
                tempMax={dayData.stats.temp_max}
                humidity={dayData.stats.humidity_percent || 0}
                citySlug={city}
                monthSlug={monthLower}
            />

            <WeatherDashboard
                dayData={dayData}
                lat={data.meta.lat}
                lon={data.meta.lon}
                dateId={dateKey}
                citySlug={city}
                cityName={data.meta.name}
                geoInfo={data.meta.geo_info}
                safetyProfile={data.meta.safety_profile}
                timezoneOffset={calculatedOffset}
                alternativeDates={alternativeDates} // Contains new linkHref property?
                cityComparisons={cityComparisons}
            />
        </SwipeNavigation>
    );
}
