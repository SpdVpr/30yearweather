
import { getCityData } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import MonthCalendarView from "@/components/MonthCalendarView";
import DatePageTracker from "@/components/DatePageTracker";
import { Card, Text, Title, Grid, Col } from "@tremor/react";
import { ArrowLeft, Thermometer, CloudRain, Sun, Calendar, Info } from "lucide-react";
import type { Metadata } from 'next';
import Header from "@/components/common/Header";
import MonthTravelInfo from "@/components/MonthTravelInfo";

// Helper for month mapping
const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: { city: string; month: string } }): Promise<Metadata> {
    const { city, month } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];

    if (!monthNum) return { title: 'Month not found' };

    const data = await getCityData(city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;
    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);

    // Aggregation for metadata
    let totalMax = 0;
    let totalRain = 0;
    let count = 0;
    Object.entries(data.days).forEach(([key, day]: [string, any]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalRain += day.stats.precip_prob;
            count++;
        }
    });

    const avgMax = count ? Math.round(totalMax / count) : 0;
    const avgRain = count ? Math.round(totalRain / count) : 0;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    // Optimized title (50-60 characters)
    const title = `${cityName} in ${monthDisplay} | Weather & Climate Guide`;

    // Optimized description (140-160 characters for SEO)
    const description = `${cityName} ${monthDisplay} weather: ${avgMax}°C avg high, ${avgRain}% rain chance. Historical climate data from 30 years of NASA satellite observations. Plan your perfect trip.`;

    return {
        title: title,
        description: description,
        keywords: [`${cityName} in ${monthLower}`, `${cityName} weather ${monthLower}`, `visiting ${cityName} in ${monthLower}`, `what to wear in ${cityName} in ${monthLower}`],
        alternates: {
            canonical: `${baseUrl}/${city}/${monthLower}`,
            languages: {
                'en': `${baseUrl}/${city}/${monthLower}`,
                'x-default': `${baseUrl}/${city}/${monthLower}`,
            }
        },
        openGraph: {
            title: title,
            description: description,
            url: `${baseUrl}/${city}/${monthLower}`,
            siteName: '30YearWeather',
            locale: 'en_US',
            type: 'website',
        }
    };
}

