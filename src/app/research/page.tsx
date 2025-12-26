import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Badge } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Travel Research & Data Studies: Evidence-Based Trip Planning | 30YearWeather",
    description: "Explore original travel research powered by 30 years of historical weather data across 270+ global destinations. Data-driven insights for optimal trip planning including shoulder season analysis, best months to visit, and crowd predictions.",
    keywords: [
        "travel research",
        "weather data analysis",
        "best time to visit",
        "shoulder season research",
        "travel planning data",
        "European travel study",
        "climate data travel",
        "off-peak travel research"
    ],
    openGraph: {
        title: "Travel Research & Data Studies | 30YearWeather",
        description: "Original travel research based on 30 years of weather data across 270+ destinations worldwide.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Travel Research & Data Studies",
        description: "Evidence-based travel insights from 30 years of weather data.",
    },
    alternates: {
        canonical: "https://30yearweather.com/research",
    },
};

// Research studies data
const studies = [
    {
        slug: "global-warming-prediction-2026",
        title: "Global Warming Index 2026",
        subtitle: "The Accelerating Heat of Our Cities",
        description: "A critical quantitative analysis of 30 years of raw temperature data across 270+ global destinations. We identify the cities warming fastest and predict climate conditions for 2026 based on real historical trends. Essential reading for understanding urban climate shifts.",
        date: "December 2025",
        category: "Climate Analysis",
        stats: {
            cities: 273,
            years: 30,
        },
        highlight: {
            finding: "Global Urban Trend",
            metric: "+0.4°C / Decade"
        },
        featured: true
    },
    {
        slug: "global-eternal-spring-2026",
        title: "Global Eternal Spring Index 2026",
        subtitle: "The Search for the World's Most Perfect Climate",
        description: "Where on Earth does the season never change? We analyzed 270+ global cities to find the rare places where summer never scorches and winter never bites. A narrative data study on bioclimate and comfort.",
        date: "December 2025",
        category: "Global Climate",
        stats: {
            cities: 273,
            years: 30,
        },
        highlight: {
            finding: "Medellín, Colombia",
            metric: "Stability Score: 97.9"
        },
        featured: false
    },
    {
        slug: "shoulder-season-index-2025",
        title: "Shoulder Season Index 2025",
        subtitle: "When to Visit 96 European Destinations for Perfect Weather & Fewer Crowds",
        description: "We analyzed 30 years of historical weather data to identify the best shoulder season months for European travel. Our research reveals that May and October offer optimal conditions.",
        date: "December 2025",
        category: "Seasonal Travel",
        stats: {
            cities: 96,
            years: 30,
        },
        highlight: {
            finding: "Las Palmas & Mykonos",
            metric: "Top Shoulder Score: 88.5"
        },
        featured: false
    },
    {
        slug: "beach-index-2025",
        title: "Beach Destination Index 2025",
        subtitle: "Best European Beach Destinations by Water Temperature",
        description: "Our analysis of 30 years of sea surface temperature data reveals where to find the warmest Mediterranean waters. Discover which coastal destinations offer the longest swimming seasons.",
        date: "December 2025",
        category: "Beach Travel",
        stats: {
            cities: 35,
            years: 30,
        },
        highlight: {
            finding: "Antalya",
            metric: "Warmest Water: 30.7°C"
        },
        featured: false
    },
    {
        slug: "winter-sun-index-2025",
        title: "Winter Sun Index 2025",
        subtitle: "Best European & Mediterranean Destinations for Winter Warmth",
        description: "Escape the cold with our data-backed guide to winter sun. We analyzed weather data from November to February to find the warmest annual destinations.",
        date: "December 2025",
        category: "Winter Travel",
        stats: {
            cities: 35,
            years: 30,
        },
        highlight: {
            finding: "Las Palmas & Hurghada",
            metric: "Top Score: 95.0"
        },
        featured: false
    }
];

