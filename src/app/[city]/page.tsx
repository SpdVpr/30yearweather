
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import { getCityData } from "@/lib/data";
import { Card, Title, Text, Badge } from "@tremor/react";
import { Thermometer, Droplets, Sun, CloudRain, MapPin, ArrowRight, Calendar, Bookmark, Map, TrendingUp, Info } from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from 'next';
import CityPageTracker from "@/components/CityPageTracker";
import Header from "@/components/common/Header";
import TravelInsights from "@/components/TravelInsights";

// 1. Dynamic Metadata
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
    const data = await getCityData(params.city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;

    // Optimized meta description (100-130 characters)
    const description = data.meta.desc
        ? (data.meta.desc.length > 130 ? data.meta.desc.substring(0, 127) + '...' : data.meta.desc)
        : `${cityName} weather forecast based on 30 years of NASA data. Best months to visit, temperatures & rain probability.`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    return {
        // Optimized title (50-60 characters)
        title: `${cityName} Weather Forecast | 30-Year Climate Data`,
        description: description,
        keywords: [`${cityName} weather forecast`, `${cityName} long range forecast`, `${cityName} weather`, `best time to visit ${cityName}`, `${cityName} weather by month`, `${cityName} 365 day forecast`],
        alternates: {
            canonical: `${baseUrl}/${params.city}`,
            languages: {
                'en': `${baseUrl}/${params.city}`,
                'x-default': `${baseUrl}/${params.city}`,
            }
        },
        openGraph: {
            title: `${cityName} Weather Forecast | 30-Year Climate Data`,
            description: description,
            url: `${baseUrl}/${params.city}`,
            siteName: '30YearWeather',
            locale: 'en_US',
            type: 'website',
        }
    };
}