export default async function CityMonthPage({ params }: { params: { city: string; month: string } }) {
    const { city, month } = params;
    const monthLower = month.toLowerCase();

    // Validate month
    const monthNum = MONTH_MAP[monthLower];
    if (!monthNum) {
        notFound();
    }

    const data = await getCityData(city);
    if (!data) notFound();

    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    const cityName = data.meta.name;

    // --- Statistics Aggregation ---
    let totalMax = 0;
    let totalMin = 0;
    let totalRainProb = 0;
    let rainyDays25 = 0; // chance > 25%
    let rainyDays50 = 0; // chance > 50%
    let daysCount = 0;
    let sunniestDay = { prob: 0, day: 0 }; // lowest rain prob

    Object.entries(data.days).forEach(([key, day]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalMin += day.stats.temp_min;
            totalRainProb += day.stats.precip_prob;
            if (day.stats.precip_prob > 25) rainyDays25++;
            if (day.stats.precip_prob > 50) rainyDays50++;
            daysCount++;
        }
    });

    const avgMax = Math.round(totalMax / daysCount);
    const avgMin = Math.round(totalMin / daysCount);
    const avgRainProb = Math.round(totalRainProb / daysCount);

    // Dynamic Text Generation
    const getSeasonContext = () => {
        const m = parseInt(monthNum);
        if (m >= 12 || m <= 2) return "Winter";
        if (m >= 3 && m <= 5) return "Spring";
        if (m >= 6 && m <= 8) return "Summer";
        return "Autumn";
    };
    const season = getSeasonContext();

    const getVerdict = () => {
        if (avgRainProb > 40) return ["Wet Season", "bg-blue-100 text-blue-800"];
        if (avgMax < 10) return ["Chilly & Crisp", "bg-cyan-100 text-cyan-800"];
        if (avgMax > 25) return ["Warm & Sunny", "bg-orange-100 text-orange-800"];
        return ["Mild & Pleasant", "bg-emerald-100 text-emerald-800"];
    };
    const [verdictText, verdictClass] = getVerdict();

    const baseUrl = "https://30yearweather.com";

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
                { "@type": "ListItem", "position": 2, "name": cityName, "item": `${baseUrl}/${city}` },
                { "@type": "ListItem", "position": 3, "name": monthDisplay, "item": `${baseUrl}/${city}/${monthLower}` }
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": `Is ${monthDisplay} a good time to visit ${cityName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Historically, ${monthDisplay} in ${cityName} has average highs of ${avgMax}°C and around ${Math.round((rainyDays25 / daysCount) * 30)} days with significant rain chance. It is considered the ${season} season and is generally ${verdictText.toLowerCase()}.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `How much does it rain in ${cityName} during ${monthDisplay}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `The average probability of rain in ${monthDisplay} is ${avgRainProb}%. Expect about ${Math.round((rainyDays25 / daysCount) * 30)} days with noticeable precipitation (>25% daily chance).`
                    }
                },
                {
                    "@type": "Question",
                    "name": `What should I pack for ${cityName} in ${monthDisplay}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": avgRainProb > 40 ? `Pack waterproof clothing and an umbrella. Temperatures range from ${avgMin}°C to ${avgMax}°C.` : avgMax > 28 ? `Pack light, breathable clothing. Sun protection is essential with temps around ${avgMax}°C.` : `Pack layers for temperatures between ${avgMin}°C and ${avgMax}°C.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `Is ${monthDisplay} peak season or off-season in ${cityName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": avgRainProb < 30 && avgMax >= 20 && avgMax <= 28 ? `${monthDisplay} is typically peak tourist season in ${cityName} due to ideal weather conditions.` : avgRainProb > 45 ? `${monthDisplay} is considered off-season in ${cityName}, offering fewer crowds and lower prices.` : `${monthDisplay} is a shoulder season in ${cityName}, balancing decent weather with moderate crowds.`
                    }
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <DatePageTracker cityName={data.meta.name} date={monthDisplay} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header
                breadcrumb={{
                    label: `${cityName} in ${monthDisplay}`,
                    href: `/${city}`,
                    sublabel: "Historical Weather Guide"
                }}
            />

            <div className="pt-16">
                {/* Content starts after the unified header */}
            </div>

            <main>
                <article itemScope itemType="https://schema.org/Article" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div itemProp="articleBody">

                    {/* H1 Heading for SEO */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            {cityName} Weather in {monthDisplay}
                        </h1>
                        <p className="text-lg text-slate-600">
                            Historical climate data based on 30 years of NASA satellite observations
                        </p>
                    </div>

                    {/* 1. KEY STATS CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Temperature */}
                        <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <Thermometer className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Temperature</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-slate-800">{avgMax}°</span>
                                <span className="text-lg text-slate-500 mb-1">/ {avgMin}°</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                Average daytime high vs nighttime low.
                            </p>
                        </Card>

                        {/* Rain */}
                        <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <CloudRain className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Precipitation</span>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-bold text-slate-800">{Math.round((rainyDays25 / daysCount) * 30)}</span>
                                <span className="text-lg text-slate-500 mb-1">days</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2">
                                Days with significant rainfall (&gt;25% chance).
                            </p>
                        </Card>

                        {/* Verdict/Pack */}
                        <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Info className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Travel Advice</span>
                            </div>
                            <p className="font-medium text-slate-800 text-lg leading-snug">
                                {avgRainProb < 20
                                    ? "Pack light! It's mostly dry."
                                    : avgRainProb < 50
                                        ? "Pack a mix: sun & light rain gear."
                                        : "Bring a raincoat & umbrella."}
                            </p>
                            <p className="text-sm text-slate-600 mt-2">
                                {season} season in {cityName}.
                                {avgMax > 28 ? " Heat warnings possible." : ""}
                            </p>
                        </Card>
                    </div>

                    {/* Tourist Season Analysis */}
                    <MonthTravelInfo
                        cityName={cityName}
                        monthNum={parseInt(monthNum)}
                        flightInfo={data.meta.flight_info}
                    />

                    {/* 3. CALENDAR VIEW - Moved up for better UX */}
                    <div id="calendar-view" className="scroll-mt-24 mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-xl font-bold text-slate-800">Daily Forecast for {monthDisplay}</h2>
                        </div>
                        {/* The specialized calendar component */}
                        <MonthCalendarView city={city} month={monthNum} data={data} />
                    </div>

                    {/* 2. INTRO TEXT (SEO) - Expanded for LLM optimization */}
                    <div className="mb-12 max-w-3xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Is {monthDisplay} a good time to visit {cityName}?</h2>
                        <div className="prose prose-slate prose-lg">
                            <p className="text-slate-600 leading-relaxed">
                                Based on our analysis of <strong>30 years of historical weather data</strong> from NASA satellites,
                                <strong>{monthDisplay}</strong> in {cityName} is characterized by average daytime highs of <strong>{avgMax}°C</strong>
                                and nighttime lows around <strong>{avgMin}°C</strong>.
                            </p>
                            <p className="text-slate-600 leading-relaxed mt-3">
                                {rainyDays25 > 15
                                    ? `This is the ${season.toLowerCase()} season with notable precipitation. Expect around ${Math.round((rainyDays25 / daysCount) * 30)} days with measurable rainfall. Pack waterproof layers and plan indoor alternatives.`
                                    : rainyDays25 > 8
                                        ? `${monthDisplay} offers a mix of sunny and occasional rainy days with about ${Math.round((rainyDays25 / daysCount) * 30)} days seeing precipitation. An umbrella is advisable but shouldn't disrupt most plans.`
                                        : `${monthDisplay} is one of the drier periods in ${cityName}, with only around ${Math.round((rainyDays25 / daysCount) * 30)} days typically seeing rain. Ideal for outdoor activities and sightseeing.`}
                            </p>
                            <p className="text-slate-600 leading-relaxed mt-3">
                                {avgMax > 30
                                    ? `The heat can be intense during midday hours. We recommend starting outdoor activities early morning or late afternoon. Stay hydrated and seek shade during peak sun hours (11am-3pm).`
                                    : avgMax > 25
                                        ? `The weather is warm and pleasant for most outdoor activities. Light, breathable clothing is recommended. Don't forget sunscreen and a hat for extended time outdoors.`
                                        : avgMax > 18
                                            ? `Temperatures are mild and comfortable for walking tours and outdoor exploration. Layers are useful as mornings and evenings can be cooler.`
                                            : `The weather is cool, so dress in warm layers. This can be a great time for fewer crowds at popular attractions.`}
                            </p>
                        </div>

                        {/* What to Pack Section */}
                        <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2">📦 Packing Essentials for {monthDisplay}</h3>
                            <ul className="text-sm text-slate-600 grid grid-cols-2 gap-2">
                                {avgMax > 28 && <li>✓ Lightweight, breathable clothing</li>}
                                {avgMax > 28 && <li>✓ High SPF sunscreen</li>}
                                {avgMax <= 28 && avgMax > 18 && <li>✓ Light layers for variable temps</li>}
                                {avgMax <= 18 && <li>✓ Warm jacket or coat</li>}
                                {avgMax <= 10 && <li>✓ Thermal underwear</li>}
                                {avgRainProb > 30 && <li>✓ Waterproof jacket or umbrella</li>}
                                {avgRainProb > 50 && <li>✓ Waterproof footwear</li>}
                                <li>✓ Comfortable walking shoes</li>
                                <li>✓ Reusable water bottle</li>
                            </ul>
                        </div>

                        {/* Season Verdict Badge */}
                        <div className="mt-4 inline-flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${verdictClass}`}>
                                {verdictText} Season
                            </span>
                            <span className="text-xs text-slate-500">
                                Based on {(daysCount * 30).toLocaleString()}+ historical observations
                            </span>
                        </div>

                        {/* Internal links for SEO hierarchy */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                            <Link href={`/${city}`} className="text-orange-600 hover:underline">Best Time to Visit {data.meta.name}</Link>
                            <span className="text-slate-300">|</span>
                            <Link href={`/${city}/${monthLower}/${new Date().getDate()}`} className="text-orange-600 hover:underline">Weather in {data.meta.name} Today</Link>
                            <span className="text-slate-300">|</span>
                            <Link href="/#cities" className="text-orange-600 hover:underline">Compare Destinations</Link>
                        </div>
                    </div>

                    {/* 4. FAQ (Structured Data Compatible) - Fixed consistency */}
                    <div className="mt-16 border-t border-slate-200 pt-12">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions: {cityName} in {monthDisplay}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-2">🌡️ What are the temperatures in {cityName} during {monthDisplay}?</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Daytime highs average <strong>{avgMax}°C</strong>, while nights drop to around <strong>{avgMin}°C</strong>.
                                    {avgMax - avgMin > 12 ? " There's a significant day/night temperature swing, so pack layers." : " Temperatures remain fairly consistent throughout the day."}
                                    {avgMin < 5 ? " It can get quite cold—thermal layers recommended." : avgMax > 30 ? " Heat can be intense—stay hydrated." : ""}
                                </p>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-2">🌧️ How many rainy days are there in {monthDisplay}?</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Based on 30 years of data, expect around <strong>{Math.round((rainyDays25 / daysCount) * 30)} days</strong> with measurable rainfall (&gt;25% daily chance).
                                    The average daily rain probability is {avgRainProb}%.
                                    {avgRainProb > 50 ? " Definitely pack rain gear." : avgRainProb > 30 ? " An umbrella is a good idea." : " Rain is unlikely to disrupt your plans."}
                                </p>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-2">👗 What should I wear in {cityName} in {monthDisplay}?</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {avgMax > 28
                                        ? "Light, breathable fabrics like cotton and linen. Don't forget sunglasses and a hat. Sandals or breathable shoes work well."
                                        : avgMax > 20
                                            ? "Comfortable casual wear with a light jacket for evenings. Comfortable walking shoes are essential."
                                            : avgMax > 10
                                                ? "Layers are key. A medium-weight jacket, sweaters, and closed-toe shoes. Consider a scarf for windy days."
                                                : "Warm winter clothing: insulated jacket, thermal layers, boots, gloves, and a warm hat."}
                                </p>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-2">💰 Is {monthDisplay} expensive or cheap to visit {cityName}?</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {avgRainProb < 25 && avgMax >= 18 && avgMax <= 28
                                        ? "This is typically peak season with higher prices for flights and accommodation. Book 2-3 months ahead for best rates."
                                        : avgRainProb > 45
                                            ? "This is off-peak season. Expect lower prices and fewer crowds at attractions. Great for budget travelers."
                                            : "This is shoulder season—a sweet spot with moderate prices and manageable crowds."}
                                </p>
                            </div>
                        </div>

                        {/* Citation Block for LLM */}
                        <div className="mt-8 p-4 bg-slate-100 rounded-lg border-l-4 border-orange-500">
                            <p className="text-sm text-slate-700 italic">
                                "According to 30YearWeather's analysis of 30 years of NASA satellite data, {cityName} in {monthDisplay} averages {avgMax}°C with a {avgRainProb}% precipitation probability."
                            </p>
                            <p className="text-xs text-slate-500 mt-1">— Source: 30YearWeather.com | Methodology: <Link href="/methodology" className="text-orange-600 hover:underline">Rolling Window Algorithm</Link></p>
                        </div>
                    </div>

                </div>
            </article>
            </main>
        </div>
    );
}
