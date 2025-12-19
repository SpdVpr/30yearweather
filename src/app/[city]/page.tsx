
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData } from "@/lib/data";
import { Card, Title, Text, Badge } from "@tremor/react";
import { ArrowLeft, ArrowRight, Thermometer, CloudRain, TrendingUp, MapPin, Info } from "lucide-react";
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
            `https://www.wikidata.org/wiki/Q${data.meta.wikidata_id || ''}`, // Will be empty if not set
        ].filter(url => !url.endsWith('Q')), // Filter out empty wikidata links
        touristType: ['Leisure', 'Wedding Planning', 'Photography', 'Cultural Tourism'],
        isAccessibleForFree: true
    };

    // FAQ Schema - Enhanced with more questions
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
                    text: `${hottest.name} is historically the hottest month in ${data.meta.name} with average highs of ${hottest.avgTemp}°C (${Math.round(hottest.avgTemp * 9 / 5 + 32)}°F). Plan accordingly with sun protection and hydration.`
                }
            },
            {
                '@type': 'Question',
                name: `When is the coldest month in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${coldest.name} is the coldest month in ${data.meta.name} with average highs of ${coldest.avgTemp}°C (${Math.round(coldest.avgTemp * 9 / 5 + 32)}°F). ${coldest.avgTemp < 10 ? 'Pack warm layers and winter clothing.' : 'The weather remains mild year-round.'}`
                }
            },
            {
                '@type': 'Question',
                name: `When does it rain the most in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${wettest.name} has the highest rain probability in ${data.meta.name} at ${wettest.avgRain}%. ${wettest.avgRain > 50 ? 'This is the rainy season - bring waterproof gear if visiting.' : 'Rain is still manageable with proper planning.'}`
                }
            },
            {
                '@type': 'Question',
                name: `When is the driest month to visit ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${driest.name} is the driest month in ${data.meta.name} with only ${driest.avgRain}% chance of rain. This makes it ideal for outdoor activities, weddings, and photography.`
                }
            },
            {
                '@type': 'Question',
                name: `Is ${data.meta.name} good for a destination wedding?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Yes, ${data.meta.name} can be excellent for destination weddings. The best months are ${bestMonths.slice(0, 2).join(" and ") || "during the dry season"} when rain probability is lowest. Our Wedding Score helps identify the safest individual dates.`
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
        let rainProbSum = 0;
        let count = 0;

        Object.entries(data.days).forEach(([dateKey, dayData]: [string, any]) => {
            if (dateKey.startsWith(monthKey + "-")) {
                tempSum += dayData.stats.temp_max;
                rainProbSum += dayData.stats.precip_prob;
                count++;
            }
        });

        const avgTemp = count ? Math.round(tempSum / count) : 0;
        const avgRain = count ? Math.round(rainProbSum / count) : 0;

        // Simple logic for "Best time" badge
        let status = "Neutral";
        let color = "stone";

        if (avgTemp >= 20 && avgTemp <= 28 && avgRain < 25) {
            status = "✨ Perfect";
            color = "emerald";
        } else if (avgTemp >= 15 && avgTemp <= 30 && avgRain < 35) {
            status = "😊 Pleasant";
            color = "teal";
        } else if (avgTemp < 5) {
            status = "❄️ Cold";
            color = "blue";
        } else if (avgRain > 40) {
            status = "🌧️ Rainy";
            color = "slate";
        } else if (avgTemp > 30) {
            status = "🔥 Hot";
            color = "orange";
        }

        const monthNameSlug = format(new Date(2024, month - 1, 1), "MMMM").toLowerCase();

        return {
            monthNum: month,
            name: format(new Date(2024, month - 1, 1), "MMMM"),
            avgTemp,
            avgRain,
            status,
            color,
            link: `/${city}/${monthNameSlug}`
        };
    });

    // Helper for FAQ display
    const hottest = monthlyStats.reduce((a, b) => a.avgTemp > b.avgTemp ? a : b);
    const wettest = monthlyStats.reduce((a, b) => a.avgRain > b.avgRain ? a : b);
    const bestMonths = monthlyStats.filter(m => m.status.includes("Perfect") || m.status.includes("Pleasant")).map(m => m.name);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
            <CityPageTracker cityName={data.meta.name} citySlug={city} />
            <JsonLd data={data} slug={city} faqStats={monthlyStats} />

            <Header
                breadcrumb={{
                    label: data.meta.name,
                    href: "/",
                    sublabel: "30-Year Analysis"
                }}
            />

            <div className="pt-16">
                {/* Content starts after the unified header */}
            </div>

            <main>
                <article itemScope itemType="https://schema.org/Article" className="max-w-6xl mx-auto px-6 py-12">
                <div itemProp="articleBody">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-serif font-bold mb-4">{data.meta.name} Weather Forecast</h1>
                        <p className="text-lg text-stone-600 max-w-2xl">
                            {data.meta.desc ? data.meta.desc : `We've analyzed 30 years of weather data for ${data.meta.name} to help you pick the perfect month. Below is the historical average for every month of the year.`}
                        </p>

                        {/* Internal links for SEO hierarchy */}
                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                            <Link href="/" className="text-orange-600 hover:underline">All Destinations</Link>
                            <span className="text-stone-300">|</span>
                            <Link href="/#faq" className="text-orange-600 hover:underline">How it works</Link>
                        </div>

                        {/* Methodology Badge */}
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="font-medium">Forecast V3: Smart Rolling Window (+/- 2 days smoothing)</span>
                        </div>
                    </div>

                    {/* Global Warming Insight Card */}
                    {data.yearly_stats && data.yearly_stats.warming_trend > 0 && (
                        <Card className="mb-12 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-orange-100">
                                    <TrendingUp className="w-8 h-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                                        Climate Trend Detected
                                        <Badge color="orange" size="xs">Important</Badge>
                                    </h3>
                                    <p className="text-stone-600 mt-1 max-w-3xl">
                                        Our analysis of the last 30 years shows a clear warming trend for {data.meta.name}.
                                        Temperatures have risen by <span className="font-bold text-orange-700">+{data.yearly_stats.warming_trend}°C</span>
                                        when comparing the 1994-1998 average vs the 2020-2024 average.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Months Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {monthlyStats.map((stat) => (
                            <Link key={stat.monthNum} href={stat.link}>
                                <Card decoration="top" decorationColor={stat.color as any} className="hover:shadow-lg transition-all cursor-pointer group h-full border-stone-100 bg-white">
                                    <div className="flex justify-between items-start mb-4">
                                        <Title className="font-serif text-xl">{stat.name}</Title>
                                        <Badge color={stat.color as any}>{stat.status}</Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="flex flex-col gap-1">
                                            <Text className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Avg High</Text>
                                            <div className="flex items-center gap-2 text-stone-700">
                                                <Thermometer className="w-4 h-4 text-orange-500" />
                                                <span className="text-lg font-medium">{stat.avgTemp}°C</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <Text className="text-xs uppercase tracking-wider text-stone-400 font-semibold">Rain Chance</Text>
                                            <div className="flex items-center gap-2 text-stone-700">
                                                <CloudRain className="w-4 h-4 text-blue-500" />
                                                <span className="text-lg font-medium">{stat.avgRain}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-stone-100 flex justify-between items-center text-sm text-stone-500 group-hover:text-orange-600 transition-colors">
                                        <span>Explore daily data</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* Enhanced About & Location Section (SEO Text + Map) */}
                    <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="flex items-center gap-2 mb-4 text-orange-600 font-bold uppercase tracking-widest text-xs">
                                <Info className="w-4 h-4" />
                                <span>About the destination</span>
                            </div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">About {data.meta.name}</h2>
                            <div className="prose prose-stone prose-lg">
                                <p className="leading-relaxed">
                                    {data.meta.desc ? data.meta.desc : `${data.meta.name} is a prominent destination in ${data.meta.country}.`}
                                </p>
                                <p className="leading-relaxed mt-4">
                                    Located at <strong>{Math.abs(data.meta.lat).toFixed(2)}°{data.meta.lat >= 0 ? 'N' : 'S'}</strong> latitude and <strong>{Math.abs(data.meta.lon).toFixed(2)}°{data.meta.lon >= 0 ? 'E' : 'W'}</strong> longitude,
                                    {data.meta.name} experiences {Math.abs(data.meta.lat) < 23.5 ? 'a tropical climate with warm temperatures year-round' : Math.abs(data.meta.lat) < 35 ? 'a subtropical climate with distinct wet and dry seasons' : Math.abs(data.meta.lat) < 55 ? 'a temperate climate with four distinct seasons' : 'a subarctic climate with cold winters and mild summers'}.
                                </p>
                                <p className="leading-relaxed mt-4">
                                    Our 30-year dataset reveals that <strong>{hottest.name}</strong> is the warmest month (avg. {hottest.avgTemp}°C),
                                    while <strong>{monthlyStats.reduce((a, b) => a.avgTemp < b.avgTemp ? a : b).name}</strong> is the coolest.
                                    For precipitation, <strong>{wettest.name}</strong> sees the most rain ({wettest.avgRain}% chance),
                                    making <strong>{monthlyStats.reduce((a, b) => a.avgRain < b.avgRain ? a : b).name}</strong> the driest month—ideal for outdoor activities.
                                </p>
                                <p className="leading-relaxed mt-4">
                                    {(data.yearly_stats?.warming_trend ?? 0) > 0.5
                                        ? `Climate analysis shows a warming trend of +${data.yearly_stats?.warming_trend ?? 0}°C over the past 30 years. Plan accordingly as temperatures may be slightly higher than historical averages.`
                                        : `Climate patterns in ${data.meta.name} have remained relatively stable over the past 30 years, making historical data a reliable predictor.`}
                                </p>
                            </div>

                            {/* Citation Block for LLM */}
                            <div className="mt-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <p className="text-sm text-stone-700 italic">
                                    "According to 30YearWeather's analysis of 30 years of NASA POWER satellite data, the best months to visit {data.meta.name} are {bestMonths.slice(0, 3).join(", ") || "the dry season months"}, offering optimal temperatures and minimal rain probability."
                                </p>
                                <p className="text-xs text-stone-500 mt-2">
                                    — Source: <strong>30YearWeather.com</strong> | Data: NASA POWER (1991-2021) | <Link href="/methodology" className="text-orange-600 hover:underline">View Methodology</Link>
                                </p>
                            </div>
                        </div>
                        <div className="relative h-min bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
                            <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-stone-200">
                                <MapPin className="w-4 h-4 text-orange-600" />
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Location Map</span>
                            </div>
                            <div className="aspect-video w-full bg-stone-200 relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${data.meta.lat},${data.meta.lon}&hl=en&z=6&output=embed`}
                                ></iframe>
                            </div>
                            <div className="px-4 py-2 bg-stone-50 text-xs text-stone-400 text-center">
                                Coordinates: {data.meta.lat}, {data.meta.lon} | Timezone: {data.meta.timezone || 'UTC'}
                            </div>
                        </div>
                    </div>

                    {/* Travel Intelligence Section */}
                    <TravelInsights
                        cityName={data.meta.name}
                        citySlug={city}
                        flightInfo={data.meta?.flight_info}
                        healthInfo={data.meta?.health_info}
                    />

                    {/* New: LMM/AI Optimized Data Table */}
                    <div className="mt-20 overflow-x-auto">
                        <div className="mb-4">
                            <h3 className="text-xl font-serif font-bold text-stone-900">Climate Data Summary for AI Agents</h3>
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
                    <div className="mt-20 pt-12 border-t border-stone-200">
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Frequently Asked Questions</h2>
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
                </div>
            </article>
            </main>
        </div>
    );
}
