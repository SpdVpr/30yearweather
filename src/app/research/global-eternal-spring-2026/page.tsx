
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, Title, Text, Badge, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from "@tremor/react";
import Header from "@/components/common/Header";
import type { Metadata } from "next";
import researchData from "@/lib/research/global-eternal-spring-2026.json";

export const metadata: Metadata = {
    title: "Global Eternal Spring Index 2026: The Search for the World's Most Perfect Climate",
    description: "Beyond the seasons. We analyzed global weather data to find the rare places on Earth where it is always spring—perfect 20-25°C days year-round, from Medellin to the Canary Islands.",
    keywords: [
        "eternal spring climate",
        "best weather in the world",
        "Medellin weather",
        "Quito climate",
        "Canary Islands weather",
        "year-round spring",
        "perfect climate cities",
        "digital nomad weather"
    ],
    authors: [{ name: "30YearWeather Research" }],
    openGraph: {
        title: "The Search for Eternal Spring: Global Index 2026",
        description: "Where on Earth is the weather perfect every single day? We analyzed 270+ cities to find out.",
        type: "article",
        publishedTime: "2025-12-26T00:00:00Z",
        authors: ["30YearWeather Research"],
        images: ["https://30yearweather.com/images/research/eternal-spring-hero.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "The Search for Eternal Spring 2026",
        description: "Where on Earth is the weather perfect every single day? We analyzed 270+ cities to find out.",
        images: ["https://30yearweather.com/images/research/eternal-spring-hero.png"],
    }
};

function getScoreColor(score: number): string {
    if (score >= 90) return "text-emerald-600";
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-teal-600";
    if (score >= 60) return "text-cyan-600";
    return "text-stone-500";
}

export default function EternalSpringPage() {
    const { destinations, methodology, key_findings } = researchData;
    const topDestinations = destinations.slice(0, 20);

    return (
        <>
            <Header
                breadcrumb={{
                    label: "Global Eternal Spring 2026",
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
                        "headline": "Global Eternal Spring Index 2026: The Search for the World's Most Perfect Climate",
                        "description": "A data-driven search for places with year-round perfect weather.",
                        "image": "https://30yearweather.com/images/research/eternal-spring-hero.png",
                        "datePublished": "2025-12-26",
                        "author": {
                            "@type": "Organization",
                            "name": "30YearWeather"
                        },
                        "about": {
                            "@type": "Dataset",
                            "name": "Global Eternal Spring Index 2026",
                            "description": "Analysis of temperature variance and comfort across 270 global cities",
                            "variableMeasured": [
                                "Temperature Stability",
                                "Annual Average Temperature",
                                "Extreme Weather Days"
                            ],
                            "license": "https://creativecommons.org/licenses/by/4.0/",
                        }
                    })
                }}
            />

            <main className="min-h-screen bg-[#FDFDFD]">
                {/* Immersive Hero */}
                <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/research/eternal-spring-hero.png"
                            alt="Surreal landscape depicting a city of eternal spring"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#FDFDFD]" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20">
                        <Badge className="mb-6 bg-white/20 text-white border-white/40 backdrop-blur-md px-4 py-1 text-sm tracking-wider uppercase">
                            Global Research Study
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
                            The Search for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-cyan-200">
                                Eternal Spring
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-light">
                            Where on Earth does the season never change? We analyzed 30 years of data to find the few rare places where summer never scorches and winter never bites.
                        </p>
                    </div>
                </section>

                {/* Narrative Section: The Quest */}
                <section aria-label="Introduction" className="py-20 px-6 max-w-3xl mx-auto">
                    <div className="prose prose-lg prose-stone mx-auto first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                        <p className="lead text-xl md:text-2xl text-stone-600 font-serif italic mb-12 border-l-4 border-emerald-500 pl-6">
                            "Imagine a life where your wardrobe has no seasons. Where windows are always open, and the boundary between indoors and outdoors dissolves."
                        </p>
                        <p>
                            Humans are biologically tropical animals. Our physiological "thermal neutrality" zone—where our bodies need to expend the least energy to maintain core temperature—hover around <strong>21°C (70°F)</strong>.
                        </p>
                        <p>
                            Most of the world chases this ideal temperature through the seasons, migrating or relying on technology like heating and air conditioning. But there are rare geographical pockets where this "Goldilocks" climate exists naturally, all year round.
                        </p>
                        <p>
                            We call this the <strong>Eternal Spring</strong>. And to find it, we didn't just look for average temperatures—we looked for <em>stability</em>.
                        </p>
                    </div>
                </section>

                {/* Feature: The Geography of Comfort */}
                <section aria-label="Geographical Analysis" className="py-20 bg-stone-50 border-y border-stone-200">
                    <div className="max-w-[1250px] mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">The High-Altitude Paradox</h2>
                                <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                                    Logic suggests that to find warmth, you go to the Equator. But at sea level, the Equator is sweltering. To find eternal spring, you must go <strong>up</strong>.
                                </p>
                                <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                    In the Andes mountains of South America and the highlands of East Africa, altitude acts as a natural air conditioner. For every 1,000 meters you climb, the temperature drops by about 6°C.
                                </p>

                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-emerald-100 p-3 rounded-full text-2xl">🏔️</div>
                                        <div>
                                            <h3 className="text-xl font-bold text-stone-900">The Winner: Medellín, Colombia</h3>
                                            <p className="text-stone-500">Altitude: 1,495m • Avg Temp: 22.5°C</p>
                                        </div>
                                    </div>
                                    <p className="text-stone-600">
                                        Known as "La Ciudad de la Eterna Primavera" (The City of Eternal Spring), Medellín topped our index with a near-perfect stability score. The temperature variance between its hottest and coldest month is less than <strong>1°C</strong>.
                                    </p>
                                </div>
                            </div>
                            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                                {/* Placeholder for map or image - using data viz pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-stone-900 p-8 flex flex-col justify-end">
                                    <div className="space-y-4">
                                        {topDestinations.filter(d => d.spring_score > 90).slice(0, 3).map((city, i) => (
                                            <div key={city.slug} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                                                <div className="flex justify-between items-center text-white">
                                                    <span className="font-bold text-lg">{i + 1}. {city.name}, {city.country}</span>
                                                    <Badge color="emerald">{city.spring_score}</Badge>
                                                </div>
                                                <div className="mt-2 text-emerald-200 text-sm flex gap-4">
                                                    <span>🌡️ {city.avg_annual_temp}°C Avg</span>
                                                    <span>📉 {city.temp_variance}°C Var</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8">
                                        <h4 className="text-white/60 uppercase tracking-widest text-sm mb-2">Key Factor</h4>
                                        <p className="text-white text-xl font-light">"Low latitude + High altitude = Stability"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature: The Ocean's Embrace */}
                <section aria-label="Ocean Influence" className="py-20 px-6 max-w-[1250px] mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-blue-50 border-blue-100">
                                    <Text className="text-blue-600 mb-2">Canary Islands</Text>
                                    <Title className="text-stone-900">Tenerife</Title>
                                    <div className="mt-4 text-3xl font-bold text-stone-800">21.4°C</div>
                                    <Text className="text-stone-500">Annual Avg</Text>
                                </Card>
                                <Card className="bg-cyan-50 border-cyan-100">
                                    <Text className="text-cyan-600 mb-2">Macaronesia</Text>
                                    <Title className="text-stone-900">Azores</Title>
                                    <div className="mt-4 text-3xl font-bold text-stone-800">18.2°C</div>
                                    <Text className="text-stone-500">Annual Avg</Text>
                                </Card>
                                <Card className="bg-orange-50 border-orange-100">
                                    <Text className="text-orange-600 mb-2">Central America</Text>
                                    <Title className="text-stone-900">San Jose</Title>
                                    <div className="mt-4 text-3xl font-bold text-stone-800">23.1°C</div>
                                    <Text className="text-stone-500">Annual Avg</Text>
                                </Card>
                                <Card className="bg-teal-50 border-teal-100">
                                    <Text className="text-teal-600 mb-2">Polynesia</Text>
                                    <Title className="text-stone-900">Bora Bora</Title>
                                    <div className="mt-4 text-3xl font-bold text-stone-800">27.0°C</div>
                                    <Text className="text-stone-500">Annual Avg</Text>
                                </Card>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">The Ocean's Buffer</h2>
                            <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                                Not everyone wants to live on a mountain. The second path to eternal spring lies in the middle of the ocean.
                            </p>
                            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                                Large bodies of water heat up and cool down much slower than land. Islands like <strong>Tenerife</strong> or the <strong>Azores</strong> (the region known as Macaronesia) benefit from this thermal inertia, keeping summers cool and winters mild.
                            </p>
                            <div className="p-6 bg-stone-50 rounded-xl border-l-4 border-blue-500">
                                <p className="text-stone-700 italic">
                                    "Islands in the subtropics often offer a 'spring-like' climate, though they may have slightly more seasonal variation than the equatorial highlands."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Data Table */}
                <section aria-label="Full Rankings" className="py-20 bg-white border-t border-stone-200">
                    <div className="max-w-[1250px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <Badge className="mb-4 bg-emerald-100 text-emerald-800">Exclusive Data</Badge>
                            <h2 className="text-4xl font-bold text-stone-900 mb-4">The Global Top 20</h2>
                            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                                Based on temperature stability, lack of extremes, and adherence to the 18-26°C ideal range.
                            </p>
                        </div>

                        <Card className="shadow-xl border-stone-200 overflow-hidden">
                            <Table>
                                <TableHead>
                                    <TableRow className="bg-stone-50">
                                        <TableHeaderCell>Rank</TableHeaderCell>
                                        <TableHeaderCell>Destination</TableHeaderCell>
                                        <TableHeaderCell>Continent</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Spring Score</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Avg Temp</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Variance</TableHeaderCell>
                                        <TableHeaderCell className="text-right">Perfect Days</TableHeaderCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topDestinations.map((city: any, i: number) => (
                                        <TableRow key={city.slug} className="hover:bg-emerald-50/50 transition-colors cursor-pointer">
                                            <TableCell>
                                                <span className={`font-mono font-bold ${i < 3 ? 'text-emerald-600 text-lg' : 'text-stone-400'}`}>
                                                    #{i + 1}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/${city.slug}`} className="font-bold text-stone-900 hover:text-emerald-600 hover:underline">
                                                    {city.name}
                                                </Link>
                                                <div className="text-xs text-stone-400">{city.country}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge size="xs" color="gray">{city.continent}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className={`font-bold ${getScoreColor(city.spring_score)}`}>
                                                    {city.spring_score}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-stone-600">
                                                {city.avg_annual_temp}°C
                                            </TableCell>
                                            <TableCell className="text-right text-stone-600">
                                                ±{city.temp_variance.toFixed(1)}°C
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-stone-500">
                                                {city.days_perfect}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </div>
                </section>

                {/* Methodology & CTA */}
                <section aria-label="Methodology" className="py-16 px-6 bg-stone-900 text-stone-400">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-white text-xl font-bold mb-4">How we calculated this</h3>
                            <p className="mb-4 text-sm leading-relaxed">
                                We processed 30 years of daily historical weather data for 273 cities globally.
                                The "Eternal Spring Score" (0-100) rewards destinations with:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                <li><strong>Low Monthly Variance:</strong> Minimal difference between the hottest and coldest months.</li>
                                <li><strong>Ideal Average:</strong> Annual mean temperature closest to 21°C.</li>
                                <li><strong>Lack of Extremes:</strong> Fewest days below 10°C or above 30°C.</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white text-xl font-bold mb-4">Explore More</h3>
                            <p className="mb-6 text-sm">
                                Want to find your own perfect climate? Use our Weather Finder to filter by temperature, region, and season.
                            </p>
                            <Link href="/finder" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                Open Weather Finder
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
