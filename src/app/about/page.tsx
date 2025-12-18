import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Database, Satellite, Calculator, CheckCircle2, Users, Target, Zap } from "lucide-react";
import type { Metadata } from 'next';
import Header from "@/components/common/Header";

export const metadata: Metadata = {
    title: "About Us | 30YearWeather - Long-Range Weather Intelligence",
    description: "Learn about 30YearWeather.com, our mission to provide accurate long-range weather forecasts based on 30 years of NASA satellite data for travel and event planning.",
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: "About 30YearWeather | Weather Intelligence Platform",
        description: "Discover how we use 30 years of NASA satellite data to help you plan weddings, vacations, and events with confidence.",
    },
};

export default function AboutPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About 30YearWeather",
        "description": "Long-range weather forecasts based on 30 years of NASA satellite data",
        "mainEntity": {
            "@type": "Organization",
            "name": "30YearWeather",
            "url": "https://30yearweather.com",
            "foundingDate": "2024",
            "founder": {
                "@type": "Person",
                "name": "Michal Vesecký",
                "jobTitle": "Founder & Lead Developer"
            },
            "description": "Weather intelligence platform providing 365-day forecasts based on 30 years of historical NASA data",
            "knowsAbout": ["Weather Forecasting", "Climate Data Analysis", "Travel Planning", "Event Planning"],
            "areaServed": "Worldwide"
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Header
                breadcrumb={{
                    label: "About 30YearWeather",
                    href: "/",
                    sublabel: "Our Story & Mission"
                }}
            />

            <div className="pt-16">
                {/* Secondary navigation if needed, or just content */}
            </div>

            <main className="max-w-6xl mx-auto px-6 py-16">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <span className="inline-block py-1.5 px-4 mb-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest">
                        About Us
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">
                        Weather Intelligence for <br className="hidden md:block" />
                        <span className="text-orange-600">Life's Important Moments</span>
                    </h1>
                    <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                        We transform 30 years of NASA satellite data into actionable weather insights,
                        helping you plan weddings, vacations, and events with unprecedented confidence.
                    </p>
                </div>

                {/* Mission Section */}
                <section className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">Our Mission</h2>
                            <p className="text-stone-600 leading-relaxed mb-4">
                                Traditional weather forecasts are only reliable for 7-10 days. But life's biggest moments —
                                weddings, destination trips, outdoor festivals — are planned months or even years in advance.
                            </p>
                            <p className="text-stone-600 leading-relaxed mb-4">
                                <strong>That's where we come in.</strong> Instead of trying to predict the unpredictable,
                                we show you what the weather has actually been like on your chosen date over the past 30 years.
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                Our approach is simple: <em>Historical patterns are more reliable than speculative forecasts.</em>
                                If it rained on June 15th in Prague 12 out of 30 years, you have a 40% rain probability —
                                a fact, not a guess.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-4">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">30</div>
                                    <div className="text-sm text-stone-600">Years of Data</div>
                                </div>
                                <div className="text-center p-4">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">84+</div>
                                    <div className="text-sm text-stone-600">Cities Worldwide</div>
                                </div>
                                <div className="text-center p-4">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">30K+</div>
                                    <div className="text-sm text-stone-600">Pages of Data</div>
                                </div>
                                <div className="text-center p-4">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">366</div>
                                    <div className="text-sm text-stone-600">Days per City</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who We Serve */}
                <section className="mb-20">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center">Who We Help</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Wedding Planners</h3>
                            <p className="text-stone-600 text-sm">
                                Find the perfect outdoor wedding date with the lowest rain probability.
                                See exact percentages for every day of the year.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Travelers</h3>
                            <p className="text-stone-600 text-sm">
                                Avoid monsoon seasons and tourist crowds. Know exactly what weather
                                to expect before you book flights and hotels.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 mb-2">Event Organizers</h3>
                            <p className="text-stone-600 text-sm">
                                Plan festivals, concerts, sports events, and corporate retreats
                                with weather data you can trust.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Data */}
                <section className="mb-20 bg-stone-900 text-white rounded-2xl p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold mb-4">Powered by NASA</h2>
                        <p className="text-stone-400 max-w-2xl mx-auto">
                            All our weather data comes from the NASA POWER Project —
                            the same satellite observation system used by researchers and governments worldwide.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <Satellite className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Satellite Data</h3>
                            <p className="text-stone-400 text-sm">
                                Real observations from space, not weather station estimates
                            </p>
                        </div>
                        <div className="text-center">
                            <Database className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">30 Year Range</h3>
                            <p className="text-stone-400 text-sm">
                                1991-2021 dataset for statistically significant patterns
                            </p>
                        </div>
                        <div className="text-center">
                            <Calculator className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                            <h3 className="font-bold mb-2">Smart Averaging</h3>
                            <p className="text-stone-400 text-sm">
                                Rolling window algorithm smooths daily anomalies
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Team */}
                <section className="mb-20">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8 text-center">The Creator</h2>
                    <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 border border-stone-200 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                MV
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold text-stone-900">Michal Vesecký</h3>
                                <p className="text-orange-600 font-medium mb-2">Founder & Developer</p>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    Based in Prague, Czech Republic. Passionate about making data accessible
                                    and helping people make better decisions for life's important moments.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-12 border border-orange-100">
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Start Planning with Confidence</h2>
                    <p className="text-stone-600 mb-8 max-w-xl mx-auto">
                        Explore 84+ cities and find the perfect date for your wedding, vacation, or event.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors"
                    >
                        Explore Destinations
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}