export default function ResearchPage() {
    return (
        <>
            <Header
                breadcrumb={{
                    label: "Research",
                    href: "/"
                }}
            />

            {/* JSON-LD for Research Hub */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Travel Research & Data Studies",
                        "description": "Original travel research based on 30 years of historical weather data",
                        "url": "https://30yearweather.com/research",
                        "publisher": {
                            "@type": "Organization",
                            "name": "30YearWeather",
                            "url": "https://30yearweather.com"
                        },
                        "mainEntity": {
                            "@type": "ItemList",
                            "itemListElement": studies.map((study, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "item": {
                                    "@type": "Article",
                                    "name": study.title,
                                    "url": `https://30yearweather.com/research/${study.slug}`
                                }
                            }))
                        }
                    })
                }}
            />

            <main className="min-h-screen bg-white pt-20">
                {/* Hero Section */}
                <section aria-label="Research Overview" className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white">
                    <div className="max-w-[1250px] mx-auto text-center">
                        <Badge size="lg" className="mb-6 bg-orange-100 text-orange-700 border-orange-200">
                            📊 Data-Driven Insights
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                            Travel Research & Data Studies
                        </h1>
                        <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                            Original research based on <strong className="text-stone-900">30 years</strong> of historical weather data
                            across <strong className="text-stone-900">270+ destinations</strong> worldwide.
                            Evidence-based insights that go beyond generic travel advice.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 mt-10">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-stone-900">30</div>
                                <div className="text-sm text-stone-500">Years of Data</div>
                            </div>
                            <div className="h-12 w-px bg-stone-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-stone-900">270+</div>
                                <div className="text-sm text-stone-500">Destinations</div>
                            </div>
                            <div className="h-12 w-px bg-stone-200"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-stone-900">10M+</div>
                                <div className="text-sm text-stone-500">Data Points</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Study */}
                <section aria-label="Featured Study" className="py-12 px-4">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-orange-600">⭐</span>
                            Featured Research
                        </h2>

                        {studies.filter(s => s.featured).map((study) => (
                            <Link
                                key={study.slug}
                                href={`/research/${study.slug}`}
                                className="group block"
                            >
                                <Card className="bg-white border-stone-200 hover:border-orange-300 hover:shadow-lg transition-all p-0 overflow-hidden">
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row gap-8">
                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                                        {study.category}
                                                    </Badge>
                                                    <span className="text-sm text-stone-500">{study.date}</span>
                                                </div>

                                                <h3 className="text-3xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                                                    {study.title}
                                                </h3>
                                                <p className="text-lg text-stone-500 mb-4">
                                                    {study.subtitle}
                                                </p>
                                                <p className="text-stone-600 leading-relaxed mb-6">
                                                    {study.description}
                                                </p>

                                                <div className="flex items-center gap-6 text-sm text-stone-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-lg">🏙️</span> {study.stats.cities} destinations analyzed
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-lg">📅</span> {study.stats.years} years of data
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="text-lg">📊</span> 10M+ data points
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Key Finding */}
                                            <div className="lg:w-64 flex-shrink-0">
                                                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                                                    <div className="text-xs text-orange-600 uppercase tracking-wide font-semibold mb-2">
                                                        🏆 Key Finding
                                                    </div>
                                                    <div className="text-xl font-bold text-stone-900 mb-2">
                                                        {study.highlight.finding}
                                                    </div>
                                                    <div className="text-sm text-stone-600">
                                                        {study.highlight.metric}
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all text-lg">
                                                    <span>Read Full Study</span>
                                                    <span>→</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* More Studies */}
                {studies.filter(s => !s.featured).length > 0 && (
                    <section aria-label="More Research Studies" className="py-12 px-4 bg-stone-50/50">
                        <div className="max-w-[1250px] mx-auto">
                            <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600">📊</span>
                                More Research
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {studies.filter(s => !s.featured).map((study) => (
                                    <Link
                                        key={study.slug}
                                        href={`/research/${study.slug}`}
                                        className="group block"
                                    >
                                        <Card className="bg-white border-stone-200 hover:border-cyan-300 hover:shadow-lg transition-all p-6 h-full">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200">
                                                    {study.category}
                                                </Badge>
                                                <span className="text-sm text-stone-500">{study.date}</span>
                                            </div>

                                            <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-cyan-600 transition-colors">
                                                {study.title}
                                            </h3>
                                            <p className="text-stone-500 mb-4 text-sm">
                                                {study.subtitle}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-stone-500">
                                                    <span>🏙️ {study.stats.cities} destinations</span>
                                                    <span>📅 {study.stats.years} years</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-cyan-600 font-medium text-sm group-hover:gap-2 transition-all">
                                                    Read <span>→</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Methodology */}
                <section aria-label="Research Methodology" className="py-12 px-4 bg-stone-50 border-t border-stone-100">
                    <div className="max-w-[1250px] mx-auto">
                        <h2 className="text-2xl font-bold text-stone-900 mb-8">📐 Our Research Methodology</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <div className="text-3xl mb-4">📡</div>
                                <h3 className="text-lg font-bold text-stone-900 mb-3">Data Collection</h3>
                                <p className="text-stone-600">
                                    We source historical weather data from Open-Meteo covering 30 years of daily observations
                                    including temperature, precipitation, sunshine hours, humidity, and marine conditions for coastal destinations.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <div className="text-3xl mb-4">🔬</div>
                                <h3 className="text-lg font-bold text-stone-900 mb-3">Statistical Analysis</h3>
                                <p className="text-stone-600">
                                    Our analysis uses weighted scoring algorithms that combine multiple factors.
                                    We calculate averages, identify patterns, and account for year-to-year climate variability
                                    to provide reliable recommendations.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <div className="text-3xl mb-4">✅</div>
                                <h3 className="text-lg font-bold text-stone-900 mb-3">Transparency & Verification</h3>
                                <p className="text-stone-600">
                                    All findings are based on verifiable data with detailed methodology explanations.
                                    Each destination links to its own page where you can explore the underlying data day-by-day.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section aria-label="Use Our Data" className="py-12 px-4 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-100">
                    <div className="max-w-[1250px] mx-auto text-center">
                        <h2 className="text-2xl font-bold text-stone-900 mb-4">
                            Use Our Research for Your Content
                        </h2>
                        <p className="text-stone-600 mb-6 max-w-2xl mx-auto">
                            Journalists, travel bloggers, and content creators are welcome to cite our research with attribution.
                            All studies include proper citation formats.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/#cities"
                                className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-sm font-medium"
                            >
                                🔍 Explore All Destinations
                            </Link>
                            <Link
                                href="/about"
                                className="px-6 py-3 bg-white text-stone-700 rounded-xl hover:bg-stone-50 transition-colors border border-stone-200"
                            >
                                About Our Data
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
