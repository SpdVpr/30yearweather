import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";
import researchData from "@/lib/research/beach-index-2025.json";

export const metadata: Metadata = {
    title: "Beach Destination Index 2025: Best European Beach Destinations by Water Temperature",
    description: "Data-driven research reveals the best beach destinations in Europe based on 30 years of sea water temperature data. Discover where to find the warmest Mediterranean waters, longest swimming seasons, and ideal beach conditions.",
    keywords: [
        "best beach destinations Europe",
        "warmest sea water Europe",
        "Mediterranean water temperature",
        "swimming season Europe",
        "beach holiday destinations",
        "sea temperature data",
        "best beaches Europe 2025"
    ],
    authors: [{ name: "30YearWeather Research" }],
    openGraph: {
        title: "Beach Destination Index 2025: Warmest Waters in Europe",
        description: "30 years of water temperature data reveals the best European beach destinations.",
        type: "article",
        publishedTime: "2025-12-26T00:00:00Z",
    },
    twitter: {
        card: "summary_large_image",
        title: "Beach Destination Index 2025",
        description: "30 years of data reveals Europe's warmest beach destinations.",
    },
    alternates: {
        canonical: "https://30yearweather.com/research/beach-index-2025",
    },
};

// Helper to get temp color
function getTempColor(temp: number): string {
    if (temp >= 26) return "text-red-500";
    if (temp >= 24) return "text-orange-500";
    if (temp >= 22) return "text-yellow-600";
    if (temp >= 20) return "text-green-600";
    return "text-blue-500";
}

function getTempBg(temp: number): string {
    if (temp >= 26) return "bg-red-50 border-red-200";
    if (temp >= 24) return "bg-orange-50 border-orange-200";
    if (temp >= 22) return "bg-yellow-50 border-yellow-200";
    if (temp >= 20) return "bg-green-50 border-green-200";
    return "bg-blue-50 border-blue-200";
}