// 2. JSON-LD Component with enhanced entity recognition
const JsonLd = ({ data, slug, faqStats }: { data: any, slug: string, faqStats: any[] }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    // Wikipedia URL mapping for cities with non-standard URLs
    const wikipediaUrlMap: Record<string, string> = {
        'bali': 'https://en.wikipedia.org/wiki/Bali',
        'phuket': 'https://en.wikipedia.org/wiki/Phuket_(city)',
        'cancun': 'https://en.wikipedia.org/wiki/Canc%C3%BAn',
        'dubai': 'https://en.wikipedia.org/wiki/Dubai',
        'male': 'https://en.wikipedia.org/wiki/Mal%C3%A9',
        'ho-chi-minh': 'https://en.wikipedia.org/wiki/Ho_Chi_Minh_City',
        'new-york': 'https://en.wikipedia.org/wiki/New_York_City',
        'new-delhi': 'https://en.wikipedia.org/wiki/New_Delhi',
        'san-francisco': 'https://en.wikipedia.org/wiki/San_Francisco',
        'las-palmas': 'https://en.wikipedia.org/wiki/Las_Palmas',
        'los-angeles': 'https://en.wikipedia.org/wiki/Los_Angeles',
        'hong-kong': 'https://en.wikipedia.org/wiki/Hong_Kong',
        'rio-de-janeiro': 'https://en.wikipedia.org/wiki/Rio_de_Janeiro',
        'buenos-aires': 'https://en.wikipedia.org/wiki/Buenos_Aires',
        'cape-town': 'https://en.wikipedia.org/wiki/Cape_Town',
        'mexico-city': 'https://en.wikipedia.org/wiki/Mexico_City',
        'chiang-mai': 'https://en.wikipedia.org/wiki/Chiang_Mai',
        'kuala-lumpur': 'https://en.wikipedia.org/wiki/Kuala_Lumpur',
        'san-juan': 'https://en.wikipedia.org/wiki/San_Juan,_Puerto_Rico',
        'montego-bay': 'https://en.wikipedia.org/wiki/Montego_Bay',
        'punta-cana': 'https://en.wikipedia.org/wiki/Punta_Cana',
        'bora-bora': 'https://en.wikipedia.org/wiki/Bora_Bora',
        'palma-mallorca': 'https://en.wikipedia.org/wiki/Palma_de_Mallorca',
        'ras-al-khaimah': 'https://en.wikipedia.org/wiki/Ras_Al_Khaimah',
    };

    const getWikipediaUrl = (citySlug: string, cityName: string) => {
        if (wikipediaUrlMap[citySlug]) {
            return wikipediaUrlMap[citySlug];
        }
        return `https://en.wikipedia.org/wiki/${cityName.replace(/\s+/g, '_')}`;
    };

    // Breadcrumbs
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: data.meta.name, item: `${baseUrl}/${slug}` }
        ]
    };

    // TouristDestination with enhanced sameAs
    const destinationLd = {
        '@context': 'https://schema.org',
        '@type': 'TouristDestination',
        name: data.meta.name,
        description: data.meta.desc,
        geo: {
            '@type': 'GeoCoordinates',
            latitude: data.meta.lat,
            longitude: data.meta.lon
        },
        url: `${baseUrl}/${slug}`,
        sameAs: [
            getWikipediaUrl(slug, data.meta.name),
            `https://www.wikidata.org/wiki/Q${data.meta.wikidata_id || ''}`,
        ].filter(url => !url.endsWith('Q')),
        touristType: ['Leisure', 'Wedding Planning', 'Photography', 'Cultural Tourism'],
        isAccessibleForFree: true
    };

    // FAQ Schema
    const hottest = faqStats.reduce((a, b) => a.avgTemp > b.avgTemp ? a : b);
    const coldest = faqStats.reduce((a, b) => a.avgTemp < b.avgTemp ? a : b);
    const wettest = faqStats.reduce((a, b) => a.avgRain > b.avgRain ? a : b);
    const driest = faqStats.reduce((a, b) => a.avgRain < b.avgRain ? a : b);
    const bestMonths = faqStats.filter(m => m.status.includes("Perfect") || m.status.includes("Pleasant")).map(m => m.name);

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `What is the best time to visit ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Based on 30 years of historical weather data from NASA satellites, the best months to visit ${data.meta.name} are ${bestMonths.slice(0, 3).join(", ") || "the drier months"}. These months offer the best combination of pleasant temperatures and low rain probability.`
                }
            },
            {
                '@type': 'Question',
                name: `When is the hottest month in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${hottest.name} is historically the hottest month in ${data.meta.name} with average highs of ${hottest.avgTemp}°C (${Math.round(hottest.avgTemp * 9 / 5 + 32)}°F).`
                }
            },
            {
                '@type': 'Question',
                name: `When is the coldest month in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${coldest.name} is the coldest month in ${data.meta.name} with average highs of ${coldest.avgTemp}°C (${Math.round(coldest.avgTemp * 9 / 5 + 32)}°F).`
                }
            },
            {
                '@type': 'Question',
                name: `When does it rain the most in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${wettest.name} has the highest rain probability in ${data.meta.name} at ${wettest.avgRain}%.`
                }
            },
            {
                '@type': 'Question',
                name: `When is the driest month to visit ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${driest.name} is the driest month in ${data.meta.name} with only ${driest.avgRain}% chance of rain.`
                }
            },
            {
                '@type': 'Question',
                name: `Is ${data.meta.name} good for a destination wedding?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes, ${data.meta.name} can be excellent for destination weddings. The best months are ${bestMonths.slice(0, 2).join(" and ") || "during the dry season"} when rain probability is lowest.`
                }
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, destinationLd, faqLd]) }}
        />
    );
};

