import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Title, Text, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";
import researchData from "@/lib/research/shoulder-season-2025.json";
import { Top10BarChart, SpringVsFallComparison, KeyFindingsGrid, MethodologyDiagram } from "@/components/research/Infographics";

export const metadata: Metadata = {
    title: "Shoulder Season Index 2025: When to Visit 96 European Destinations for Perfect Weather & Fewer Crowds",
    description: "Data-driven research reveals the best shoulder season months for 96 European cities. Based on 30 years of weather data, discover when Las Palmas, Mykonos, Santorini and 93 other destinations offer ideal temperatures (18-26°C), low rain probability, and 35% fewer tourists than peak summer.",
    keywords: [
        "shoulder season Europe 2025",
        "best time to visit Europe spring",
        "best time to visit Europe fall",
        "off-peak travel Europe",
        "avoid crowds Europe",
        "April May travel destinations",
        "September October travel Europe",
        "Las Palmas weather",
        "Mykonos shoulder season",
        "European travel weather data",
        "when to visit Mediterranean"
    ],
    authors: [{ name: "30YearWeather Research" }],
    openGraph: {
        title: "Shoulder Season Index 2025: Best Time to Visit 96 European Destinations",
        description: "We analyzed 30 years of weather data covering 10M+ data points to find when European destinations offer perfect weather with 35% fewer crowds.",
        type: "article",
        publishedTime: "2025-12-01T00:00:00Z",
        authors: ["30YearWeather Research"],
        tags: ["travel research", "shoulder season", "Europe travel", "weather data", "off-peak travel"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Shoulder Season Index 2025: Best Time to Visit Europe",
        description: "30 years of data reveals when to visit 96 European destinations for perfect weather & fewer crowds.",
    },
    alternates: {
        canonical: "https://30yearweather.com/research/shoulder-season-index-2025",
    },
};

// Helper to get score color - light mode
function getScoreColor(score: number): string {
    if (score >= 85) return "text-emerald-600";
    if (score >= 75) return "text-green-600";
    if (score >= 65) return "text-yellow-600";
    if (score >= 55) return "text-orange-600";
    return "text-red-600";
}

function getScoreBg(score: number): string {
    if (score >= 85) return "bg-emerald-100 border-emerald-200";
    if (score >= 75) return "bg-green-100 border-green-200";
    if (score >= 65) return "bg-yellow-100 border-yellow-200";
    if (score >= 55) return "bg-orange-100 border-orange-200";
    return "bg-red-100 border-red-200";
}

function SeasonBadge({ type }: { type: "spring" | "fall" }) {
    if (type === "spring") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs border border-pink-200">
                🌸 Spring
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs border border-amber-200">
            🍂 Fall
        </span>
    );
}