export default function BeachIndexStudyPage() {
    const { destinations, methodology, key_findings } = researchData;

    // Top 10 for hero section
    const top10 = destinations.slice(0, 10);

    // Group by water temp categories
    const warmDests = destinations.filter((d: any) => d.avg_summer_water_temp >= 25);
    const mildDests = destinations.filter((d: any) => d.avg_summer_water_temp >= 20 && d.avg_summer_water_temp < 25);

    return (
        <>
            <Header
                breadcrumb={{
                    label: "Beach Destination Index 2025",
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
                        "headline": "Beach Destination Index 2025: Best European Beach Destinations by Water Temperature",
                        "description": "Data-driven research revealing the best beach destinations in Europe based on 30 years of water temperature data.",
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
                            "name": "European Beach Water Temperature Index 2025",
                            "description": "Analysis of 30 years of sea surface temperature data for 35 European beach destinations",
                            "temporalCoverage": "1995/2024",
                            "spatialCoverage": "Europe",
                            "variableMeasured": [
                                "Sea Surface Temperature",
                                "Swimming Season Length",
                                "Air Temperature",
                                "Sunshine Hours"
                            ],
                            "distribution": {
                                "@type": "DataDownload",
                                "contentUrl": "https://30yearweather.com/research/beach-index-2025",
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
                        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-cyan-100/50 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl" />
                    </div>

                    <div className="max-w-[1250px] mx-auto relative z-10">
                        {/* Publication badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
                                🏖️ Beach Research
                            </Badge>
                            <span className="text-stone-500 text-sm">December 2025</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-500 text-sm">{methodology.destinations_analyzed} coastal destinations</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 leading-tight">
                            Beach Destination Index
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                                2025
                            </span>
                        </h1>

                        <p className="text-xl text-stone-600 max-w-3xl leading-relaxed mb-8">
                            We analyzed <strong className="text-stone-900">30 years</strong> of sea surface temperature data
                            to find Europe's best beach destinations. Discover where the Mediterranean offers
                            <span className="text-cyan-600 font-medium"> warm waters for swimming</span>,
                            <span className="text-cyan-600 font-medium"> extended beach seasons</span>, and
                            <span className="text-cyan-600 font-medium"> ideal coastal conditions</span>.
                        </p>

                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-cyan-100">
                            <img
                                src="/images/research/beach-index-hero.png"
                                alt="Visualization of Europe's warmest waters and beach destinations ranked by temperature."
                                className="w-full h-auto object-cover"
                                width={1200}
                                height={630}
                            />
                        </div>

                        {/* Key insights grid */}
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">🌊</span>
                                    <div className="text-sm text-stone-500">Warmest Waters</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    {key_findings.warmest_water.destination}
                                </div>
                                <div className="text-sm text-stone-500">
                                    Peak: {key_findings.warmest_water.peak_temp}°C in {key_findings.warmest_water.peak_month}
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">📅</span>
                                    <div className="text-sm text-stone-500">Longest Swimming Season</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    {key_findings.longest_swimming_season.destination}
                                </div>
                                <div className="text-sm text-stone-500">
                                    {key_findings.longest_swimming_season.months} months above 20°C
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">🏆</span>
                                    <div className="text-sm text-stone-500">Top Rated Destinations</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">
                                    Canary Islands
                                </div>
                                <div className="text-sm text-stone-500">
                                    Year-round warm waters (20-24°C)
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Water Temperature Matters */}
                <section aria-label="Water Temperature Analysis" className="py-12 px-4 bg-white border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-stone-900 mb-4">🌡️ Why Water Temperature Matters</h2>
                                <p className="text-lg text-stone-600 leading-relaxed mb-6">
                                    Sea water temperature is one of the most important factors for a beach holiday.
                                    Too cold and you can't swim comfortably. The ideal range for most swimmers is
                                    <strong className="text-stone-900"> 22-26°C</strong> — warm enough for extended swims
                                    without overheating.
                                </p>
                                <p className="text-stone-600 leading-relaxed mb-6">
                                    Our analysis of 30 years of satellite-measured sea surface temperature reveals
                                    significant differences across European destinations.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                        <span className="text-xl">🔥</span>
                                        <div>
                                            <div className="font-medium text-stone-900">26°C+ — Very Warm</div>
                                            <div className="text-sm text-stone-500">Eastern Mediterranean, Aegean in August</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                        <span className="text-xl">☀️</span>
                                        <div>
                                            <div className="font-medium text-stone-900">22-26°C — Ideal</div>
                                            <div className="text-sm text-stone-500">Most Mediterranean destinations, summer peak</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <span className="text-xl">💧</span>
                                        <div>
                                            <div className="font-medium text-stone-900">18-22°C — Refreshing</div>
                                            <div className="text-sm text-stone-500">Atlantic coast, early/late season</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Temperature comparison */}
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                                <h3 className="font-bold text-stone-900 mb-4">Summer Water Temperature Comparison</h3>
                                <div className="space-y-3">
                                    {top10.slice(0, 8).map((dest: any) => (
                                        <div key={dest.slug} className="flex items-center justify-between">
                                            <Link href={`/${dest.slug}`} className="font-medium text-stone-700 hover:text-cyan-600">
                                                {dest.name}
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                                    style={{ width: `${(dest.avg_summer_water_temp / 30) * 100}px` }}
                                                ></div>
                                                <span className={`font-bold ${getTempColor(dest.avg_summer_water_temp)}`}>
                                                    {dest.avg_summer_water_temp}°C
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top 10 Beach Destinations */}
                <section aria-label="Top 10 Rankings" className="py-12 px-4 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">🏆 Top Beach Destinations by Water Temperature</h2>
                        <p className="text-stone-600 mb-8">
                            Ranked by swimming conditions based on water temperature, season length, and temperature stability.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {top10.map((dest: any, i: number) => (
                                <Link key={dest.slug} href={`/${dest.slug}`}>
                                    <Card
                                        className={`p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white border-stone-200 ${i < 3 ? 'ring-2 ring-cyan-200' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${i === 0 ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white' :
                                                i === 1 ? 'bg-gradient-to-br from-stone-300 to-stone-400 text-white' :
                                                    i === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white' :
                                                        'bg-stone-100 text-stone-600'
                                                }`}>
                                                {i + 1}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-stone-900 truncate">{dest.name}</h3>
                                                    <span className="text-stone-400 text-sm">{dest.country}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <span className={getTempColor(dest.avg_summer_water_temp)}>
                                                        🌊 {dest.avg_summer_water_temp}°C summer avg
                                                    </span>
                                                    <span className="text-stone-500">
                                                        📅 {dest.swimming_season_months} months
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${getTempColor(dest.peak_water_temp)}`}>
                                                    {dest.peak_water_temp}°C
                                                </div>
                                                <div className="text-xs text-stone-500">
                                                    peak in {dest.peak_water_month}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Full Rankings Table */}
                <section aria-label="Full Data Rankings" className="py-12 px-4 bg-stone-50 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">📋 Complete Rankings</h2>
                        <p className="text-stone-600 mb-6">
                            All {destinations.length} beach destinations ranked by water temperature data.
                        </p>

                        <Card className="bg-white border-stone-200">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell className="text-stone-600">Rank</TableHeaderCell>
                                            <TableHeaderCell className="text-stone-600">Destination</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Summer Avg</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Peak Temp</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Peak Month</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Swim Season</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {destinations.map((dest: any) => (
                                            <TableRow key={dest.slug} className="hover:bg-stone-50 transition-colors">
                                                <TableCell className="font-medium text-stone-500">
                                                    {dest.rank <= 3 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 text-sm font-bold">
                                                            {dest.rank}
                                                        </span>
                                                    ) : dest.rank}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/${dest.slug}`}
                                                        className="font-medium text-stone-900 hover:text-cyan-600 transition-colors"
                                                    >
                                                        {dest.name}
                                                        <span className="text-stone-400 font-normal ml-2">{dest.country}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-bold ${getTempColor(dest.avg_summer_water_temp)}`}>
                                                        {dest.avg_summer_water_temp}°C
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-bold ${getTempColor(dest.peak_water_temp)}`}>
                                                        {dest.peak_water_temp}°C
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center text-stone-600">{dest.peak_water_month}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${dest.swimming_season_months >= 6 ? 'bg-green-100 text-green-700' :
                                                        dest.swimming_season_months >= 4 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-stone-100 text-stone-600'
                                                        }`}>
                                                        {dest.swimming_season_months} months
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Citation Section */}
                <section aria-label="Citation" className="py-12 px-4 border-t border-stone-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-stone-900 mb-4 text-center">📝 Cite This Research</h2>
                        <p className="text-stone-600 text-center mb-6">
                            Journalists, bloggers, and researchers are welcome to cite this study with attribution.
                        </p>

                        <Card className="bg-stone-50 border-stone-200 p-6">
                            <div className="font-mono text-sm text-stone-600 break-words">
                                30YearWeather. (2025). <em>Beach Destination Index 2025: Best European Beach Destinations by Water Temperature</em>.
                                Retrieved from https://30yearweather.com/research/beach-index-2025
                            </div>
                        </Card>

                        <div className="text-center mt-6">
                            <p className="text-stone-500 text-sm">
                                Licensed under <span className="font-medium text-stone-700">CC BY 4.0</span> —
                                Share and adapt with attribution.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 px-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-t border-cyan-100">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-stone-900 mb-4">
                            Plan Your Beach Holiday
                        </h2>
                        <p className="text-stone-600 mb-6">
                            Explore day-by-day weather and water temperature data for any coastal destination.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/finder"
                                className="px-6 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium shadow-sm"
                            >
                                🔍 Find Beach Destinations
                            </Link>
                            <Link
                                href="/research"
                                className="px-6 py-3 bg-white text-stone-700 rounded-xl hover:bg-stone-50 transition-colors border border-stone-200"
                            >
                                ← All Research
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
