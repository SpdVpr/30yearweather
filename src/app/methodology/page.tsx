import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Database, Satellite, Calculator, GitBranch, Shield, ChartBar, Thermometer, CloudRain, Wind, Plane, Heart } from "lucide-react";
import type { Metadata } from 'next';
import Header from "@/components/common/Header";

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
    const currentDate = new Date().toISOString().split('T')[0];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "30YearWeather Methodology: How We Calculate Long-Range Weather Forecasts",
        "description": "Technical explanation of our weather forecasting methodology using NASA POWER satellite data. Learn about our rolling window algorithm, 2.5mm rain threshold, and Wedding Score™ calculation.",
        "author": {
            "@type": "Organization",
            "name": "30YearWeather",
            "url": "https://30yearweather.com"
        },
        "datePublished": "2024-12-01",
        "dateModified": currentDate,
        "publisher": {
            "@type": "Organization",
            "name": "30YearWeather",
            "url": "https://30yearweather.com",
            "logo": {
                "@type": "ImageObject",
                "url": "https://30yearweather.com/icon.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://30yearweather.com/methodology"
        },
        "about": [
            {
                "@type": "Dataset",
                "name": "NASA POWER Satellite Weather Data",
                "temporalCoverage": "1991/2021",
                "description": "30 years of global weather observations from NASA satellites",
                "provider": {
                    "@type": "Organization",
                    "name": "NASA Langley Research Center",
                    "url": "https://power.larc.nasa.gov/"
                }
            },
            {
                "@type": "SoftwareApplication",
                "name": "30YearWeather Rolling Window Algorithm",
                "applicationCategory": "Weather Analysis",
                "description": "±2 day smoothing algorithm for statistical robustness"
            }
        ],
        "keywords": [
            "weather forecasting methodology",
            "NASA POWER data",
            "historical weather analysis",
            "wedding weather planning",
            "30 year weather average",
            "rolling window algorithm",
            "precipitation probability"
        ],
        "citation": {
            "@type": "CreativeWork",
            "name": "NASA POWER Project",
            "url": "https://power.larc.nasa.gov/"
        },
        "isAccessibleForFree": true,
        "inLanguage": "en-US"
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header
                breadcrumb={{
                    label: "Our Methodology",
                    href: "/",
                    sublabel: "Scientific Approach"
                }}
            />

            <div className="pt-16">
                {/* Unified navigation handles back links */}
            </div>

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
                        <li><a href="#data-source" className="hover:text-orange-600">1. Data Sources & APIs</a></li>
                        <li><a href="#data-collection" className="hover:text-orange-600">2. Data Collection Process</a></li>
                        <li><a href="#rolling-window" className="hover:text-orange-600">3. Rolling Window Algorithm</a></li>
                        <li><a href="#metrics" className="hover:text-orange-600">4. Weather Metrics</a></li>
                        <li><a href="#travel-logic" className="hover:text-orange-600">5. Travel Intelligence (Flights)</a></li>
                        <li><a href="#health-prep" className="hover:text-orange-600">6. Health & Safety Analytics</a></li>
                        <li><a href="#lunar-solar" className="hover:text-orange-600">7. Atmospheric & Solar Data</a></li>
                        <li><a href="#scoring" className="hover:text-orange-600">8. Wedding & Event Scoring</a></li>
                        <li><a href="#limitations" className="hover:text-orange-600">9. Limitations & Caveats</a></li>
                        <li><a href="#updates" className="hover:text-orange-600">10. Data Updates</a></li>
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
                            <h2 className="text-2xl font-bold m-0">1. Data Sources & APIs</h2>
                        </div>
                        <p>
                            30YearWeather integrates multiple high-fidelity data streams to provide a holistic view of your destination beyond just the temperature.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6 my-8">
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <h4 className="font-bold text-blue-600 mt-0">Meteorological Data</h4>
                                <p className="text-sm text-stone-600"><strong>NASA POWER Project</strong> (Prediction Of Worldwide Energy Resources). Provides 30 years of satellite observations for temperature, rain, and wind.</p>
                                <a href="https://power.larc.nasa.gov/" className="text-xs uppercase font-bold tracking-wider text-stone-400 hover:text-blue-500">Source: NASA →</a>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <h4 className="font-bold text-indigo-600 mt-0">Flight Analytics</h4>
                                <p className="text-sm text-stone-600"><strong>AeroDataBox API</strong>. Powers our tourism throughput models, seasonality charts, and daily flight slot estimates.</p>
                                <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Source: Global ADS-B Network</span>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <h4 className="font-bold text-emerald-600 mt-0">Medical Advisories</h4>
                                <p className="text-sm text-stone-600"><strong>CDC Travelers' Health</strong>. Real-time vaccination requirements and non-vaccine disease notices for international travel.</p>
                                <a href="https://wwwnc.cdc.gov/travel" className="text-xs uppercase font-bold tracking-wider text-stone-400 hover:text-emerald-500">Source: CDC.gov →</a>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                                <h4 className="font-bold text-amber-600 mt-0">Astronomy & Air</h4>
                                <p className="text-sm text-stone-600"><strong>OpenWeather & Astronomia</strong>. Calculations for UV index, solar altitude, and historical AQI (Air Quality Index) patterns.</p>
                                <span className="text-xs uppercase font-bold tracking-wider text-stone-400">Source: Multi-Model Reanalysis</span>
                            </div>
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
                        <p>For each of our 84+ cities, we collect the following metrics:</p>

                        <h3>Primary Weather Parameters</h3>
                        <ul>
                            <li><strong>T2M_MAX/MIN</strong> – Daily thermal peaks and troughs at 2m height.</li>
                            <li><strong>PRECTOTCORR</strong> – Corrected total liquid water equivalent (Precipitation).</li>
                            <li><strong>RH2M</strong> – Relative humidity (critical for heat index calculations).</li>
                            <li><strong>WS2M</strong> – Wind speed (used for "Wind Risk" event scoring).</li>
                            <li><strong>AS_SFC_SW_DWN</strong> – Downward solar radiation (proxy for cloud density).</li>
                        </ul>

                        <h3>Time Horizon</h3>
                        <p>
                            We maintain a baseline of <strong>1991–2021</strong> (30 years) for climate normals. Our daily flight analysis uses a <strong>2025/2026 scheduling window</strong> to reflect post-pandemic travel connectivity accurately.
                        </p>
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
                            Traditional weather sites show a single day's average. We use a <strong>±2 day Premium Rolling Window</strong>.
                        </p>
                        <p>
                            When you view <em>August 15th</em>, our engine analyzes <strong>150 distinct observations</strong> (30 years × 5-day window). This eliminates "statistical flukes" and provides a smoothed probability curve that more accurately reflects the likely experience for your travel week.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section id="metrics" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                <ChartBar className="w-5 h-5 text-violet-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">4. Weather Metrics & Thresholds</h2>
                        </div>

                        <div className="bg-stone-100 border-l-4 border-stone-800 p-6 my-6">
                            <h4 className="mt-0 font-bold uppercase tracking-tight">The 2.5mm "Rain Rule"</h4>
                            <p className="text-sm mb-0">
                                Most weather sites count 0.1mm (a single drop) as a "rainy day." 30YearWeather uses a strict <strong>2.5mm threshold</strong> for probability. Why? Because 0.1mm doesn't ruin a wedding or a city tour. 2.5mm is the point where you actually need an umbrella or indoor alternatives. This results in "higher quality" rain probabilities.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Thermometer className="w-4 h-4 text-orange-500" />
                                    <strong>Max/Min Temp</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">The 30-year average of daily highs and lows. We also track standard deviation to flag "Volatile" days.</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-stone-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CloudRain className="w-4 h-4 text-blue-500" />
                                    <strong>Cloud Proxy</strong>
                                </div>
                                <p className="text-sm text-stone-600 m-0">Calculated via Solar Irradiance. High irradiance indicates clear skies; low values suggest frequent overcast conditions.</p>
                            </div>
                        </div>
                    </section>

                    {/* NEW SECTION 5: TRAVEL INTELLIGENCE */}
                    <section id="travel-logic" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Plane className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">5. Travel Intelligence (Flights)</h2>
                        </div>
                        <p>
                            Our "Flight Pressure" score is a unique metric that calculates how "crowded" a city is likely to be based on air traffic capacity.
                        </p>
                        <ul>
                            <li><strong>Methodology:</strong> We sample 12 months of scheduled arrival data for the city's primary ICAO airport.</li>
                            <li><strong>Daily Arrivals:</strong> We count all commercial flight slots (including code-shares). A "Typical Day" arrival count shows the number of landing slots available for passengers.</li>
                            <li><strong>Pressure Index (0-100):</strong> A weighted score comparing the city's monthly peak traffic to its annual baseline. A score of 90+ indicates a city at maximum tourism capacity.</li>
                            <li><strong>Top Routes:</strong> Extracted from live global schedules, showing where the majority of visitors are arriving from.</li>
                        </ul>
                    </section>

                    {/* NEW SECTION 6: HEALTH */}
                    <section id="health-prep" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">6. Health & Safety Analytics</h2>
                        </div>
                        <p>
                            International travel requires more than just checking the temperature. We integrate the latest health data from the <strong>CDC</strong>:
                        </p>
                        <ul>
                            <li><strong>Mandatory Pass:</strong> We flag vaccines required by law for entry into the destination country.</li>
                            <li><strong>Precautionary Tier:</strong> We separate diseases into "Routine," "Recommended for Most," and "Selective" (e.g., for rural travelers) to avoid unnecessary alarm.</li>
                            <li><strong>Notice Level:</strong> Any active CDC health notices (Level 1-4) are visually prioritized at the top of the Health dedicated page.</li>
                        </ul>
                    </section>

                    {/* NEW SECTION 7: SOLAR/LUNAR */}
                    <section id="lunar-solar" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center">
                                <Wind className="w-5 h-5 text-stone-900" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">7. Atmospheric & Solar Data</h2>
                        </div>
                        <p>
                            Understanding lighting and solar intensity is vital for photography and event planning:
                        </p>
                        <ul>
                            <li><strong>UV Index Forecast:</strong> Calculated based on historical ozone levels and solar angle at solar noon.</li>
                            <li><strong>Magic Hour:</strong> We precisely calculate Golden Hour and Blue Hour windows based on the city's exact latitude/longitude for every day of the year.</li>
                            <li><strong>Tide & Marine (Alpha):</strong> For coastal cities, we provide average sea temperatures based on the <em>ERA5-Land</em> reanalysis dataset.</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section id="scoring" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center">
                                <GitBranch className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">8. Wedding & Event Scoring</h2>
                        </div>
                        <p>
                            The <strong>30Year Score™</strong> is a composite weighted index designed to predict "outdoor event viability":
                        </p>

                        <div className="bg-stone-900 text-white rounded-xl p-8 my-6 shadow-xl">
                            <h4 className="font-bold mb-4 text-orange-400">The "Goldilocks" Logic</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold uppercase tracking-widest text-stone-400 text-center">
                                <div><div className="text-2xl text-white mb-1">40%</div>Rain Risk</div>
                                <div><div className="text-2xl text-white mb-1">30%</div>Temp Range</div>
                                <div><div className="text-2xl text-white mb-1">20%</div>Humidity</div>
                                <div><div className="text-2xl text-white mb-1">10%</div>Wind Gusts</div>
                            </div>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section id="limitations" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">9. Limitations & Caveats</h2>
                        </div>
                        <ul>
                            <li><strong>Historic Trends:</strong> We show historic norms; they do not account for one-off climate anomalies (heatwaves, rare hurricanes).</li>
                            <li><strong>Airport Proxy:</strong> Flight data is based on the primary commercial airport. Smaller charter fields are not included.</li>
                            <li><strong>CDC Scope:</strong> Medical data focuses on global travelers from a US-baseline perspective as per CDC. Safe travel always requires individual physician consultation.</li>
                        </ul>
                    </section>

                    {/* Section 10 */}
                    <section id="updates" className="mb-16">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-stone-200 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-stone-600" />
                            </div>
                            <h2 className="text-2xl font-bold m-0">10. Data Updates</h2>
                        </div>
                        <ul>
                            <li><strong>Health Notices:</strong> Updated weekly via the ETL pipeline.</li>
                            <li><strong>Flight Schedules:</strong> Refreshed quarterly to reflect updated airline routes.</li>
                            <li><strong>Weather Normals:</strong> Re-processed annually as new years of satellite data are finalized by NASA.</li>
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
