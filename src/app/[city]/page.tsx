import Link from "next/link";
import { notFound } from "next/navigation";
import { getCityData } from "@/lib/data";
import { Card, Title, Text, Badge } from "@tremor/react";
import { ArrowLeft, ArrowRight, Thermometer, CloudRain } from "lucide-react";
import { format } from "date-fns";
import type { Metadata } from 'next';

// 1. Dynamic Metadata
export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
    const data = await getCityData(params.city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;
    const description = data.meta.desc || `Get accurate long-range weather forecasts for ${cityName} up to 365 days ahead. Based on 30 years of historical data. See rain probabilities, temperatures, and best months to visit ${cityName}.`;

    return {
        title: `${cityName} Weather Forecast - 365 Day Long-Range Forecast`,
        description: description,
        keywords: [`${cityName} weather forecast`, `${cityName} long range forecast`, `${cityName} weather`, `best time to visit ${cityName}`, `${cityName} weather by month`, `${cityName} 365 day forecast`],
        alternates: {
            canonical: `/${params.city}`,
        }
    };
}

// 2. JSON-LD Component
const JsonLd = ({ data, slug }: { data: any, slug: string }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    // Breadcrumbs: Home > City
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: data.meta.name,
                item: `${baseUrl}/${slug}`
            }
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

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbLd, destinationLd]) }}
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

        if (avgTemp >= 20 && avgTemp <= 28 && avgRain < 30) {
            status = "✨ Perfect";
            color = "emerald";
        } else if (avgTemp < 5) {
            status = "❄️ Cold";
            color = "blue";
        } else if (avgRain > 40) {
            status = "🌧️ Rainy";
            color = "slate";
        } else if (avgTemp > 28) {
            status = "🔥 Hot";
            color = "orange";
        }

        return {
            monthNum: month,
            name: format(new Date(2024, month - 1, 1), "MMMM"),
            avgTemp,
            avgRain,
            status,
            color,
            link: `/${city}/${monthKey}` // Link to month calendar view
        };
    });

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 pb-20">
            <JsonLd data={data} slug={city} />

            {/* Navbar / Breadcrumb */}
            <div className="bg-white border-b border-stone-200 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <Link href="/" className="text-stone-500 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold font-serif">{data.meta.name} <span className="text-stone-400 font-sans font-normal text-sm">/ 30-Year Analysis</span></h1>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-4xl font-serif font-bold mb-4">When to visit {data.meta.name}?</h2>
                    <p className="text-lg text-stone-600 max-w-2xl">
                        {/* Use the rich description here as well if available, falling back to static text */}
                        {data.meta.desc ? data.meta.desc : "We've analyzed 30 years of weather data to help you pick the perfect month. Below is the historical average for every month of the year."}
                    </p>
                </div>

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
            </main>
        </div>
    );
}
