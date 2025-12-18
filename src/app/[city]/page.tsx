
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData } from "@/lib/data";
import { Card, Title, Text, Badge } from "@tremor/react";
import { ArrowLeft, ArrowRight, Thermometer, CloudRain, TrendingUp } from "lucide-react";
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
        url: `${baseUrl}/${slug}`
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
