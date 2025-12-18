
import { getCityData } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import MonthCalendarView from "@/components/MonthCalendarView";
import DatePageTracker from "@/components/DatePageTracker";
import { Card, Text, Title, Grid, Col } from "@tremor/react";
import { ArrowLeft, Thermometer, CloudRain, Sun, Calendar, Info } from "lucide-react";
import type { Metadata } from 'next';

// Helper for month mapping
const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: { city: string; month: string } }): Promise<Metadata> {
    const { city, month } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];

    if (!monthNum) return { title: 'Month not found' };

    const data = await getCityData(city);
    if (!data) return { title: 'City not found' };

    const cityName = data.meta.name;
    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);

    // Aggregation for metadata
    let totalMax = 0;
    let totalRain = 0;
    let count = 0;
    Object.entries(data.days).forEach(([key, day]: [string, any]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalRain += day.stats.precip_prob;
            count++;
        }
    });

    const avgMax = count ? Math.round(totalMax / count) : 0;
    const avgRain = count ? Math.round(totalRain / count) : 0;

    return {
        title: `${cityName} ${monthDisplay} Weather Forecast | ${avgMax}°C, ${avgRain}% Rain | 30 Years NASA Data`,
        description: `Planning to visit ${cityName} in ${monthDisplay}? Historical weather data shows average highs of ${avgMax}°C and ${avgRain}% precipitation risk. Explore daily 30-year averages.`,
        keywords: [`${cityName} in ${monthLower}`, `${cityName} weather ${monthLower}`, `visiting ${cityName} in ${monthLower}`, `what to wear in ${cityName} in ${monthLower}`]
    };
}

export default async function CityMonthPage({ params }: { params: { city: string; month: string } }) {
    const { city, month } = params;
    const monthLower = month.toLowerCase();

    // Validate month
    const monthNum = MONTH_MAP[monthLower];
    if (!monthNum) {
        notFound();
    }

    const data = await getCityData(city);
    if (!data) notFound();

    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    const cityName = data.meta.name;

    // --- Statistics Aggregation ---
    let totalMax = 0;
    let totalMin = 0;
    let totalRainProb = 0;
    let rainyDays25 = 0; // chance > 25%
    let rainyDays50 = 0; // chance > 50%
    let daysCount = 0;
    let sunniestDay = { prob: 0, day: 0 }; // lowest rain prob

    Object.entries(data.days).forEach(([key, day]) => {
        if (key.startsWith(monthNum + "-")) {
            totalMax += day.stats.temp_max;
            totalMin += day.stats.temp_min;
            totalRainProb += day.stats.precip_prob;
            if (day.stats.precip_prob > 25) rainyDays25++;
            if (day.stats.precip_prob > 50) rainyDays50++;
            daysCount++;
        }
    });

    const avgMax = Math.round(totalMax / daysCount);
    const avgMin = Math.round(totalMin / daysCount);
    const avgRainProb = Math.round(totalRainProb / daysCount);

    // Dynamic Text Generation
    const getSeasonContext = () => {
        const m = parseInt(monthNum);
        if (m >= 12 || m <= 2) return "Winter";
        if (m >= 3 && m <= 5) return "Spring";
        if (m >= 6 && m <= 8) return "Summer";
        return "Autumn";
    };
    const season = getSeasonContext();

    const getVerdict = () => {
        if (avgRainProb > 40) return ["Wet Season", "bg-blue-100 text-blue-800"];
        if (avgMax < 10) return ["Chilly & Crisp", "bg-cyan-100 text-cyan-800"];
        if (avgMax > 25) return ["Warm & Sunny", "bg-orange-100 text-orange-800"];
        return ["Mild & Pleasant", "bg-emerald-100 text-emerald-800"];
    };
    const [verdictText, verdictClass] = getVerdict();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <DatePageTracker cityName={data.meta.name} date={monthDisplay} />

            {/* Navbar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/${city}`} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">
                                {cityName} in {monthDisplay}
                            </h1>
                            <span className="text-xs text-slate-500 font-medium">Historical Weather Guide</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${verdictClass}`}>
                        {verdictText}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

                {/* 1. KEY STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Temperature */}
                    <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                <Thermometer className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Temperature</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-slate-800">{avgMax}°</span>
                            <span className="text-lg text-slate-500 mb-1">/ {avgMin}°</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                            Average daytime high vs nighttime low.
                        </p>
                    </Card>

                    {/* Rain */}
                    <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <CloudRain className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Precipitation</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-slate-800">{Math.round((rainyDays25 / daysCount) * 30)}</span>
                            <span className="text-lg text-slate-500 mb-1">days</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                            Days with significant rainfall (&gt;25% chance).
                        </p>
                    </Card>

                    {/* Verdict/Pack */}
                    <Card className="ring-1 ring-slate-200 shadow-sm p-6 bg-gradient-to-br from-white to-slate-50">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <Info className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Travel Advice</span>
                        </div>
                        <p className="font-medium text-slate-800 text-lg leading-snug">
                            {avgRainProb < 20
                                ? "Pack light! It's mostly dry."
                                : avgRainProb < 50
                                    ? "Pack a mix: sun & light rain gear."
                                    : "Bring a raincoat & umbrella."}
                        </p>
                        <p className="text-sm text-slate-600 mt-2">
                            {season} season in {cityName}.
                            {avgMax > 28 ? " Heat warnings possible." : ""}
                        </p>
                    </Card>
                </div>

                {/* 2. INTRO TEXT (SEO) */}
                <div className="mb-12 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Is {monthDisplay} a good time to visit {cityName}?</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Based on our analysis of 30 years of historical weather data, <strong>{monthDisplay}</strong> in {cityName} is characterized by
                        avg highs of <strong>{avgMax}°C</strong>.
                        {rainyDays50 > 5
                            ? ` Be prepared for some wet days, as there are typically around ${Math.round((rainyDays50 / daysCount) * 30)} days with high rain probability.`
                            : " It is a relatively dry month, perfect for outdoor exploration."}
                    </p>
                </div>

                {/* 3. CALENDAR VIEW */}
                <div id="calendar-view" className="scroll-mt-24">
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-xl font-bold text-slate-800">Daily Forecast for {monthDisplay}</h2>
                    </div>
                    {/* The specialized calendar component */}
                    <MonthCalendarView city={city} month={monthNum} data={data} />
                </div>

                {/* 4. FAQ (Structured Data Candidate) */}
                <div className="mt-16 border-t border-slate-200 pt-12">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequent Questions about {monthDisplay}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">How cold is {cityName} in {monthDisplay}?</h3>
                            <p className="text-slate-600 text-sm">Nights can drop to {avgMin}°C, while days average around {avgMax}°C. {avgMin < 5 ? "It gets quite cold, bring layers." : "It stays relatively mild."}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 mb-2">Does it rain a lot in {cityName}?</h3>
                            <p className="text-slate-600 text-sm">In {monthDisplay}, the average chance of rain on any given day is {avgRainProb}%. You can expect about {Math.round((rainyDays50 / daysCount) * 30)} rainy days throughout the month.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
