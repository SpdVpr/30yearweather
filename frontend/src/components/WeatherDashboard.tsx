"use client";
import { useState, useEffect } from "react"; // NEW
import { Card, AreaChart, Title, BarChart } from "@tremor/react";
import StatCard from "./StatCard";
import SmartSuitcase from "./SmartSuitcase";
import HistoricalRecords from "./HistoricalRecords";
import AstronomyCard from "./AstronomyCard";
import ExtremesCard from "./ExtremesCard";
import TourismScoreCard from "./TourismScoreCard";
import { Sun, CloudRain, Wind, Thermometer, Cloud, Heart } from "lucide-react";
import { DayData } from "@/lib/data";
import { calculateTourismScores, fetchTourismData, TourismDataset, getTourismInsights, getTourismAttribution } from "@/lib/tourism"; // NEW imports

interface WeatherDashboardProps {
    dayData: DayData;
    lat: number;
    lon: number;
    dateId: string;
    citySlug: string; // NEW prop
}

export default function WeatherDashboard({ dayData, lat, lon, dateId, citySlug }: WeatherDashboardProps) {
    const { stats, scores, clothing, historical_records } = dayData;

    // NEW: Fetch Tourism Data
    const [tourismData, setTourismData] = useState<TourismDataset | null>(null);

    useEffect(() => {
        if (citySlug) {
            fetchTourismData(citySlug).then(setTourismData);
        }
    }, [citySlug]);

    // Calculate scores with real data (if available)
    const tourismScores = calculateTourismScores(dayData, dateId, tourismData);

    // Get monthly insights
    const month = parseInt(dateId.split('-')[0]);
    const tourismInsights = getTourismInsights(tourismData, month);
    const tourismAttribution = getTourismAttribution(tourismData);

    // Transform ACTUAL historical records for the chart
    // This ensures we are visualizing real data from the JSON/Firebase source
    const chartData = historical_records
        ? historical_records.map(r => ({
            Year: r.year.toString(),
            "Max Temp": r.temp_max,
            "Min Temp": r.temp_min
        })).reverse()
        : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

            {/* 1. Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Avg High"
                    value={`${stats.temp_max}°C`}
                    icon={<Thermometer className="w-5 h-5 text-rose-500" />}
                    color="rose"
                    delay={1}
                />
                <StatCard
                    title="Rain Probability"
                    value={`${stats.precip_prob}%`}
                    subtext={`${stats.precip_mm}mm avg amount`}
                    icon={<CloudRain className="w-5 h-5 text-blue-500" />}
                    color="blue"
                    delay={2}
                />
                <StatCard
                    title="Cloud Cover"
                    value={`${stats.clouds_percent}%`}
                    icon={<Cloud className="w-5 h-5 text-slate-500" />}
                    delay={3}
                />
                <StatCard
                    title="Wind Speed"
                    value={`${stats.wind_kmh} km/h`}
                    icon={<Wind className="w-5 h-5 text-slate-500" />}
                    delay={4}
                />
            </div>

            {/* 2. Detailed Insights Grid (NEW) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Astronomy / Sun Cycle - Now full width in this row or spanning */}
                <div className="md:col-span-2">
                    <AstronomyCard date={dateId} lat={lat} lon={lon} />
                </div>
                {/* AI Tourism Intelligence - Replaces previous placeholder */}
                <div className="md:col-span-1">
                    <TourismScoreCard
                        scores={tourismScores}
                        insights={tourismInsights}
                        attribution={tourismAttribution}
                    />
                </div>
            </div>

            {/* 3. Main Visualizations & Suitcase */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Temperature Trend Chart */}
                    <Card className="p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
                        <Title>Temperature History (Last 10 Years)</Title>
                        <div className="mt-4">
                            <AreaChart
                                className="h-72 mt-4"
                                data={chartData}
                                index="Year"
                                categories={["Max Temp", "Min Temp"]}
                                colors={["orange", "blue"]}
                                valueFormatter={(number) => `${number}°C`}
                                showAnimation={true}
                            />
                        </div>
                    </Card>

                    {/* Historical Data Table */}
                    {historical_records && <HistoricalRecords records={historical_records} />}
                </div>

                {/* Right Column: Suitcase & Wedding Score (1/3 width) */}
                <div className="space-y-6">

                    {/* Wedding Score (Demoted to side card) */}
                    <StatCard
                        title="Wedding Index"
                        value={`${scores.wedding}/100`}
                        subtext="Based on rain, temp & wind stability"
                        icon={<Heart className="w-5 h-5 text-rose-500" />}
                        color="rose"
                        delay={5}
                    />

                    {/* Reliability Score */}
                    <StatCard
                        title="Weather Reliability"
                        value={`${scores.reliability}/100`}
                        subtext="Consistency year-over-year"
                        icon={<Sun className="w-5 h-5 text-amber-500" />}
                        color="amber"
                        delay={6}
                    />

                    {/* Events & Holidays */}
                    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-xs font-medium uppercase tracking-wide opacity-70 mb-4 text-indigo-900">
                            Events & Holidays
                        </h3>
                        {dayData.events && dayData.events.length > 0 ? (
                            <div className="space-y-3">
                                {dayData.events.map((event, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg text-indigo-900">
                                        <div className="mt-0.5">🎉</div>
                                        <span className="font-medium text-sm">{event.description}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-gray-500">
                                <div className="opacity-50">📅</div>
                                <span className="text-sm">No public holidays expected</span>
                            </div>
                        )}
                    </div>

                    {/* Smart Suitcase */}
                    <SmartSuitcase clothing={clothing} />

                    {/* Hall of Fame (Extremes) - Moved to sidebar */}
                    {historical_records && (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-900">Weather Records</h3>
                                <p className="text-xs text-gray-500">Extreme measurements</p>
                            </div>
                            <ExtremesCard records={historical_records} />
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
}