export default async function CityIndexPage({
    params,
}: {
    params: { city: string };
}) {
    const { city } = params;
    const data = await getCityData(city);

    if (!data) {
        notFound();
    }

    // Pre-calculate monthly stats aggregation
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthlyStats = months.map((month) => {
        const monthKey = month.toString().padStart(2, "0");

        let tempSum = 0;
        let tempMinSum = 0;
        let rainProbSum = 0;
        let rainMmSum = 0;
        let count = 0;

        Object.entries(data.days).forEach(([dateKey, dayData]: [string, any]) => {
            if (dateKey.startsWith(monthKey + "-")) {
                tempSum += dayData.stats.temp_max;
                tempMinSum += dayData.stats.temp_min || 0;
                rainProbSum += dayData.stats.precip_prob;
                rainMmSum += dayData.stats.precip_mm || 0;
                count++;
            }
        });

        const avgTemp = count ? Math.round(tempSum / count) : 0;
        const avgTempMin = count ? Math.round(tempMinSum / count) : 0;
        const avgRain = count ? Math.round(rainProbSum / count) : 0;
        const totalRainMm = count ? Math.round(rainMmSum) : 0;

        // Simple logic for "Best time" badge
        let status = "Neutral";
        let color = "stone";
        let emoji = "☁️";

        if (avgTemp >= 20 && avgTemp <= 28 && avgRain < 25) {
            status = "✨ Perfect";
            color = "emerald";
            emoji = "☀️";
        } else if (avgTemp >= 15 && avgTemp <= 30 && avgRain < 35) {
            status = "😊 Pleasant";
            color = "teal";
            emoji = "🌤️";
        } else if (avgTemp < 5) {
            status = "❄️ Cold";
            color = "blue";
            emoji = "❄️";
        } else if (avgRain > 40) {
            status = "🌧️ Rainy";
            color = "slate";
            emoji = "🌧️";
        } else if (avgTemp > 30) {
            status = "🔥 Hot";
            color = "orange";
            emoji = "🔥";
        }

        const monthNameSlug = format(new Date(2024, month - 1, 1), "MMMM").toLowerCase();

        return {
            monthNum: month,
            name: format(new Date(2024, month - 1, 1), "MMMM"),
            shortName: format(new Date(2024, month - 1, 1), "MMM"),
            avgTemp,
            avgTempMin,
            avgRain,
            totalRainMm,
            status,
            color,
            emoji,
            link: `/${city}/${monthNameSlug}`
        };
    });

    // Calculate yearly aggregates
    const yearlyAvgHigh = Math.round(monthlyStats.reduce((sum, m) => sum + m.avgTemp, 0) / 12);
    const yearlyAvgLow = Math.round(monthlyStats.reduce((sum, m) => sum + m.avgTempMin, 0) / 12);
    const yearlyRainfall = monthlyStats.reduce((sum, m) => sum + m.totalRainMm, 0);
    const avgSunshineHrs = 8;

    // Best months to visit
    const bestMonths = monthlyStats.filter(m => m.status.includes("Perfect") || m.status.includes("Pleasant")).map(m => m.name);
    const bestMonthsText = bestMonths.length > 0 ? bestMonths.slice(0, 2).join(" - ") : "Year-round";

    // Hero image
    const heroImage = `/images/${city}-hero.webp`;

    // Helper for FAQ display
    const hottest = monthlyStats.reduce((a, b) => a.avgTemp > b.avgTemp ? a : b);
    const coldest = monthlyStats.reduce((a, b) => a.avgTemp < b.avgTemp ? a : b);
    const wettest = monthlyStats.reduce((a, b) => a.avgRain > b.avgRain ? a : b);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900">
            <CityPageTracker cityName={data.meta.name} citySlug={city} />
            <JsonLd data={data} slug={city} faqStats={monthlyStats} />

            <Header
                breadcrumb={{
                    label: data.meta.name,
                    href: "/",
                    sublabel: "30-Year Analysis"
                }}
            />

            {/* Hero Section - Full width on mobile, boxed on desktop */}
            <section className="relative pt-16 md:pt-24 max-w-7xl mx-auto md:px-6 lg:px-8">
                <div className="relative h-[500px] md:h-[500px] w-full overflow-hidden rounded-none md:rounded-2xl">
                    <Image
                        src={heroImage}
                        alt={`${data.meta.name} weather and climate - scenic view of ${data.meta.name}, ${data.meta.country}`}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                        quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto">
                        <nav className="flex items-center gap-2 text-xs text-white/70 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <span className="text-white font-medium">{data.meta.name}</span>
                        </nav>

                        <div className="mb-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
                                <Calendar className="w-3.5 h-3.5" />
                                Best Time to Visit: {bestMonthsText}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            {data.meta.name} Weather Forecast
                        </h1>

                        <p className="text-white/90 text-base md:text-lg max-w-3xl mb-6 leading-relaxed">
                            Plan your trip to {data.meta.name}, {data.meta.country} with confidence.
                            Based on <strong>30 years of NASA satellite data</strong>, expect average temperatures of {yearlyAvgHigh}°C (high) to {yearlyAvgLow}°C (low),
                            with {yearlyRainfall.toLocaleString()}mm annual rainfall.
                            {bestMonths.length > 0 && <> The <strong>best months to visit</strong> are <strong>{bestMonths.slice(0, 3).join(", ")}</strong> for optimal weather conditions.</>}
                            {' '}Explore daily forecasts for all 365 days.
                        </p>

                        <div className="flex items-center gap-3">
                            <a
                                href={`https://maps.google.com/?q=${data.meta.lat},${data.meta.lon}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-lg"
                            >
                                <Map className="w-4 h-4" />
                                View on Map
                            </a>
                            <button className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors" aria-label="Save to favorites">
                                <Bookmark className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Avg High</span>
                            <Thermometer className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{yearlyAvgHigh}°C</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Peak in {hottest.name}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Avg Low</span>
                            <Thermometer className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{yearlyAvgLow}°C</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Coolest in {coldest.name}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Annual Rainfall</span>
                            <CloudRain className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{yearlyRainfall.toLocaleString()}</span>
                            <span className="text-lg text-stone-500">mm</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Heavy in {wettest.name}</p>
                    </div>

                    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">Daily Sunshine</span>
                            <Sun className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-4xl font-bold text-stone-900">{avgSunshineHrs}</span>
                            <span className="text-lg text-stone-500">hrs</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">Peak in dry season</p>
                    </div>
                </div>

                {/* Monthly Breakdown - Primary CTA Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-stone-900">Choose a Month</h2>
                            <p className="text-sm text-stone-500 mt-1">Click any month to explore daily weather forecasts</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs text-stone-400">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                                ✨ Perfect
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full">
                                😊 Pleasant
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-700 rounded-full">
                                🌧️ Rainy
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {monthlyStats.map((stat) => (
                            <Link key={stat.monthNum} href={stat.link}>
                                <Card
                                    decoration="top"
                                    decorationColor={stat.color as any}
                                    className="hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer group h-full border-stone-100 bg-white"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <Title className="font-serif text-lg">{stat.name}</Title>
                                        <span className="text-xl">{stat.emoji}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-stone-700">
                                            <Thermometer className="w-4 h-4 text-orange-500" />
                                            <span className="text-lg font-bold">{stat.avgTemp}°C</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-700">
                                            <CloudRain className="w-4 h-4 text-blue-500" />
                                            <span className="text-sm">{stat.avgRain}% rain</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                                        <Badge color={stat.color as any} size="xs">{stat.status}</Badge>
                                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Destination Overview - Unified Card */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                        {/* Header - Same style as TravelInsights */}
                        <div className="px-6 py-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-stone-900">About {data.meta.name}</h2>
                                <p className="text-stone-500 text-xs">Location, climate overview & historical trends</p>
                            </div>
                            <span className="px-3 py-1.5 bg-stone-200 rounded-full text-stone-700 text-sm font-semibold">
                                {data.meta.country}
                            </span>
                        </div>

                        {/* Content Grid */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: Map */}
                                <div className="lg:col-span-1">
                                    <div className="rounded-xl overflow-hidden border border-stone-200 h-full flex flex-col">
                                        <div className="flex-1 min-h-[280px] bg-stone-100 relative">
                                            <iframe
                                                className="absolute inset-0 w-full h-full"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                title={`Map of ${data.meta.name}, ${data.meta.country}`}
                                                src={`https://maps.google.com/maps?q=${data.meta.lat},${data.meta.lon}&hl=en&z=8&output=embed`}
                                            ></iframe>
                                        </div>
                                        <div className="p-3 bg-stone-50 border-t border-stone-200">
                                            <p className="text-xs text-stone-600 mb-1">
                                                📍 {Math.abs(data.meta.lat).toFixed(4)}° {data.meta.lat >= 0 ? 'N' : 'S'}, {Math.abs(data.meta.lon).toFixed(4)}° {data.meta.lon >= 0 ? 'E' : 'W'}
                                            </p>
                                            <a
                                                href={`https://maps.google.com/?q=${data.meta.lat},${data.meta.lon}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                Open in Google Maps
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: About Text + Climate Trend */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* About Text */}
                                    <div className="prose prose-stone prose-sm max-w-none">
                                        <p className="text-stone-600 leading-relaxed text-base">
                                            {data.meta.desc ? data.meta.desc : `${data.meta.name} is a prominent destination in ${data.meta.country}.`}
                                        </p>
                                        <p className="text-stone-600 leading-relaxed mt-3 text-base">
                                            Located at <strong>{Math.abs(data.meta.lat).toFixed(2)}°{data.meta.lat >= 0 ? 'N' : 'S'}</strong> latitude,
                                            {data.meta.name} experiences {Math.abs(data.meta.lat) < 23.5 ? 'a tropical climate with warm temperatures year-round' : Math.abs(data.meta.lat) < 35 ? 'a subtropical climate with distinct wet and dry seasons' : Math.abs(data.meta.lat) < 55 ? 'a temperate climate with four distinct seasons' : 'a subarctic climate with cold winters and mild summers'}.
                                        </p>
                                        <p className="text-stone-600 leading-relaxed mt-3 text-base">
                                            Based on 30 years of data, <strong>{hottest.name}</strong> is the warmest month (avg. {hottest.avgTemp}°C),
                                            while <strong>{coldest.name}</strong> is the coolest.
                                            <strong> {wettest.name}</strong> sees the most rain ({wettest.avgRain}% chance),
                                            making <strong>{monthlyStats.reduce((a, b) => a.avgRain < b.avgRain ? a : b).name}</strong> the driest month.
                                        </p>
                                    </div>

                                    {/* Climate Trend + Citation - Side by Side */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Climate Trend Alert */}
                                        {data.yearly_stats && data.yearly_stats.warming_trend > 0 && (
                                            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 flex flex-col">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2.5 bg-orange-100 rounded-lg">
                                                        <TrendingUp className="w-6 h-6 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-stone-900">Climate Trend Detected</h3>
                                                        <Badge color="orange" size="xs">Important</Badge>
                                                    </div>
                                                </div>

                                                {/* Key Stat Highlight */}
                                                <div className="bg-white/60 rounded-lg p-4 mb-4 text-center border border-orange-100">
                                                    <p className="text-4xl font-bold text-orange-600">+{data.yearly_stats.warming_trend}°C</p>
                                                    <p className="text-xs text-stone-500 mt-1">Temperature increase over 30 years</p>
                                                </div>

                                                <p className="text-sm text-stone-600 leading-relaxed flex-1">
                                                    Our analysis shows a clear warming trend for {data.meta.name},
                                                    comparing <strong>1994-1998</strong> vs <strong>2020-2024</strong> averages.
                                                </p>
                                            </div>
                                        )}

                                        {/* Citation / Best Time */}
                                        <div className="p-6 bg-stone-50 rounded-xl border border-stone-100 flex flex-col">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2.5 bg-orange-100 rounded-lg">
                                                    <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-stone-900">Best Time to Visit</h3>
                                                    <span className="text-xs text-stone-500">NASA POWER Data (1991-2021)</span>
                                                </div>
                                            </div>

                                            {/* Key Stat Highlight - Only months and temp */}
                                            <div className="bg-white rounded-lg p-4 mb-4 border border-stone-200 flex items-center justify-between">
                                                <div>
                                                    <p className="text-2xl font-bold text-orange-600">{bestMonths.slice(0, 3).join(", ") || "Dry Season"}</p>
                                                    <p className="text-xs text-stone-500">Best months to visit</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-stone-800">{yearlyAvgHigh}°C</p>
                                                    <p className="text-xs text-stone-500">Avg High</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-stone-600 leading-relaxed flex-1">
                                                Based on <strong className="text-orange-600">30 years of NASA satellite data</strong>,
                                                {data.meta.name} receives approximately <strong>{yearlyRainfall.toLocaleString()}mm</strong> of rainfall annually.
                                                These months offer optimal temperatures and minimal rain probability for your visit.
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-200">
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-stone-200 text-xs text-stone-500">
                                                    📊 30YearWeather
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded-full border border-stone-200 text-xs text-stone-500">
                                                    🛰️ NASA
                                                </span>
                                                <Link href="/methodology" className="text-xs text-orange-600 hover:underline font-semibold ml-auto">
                                                    Methodology →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Travel Intelligence Section */}
                <TravelInsights
                    cityName={data.meta.name}
                    citySlug={city}
                    flightInfo={data.meta?.flight_info}
                    healthInfo={data.meta?.health_info}
                />

                {/* Climate Data Summary */}
                <div className="mt-16 overflow-x-auto">
                    <div className="mb-4">
                        <h3 className="text-xl font-serif font-bold text-stone-900">Climate Data Summary</h3>
                        <p className="text-sm text-stone-500">Structured historical data for easy parsing.</p>
                    </div>
                    <table className="min-w-full text-sm text-left text-stone-600 border border-stone-200 bg-white rounded-lg shadow-sm">
                        <thead className="bg-stone-50 text-stone-900 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 border-b">Month</th>
                                <th className="px-4 py-3 border-b">Avg High (°C)</th>
                                <th className="px-4 py-3 border-b">Rain Probability (%)</th>
                                <th className="px-4 py-3 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyStats.map((stat) => (
                                <tr key={stat.monthNum} className="border-b last:border-0 hover:bg-stone-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-stone-900">{stat.name}</td>
                                    <td className="px-4 py-3">{stat.avgTemp}°C</td>
                                    <td className="px-4 py-3">{stat.avgRain}%</td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full bg-${stat.color}-500`}></span>
                                        {stat.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FAQ Section (SEO Optimized) */}
                <div className="mt-16 pt-12 border-t border-stone-200">
                    <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Frequently Asked Questions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">When is the best time to visit {data.meta.name}?</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Ideally, look for months with mild temperatures (20-25°C) and low rain chance.
                                Based on historical data, {bestMonths.slice(0, 3).join(", ") || "summer months"} are usually great choices.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">When is the hottest month?</h3>
                            <p className="text-stone-600 leading-relaxed">
                                {hottest.name} is historically the hottest month in {data.meta.name} with average highs of {hottest.avgTemp}°C.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">Which month has the most rain?</h3>
                            <p className="text-stone-600 leading-relaxed">
                                {wettest.name} typically sees the highest probability of rain ({wettest.avgRain}%).
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-stone-900 mb-2">Is {data.meta.name} expensive?</h3>
                            <p className="text-stone-600 leading-relaxed">
                                Prices vary by season. The "Perfect" weather months usually coincide with peak tourist season and higher prices, while the rainy or cold months offer better deals.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            {/* Footer */}
            <div className="mt-16">
                <Footer />
            </div>
        </div>
    );
}
