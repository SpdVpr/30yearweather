import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Database, Satellite, Calculator, GitBranch, Shield, ChartBar, Thermometer, CloudRain, Wind } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Methodology | How We Calculate Weather Forecasts | 30YearWeather",
    description: "Learn how 30YearWeather calculates long-range weather forecasts using 30 years of NASA POWER satellite data, rolling window averages, and probabilistic modeling.",
    alternates: {
        canonical: '/methodology',
    },
    openGraph: {
        title: "Our Methodology | 30YearWeather",
        description: "Technical deep-dive into how we transform 30 years of NASA satellite data into actionable weather forecasts.",
    },
};

export default function MethodologyPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "30YearWeather Methodology: How We Calculate Long-Range Weather Forecasts",
        "description": "Technical explanation of our weather forecasting methodology using NASA POWER satellite data",
        "author": {
            "@type": "Organization",
            "name": "30YearWeather"
        },
        "datePublished": "2024-12-01",
        "dateModified": "2024-12-18",
        "publisher": {
            "@type": "Organization",
            "name": "30YearWeather",
            "url": "https://30yearweather.com"
        },
        "about": {
            "@type": "Dataset",
            "name": "NASA POWER Satellite Weather Data",
            "temporalCoverage": "1991/2021",
            "description": "30 years of global weather observations from NASA satellites"
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Navigation */}
            <nav className="bg-white border-b border-stone-200 py-4 px-6 md:px-12 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <Link href="/about" className="text-orange-600 hover:text-orange-700 font-medium">
                        About Us →
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-16">
                    <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest">
                        Technical Documentation
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
                        Our Methodology
                    </h1>
                    <p className="text-xl text-stone-600 leading-relaxed">
                        A transparent look at how we transform 30 years of NASA satellite observations
                        into actionable weather forecasts for 366 days of the year.
                    </p>
                </div>

                {/* Table of Contents */}
                <nav className="mb-16 p-6 bg-white rounded-xl border border-stone-200">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500 mb-4">Contents</h2>
                    <ul className="space-y-2 text-stone-700">
                        <li><a href="#data-source" className="hover:text-orange-600">1. Data Source: NASA POWER API</a></li>
                        <li><a href="#data-collection" className="hover:text-orange-600">2. Data Collection Process</a></li>
                        <li><a href="#rolling-window" className="hover:text-orange-600">3. Rolling Window Algorithm</a></li>
                        <li><a href="#metrics" className="hover:text-orange-600">4. Calculated Metrics</a></li>
                        <li><a href="#scoring" className="hover:text-orange-600">5. Wedding & Event Scoring</a></li>
                        <li><a href="#limitations" className="hover:text-orange-600">6. Limitations & Caveats</a></li>
                        <li><a href="#updates" className="hover:text-orange-600">7. Data Updates</a></li>
                    </ul>
                </nav>

                {/* Content */}
                <div className="prose prose-stone prose-lg max-w-none">

                    {/* Section 1 */}
                    <section id="data-source" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Satellite className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">1. Data Source: NASA POWER API</h2>
                        </div>
                        <p>
                            All weather data in 30YearWeather comes from the <strong>NASA POWER Project</strong>
                            (Prediction Of Worldwide Energy Resources). This is the same data infrastructure used by:
                        </p>
                        <ul>
                            <li>Agricultural researchers</li>
                            <li>Renewable energy planners</li>
                            <li>Climate scientists</li>
                            <li>Government agencies worldwide</li>
                        </ul>
                        <p>
                            NASA POWER provides global coverage using satellite observations and reanalysis models,
                            avoiding the gaps and biases inherent in ground-based weather station networks.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                            <p className="m-0 text-sm">
                                <strong>Official Source:</strong>{" "}
                                <a href="https://power.larc.nasa.gov/" target="_blank" rel="noopener noreferrer">
                                    power.larc.nasa.gov
                                </a>
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section id="data-collection" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">2. Data Collection Process</h2>
                        </div>
                        <p>For each of our 84+ cities, we collect the following data:</p>

                        <h3>Data Parameters</h3>
                        <ul>
                            <li><strong>T2M_MAX</strong> – Maximum temperature at 2 meters (°C)</li>
                            <li><strong>T2M_MIN</strong> – Minimum temperature at 2 meters (°C)</li>
                            <li><strong>T2M</strong> – Average temperature at 2 meters (°C)</li>
                            <li><strong>PRECTOTCORR</strong> – Precipitation (mm)</li>
                            <li><strong>RH2M</strong> – Relative humidity at 2 meters (%)</li>
                            <li><strong>WS2M</strong> – Wind speed at 2 meters (m/s)</li>
                            <li><strong>ALLSKY_SFC_SW_DWN</strong> – Solar radiation (cloud cover proxy)</li>
                        </ul>

                        <h3>Time Period</h3>
                        <p>
                            We use data from <strong>January 1, 1991 to December 31, 2021</strong> —
                            a full 30-year span providing 10,950+ data points per city.
                        </p>
                        <p>
                            This range was chosen because:
                        </p>
                        <ul>
                            <li>30 years is the WMO (World Meteorological Organization) standard for climate normals</li>
                            <li>It captures modern climate patterns including warming trends</li>
                            <li>It provides statistically significant sample sizes for every day of the year</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section id="rolling-window" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">3. Rolling Window Algorithm</h2>
                        </div>
                        <p>
                            Instead of simply averaging data for a single date (e.g., June 15th only),
                            we use a <strong>±2 day rolling window</strong>. This means when you look up June 15th,
                            we're actually averaging data from June 13-17 across all 30 years.
                        </p>

                        <h3>Why Rolling Window?</h3>
                        <ul>
                            <li><strong>Reduces noise:</strong> A freak storm on June 15, 2003 won't skew the average</li>
                            <li><strong>Increases sample size:</strong> 5 days × 30 years = 150 data points instead of 30</li>
                            <li><strong>Reflects reality:</strong> Weather patterns don't change abruptly day-to-day</li>
                        </ul>

                        <div className="bg-stone-100 rounded-lg p-6 my-6">
                            <h4 className="font-bold mb-2">Example Calculation (Prague, June 15)</h4>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Date Range</th>
                                        <th className="text-left py-2">Years</th>
                                        <th className="text-left py-2">Data Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2">June 13-17</td>
                                        <td className="py-2">1991-2021</td>
                                        <td className="py-2">5 × 30 = 150</td>
                                    </tr>
                                </tbody>
                            </table>
                            <p className="text-sm text-stone-600 mt-4 mb-0">
                                Each metric (temp, rain, wind) is averaged across these 150 observations.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section id="metrics" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                <ChartBar className="w-5 h-5 text-violet-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">4. Calculated Metrics</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 my-6">
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-4 h-4 text-orange-500" />
                                    <strong>Temperature</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">
                                    Average of daily max/min temperatures. Displayed in °C (convertible to °F).
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CloudRain className="w-4 h-4 text-blue-500" />
                                    <strong>Rain Probability</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">
                                    Percentage of days with precipitation &gt; 0.1mm in the rolling window.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wind className="w-4 h-4 text-teal-500" />
                                    <strong>Wind Speed</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">
                                    Average wind speed at 2m height, converted from m/s to km/h.
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <ChartBar className="w-4 h-4 text-amber-500" />
                                    <strong>Humidity</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">
                                    Average relative humidity percentage at 2m height.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section id="scoring" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-rose-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">5. Wedding & Event Scoring</h2>
                        </div>
                        <p>
                            We calculate a 0-100 "Wedding Score" for each day based on multiple weighted factors:
                        </p>

                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 my-6">
                            <h4 className="font-bold mb-4">Scoring Formula</h4>
                            <ul className="space-y-2 text-sm">
                                <li><strong>Rain Probability (40% weight):</strong> Lower is better. 0% rain = 40 points</li>
                                <li><strong>Temperature Comfort (30% weight):</strong> 20-26°C optimal = 30 points</li>
                                <li><strong>Humidity (15% weight):</strong> 40-60% optimal = 15 points</li>
                                <li><strong>Wind (15% weight):</strong> &lt;20 km/h optimal = 15 points</li>
                            </ul>
                            <p className="mt-4 mb-0 text-sm text-rose-700">
                                <strong>Score Interpretation:</strong> 80+ = Perfect | 60-79 = Good | 40-59 = Fair | &lt;40 = Risky
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section id="limitations" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">6. Limitations & Caveats</h2>
                        </div>
                        <p>We believe in transparency. Here's what you should know:</p>
                        <ul>
                            <li>
                                <strong>Historical ≠ Prediction:</strong> We show what happened in the past,
                                not a guarantee of the future. Climate is changing.
                            </li>
                            <li>
                                <strong>City-level resolution:</strong> Our data represents the city center.
                                Microclimates (coastal, mountainous) may vary.
                            </li>
                            <li>
                                <strong>Extreme events:</strong> Rare events (hurricanes, freak storms) are
                                smoothed out by averaging. Always have a backup plan.
                            </li>
                            <li>
                                <strong>Data ends 2021:</strong> Our dataset currently ends in 2021.
                                We're working on incorporating more recent data.
                            </li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section id="updates" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-stone-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">7. Data Updates</h2>
                        </div>
                        <ul>
                            <li><strong>City expansion:</strong> We regularly add new cities based on user demand</li>
                            <li><strong>Algorithm refinements:</strong> Our scoring models are continuously improved</li>
                            <li><strong>Data range extension:</strong> We plan to extend to 2023+ data in 2025</li>
                        </ul>
                    </section>

                </div>

                {/* CTA */}
                <div className="mt-16 text-center bg-stone-900 text-white rounded-2xl p-12">
                    <h2 className="text-3xl font-serif font-bold mb-4">Ready to Plan?</h2>
                    <p className="text-stone-400 mb-8 max-w-xl mx-auto">
                        Now that you understand how our data works, put it to use for your next event.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                        Explore Cities
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
