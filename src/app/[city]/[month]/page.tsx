
import { getCityData } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MonthCalendarView from "@/components/MonthCalendarView";
import DatePageTracker from "@/components/DatePageTracker";
import { Thermometer, CloudRain, Sun, Calendar, Droplets, Wind, ArrowRight } from "lucide-react";
import type { Metadata } from 'next';
import Header from "@/components/common/Header";
import TravelInsights from "@/components/TravelInsights";
import Footer from "@/components/Footer";
import SeaTemperatureCard from "@/components/SeaTemperatureCard";
import marineMetadata from "@/lib/marine-metadata.json";

// Helper for month mapping
const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const dynamicParams = true;
export const revalidate = 86400;

// 1. Dynamic Metadata
export async function generateMetadata({ params }: { params: { city: string; month: string } }): Promise<Metadata> {
    const { city, month } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];

    if (!monthNum) return { title: 'Month not found' };

    const data = await getCityData(city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;
    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);

    // Calculate detailed stats for the month
    let totalMax = 0;
    let totalMin = 0;
    let totalRainProb = 0;
    let rainyDays25 = 0;
    let count = 0;

    Object.entries(data.days).forEach(([key, day]: [string, any]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalMin += day.stats.temp_min || 0;
            totalRainProb += day.stats.precip_prob;
            if (day.stats.precip_prob > 25) rainyDays25++;
            count++;
        }
    });

    const avgMax = count ? Math.round(totalMax / count) : 0;
    const avgMin = count ? Math.round(totalMin / count) : 0;
    const avgRain = count ? Math.round(totalRainProb / count) : 0;
    const rainyDaysCount = count ? Math.round((rainyDays25 / count) * count) : 0;

    // Sea Temp
    const marineInfo = (marineMetadata as Record<string, any>)[city];
    let seaTempStr = "";
    if (marineInfo) {
        const marineDays = Object.entries(data.days)
            .filter(([key, day]: [string, any]) => key.startsWith(monthNum + "-") && day.marine?.water_temp !== undefined);
        if (marineDays.length > 0) {
            const totalTemp = marineDays.reduce((sum: number, [, day]: [string, any]) => sum + (day.marine?.water_temp || 0), 0);
            const avgSeaTemp = Math.round((totalTemp / marineDays.length) * 10) / 10;
            seaTempStr = `Swimming temp: ${avgSeaTemp}°C. `;
        }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    const title = `${cityName} Weather in ${monthDisplay} | 30-Year Forecast`;
    // Target 160-220 characters
    // Example: "Planning to visit Ao Nang in February? based on 30 years of data: expect avg highs of 32°C, lows of 24°C, and 3 rainy days. Swimming temp: 29°C. Read our travel guide."
    const description = `Planning a trip to ${cityName} in ${monthDisplay}? Based on 30 years of data: expect avg highs of ${avgMax}°C, lows of ${avgMin}°C, and ${rainyDaysCount} rainy days. ${seaTempStr}Read our detailed travel guide.`;

    return {
        title: title,
        description: description,
        keywords: [`${cityName} in ${monthLower}`, `${cityName} weather ${monthLower}`, `visiting ${cityName} in ${monthLower}`, `what to wear in ${cityName} in ${monthLower}`, `${cityName} ${monthLower} temperature`],
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

    const monthNum = MONTH_MAP[monthLower];
    if (!monthNum) {
        notFound();
    }

    const data = await getCityData(city);
    if (!data) notFound();

    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    const cityName = data.meta.name;
    const monthIndex = parseInt(monthNum) - 1;

    // Hero image
    const heroImage = `/images/${city}-hero.webp`;

    // Statistics Aggregation
    let totalMax = 0;
    let totalMin = 0;
    let totalRainProb = 0;
    let totalSunHours = 0;
    let rainyDays25 = 0;
    let daysCount = 0;
    let hottestDay = { temp: -100, day: 0 };
    let coolestDay = { temp: 100, day: 0 };

    Object.entries(data.days).forEach(([key, day]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalMin += day.stats.temp_min;
            totalRainProb += day.stats.precip_prob;
            totalSunHours += (day.stats as any).sun_hours ?? 8;
            if (day.stats.precip_prob > 25) rainyDays25++;
            daysCount++;

            const dayNum = parseInt(key.split('-')[1]);
            if (day.stats.temp_max > hottestDay.temp) {
                hottestDay = { temp: day.stats.temp_max, day: dayNum };
            }
            if (day.stats.temp_min < coolestDay.temp) {
                coolestDay = { temp: day.stats.temp_min, day: dayNum };
            }
        }
    });

    const avgMax = Math.round(totalMax / daysCount);
    const avgMin = Math.round(totalMin / daysCount);
    const avgRainProb = Math.round(totalRainProb / daysCount);
    const avgSunHours = Math.round(totalSunHours / daysCount);
    const rainyDaysCount = Math.round((rainyDays25 / daysCount) * daysCount);

    // Calculate average sea temperature for this month (if coastal city)
    const marineInfo = (marineMetadata as Record<string, any>)[city];
    let avgSeaTemp: number | null = null;
    if (marineInfo) {
        const marineDaysForMonth = Object.entries(data.days)
            .filter(([key, day]: [string, any]) => key.startsWith(monthNum + "-") && day.marine?.water_temp !== undefined);
        if (marineDaysForMonth.length > 0) {
            const totalTemp = marineDaysForMonth.reduce((sum: number, [, day]: [string, any]) => sum + (day.marine?.water_temp || 0), 0);
            avgSeaTemp = Math.round((totalTemp / marineDaysForMonth.length) * 10) / 10;
        }
    }

    // Season context
    const getSeasonContext = () => {
        const m = parseInt(monthNum);
        if (m >= 12 || m <= 2) return "Winter";
        if (m >= 3 && m <= 5) return "Spring";
        if (m >= 6 && m <= 8) return "Summer";
        return "Autumn";
    };
    const season = getSeasonContext();

    // Verdict
    const getVerdict = () => {
        if (avgRainProb > 40) return { text: "Wet Season", emoji: "🌧️", color: "blue" };
        if (avgMax < 10) return { text: "Cool & Crisp", emoji: "❄️", color: "cyan" };
        if (avgMax > 28) return { text: "Hot & Sunny", emoji: "☀️", color: "orange" };
        if (avgMax > 20) return { text: "Warm & Pleasant", emoji: "😊", color: "emerald" };
        return { text: "Mild & Comfortable", emoji: "🌤️", color: "teal" };
    };
    const verdict = getVerdict();

    // Next/Prev months
    const prevMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    const nextMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
    const prevMonth = MONTH_NAMES[prevMonthIndex].toLowerCase();
    const nextMonth = MONTH_NAMES[nextMonthIndex].toLowerCase();

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
                        "text": `Based on 30 years of NASA data, ${monthDisplay} in ${cityName} has average highs of ${avgMax}°C and ${rainyDaysCount} rainy days. It is ${verdict.text.toLowerCase()} season.`
                    }
                },
                {
                    "@type": "Question",
                    "name": `What is the weather like in ${cityName} in ${monthDisplay}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Expect temperatures between ${avgMin}°C and ${avgMax}°C with ${avgRainProb}% average rain probability and about ${avgSunHours} hours of sunshine daily.`
                    }
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col">
            <DatePageTracker cityName={data.meta.name} date={monthDisplay} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header
                breadcrumb={{
                    label: `${cityName} in ${monthDisplay}`,
                    href: `/${city}`,
                    sublabel: "Monthly Weather Guide"
                }}
            />

            {/* Hero Section - Full width on mobile, boxed on desktop */}
            <section className="w-full relative pt-16 md:pt-24 max-w-7xl mx-auto md:px-6 lg:px-8">
                {/* Desktop Breadcrumbs (above hero) */}
                <nav className="hidden md:flex items-center gap-2 text-xs text-stone-500 mb-4" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/${city}`} className="hover:text-stone-900 transition-colors">{cityName}</Link>
                    <span>/</span>
                    <span className="text-stone-900 font-medium">{monthDisplay}</span>
                </nav>

                <div className="relative h-[500px] md:h-[400px] w-full overflow-hidden rounded-none md:rounded-2xl bg-stone-800">
                    <Image
                        src={heroImage}
                        alt={`${cityName} weather in ${monthDisplay} - ${data.meta.country}`}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 1280px"
                        quality={60}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                        {/* Breadcrumbs */}
                        <nav className="flex md:hidden items-center gap-2 text-xs text-white/70 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/${city}`} className="hover:text-white transition-colors">{cityName}</Link>
                            <span>/</span>
                            <span className="text-white font-medium">{monthDisplay}</span>
                        </nav>

                        {/* Season Badge */}
                        <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider border border-white/20">
                                <span>{verdict.emoji}</span>
                                {verdict.text}
                            </span>
                        </div>

                        {/* H1 */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {cityName} Weather in {monthDisplay}
                        </h1>

                        {/* SEO Description */}
                        <p className="text-white/90 text-base md:text-lg max-w-3xl mb-6 leading-relaxed">
                            Plan your {monthDisplay} trip to {cityName}, {data.meta.country}.
                            Based on <strong>30 years of NASA data</strong>, expect temperatures of {avgMax}°C (high) to {avgMin}°C (low),
                            with {avgRainProb}% rain probability and {avgSunHours} hours of daily sunshine.
                            {marineInfo && avgSeaTemp !== null && (
                                <> The <strong>{marineInfo.sea_name}</strong> averages <strong>{avgSeaTemp}°C</strong> in {monthDisplay}.</>
                            )}
                            {rainyDaysCount > 10
                                ? ` Pack rain gear for around ${rainyDaysCount} rainy days.`
                                : ` Great conditions with only ${rainyDaysCount} rainy days expected.`}
                        </p>

                        {/* Month Navigation */}
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/${city}/${prevMonth}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/20"
                            >
                                ← {MONTH_NAMES[prevMonthIndex]}
                            </Link>
                            <Link
                                href={`/${city}/${nextMonth}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                            >
                                {MONTH_NAMES[nextMonthIndex]} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <main className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                    {/* Avg High */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Avg High</span>
                            <Thermometer className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{avgMax}°C</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Hottest around day {hottestDay.day}</p>
                    </div>

                    {/* Avg Low */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Avg Low</span>
                            <Thermometer className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{avgMin}°C</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Coolest around day {coolestDay.day}</p>
                    </div>

                    {/* Rainy Days */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Rainy Days</span>
                            <CloudRain className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{rainyDaysCount}</span>
                            <span className="text-lg text-stone-500">days</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">{avgRainProb}% avg rain chance</p>
                    </div>

                    {/* Sunshine */}
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Sunshine</span>
                            <Sun className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{avgSunHours}</span>
                            <span className="text-lg text-stone-500">hrs/day</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">{season} season</p>
                    </div>
                </div>

                {/* Sea Temperature Section - Only for coastal cities */}
                {marineInfo && avgSeaTemp !== null && (
                    <SeaTemperatureCard
                        waterTemp={avgSeaTemp}
                        seaName={marineInfo.sea_name}
                        seaNameLocal={marineInfo.sea_name_local}
                        monthName={monthDisplay}
                        cityName={cityName}
                        variant="full"
                    />
                )}

                {/* Calendar View */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-stone-900">Daily Forecasts</h2>
                            <p className="text-sm text-stone-500 mt-1">Click any day to see detailed weather information</p>
                        </div>
                    </div>
                    <MonthCalendarView city={city} month={monthNum} data={data} />
                </section>

                {/* Travel Intelligence - Same as City Page */}
                <TravelInsights
                    cityName={cityName}
                    citySlug={city}
                    flightInfo={data.meta.flight_info}
                    healthInfo={data.meta.health_info}
                />

                {/* SEO Content Block */}
                <section className="mt-12 mb-12">
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        {/* Header - Same style as TravelInsights cards */}
                        <div className="px-6 py-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-stone-900">Is {monthDisplay} a Good Time to Visit {cityName}?</h2>
                                <p className="text-stone-500 text-xs">Climate analysis based on 30 years of data</p>
                            </div>
                            <span className="px-3 py-1.5 bg-stone-200 rounded-full text-stone-700 text-sm font-semibold">
                                {verdict.text}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="prose prose-stone max-w-none">
                                <p className="text-stone-600 leading-relaxed">
                                    Based on our analysis of <strong>30 years of historical weather data</strong> from NASA satellites,
                                    <strong> {monthDisplay}</strong> in {cityName} is characterized by average daytime highs of <strong>{avgMax}°C</strong>
                                    and nighttime lows around <strong>{avgMin}°C</strong>.
                                </p>
                                <p className="text-stone-600 leading-relaxed mt-3">
                                    {rainyDaysCount > 15
                                        ? `This is ${season.toLowerCase()} season with notable precipitation. Expect around ${rainyDaysCount} days with measurable rainfall. Pack waterproof layers and plan indoor alternatives.`
                                        : rainyDaysCount > 8
                                            ? `${monthDisplay} offers a mix of sunny and occasional rainy days with about ${rainyDaysCount} days seeing precipitation. An umbrella is advisable but shouldn't disrupt most plans.`
                                            : `${monthDisplay} is one of the drier periods in ${cityName}, with only around ${rainyDaysCount} days typically seeing rain. Ideal for outdoor activities and sightseeing.`}
                                </p>
                                <p className="text-stone-600 leading-relaxed mt-3">
                                    {avgMax > 30
                                        ? `The heat can be intense during midday hours. We recommend starting outdoor activities early morning or late afternoon. Stay hydrated and seek shade during peak sun hours.`
                                        : avgMax > 25
                                            ? `The weather is warm and pleasant for most outdoor activities. Light, breathable clothing is recommended. Don't forget sunscreen and a hat.`
                                            : avgMax > 18
                                                ? `Temperatures are mild and comfortable for walking tours and outdoor exploration. Layers are useful as mornings and evenings can be cooler.`
                                                : `The weather is cool, so dress in warm layers. This can be a great time for fewer crowds at popular attractions.`}
                                </p>
                            </div>

                            {/* Packing Essentials */}
                            <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
                                <h3 className="font-bold text-stone-800 mb-3">📦 Packing Essentials for {monthDisplay}</h3>
                                <ul className="text-sm text-stone-600 grid grid-cols-2 gap-2">
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
                        </div>
                    </div>
                </section>

                {/* Citation Block */}
                <div className="mb-12 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-100 rounded-xl shrink-0">
                            <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-lg font-medium text-stone-800 leading-relaxed mb-3">
                                "According to 30YearWeather's analysis of <strong className="text-orange-700">30 years of NASA POWER satellite data</strong>,
                                {cityName} in {monthDisplay} averages <strong className="text-orange-700">{avgMax}°C</strong> with
                                <strong className="text-orange-700"> {avgRainProb}%</strong> precipitation probability."
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-orange-200 text-stone-700 font-medium">
                                    📊 Source: 30YearWeather.com
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-orange-200 text-stone-700 font-medium">
                                    🛰️ Data: NASA POWER (1991-2021)
                                </span>
                                <Link href="/methodology" className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold hover:underline">
                                    View Methodology →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-stone-900 mb-6">
                        Frequently Asked Questions: {cityName} in {monthDisplay}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-white rounded-xl border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">🌡️ What are the temperatures?</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Daytime highs average <strong>{avgMax}°C</strong>, nights drop to <strong>{avgMin}°C</strong>.
                                {avgMax - avgMin > 12 ? " There's a significant day/night temperature swing." : " Temperatures remain fairly consistent."}
                            </p>
                        </div>
                        <div className="p-5 bg-white rounded-xl border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">🌧️ How many rainy days?</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                Expect around <strong>{rainyDaysCount} days</strong> with measurable rainfall.
                                {avgRainProb > 50 ? " Definitely pack rain gear." : avgRainProb > 30 ? " An umbrella is advisable." : " Rain is unlikely to disrupt plans."}
                            </p>
                        </div>
                        <div className="p-5 bg-white rounded-xl border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">👗 What should I wear?</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {avgMax > 28
                                    ? "Light, breathable fabrics. Don't forget sunglasses and a hat."
                                    : avgMax > 20
                                        ? "Comfortable casual wear with a light jacket for evenings."
                                        : avgMax > 10
                                            ? "Layers are key. A medium-weight jacket and closed-toe shoes."
                                            : "Warm winter clothing: insulated jacket, boots, gloves."}
                            </p>
                        </div>
                        <div className="p-5 bg-white rounded-xl border border-stone-200">
                            <h3 className="font-bold text-stone-800 mb-2">💰 Is it peak or off-season?</h3>
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {avgRainProb < 25 && avgMax >= 18 && avgMax <= 28
                                    ? "This is typically peak season with higher prices. Book 2-3 months ahead."
                                    : avgRainProb > 45
                                        ? "This is off-peak season. Expect lower prices and fewer crowds."
                                        : "This is shoulder season—moderate prices and manageable crowds."}
                            </p>
                        </div>
                    </div>
                </section>

            </main >
            <div className="mt-auto">
                <Footer />
            </div>
        </div >
    );
}
