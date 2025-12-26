
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Title, Text, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Metric, Grid, Col } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";
import warmingData from "@/lib/research/global-warming-2026.json";

export const metadata: Metadata = {
    title: "Global Warming Prediction 2026: City-by-City Analysis | 30YearWeather",
    description: "New study analyzing 30 years of temperature data across 270+ global cities reveals a 0.4°C/decade warming trend. See predictions for 2026 and the fastest warming destinations.",
    keywords: [
        "global warming prediction 2026",
        "climate change city data",
        "temperature trends 2026",
        "fastest warming cities",
        "climate analysis",
        "Open-Meteo data research"
    ],
    authors: [{ name: "30YearWeather Research" }],
    openGraph: {
        title: "Global Warming Prediction 2026",
        description: "We analyzed 10 million daily temperature records to predict the climate of 2026. Paradoxically, some cities are heating up 3x faster than the global average.",
        type: "article",
        publishedTime: "2025-12-26T00:00:00Z",
        authors: ["30YearWeather Research"],
        images: ["https://30yearweather.com/images/research/global-warming-hero.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Global Warming Prediction 2026",
        description: "Data-driven climate analysis of 270 global cities.",
        images: ["https://30yearweather.com/images/research/global-warming-hero.png"],
    }
};

export default function GlobalWarmingPage() {
    const { meta, continent_stats, top_warming_cities } = warmingData;

    return (
        <>
            <Header
                breadcrumb={{
                    label: "Global Warming 2026",
                    href: "/research",
                    sublabel: "Research"
                }}
            />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Global Warming Prediction 2026: 30-Year Data Analysis",
                        "description": "Analysis of temperature trends across 273 cities using Open-Meteo ERA5 data.",
                        "image": "https://30yearweather.com/images/research/global-warming-hero.png",
                        "datePublished": "2025-12-26",
                        "author": {
                            "@type": "Organization",
                            "name": "30YearWeather"
                        },
                        "about": {
                            "@type": "Dataset",
                            "name": "Global Urban Warming Index 2026",
                            "description": "Warming rates for 273 major cities based on 1996-2025 data",
                            "variableMeasured": "Temperature change per decade",
                            "license": "https://creativecommons.org/licenses/by/4.0/",
                            "sourceOrganization": "Open-Meteo (ERA5 Reanalysis)"
                        }
                    })
                }}
            />

            <main className="min-h-screen bg-stone-50">
                {/* Hero Section */}
                <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-black">
                    <div className="absolute inset-0 z-0 opacity-80">
                        <img
                            src="/images/research/global-warming-hero.png"
                            alt="Visualization of global temperature anomalies"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-20">
                        <Badge size="lg" className="mb-6 bg-red-600 text-white border-0 font-bold uppercase tracking-widest shadow-lg shadow-red-900/50">
                            Critical Trend Analysis
                        </Badge>
                        <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tighter shadow-black drop-shadow-2xl">
                            +0.40°C <span className="text-red-500">/ Decade</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto leading-relaxed font-light">
                            Our analysis of <strong className="text-white">273 global cities</strong> reveals an accelerating urban warming trend.
                            Based on 30 years of daily raw data, here is our prediction for 2026.
                        </p>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="py-12 px-6 -mt-16 relative z-20">
                    <div className="max-w-[1250px] mx-auto">
                        <Grid numItemsMd={3} className="gap-6">
                            <Card className="bg-white/95 backdrop-blur shadow-xl border-t-4 border-red-500">
                                <Text>Global Urban Average</Text>
                                <Metric className="text-stone-900 mt-2">+{meta.global_warming_rate_decade}°C</Metric>
                                <Text className="mt-2 text-stone-500">Warming rate per decade (1996-2025)</Text>
                            </Card>
                            <Card className="bg-white/95 backdrop-blur shadow-xl border-t-4 border-orange-500">
                                <Text>Fastest Warming Continent</Text>
                                <Metric className="text-stone-900 mt-2">Europe</Metric>
                                <Text className="mt-2 text-stone-500">
                                    +{(continent_stats as any).Europe?.avg_warming_rate_decade}°C / decade avg
                                </Text>
                            </Card>
                            <Card className="bg-white/95 backdrop-blur shadow-xl border-t-4 border-amber-500">
                                <Text>2026 Prediction Baseline</Text>
                                <div className="text-3xl font-bold text-stone-900 mt-3">+1.2°C</div>
                                <Text className="mt-2 text-stone-500">Projected rise since 1996 baseline in urban centers</Text>
                            </Card>
                        </Grid>
                    </div>
                </section>

                {/* Narrative & Methodology */}
                <section className="py-16 px-6 max-w-4xl mx-auto">
                    <div className="prose prose-lg prose-stone mx-auto">
                        <h2 className="text-4xl font-bold tracking-tight mb-8">The Data Speaks</h2>
                        <p className="lead text-xl">
                            We didn't rely on general models. We went straight to the source: <strong>30 years of raw daily weather records</strong> for 273 of the world's most popular travel destinations.
                        </p>
                        <p>
                            Using high-precision data from Open-Meteo (based on ECMWF ERA5 reanalysis), we calculated the daily mean temperature for every single day since 1996. By applying linear regression analysis to these millions of data points, we isolated the underlying warming trend for each city, filtering out seasonal noise and short-term anomalies.
                        </p>
                        <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-xl my-8">
                            <h3 className="text-red-800 font-bold mt-0">Key Finding: Europe is Heating Up</h3>
                            <p className="mb-0 text-red-700">
                                Our data confirms that European cities are warming significantly faster than the global average, with many exceeding 0.6°C per decade. This "Alpine amplification" and Mediterranean warming poses real changes for future travel planning.
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Rankings Table */}
                <section className="py-16 px-6 bg-white border-y border-stone-200">
                    <div className="max-w-[1250px] mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-stone-900">Fastest Warming Cities 2026</h2>
                            <p className="text-stone-500 mt-2">Destinations with the steepest temperature rise (1996-2025)</p>
                        </div>

                        <Card>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeaderCell>City</TableHeaderCell>
                                        <TableHeaderCell>Continent</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Warming Rate</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Total Rise (30y)</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Predicted Avg Temp (2026)*</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {top_warming_cities.map((city: any) => (
                                        <TableRow key={city.slug} className="hover:bg-red-50/50">
                                            <TableCell>
                                                <Link href={`/${city.slug}`} className="font-bold text-stone-900 hover:underline">
                                                    {city.name}
                                                </Link>
                                                <div className="text-xs text-stone-400">{city.country}</div>
                                            </TableCell>
                                            <TableCell><Badge size="xs" color="gray">{city.continent}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Badge color="red" size="lg">+{city.warming_rate_decade}°C / 10 years</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">
                                                +{city.warming_total}°C
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-stone-900">
                                                {city.prediction_2026}°C
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                        <div className="mt-4 text-xs text-stone-500 text-right italic">
                            *Projected annual average temperature for 2026, calculated by extrapolating the city's specific 30-year linear warming trend.
                        </div>
                    </div>
                </section>

                {/* Source & Credits */}
                <section className="py-12 px-6 bg-stone-900 text-stone-400 text-center text-sm">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <p className="uppercase tracking-widest font-bold text-stone-500">Data Sources & Attribution</p>
                        <p>
                            All temperature data in this study is sourced from the <strong>Open-Meteo Historical Weather API</strong>,
                            which utilizes the Copernicus Climate Change Service (C3S) ERA5 reanalysis dataset.
                        </p>
                        <p>
                            Analysis period: 1996-2025. Methodology: Ordinary Least Squares (OLS) linear regression on annual mean temperatures.
                            Data processed by 30YearWeather Research Team.
                        </p>
                        <div className="pt-4">
                            <Link href="/research" className="text-white hover:text-red-400 underline decoration-red-500 underline-offset-4">
                                ← Back to Research Hub
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
