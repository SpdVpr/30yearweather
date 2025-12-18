
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData } from "@/lib/data";
import { Card, Title, Text, Badge } from "@tremor/react";
import { ArrowLeft, ArrowRight, Thermometer, CloudRain, TrendingUp, MapPin, Info } from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from 'next';
import CityPageTracker from "@/components/CityPageTracker";

// 1. Dynamic Metadata
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
    const data = await getCityData(params.city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;
    const description = data.meta.desc || `Get accurate long-range weather forecasts for ${cityName} up to 365 days ahead. Based on 30 years of historical data. See rain probabilities, temperatures, and best months to visit ${cityName}.`;

    return {
        title: `${cityName} Weather Forecast | 365-Day Monthly Climate | 30 Years NASA Data`,
        description: description,
        keywords: [`${cityName} weather forecast`, `${cityName} long range forecast`, `${cityName} weather`, `best time to visit ${cityName}`, `${cityName} weather by month`, `${cityName} 365 day forecast`],
        alternates: {
            canonical: `/${params.city}`,
        },
        openGraph: {
            title: `${cityName} Weather Forecast | 365-Day Monthly Climate`,
            description: description,
        }
    };
}

// 2. JSON-LD Component
const JsonLd = ({ data, slug, faqStats }: { data: any, slug: string, faqStats: any[] }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    // Breadcrumbs
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: data.meta.name, item: `${baseUrl}/${slug}` }
        ]
    };

    // TouristDestination
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
            `https://en.wikipedia.org/wiki/${data.meta.name.replace(/\s+/g, '_')}`,
        ]
    };

    // FAQ Schema
    const hottest = faqStats.reduce((a, b) => a.avgTemp > b.avgTemp ? a : b);
    const wettest = faqStats.reduce((a, b) => a.avgRain > b.avgRain ? a : b);

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `When is the hottest month in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${hottest.name} is historically the hottest month with average highs of ${hottest.avgTemp}°C.`
                }
            },
            {
                '@type': 'Question',
                name: `When does it rain the most in ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${wettest.name} has the highest rain probability (${wettest.avgRain}%).`
                }
            },
            {
                '@type': 'Question',
                name: `What is the best time to visit ${data.meta.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Based on historical weather data, the best months are usually ${faqStats.filter(m => m.status.includes("Perfect") || m.status.includes("Pleasant")).map(m => m.name).slice(0, 3).join(", ") || "summer months"}.`
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

            {/* Navbar / Breadcrumb */}
            <div className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/" className="text-stone-500 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold font-serif">{data.meta.name} <span className="text-stone-400 font-sans font-normal text-sm">/ 30-Year Analysis</span></h1>
                </div>
            </div>

            <article itemScope itemType="https://schema.org/Article" className="max-w-6xl mx-auto px-6 py-12">
                <div itemProp="articleBody">
                    {/* Header */}
                    <div className="mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4">When to visit {data.meta.name}?</h2>
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

                    {/* New: About & Location Section (SEO Text + Map) */}
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
                                    Geographically located at latitude <strong>{data.meta.lat}</strong> and longitude <strong>{data.meta.lon}</strong>,
                                    {data.meta.name} exhibits specific climate patterns influenced by its location.
                                    Historical data indicates that <strong>{hottest.name}</strong> is typically the warmest month, offering optimal conditions for sun-seekers,
                                    while <strong>{wettest.name}</strong> often presents the highest chance of precipitation.
                                </p>
                                <p className="leading-relaxed mt-4">
                                    For travelers planning a visit to {data.meta.name}, understanding these seasonal nuances is key to a comfortable trip.
                                    Our 30-year dataset provides a reliability benchmark, ensuring you know exactly what to expect.
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
                                Coordinates: {data.meta.lat}, {data.meta.lon}
                            </div>
                        </div>
                    </div>

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
        </div>
    );
}