export default function ShoulderSeasonStudyPage() {
    const { destinations, methodology, key_findings } = researchData;

    // Top 10 for hero section
    const top10 = destinations.slice(0, 10);

    // Group by best month preference
    const springDestinations = destinations.filter((d: any) =>
        d.best_month === "Apr" || d.best_month === "May"
    ).slice(0, 15);

    const fallDestinations = destinations.filter((d: any) =>
        d.best_month === "Sep" || d.best_month === "Oct"
    ).slice(0, 15);

    return (
        <>
            <Header
                breadcrumb={{
                    label: "Shoulder Season Index 2025",
                    href: "/research",
                    sublabel: "Research"
                }}
            />

            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Shoulder Season Index 2025: When to Visit 96 European Destinations",
                        "description": "Data-driven research revealing the best shoulder season months for 96 European cities based on 30 years of weather data.",
                        "image": "https://30yearweather.com/images/research/shoulder-season-hero.png",
                        "datePublished": "2025-12-01",
                        "dateModified": "2025-12-26",
                        "author": {
                            "@type": "Organization",
                            "name": "30YearWeather",
                            "url": "https://30yearweather.com"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "30YearWeather",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://30yearweather.com/logo.png"
                            }
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "https://30yearweather.com/research/shoulder-season-index-2025"
                        },
                        "about": {
                            "@type": "Dataset",
                            "name": "Shoulder Season Weather Index 2025",
                            "description": "Analysis of 30 years of historical weather data for 96 European destinations",
                            "temporalCoverage": "1995/2024",
                            "spatialCoverage": "Europe",
                            "variableMeasured": [
                                "Daily Temperature",
                                "Precipitation Probability",
                                "Sunshine Hours",
                                "Flight Capacity Estimates"
                            ],
                            "distribution": {
                                "@type": "DataDownload",
                                "contentUrl": "https://30yearweather.com/research/shoulder-season-index-2025",
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
                        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-100/50 blur-3xl" />
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pink-100/50 blur-3xl" />
                    </div>

                    <div className="max-w-[1250px] mx-auto relative z-10">
                        {/* Publication badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                📊 Research Study
                            </Badge>
                            <span className="text-stone-500 text-sm">December 2025</span>
                            <span className="text-stone-300">•</span>
                            <span className="text-stone-500 text-sm">{methodology.cities_analyzed} destinations analyzed</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 leading-tight">
                            Shoulder Season Index
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                                2025
                            </span>
                        </h1>

                        <p className="text-xl text-stone-600 max-w-3xl leading-relaxed mb-8">
                            We analyzed <strong className="text-stone-900">30 years</strong> of historical weather data
                            to identify when European destinations offer the best combination of
                            <span className="text-orange-600 font-medium"> pleasant weather</span>,
                            <span className="text-orange-600 font-medium"> fewer crowds</span>, and
                            <span className="text-orange-600 font-medium"> optimal travel conditions</span>.
                        </p>

                        <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-stone-100">
                            <img
                                src="/images/research/shoulder-season-hero.png"
                                alt="Graph showing best shoulder season trade-offs: High temperature vs Low crowds vs Low prices."
                                className="w-full h-auto object-cover"
                                width={1200}
                                height={630}
                            />
                        </div>

                        {/* Key insights grid */}
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">🏆</span>
                                    <div className="text-sm text-stone-500">Top Destinations</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">Las Palmas & Mykonos</div>
                                <div className="text-sm text-stone-500">Score: 88.5 / 100</div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">📅</span>
                                    <div className="text-sm text-stone-500">Best Month Overall</div>
                                </div>
                                <div className="text-2xl font-bold text-stone-900 mb-1">May & October</div>
                                <div className="text-sm text-stone-500">Peak shoulder season months</div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-stone-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">👥</span>
                                    <div className="text-sm text-stone-500">Average Crowd Reduction</div>
                                </div>
                                <div className="text-2xl font-bold text-green-600 mb-1">-35%</div>
                                <div className="text-sm text-stone-500">vs. peak summer months</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Insight + Infographic */}
                <section aria-label="Why Shoulder Season" className="py-12 px-4 bg-white border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            {/* Key insight text */}
                            <div>
                                <h2 className="text-2xl font-bold text-stone-900 mb-4">💡 Why Shoulder Season?</h2>
                                <p className="text-lg text-stone-600 leading-relaxed mb-6">
                                    Shoulder season — the weeks between peak tourist season and off-season — offers
                                    a sweet spot for travelers. You get <strong className="text-stone-900">warm weather</strong>,
                                    <strong className="text-stone-900"> fewer crowds</strong>, and often
                                    <strong className="text-stone-900"> better prices</strong>.
                                </p>
                                <p className="text-stone-600 leading-relaxed mb-6">
                                    But when exactly is shoulder season for each destination? It varies widely.
                                    That's why we analyzed 30 years of data to find the optimal windows for 96 European destinations.
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                        <span className="text-xl">🌸</span>
                                        <div>
                                            <div className="font-medium text-stone-900">Spring Shoulder: April–May</div>
                                            <div className="text-sm text-stone-500">Ideal for Mediterranean coast, blooming gardens</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <span className="text-xl">🍂</span>
                                        <div>
                                            <div className="font-medium text-stone-900">Fall Shoulder: September–October</div>
                                            <div className="text-sm text-stone-500">Warmest seas, wine harvest, golden light</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Hero infographic */}
                            <div className="relative">
                                <img
                                    src="/images/research/shoulder-season-hero.png"
                                    alt="Shoulder Season Index 2025 Infographic"
                                    className="w-full rounded-2xl shadow-lg border border-stone-200"
                                />
                                <a
                                    href="/images/research/shoulder-season-hero.png"
                                    target="_blank"
                                    className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-stone-600 hover:bg-white transition-colors shadow-sm border border-stone-200"
                                >
                                    ↗ Download
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top 10 Winners */}
                <section aria-label="Top 10 Destinations" className="py-12 px-4 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">🏆 Top 10 Shoulder Season Destinations</h2>
                        <p className="text-stone-600 mb-8">
                            These destinations scored highest for optimal shoulder season travel based on our weighted analysis of
                            temperature, precipitation, tourist crowds, and sunshine hours.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {top10.map((dest: any, i: number) => (
                                <Link key={dest.slug} href={`/${dest.slug}`}>
                                    <Card
                                        className={`p-4 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 bg-white border-stone-200 ${i < 3 ? 'ring-2 ring-amber-200' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${i === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                                                i === 1 ? 'bg-gradient-to-br from-stone-300 to-stone-400 text-white' :
                                                    i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
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
                                                    <span className="text-orange-600">🌡️ {dest.best_month_temp}°C</span>
                                                    <span className="text-blue-600">🌧️ {dest.best_month_rain}%</span>
                                                    <SeasonBadge type={dest.best_month === "Apr" || dest.best_month === "May" ? "spring" : "fall"} />
                                                </div>
                                            </div>

                                            <div className={`text-2xl font-bold ${getScoreColor(dest.overall_score)}`}>
                                                {dest.overall_score}
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Spring vs Fall Section */}
                <section aria-label="Spring vs Fall Comparison" className="py-12 px-4 bg-gradient-to-r from-pink-50 via-white to-amber-50 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2 text-center">🌸 Spring vs 🍂 Fall</h2>
                        <p className="text-stone-600 mb-8 text-center max-w-2xl mx-auto">
                            Which shoulder season is better? It depends on the destination. Here's how they compare.
                        </p>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Spring Column */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-pink-200 shadow-sm">
                                <div className="p-6 bg-gradient-to-r from-pink-100 to-pink-50 border-b border-pink-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">🌸</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-stone-900">Spring Season</h3>
                                            <p className="text-stone-600">April – May</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="text-sm text-stone-500 mb-2">Best for:</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs">Blooming gardens</span>
                                            <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs">Easter festivals</span>
                                            <span className="px-2 py-1 rounded-full bg-pink-100 text-pink-700 text-xs">Warming seas</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-stone-500 mb-2">Top Spring Destinations:</div>
                                    <div className="space-y-2">
                                        {springDestinations.slice(0, 5).map((dest: any) => (
                                            <Link key={dest.slug} href={`/${dest.slug}`}>
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-pink-50 transition-colors">
                                                    <span className="font-medium text-stone-900">{dest.name}</span>
                                                    <span className={`font-bold ${getScoreColor(dest.spring_score)}`}>
                                                        {dest.spring_score}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Fall Column */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-amber-200 shadow-sm">
                                <div className="p-6 bg-gradient-to-r from-amber-100 to-amber-50 border-b border-amber-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">🍂</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-stone-900">Fall Season</h3>
                                            <p className="text-stone-600">September – October</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="text-sm text-stone-500 mb-2">Best for:</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">Warm sea temps</span>
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">Wine harvest</span>
                                            <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">Golden light</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-stone-500 mb-2">Top Fall Destinations:</div>
                                    <div className="space-y-2">
                                        {fallDestinations.slice(0, 5).map((dest: any) => (
                                            <Link key={dest.slug} href={`/${dest.slug}`}>
                                                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 transition-colors">
                                                    <span className="font-medium text-stone-900">{dest.name}</span>
                                                    <span className={`font-bold ${getScoreColor(dest.fall_score)}`}>
                                                        {dest.fall_score}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Methodology Section */}
                <section aria-label="Methodology" className="py-12 px-4 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">📐 How We Scored Destinations</h2>
                        <p className="text-stone-600 mb-8">
                            Our shoulder season score is a weighted combination of four key factors that determine
                            ideal travel conditions.
                        </p>

                        <div className="grid md:grid-cols-4 gap-4 mb-8">
                            <div className="p-5 bg-orange-50 rounded-xl border border-orange-100">
                                <div className="text-3xl mb-3">🌡️</div>
                                <div className="text-lg font-bold text-stone-900 mb-1">Temperature</div>
                                <div className="text-2xl font-bold text-orange-600">40 pts</div>
                                <div className="text-sm text-stone-500 mt-2">18-26°C ideal range</div>
                            </div>
                            <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="text-3xl mb-3">🌧️</div>
                                <div className="text-lg font-bold text-stone-900 mb-1">Rain Chance</div>
                                <div className="text-2xl font-bold text-blue-600">25 pts</div>
                                <div className="text-sm text-stone-500 mt-2">&lt;15% is excellent</div>
                            </div>
                            <div className="p-5 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="text-3xl mb-3">👥</div>
                                <div className="text-lg font-bold text-stone-900 mb-1">Tourist Crowds</div>
                                <div className="text-2xl font-bold text-purple-600">20 pts</div>
                                <div className="text-sm text-stone-500 mt-2">Based on flight data</div>
                            </div>
                            <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="text-3xl mb-3">☀️</div>
                                <div className="text-lg font-bold text-stone-900 mb-1">Sunshine</div>
                                <div className="text-2xl font-bold text-yellow-600">15 pts</div>
                                <div className="text-sm text-stone-500 mt-2">6+ hours daily ideal</div>
                            </div>
                        </div>

                        <Card className="bg-stone-50 border-stone-200">
                            <Title className="text-stone-900">Data Sources</Title>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span className="text-stone-700">Open-Meteo Archive API (1995-2024)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span className="text-stone-700">AeroDataBox flight seasonality data</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span className="text-stone-700">Marine temperature data for coastal cities</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600">✓</span>
                                        <span className="text-stone-700">Daily observations for {methodology.data_years} years</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Full Rankings Table */}
                <section aria-label="Full Data Rankings" className="py-12 px-4 bg-stone-50 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">📋 Complete Rankings</h2>
                        <p className="text-stone-600 mb-6">
                            All {destinations.length} European destinations ranked by shoulder season score. Click any destination
                            for detailed day-by-day weather insights.
                        </p>

                        <Card className="bg-white border-stone-200">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableHeaderCell className="text-stone-600">Rank</TableHeaderCell>
                                            <TableHeaderCell className="text-stone-600">Destination</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Score</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Best Month</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Temp</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Rain</TableHeaderCell>
                                            <TableHeaderCell className="text-center text-stone-600">Crowd ∆</TableHeaderCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {destinations.map((dest: any) => (
                                            <TableRow key={dest.slug} className="hover:bg-stone-50 transition-colors">
                                                <TableCell className="font-medium text-stone-500">
                                                    {dest.rank <= 3 ? (
                                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                                                            {dest.rank}
                                                        </span>
                                                    ) : dest.rank}
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/${dest.slug}`}
                                                        className="font-medium text-stone-900 hover:text-orange-600 transition-colors"
                                                    >
                                                        {dest.name}
                                                        <span className="text-stone-400 font-normal ml-2">{dest.country}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-bold ${getScoreColor(dest.overall_score)}`}>
                                                        {dest.overall_score}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <SeasonBadge type={dest.best_month === "Apr" || dest.best_month === "May" ? "spring" : "fall"} />
                                                </TableCell>
                                                <TableCell className="text-center text-stone-600">{dest.best_month_temp}°C</TableCell>
                                                <TableCell className="text-center text-stone-600">{dest.best_month_rain}%</TableCell>
                                                <TableCell className="text-center">
                                                    {dest.crowd_reduction > 0 ? (
                                                        <span className="text-green-600 font-medium">−{dest.crowd_reduction}%</span>
                                                    ) : dest.crowd_reduction < 0 ? (
                                                        <span className="text-red-600">+{Math.abs(dest.crowd_reduction)}%</span>
                                                    ) : (
                                                        <span className="text-stone-400">0%</span>
                                                    )}
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
                <section className="py-12 px-4 border-t border-stone-100">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-stone-900 mb-4 text-center">📝 Cite This Research</h2>
                        <p className="text-stone-600 text-center mb-6">
                            Journalists, bloggers, and researchers are welcome to cite this study with attribution.
                        </p>

                        <Card className="bg-stone-50 border-stone-200 p-6">
                            <div className="font-mono text-sm text-stone-600 break-words">
                                30YearWeather. (2025). <em>Shoulder Season Index 2025: Best Time to Visit 96 European Destinations</em>.
                                Retrieved from https://30yearweather.com/research/shoulder-season-index-2025
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
                <section className="py-12 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-stone-900 mb-4">
                            Plan Your Shoulder Season Trip
                        </h2>
                        <p className="text-stone-600 mb-6">
                            Explore day-by-day weather insights for any destination in this study.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/finder"
                                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium shadow-sm"
                            >
                                🔍 Find Your Destination
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
