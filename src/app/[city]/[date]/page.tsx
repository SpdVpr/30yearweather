import { getCityData, getAllCities } from "@/lib/data";
import { notFound } from "next/navigation";
import CityHero from "@/components/CityHero";
import WeatherDashboard from "@/components/WeatherDashboard";
import MonthCalendarView from "@/components/MonthCalendarView";
import { format } from "date-fns";
import type { Metadata } from 'next';
import DatePageTracker from "@/components/DatePageTracker";

// 1. Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: { city: string; date: string } }): Promise<Metadata> {
    const { city, date } = params;
    const data = await getCityData(city);

    // Check if it's a month view
    const isMonthView = date.length === 2 && !isNaN(parseInt(date));

    if (!data) {
        return { title: 'Weather not found' };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';
    const cityName = data.meta.name;

    if (isMonthView) {
        const monthName = format(new Date(2024, parseInt(date) - 1, 1), "MMMM");
        return {
            title: `${cityName} Weather Forecast for ${monthName} - Long-Range Predictions`,
            description: `Get ${monthName} weather forecast for ${cityName}. See day-by-day predictions, rain probabilities, and temperatures based on 30 years of data. Perfect for planning your ${monthName} trip to ${cityName}.`,
            keywords: [`${cityName} ${monthName} weather`, `${cityName} ${monthName} forecast`, `${cityName} weather ${monthName}`],
            alternates: { canonical: `${baseUrl}/${city}/${date}` }
        };
    }

    const dayData = data.days[date];
    if (!dayData) return { title: 'Date not found' };

    const dateObj = new Date(2024, parseInt(date.split('-')[0]) - 1, parseInt(date.split('-')[1]));
    const formattedDate = format(dateObj, "MMMM d");
    const formattedMonth = format(dateObj, "MMMM");
    const tempAvg = dayData.stats.temp_max;

    return {
        title: `${cityName} Weather Forecast for ${formattedDate} - Long-Range Prediction`,
        description: `${cityName} weather forecast for ${formattedDate}: Expect ${tempAvg}°C with ${dayData.stats.precip_prob}% chance of rain. Based on 30 years of data. Perfect for planning weddings, trips, and events in ${cityName}.`,
        keywords: [`${cityName} weather forecast ${formattedDate}`, `${cityName} weather ${formattedMonth}`, `${cityName} forecast`, `weather forecast ${cityName}`, "wedding weather forecast"],
        alternates: {
            canonical: `${baseUrl}/${city}/${date}`,
        },
        openGraph: {
            title: `${cityName} Weather Forecast for ${formattedDate} - ${tempAvg}°C, ${dayData.stats.precip_prob}% Rain`,
            description: `Long-range weather forecast for ${cityName} on ${formattedDate}. Avg Temp: ${tempAvg}°C, Rain Chance: ${dayData.stats.precip_prob}%. Based on 30 years of NASA data.`,
            images: [
                {
                    url: '/images/hero1-optimized.webp',
                    width: 1200,
                    height: 630,
                    alt: `${cityName} Weather Forecast for ${formattedDate}`,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${cityName} Weather Forecast for ${formattedDate} - ${tempAvg}°C, ${dayData.stats.precip_prob}% Rain`,
            description: `Long-range weather forecast for ${cityName} on ${formattedDate}. Avg Temp: ${tempAvg}°C, Rain Chance: ${dayData.stats.precip_prob}%. Based on 30 years of NASA data.`,
            images: ['/images/hero1-optimized.webp'],
        }
    };
}

// 2. Re-generate params for SSG
// 2. ISR Configuration (On-Demand Generation)
// We removed generateStaticParams to avoid building 15k+ pages at build time.
// Instead, we build them on-demand when a user visits them, and cache them for 24 hours.
export const dynamicParams = true;
export const revalidate = 86400; // Revalidate once every 24 hours

// 3. JSON-LD for Day/Month View
const JsonLd = ({ data, date, dayData }: { data: any, date: string, dayData?: any }) => {
    const isMonthView = date.length === 2;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';
    const citySlug = data.meta.name.toLowerCase().replace(/\s+/g, '-'); // simple slug approximate or use generic
    // Actually we should pass slug from params, but here we can rely on data.meta usually

    let schemaGraph = [];

    if (isMonthView) {
        // --- MONTH VIEW SEO ---
        const monthName = format(new Date(2024, parseInt(date) - 1, 1), "MMMM");

        // Breadcrumbs: Home > City > Month
        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: data.meta.name, item: `${baseUrl}/${citySlug}` }, // approximate slug
                { '@type': 'ListItem', position: 3, name: monthName, item: `${baseUrl}/${citySlug}/${date}` }
            ]
        };

        // CollectionPage or TouristDestination
        const destinationLd = {
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: `${monthName} in ${data.meta.name}`,
            description: `Historical weather guide for ${data.meta.name} in ${monthName}.`,
            url: `${baseUrl}/${citySlug}/${date}`
        };

        schemaGraph = [breadcrumbLd, destinationLd];

    } else {
        // --- DAY VIEW SEO ---
        const dateObj = new Date(2024, parseInt(date.split('-')[0]) - 1, parseInt(date.split('-')[1]));
        const formattedDate = format(dateObj, "MMMM d");
        const monthCode = date.split('-')[0];
        const monthName = format(dateObj, "MMMM");

        // Breadcrumbs: Home > City > Month > Day
        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
                { '@type': 'ListItem', position: 2, name: data.meta.name, item: `${baseUrl}/${citySlug}` },
                { '@type': 'ListItem', position: 3, name: monthName, item: `${baseUrl}/${citySlug}/${monthCode}` },
                { '@type': 'ListItem', position: 4, name: formattedDate, item: `${baseUrl}/${citySlug}/${date}` }
            ]
        };

        const destinationLd = {
            '@type': 'TouristDestination',
            '@id': `${baseUrl}/${citySlug}#destination`,
            name: data.meta.name,
            description: `Historical weather report for ${data.meta.name} on ${formattedDate}`,
            containsPlace: {
                '@type': 'Place',
                name: data.meta.name,
                latitude: data.meta.lat,
                longitude: data.meta.lon,
            }
        };

        const datasetLd = {
            '@type': 'Dataset',
            '@id': `${baseUrl}/${citySlug}/${date}#weather-data`,
            name: `Historical Weather Data: ${data.meta.name} on ${formattedDate}`,
            description: `Aggregated historical weather statistics for ${data.meta.name} on ${formattedDate} based on 30 years of records.`,
            variableMeasured: [
                { '@type': 'PropertyValue', name: 'Average High Temperature', value: `${dayData.stats.temp_max}°C` },
                { '@type': 'PropertyValue', name: 'Rain Probability', value: `${dayData.stats.precip_prob}%` },
                { '@type': 'PropertyValue', name: 'Wind Speed', value: `${dayData.stats.wind_kmh} km/h` },
                ...(dayData.stats.humidity_percent ? [{ '@type': 'PropertyValue', name: 'Humidity', value: `${dayData.stats.humidity_percent}%` }] : []),
                ...(dayData.stats.sunshine_hours ? [{ '@type': 'PropertyValue', name: 'Sunshine Duration', value: `${dayData.stats.sunshine_hours} hours` }] : []),
                ...(dayData.stats.snowfall_cm ? [{ '@type': 'PropertyValue', name: 'Snowfall', value: `${dayData.stats.snowfall_cm} cm` }] : [])
            ],
            mainEntityOfPage: `${baseUrl}/${citySlug}/${date}`
        };

        schemaGraph = [
            breadcrumbLd,
            {
                '@context': 'https://schema.org',
                '@graph': [destinationLd, datasetLd]
            }
        ];
    }

    return (
        <>
            {schemaGraph.map((schema, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
        </>
    );
}

export default async function CityDatePage({
    params,
}: {
    params: { city: string; date: string };
}) {
    const { city, date } = params;
    const data = await getCityData(city);

    // --- MONTH VIEW LOGIC ---
    console.log(`Checking route: city=${city}, date=${date}, length=${date.length}`);
    if (date.length === 2 && !isNaN(parseInt(date))) {
        console.log("-> Detected Month View");
        if (!data) notFound();
        const monthName = format(new Date(2024, parseInt(date) - 1, 1), "MMMM");
        return (
            <>
                <DatePageTracker
                    cityName={data.meta.name}
                    date={monthName}
                />
                <JsonLd data={data} date={date} dayData={null} />
                <MonthCalendarView city={city} month={date} data={data} />
            </>
        );
    }

    // --- DAY VIEW LOGIC ---
    const dayData = data?.days[date];

    if (!data || !dayData) {
        notFound();
    }

    const dateObj = new Date(2024, parseInt(date.split('-')[0]) - 1, parseInt(date.split('-')[1]));
    const formattedDate = format(dateObj, "MMMM d");

    // Calculate verdict from wedding score
    const weddingScore = dayData.scores.wedding;
    let verdict = "MAYBE";
    if (weddingScore >= 80) verdict = "YES";
    else if (weddingScore < 50) verdict = "NO";

    // Generate alternative dates (±7 days) for "Better Alternatives" feature
    const alternativeDates = [];
    for (let offset = -7; offset <= 7; offset++) {
        if (offset === 0) continue; // Skip current date
        const altDate = new Date(dateObj);
        altDate.setDate(altDate.getDate() + offset);
        const altSlug = `${(altDate.getMonth() + 1).toString().padStart(2, '0')}-${altDate.getDate().toString().padStart(2, '0')}`;
        const altDayData = data.days[altSlug];
        if (altDayData) {
            alternativeDates.push({
                dateSlug: altSlug,
                dateFormatted: format(altDate, "MMMM d"),
                score: altDayData.scores.wedding,
                tempMax: altDayData.stats.temp_max,
                precipProb: altDayData.stats.precip_prob,
                improvement: altDayData.scores.wedding - weddingScore
            });
        }
    }

    // Generate city comparisons (popular cities for same date)
    // Select a diverse set of popular destinations
    const popularCities = [
        { slug: 'prague-cz', name: 'Prague', country: 'Czech Republic' },
        { slug: 'paris-fr', name: 'Paris', country: 'France' },
        { slug: 'rome-it', name: 'Rome', country: 'Italy' },
        { slug: 'barcelona-es', name: 'Barcelona', country: 'Spain' },
        { slug: 'london-uk', name: 'London', country: 'United Kingdom' },
        { slug: 'amsterdam-nl', name: 'Amsterdam', country: 'Netherlands' },
        { slug: 'lisbon-pt', name: 'Lisbon', country: 'Portugal' },
        { slug: 'tokyo-jp', name: 'Tokyo', country: 'Japan' },
        { slug: 'dubai-ae', name: 'Dubai', country: 'UAE' },
        { slug: 'bangkok-th', name: 'Bangkok', country: 'Thailand' },
    ].filter(c => c.slug !== city); // Exclude current city

    const cityComparisons = await Promise.all(
        popularCities.slice(0, 6).map(async (c) => {
            const cityData = await getCityData(c.slug);
            if (!cityData || !cityData.days[date]) return null;
            const dayStats = cityData.days[date];
            return {
                citySlug: c.slug,
                cityName: c.name,
                country: c.country,
                tempMax: dayStats.stats.temp_max,
                precipProb: dayStats.stats.precip_prob,
                score: dayStats.scores.wedding
            };
        })
    ).then(results => results.filter((r): r is NonNullable<typeof r> => r !== null));

    return (
        <main className="min-h-screen bg-slate-50">
            <DatePageTracker
                cityName={data.meta.name}
                date={formattedDate}
                verdict={verdict}
            />
            {/* Inject JSON-LD */}
            <JsonLd data={data} date={date} dayData={dayData} />

            {/* 1. Hero Section with Parallax Image & Key Stats */}
            <CityHero
                city={data.meta.name}
                citySlug={city}
                date={formattedDate}
                tempMax={dayData.stats.temp_max}
                tempMin={dayData.stats.temp_min}
                precipProb={dayData.stats.precip_prob}
                dateSlug={date}
                windKmh={dayData.stats.wind_kmh}
                humidity={dayData.stats.humidity_percent}
            />

            {/* 2. Main Dashboard (Programmatic SEO Structure) */}
            <WeatherDashboard
                dayData={dayData}
                lat={data.meta.lat}
                lon={data.meta.lon}
                dateId={date} // "MM-DD" needed for SunCalc
                citySlug={city}
                cityName={data.meta.name}
                geoInfo={data.meta.geo_info}
                safetyProfile={data.meta.safety_profile}
                timezoneOffset={
                    (() => {
                        // Standardized offsets (Simplified for main tourism seasons/Year-round)
                        const c = city.toLowerCase();
                        if (c.includes('tokyo') || c.includes('kyoto') || c.includes('seoul')) return 9;
                        if (c.includes('beijing') || c.includes('shanghai') || c.includes('hong-kong') || c.includes('taipei') || c.includes('singapore') || c.includes('kuala-lumpur') || c.includes('bali') || c.includes('manila')) return 8;
                        if (c.includes('bangkok') || c.includes('hanoi') || c.includes('ho-chi-minh') || c.includes('jakarta')) return 7;
                        if (c.includes('mumbai') || c.includes('new-delhi')) return 5.5;
                        if (c.includes('dubai')) return 4;
                        if (c.includes('istanbul') || c.includes('athens') || c.includes('helsinki')) return 3; // Summer coverage main
                        if (c.includes('london') || c.includes('dublin') || c.includes('lisbon')) return 1; // Summer coverage main
                        // Default CET/CEST (Prague, Berlin, Paris, Rome, etc)
                        return 2;
                    })()
                }
                alternativeDates={alternativeDates}
                cityComparisons={cityComparisons}
            />

            {/* AI/SEO Citation Block - Helps Perplexity/GPT cite us */}
            <section className="container mx-auto px-4 py-12 mt-8 border-t border-slate-200">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Data Source & Methodology</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        This historical weather report for <strong>{data.meta.name}</strong> on <strong>{formattedDate}</strong> is calculated based on 30 years of continuous historical data.
                        Unlike standard 7-day forecasts which rely on models, this data represents actual recorded historical averages.
                        <br /><br />
                        <strong>Methodology V3 (Smart Forecast):</strong> This prediction uses our new "Smart Rolling Window" algorithm (smoothing ±2 days) and applies Recency Weighting to prioritize climate data from the last 10 years, ensuring the forecast reflects modern warming trends rather than outdated history.
                    </p>
                    <div className="bg-slate-100 p-4 rounded-md border border-slate-200">
                        <p className="text-xs font-mono text-slate-500 mb-1">CITE THIS DATA:</p>
                        <p className="text-sm font-medium text-slate-700 select-all">
                            "Historical Weather for {data.meta.name} on {formattedDate}. Source: 30YearWeather.com based on NASA POWER API (1991-2021)."
                        </p>
                    </div>
                </div>
            </section>

        </main>
    );
}
