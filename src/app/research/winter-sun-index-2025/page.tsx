import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";
import researchData from "@/lib/research/winter-sun-2025.json";

export const metadata: Metadata = {
    title: "Winter Sun Index 2025: Best Destinations for Warmth & Sunshine",
    description: "Escape the cold with our data-driven guide to the best winter sun destinations in Europe and beyond. Analysis of temperature, sunshine hours, and rain data for November through February.",
    keywords: [
        "winter sun Europe",
        "warmest places in Europe winter",
        "winter beach holidays",
        "November sun",
        "December sun",
        "January sun",
        "February sun",
        "Canary Islands winter weather"
    ],
    authors: [{ name: "30YearWeather Research" }],
    openGraph: {
        title: "Winter Sun Index 2025: Where to Find Warmth in Winter",
        description: "Escape the winter gloom. We analyzed 30 years of weather data to find the sunniest and warmest winter getaways.",
        type: "article",
        publishedTime: "2025-12-26T00:00:00Z",
    },
    twitter: {
        card: "summary_large_image",
        title: "Winter Sun Index 2025",
        description: "Data-driven guide to the best winter sun destinations.",
    },
    alternates: {
        canonical: "https://30yearweather.com/research/winter-sun-index-2025",
    },
};

// Helper to get temp color
function getTempColor(temp: number): string {
    if (temp >= 20) return "text-orange-600";
    if (temp >= 18) return "text-amber-600";
    if (temp >= 15) return "text-yellow-600";
    return "text-stone-600";
}

function getSunColor(hours: number): string {
    if (hours >= 9) return "text-orange-500";
    if (hours >= 7) return "text-yellow-500";
    return "text-stone-500";
}

