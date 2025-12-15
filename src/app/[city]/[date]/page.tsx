import { getCityData, getAllCities } from "@/lib/data";
import { notFound } from "next/navigation";
import CityHero from "@/components/CityHero";
import WeatherDashboard from "@/components/WeatherDashboard";
import MonthCalendarView from "@/components/MonthCalendarView";
import { format } from "date-fns";
import type { Metadata } from 'next';

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
            images: ['/images/prague-hero.png'],
        }
    };
}

// 2. Re-generate params for SSG
export async function generateStaticParams() {
    const cities = await getAllCities();
    const allParams = [];

    for (const city of cities) {
        const data = await getCityData(city);
        if (data && data.days) {
            // Add all days
            for (const date of Object.keys(data.days)) {
                allParams.push({ city, date });
            }
            // Add all months (01..12)
            for (let i = 1; i <= 12; i++) {
                allParams.push({ city, date: i.toString().padStart(2, '0') });
            }
        }
    }
    return allParams;
}

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
        return (
            <>
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

    return (
        <main className="min-h-screen bg-slate-50">
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
                    city.includes('tokyo') ? 9 :
                        city.includes('prague') ? 2 : // Summer time approx
                            city.includes('berlin') ? 2 : 0
                }
            />

        </main>
    );
}
