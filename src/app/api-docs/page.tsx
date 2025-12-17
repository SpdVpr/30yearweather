
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Terminal, Code, Database, Globe } from "lucide-react";

export const metadata = {
    title: "Weather API Documentation | 30YearWeather",
    description: "Free historical weather API for developers and AI agents. Access 30 years of climate data for 100+ cities.",
};

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-orange-100 selection:text-orange-900">
            {/* Header / Nav */}
            <nav className="bg-white border-b border-stone-200 py-4 px-6 md:px-12 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="font-bold font-serif text-xl">30YearWeather API</div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-stone-900 text-white py-20 px-6 md:px-12">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-bold uppercase tracking-widest mb-6">
                        <Terminal className="w-3 h-3" />
                        Beta Access
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Historical Weather for<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-400">AI Agents & Developers</span>
                    </h1>
                    <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
                        Stop guessing with 7-day forecasts. Build travel apps, wedding planners, and AI agents with
                        reliable 30-year climate baselines.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="#endpoints" className="px-8 py-3 bg-white text-stone-900 font-bold rounded-lg hover:bg-stone-100 transition-colors">
                            View Endpoints
                        </a>
                        <a href="#pricing" className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg border border-white/10 hover:bg-white/20 transition-colors">
                            Pricing & Limits
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Navigation */}
                <aside className="hidden lg:block lg:col-span-1 sticky top-24 h-fit">
                    <div className="space-y-1 border-l border-stone-200 pl-4">
                        <a href="#introduction" className="block py-2 text-sm font-bold text-orange-600 border-l-2 border-orange-600 -ml-4.5 pl-4">Introduction</a>
                        <a href="#authentication" className="block py-2 text-sm text-stone-500 hover:text-stone-900">Authentication</a>
                        <a href="#endpoints" className="block py-2 text-sm text-stone-500 hover:text-stone-900">Endpoints</a>
                        <div className="pl-4 space-y-1">
                            <a href="#get-city" className="block py-1 text-xs text-stone-400 hover:text-stone-700">GET /city/:slug</a>
                            <a href="#search" className="block py-1 text-xs text-stone-400 hover:text-stone-700">GET /search</a>
                        </div>
                        <a href="#pricing" className="block py-2 text-sm text-stone-500 hover:text-stone-900">Pricing</a>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-16">

                    {/* Introduction */}
                    <section id="introduction">
                        <h2 className="text-3xl font-serif font-bold mb-4">Introduction</h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            The 30YearWeather API provides aggregated historical weather data derived from NASA POWER satellite observations (1994-2024).
                            Unlike standard forecast APIs that predict the next 14 days, our API tells you what the weather is <strong>statistically likely</strong> to be on any day of the year.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm">
                                <Database className="w-8 h-8 text-blue-500 mb-4" />
                                <h3 className="font-bold mb-2">30-Year Baseline</h3>
                                <p className="text-sm text-stone-500">Averages, extremes, and probabilities calculated from 3 decades of data.</p>
                            </div>
                            <div className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm">
                                <Globe className="w-8 h-8 text-emerald-500 mb-4" />
                                <h3 className="font-bold mb-2">Global Coverage</h3>
                                <p className="text-sm text-stone-500">Currently covering 40+ major tourist destinations, expanding weekly.</p>
                            </div>
                            <div className="p-6 bg-white rounded-xl border border-stone-100 shadow-sm">
                                <Code className="w-8 h-8 text-purple-500 mb-4" />
                                <h3 className="font-bold mb-2">Rich Daily Context</h3>
                                <p className="text-sm text-stone-500">Includes Health (Migraine/Joint Pain), Marine (Water Temp/Waves), and Activity Scores.</p>
                            </div>
                        </div>
                    </section>

                    {/* Authentication */}
                    <section id="authentication">
                        <h2 className="text-3xl font-serif font-bold mb-4">Authentication</h2>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                            <h3 className="text-amber-800 font-bold mb-2">Public Beta (No Key Required)</h3>
                            <p className="text-amber-700 text-sm mb-4">
                                Currently, the API is in public beta. You do not need an API key for low-volume testing (under 1,000 requests/day).
                            </p>
                            <p className="text-amber-700 text-sm">
                                <strong>Requirement:</strong> You must provide attribution by linking back to <a href="https://30yearweather.com" className="underline font-bold">30YearWeather.com</a> on any page or app where this data is used.
                            </p>
                        </div>
                    </section>

                    {/* Endpoints */}
                    <section id="endpoints">
                        <h2 className="text-3xl font-serif font-bold mb-8">Endpoints</h2>

                        {/* Endpoint 1: City Details */}
                        <div id="get-city" className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded text-sm font-mono">GET</span>
                                <code className="text-lg font-mono font-bold">/api/v1/city/:slug</code>
                            </div>
                            <p className="text-stone-600 mb-4">Returns a comprehensive climate summary for a specific city, including best months to visit, safety profile, and monthly averages.</p>

                            <div className="bg-stone-900 rounded-lg overflow-hidden shadow-xl my-6">
                                <div className="flex items-center justify-between px-4 py-2 bg-stone-800 border-b border-stone-700">
                                    <span className="text-xs text-stone-400 font-mono">Example Request</span>
                                    <span className="text-xs text-emerald-400">curl</span>
                                </div>
                                <div className="p-4 font-mono text-sm text-stone-300 overflow-x-auto">
                                    curl "https://30yearweather.com/api/v1/city/prague-cz?minified=false"
                                </div>
                            </div>

                            <p className="text-xs text-stone-500 italic mb-2">Note: Use <code>?minified=true</code> to exclude daily data for lighter payloads.</p>

                            <h4 className="font-bold mb-2 text-sm uppercase tracking-wide text-stone-500">Response Example</h4>
                            <pre className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs overflow-x-auto font-mono text-stone-800 max-h-80 overflow-y-auto">
                                {`{
  "name": "Prague",
  "country": "Czech Republic",
  "summary": { ... },
  "daily_forecast": {
    "05-11": {
      "stats": {
        "temp_max": 18.5,
        "precip_prob": 12,
        "wind_kmh": 14,
        ...
      },
      "scores": {
        "wedding": 85,
        "stargazing": 60,
        ...
      },
      "calculated_metrics": {
          "health_score": 85,
          "verdict": "Excellent",
          "marine_status": "N/A"
      },
      "health_impact": {
        "migraine_risk": "Low",
        "joint_pain_risk": "Low"
      }
    },
    ... (365 days)
  }
}`}
                            </pre>
                        </div>

                        {/* Endpoint 2: Search */}
                        <div id="search">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded text-sm font-mono">GET</span>
                                <code className="text-lg font-mono font-bold">/api/v1/search</code>
                            </div>
                            <p className="text-stone-600 mb-4">Find destinations that match specific climate criteria (e.g., "Where is it warm in May?").</p>

                            <h4 className="font-bold mb-2 text-sm uppercase tracking-wide text-stone-500">Query Parameters</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left mb-6 border-collapse">
                                    <thead className="bg-stone-100 text-stone-700">
                                        <tr>
                                            <th className="p-3 border border-stone-200">Parameter</th>
                                            <th className="p-3 border border-stone-200">Type</th>
                                            <th className="p-3 border border-stone-200">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border border-stone-200 font-mono text-orange-600">month</td>
                                            <td className="p-3 border border-stone-200">number (1-12)</td>
                                            <td className="p-3 border border-stone-200">Required. The month to filter by.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-stone-200 font-mono text-orange-600">min_temp</td>
                                            <td className="p-3 border border-stone-200">number</td>
                                            <td className="p-3 border border-stone-200">Minimum average daily high temperature (°C).</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-stone-200 font-mono text-orange-600">max_rain_prob</td>
                                            <td className="p-3 border border-stone-200">number</td>
                                            <td className="p-3 border border-stone-200">Maximum acceptable rain probability (%).</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="bg-stone-900 rounded-lg overflow-hidden shadow-xl mb-6">
                                <div className="flex items-center justify-between px-4 py-2 bg-stone-800 border-b border-stone-700">
                                    <span className="text-xs text-stone-400 font-mono">Example: "Warm places in May"</span>
                                </div>
                                <div className="p-4 font-mono text-sm text-stone-300 overflow-x-auto">
                                    curl "https://30yearweather.com/api/v1/search?month=5&min_temp=20&max_rain_prob=30"
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing">
                        <h2 className="text-3xl font-serif font-bold mb-6">Pricing & Plans</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Free Tier */}
                            <div className="border-2 border-orange-500 rounded-2xl p-8 bg-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">CURRENTLY ACTIVE</div>
                                <h3 className="text-2xl font-bold mb-2">Hobby / Beta</h3>
                                <div className="text-4xl font-bold mb-6">$0<span className="text-base font-normal text-stone-500">/mo</span></div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm text-stone-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Up to 1,000 requests / day
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-stone-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Rate limited (30 req / min)
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-stone-700">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        Attribution Required
                                    </li>
                                </ul>
                                <button className="w-full py-3 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-200 cursor-default">
                                    Active by Default
                                </button>
                            </div>

                            {/* Pro Tier (Coming Soon) */}
                            <div className="border border-stone-200 rounded-2xl p-8 bg-stone-50 opacity-75 grayscale hover:grayscale-0 transition-all">
                                <h3 className="text-2xl font-bold mb-2">Pro API</h3>
                                <div className="text-4xl font-bold mb-6 text-stone-400">TBD</div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2 text-sm text-stone-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                        Commercial License
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-stone-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                        No Rate Limits
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-stone-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                                        Priority Support
                                    </li>
                                </ul>
                                <button className="w-full py-3 rounded-lg bg-stone-200 text-stone-500 font-bold cursor-not-allowed">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