export default function WinterSunStudyPage() {
    const { destinations, methodology, key_findings } = researchData;

    // Top 10 for hero section
    const top10 = destinations.slice(0, 10);

    return (
        <>
            <Header
                breadcrumb={{
                    label: "Winter Sun Index 2025",
                    href: "/research",
                    sublabel: "Research"
                }}
            />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Winter Sun Index 2025: Best Destinations for Warmth & Sunshine",
                        "description": "Data-driven research identifying the best destinations for winter sun based on temperature and sunshine hours.",
                        "datePublished": "2025-12-26",
                        "dateModified": "2025-12-26",
                        "author": {
                            "@type": "Organization",
                            "name": "30YearWeather",
                            "url": "https://30yearweather.com"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "30YearWeather"
                        },
                        "about": {
                            "@type": "Dataset",
                            "name": "European Winter Sun Index 2025",
                            "description": "Analysis of winter weather data (Nov-Feb) for 35 European and nearby destinations",
                            "temporalCoverage": "1995/2024",
                            "spatialCoverage": "Europe",
                            "variableMeasured": [
                                "Winter Average Temperature",
                                "Daily Sunshine Hours",
                                "Rainfall Probability"
                            ],
                            "distribution": {
                                "@type": "DataDownload",
                                "contentUrl": "https://30yearweather.com/research/winter-sun-index-2025",
                                "encodingFormat": "text/html"
                            },
                            "license": "https://creativecommons.org/licenses/by/4.0/",
                            "creator": {
                                "@type": "Organization",
                                "name": "30YearWeather"
                            }
                        }
                    })
                }}
            />

            <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-50 pt-24">
                {/* Hero Section */}
                <section aria-label="Study Overview" className="relative py-12 px-4 overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl opacity-60" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl opacity-60" />
                    </div>

                    <div className="max-w-[1250px] mx-auto relative z-10">
                        {/* Publication badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                ☀️ Winter Travel
                            </Badge>
                            <span className="text-stone-500 text-sm">December 2025</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-500 text-sm">{methodology.destinations_analyzed} destinations analyzed</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
                            Winter Sun Index
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                                2025
                            </span>
                        </h1>

                        <p className="text-xl text-stone-600 max-w-3xl leading-relaxed mb-10">
                            Don't let the winter blues get you down. We analyzed weather data from November to February
                            to find destinations that offer <strong className="text-stone-900">genuine warmth</strong> and
                            <strong className="text-stone-900"> abundant sunshine</strong> when the rest of Europe is shivering.
                        </p>

                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-amber-100">
                            <img
                                src="/images/research/winter-sun-hero.png"
                                alt="Winter Sun Index 2025 finding the best warm destinations in Europe during winter."
                                className="w-full h-auto object-cover"
                                width={1200}
                                height={630}
                            />
                        </div>

                        {/* Key insights grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl bg-amber-100 p-2 rounded-lg">🌡️</span>
                                    <div className="text-sm font-medium text-stone-500 uppercase tracking-wide">Warmest</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    {key_findings.warmest.destination}
                                </div>
                                <div className="text-sm text-stone-500">
                                    {key_findings.warmest.avg_temp}°C winter average
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl bg-yellow-100 p-2 rounded-lg">☀️</span>
                                    <div className="text-sm font-medium text-stone-500 uppercase tracking-wide">Sunniest</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    {key_findings.sunniest.destination}
                                </div>
                                <div className="text-sm text-stone-500">
                                    {key_findings.sunniest.sunshine_hours} hrs daily sunshine
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl bg-blue-100 p-2 rounded-lg">☂️</span>
                                    <div className="text-sm font-medium text-stone-500 uppercase tracking-wide">Driest</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    {key_findings.driest.destination}
                                </div>
                                <div className="text-sm text-stone-500">
                                    Only {key_findings.driest.rain_prob}% rain probability
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Quest for Winter Warmth */}
                <section aria-label="Analysis Criteria" className="py-16 px-4 bg-white border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-stone-900 mb-6">The Quest for Winter Warmth</h2>
                                <p className="text-lg text-stone-600 leading-relaxed mb-6">
                                    Finding true "t-shirt weather" in Europe during winter is challenging.
                                    While many southern destinations are mild compared to the north, few offer
                                    consistent warmth reliable enough for a sun holiday.
                                </p>
                                <p className="text-stone-600 leading-relaxed mb-6">
                                    Our analysis focuses on three critical factors:
                                </p>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <div className="bg-red-100 p-1.5 rounded text-red-600 mt-0.5">✓</div>
                                        <div>
                                            <strong className="block text-stone-900">Temperature Stability</strong>
                                            <span className="text-stone-500">We look for average highs above 18°C. Anything below 15°C often requires a jacket.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="bg-yellow-100 p-1.5 rounded text-yellow-600 mt-0.5">✓</div>
                                        <div>
                                            <strong className="block text-stone-900">Sunshine Hours</strong>
                                            <span className="text-stone-500">Winter days are short. Destinations with 7+ hours of sunshine maximize your Vitamin D.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="bg-blue-100 p-1.5 rounded text-blue-600 mt-0.5">✓</div>
                                        <div>
                                            <strong className="block text-stone-900">Low Rainfall Risk</strong>
                                            <span className="text-stone-500">Winter is often the rainy season in the Mediterranean. We identify where it stays dry.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Regional Comparison Chart */}
                            <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
                                <h3 className="font-bold text-stone-900 mb-6 text-lg">Winter Average Highs (Nov-Feb)</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-stone-700">Dubai / Red Sea</span>
                                            <span className="font-bold text-orange-600">22°C+</span>
                                        </div>
                                        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-orange-400 to-red-500" style={{ width: '95%' }}></div>
                                        </div>
                                        <div className="text-xs text-stone-500 mt-1">Guaranteed beach weather</div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-stone-700">Canary Islands</span>
                                            <span className="font-bold text-amber-600">19-21°C</span>
                                        </div>
                                        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-amber-400 to-orange-400" style={{ width: '80%' }}></div>
                                        </div>
                                        <div className="text-xs text-stone-500 mt-1">Eternal spring, reliable warmth</div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-stone-700">Cyprus & S. Turkey</span>
                                            <span className="font-bold text-yellow-600">16-18°C</span>
                                        </div>
                                        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-400" style={{ width: '60%' }}></div>
                                        </div>
                                        <div className="text-xs text-stone-500 mt-1">Pleasant but variable</div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-stone-700">S. Spain & Italy</span>
                                            <span className="font-bold text-stone-600">13-16°C</span>
                                        </div>
                                        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-stone-300 to-yellow-300" style={{ width: '45%' }}></div>
                                        </div>
                                        <div className="text-xs text-stone-500 mt-1">Mild, sunny days but cool nights</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top 10 Ranking */}
                <section aria-label="Top 10 Rankings" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">🏆 Top Winter Sun Destinations</h2>
                        <p className="text-stone-600 mb-10">
                            Ranked by our Winter Sun Score, combining temperature, sunshine, and low rainfall.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {top10.map((dest: any, i: number) => (
                                <Link key={dest.slug} href={`/${dest.slug}`}>
                                    <div className={`
                                        group relative p-6 bg-white rounded-2xl border transition-all duration-300
                                        ${i < 3 ? 'border-amber-200 shadow-md hover:shadow-xl hover:-translate-y-1' : 'border-stone-200 hover:border-amber-200 hover:shadow-lg hover:-translate-y-0.5'}
                                    `}>
                                        {/* Rank Badge */}
                                        <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm z-10
                                            ${i === 0 ? 'bg-gradient-to-br from-yellow-300 to-orange-500 text-white' :
                                                i === 1 ? 'bg-gradient-to-br from-stone-300 to-stone-400 text-white' :
                                                    i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                                                        'bg-stone-100 text-stone-500 border border-stone-200'}
                                        `}>
                                            {i + 1}
                                        </div>

                                        <div className="flex justify-between items-start mb-4 pl-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                                                    {dest.name}
                                                </h3>
                                                <span className="text-stone-500 text-sm">{dest.country}</span>
                                            </div>
                                            <Badge size="lg" className={`${dest.winter_sun_score >= 90 ? 'bg-green-100 text-green-700' :
                                                dest.winter_sun_score >= 80 ? 'bg-lime-100 text-lime-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                Score: {dest.winter_sun_score}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center p-2 bg-stone-50 rounded-lg">
                                                <div className={`font-bold text-lg ${getTempColor(dest.avg_temp)}`}>
                                                    {dest.avg_temp}°C
                                                </div>
                                                <div className="text-xs text-stone-500">Avg Temp</div>
                                            </div>
                                            <div className="text-center p-2 bg-stone-50 rounded-lg">
                                                <div className={`font-bold text-lg ${getSunColor(dest.avg_sunshine_hours)}`}>
                                                    {dest.avg_sunshine_hours}h
                                                </div>
                                                <div className="text-xs text-stone-500">Sunshine</div>
                                            </div>
                                            <div className="text-center p-2 bg-stone-50 rounded-lg">
                                                <div className="font-bold text-lg text-blue-600">
                                                    {dest.avg_rain_prob}%
                                                </div>
                                                <div className="text-xs text-stone-500">Rain Prob</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-stone-500 bg-amber-50/50 p-2 rounded-lg">
                                            <span className="text-amber-500">⭐</span> Best Month: <span className="font-medium text-stone-700">{dest.best_winter_month}</span>
                                            <span className="text-stone-300">|</span>
                                            Highs of {dest.best_month_temp}°C
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Complete Data Table */}
                <section aria-label="Full Data Rankings" className="py-16 px-4 bg-stone-50 border-t border-stone-200">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-6">📋 Complete Winter Data</h2>

                        <Card className="bg-white p-0 overflow-hidden border-stone-200">
                            <Table className="w-full">
                                <TableHead className="bg-stone-50">
                                    <TableRow>
                                        <TableHeaderCell className="text-stone-600 pl-6">Rank</TableHeaderCell>
                                        <TableHeaderCell className="text-stone-600">Destination</TableHeaderCell>
                                        <TableHeaderCell className="text-center text-stone-600">Winter Score</TableHeaderCell>
                                        <TableHeaderCell className="text-center text-stone-600">Avg Temp</TableHeaderCell>
                                        <TableHeaderCell className="text-center text-stone-600">Sunshine (hrs)</TableHeaderCell>
                                        <TableHeaderCell className="text-center text-stone-600">Rain Chance</TableHeaderCell>
                                        <TableHeaderCell className="text-center text-stone-600">Best Month</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {destinations.map((dest: any) => (
                                        <TableRow key={dest.slug} className="hover:bg-amber-50/30 transition-colors border-b border-stone-100 last:border-none">
                                            <TableCell className="font-medium text-stone-500 pl-6">{dest.rank}</TableCell>
                                            <TableCell>
                                                <Link href={`/${dest.slug}`} className="font-medium text-stone-900 hover:text-amber-600">
                                                    {dest.name}
                                                    <span className="text-stone-400 font-normal text-xs ml-2">{dest.country}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-stone-700">{dest.winter_sun_score}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-bold ${getTempColor(dest.avg_temp)}`}>{dest.avg_temp}°C</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`${getSunColor(dest.avg_sunshine_hours)}`}>{dest.avg_sunshine_hours}</span>
                                            </TableCell>
                                            <TableCell className="text-center text-stone-600">{dest.avg_rain_prob}%</TableCell>
                                            <TableCell className="text-center text-stone-600">{dest.best_winter_month}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </section>

                {/* CTA Section */}
                <section aria-label="Find Your Winter Sun" className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-amber-100">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4">
                            Ready to escape the cold?
                        </h2>
                        <p className="text-lg text-stone-600 mb-8">
                            Use our Destination Finder to filter by exact temperature preferences for your specific travel dates.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/finder?min_temp=20"
                                className="px-8 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-bold shadow-lg shadow-orange-200"
                            >
                                🔍 Find Your Winter Sun
                            </Link>
                            <Link
                                href="/research"
                                className="px-8 py-4 bg-white text-stone-700 rounded-xl hover:bg-stone-50 transition-colors border border-stone-200 font-medium"
                            >
                                ← Back to Research
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
