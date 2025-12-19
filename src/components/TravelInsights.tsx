"use client";

import { Card, Badge, ProgressBar } from "@tremor/react";
import { Plane, Stethoscope, MapPin, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FlightInfo {
    source: string;
    peak_daily_arrivals?: number;
    pressure_score: number;
    seasonality?: Record<number, number>;
    top_routes?: string[];
    delays?: {
        median_delay?: string;
        delay_index?: string;
    };
    icao?: string;
}

interface HealthInfo {
    source: string;
    vaccines: Array<{ disease: string; recommendation: string }>;
    non_vaccine_diseases?: Array<{ disease: string; advice: string }>;
}

interface TravelInsightsProps {
    cityName: string;
    citySlug: string;
    flightInfo?: FlightInfo | null;
    healthInfo?: HealthInfo | null;
}

// Month names for seasonality chart
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TravelInsights({ cityName, citySlug, flightInfo, healthInfo }: TravelInsightsProps) {
    // If no data at all, don't render
    if (!flightInfo && !healthInfo) {
        return null;
    }

    // Calculate pressure label
    const getPressureLabel = (score: number) => {
        if (score >= 80) return { label: "Major Hub", color: "red" };
        if (score >= 60) return { label: "Well Connected", color: "orange" };
        if (score >= 40) return { label: "Moderate Traffic", color: "yellow" };
        if (score >= 20) return { label: "Low Traffic", color: "emerald" };
        return { label: "Remote Destination", color: "cyan" };
    };

    // Get peak month from seasonality
    const getPeakMonth = (seasonality?: Record<number, number>) => {
        if (!seasonality) return null;
        const entries = Object.entries(seasonality);
        if (entries.length === 0) return null;
        const peak = entries.reduce((a, b) => (Number(a[1]) > Number(b[1]) ? a : b));
        return { month: MONTH_NAMES[Number(peak[0]) - 1], count: peak[1] };
    };

    const pressureInfo = flightInfo ? getPressureLabel(flightInfo.pressure_score) : null;
    const peakMonth = flightInfo?.seasonality ? getPeakMonth(flightInfo.seasonality) : null;

    return (
        <div className="mt-16 space-y-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-500 rounded-xl shadow-lg">
                    <Plane className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900">Travel Intelligence</h2>
                    <p className="text-sm text-stone-500">Exclusive data powered by flight analytics & CDC health advisories</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Flight Connectivity Card */}
                {flightInfo && (
                    <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-white to-stone-50 border-stone-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Plane className="w-5 h-5 text-blue-600" />
                                <h3 className="font-bold text-stone-900">Flight Connectivity</h3>
                            </div>
                            {pressureInfo && (
                                <Badge color={pressureInfo.color as any} size="lg">
                                    {pressureInfo.label}
                                </Badge>
                            )}
                        </div>

                        {/* Pressure Score */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-stone-500">Traffic Pressure Index</span>
                                <span className="font-bold text-lg text-stone-900">{flightInfo.pressure_score}/100</span>
                            </div>
                            <ProgressBar
                                value={flightInfo.pressure_score}
                                color={pressureInfo?.color as any || "blue"}
                                className="h-2"
                            />
                            {flightInfo.peak_daily_arrivals && (
                                <p className="text-xs text-stone-400 mt-1">
                                    ~{flightInfo.peak_daily_arrivals.toLocaleString()} landing slots on peak month's typical day
                                </p>
                            )}
                        </div>

                        {/* Seasonality Mini Chart */}
                        {flightInfo.seasonality && Object.keys(flightInfo.seasonality).length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-stone-700 mb-3">Landing Slots Pattern</h4>
                                <div className="flex items-end justify-between gap-1" style={{ height: '100px' }}>
                                    {MONTH_NAMES.map((month, idx) => {
                                        const value = flightInfo.seasonality?.[idx + 1] || 0;
                                        const maxValue = Math.max(...Object.values(flightInfo.seasonality || {}));
                                        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                                        const isPeak = peakMonth?.month === month;

                                        // Color based on traffic level
                                        const ratio = maxValue > 0 ? value / maxValue : 0;
                                        let barColor = 'bg-emerald-400'; // Low
                                        if (ratio >= 0.85) barColor = 'bg-red-500'; // Peak
                                        else if (ratio >= 0.6) barColor = 'bg-orange-500'; // High
                                        else if (ratio >= 0.4) barColor = 'bg-yellow-400'; // Shoulder
                                        else if (ratio >= 0.2) barColor = 'bg-emerald-400'; // Low
                                        else barColor = 'bg-cyan-300'; // Off-peak

                                        return (
                                            <div key={month} className="flex flex-col items-center flex-1 gap-1" title={`${month}: ${value} slots/day`}>
                                                {/* Value label above bar */}
                                                <span className={`text-[9px] font-medium ${isPeak ? 'text-orange-600 font-bold' : 'text-stone-500'}`}>
                                                    {value > 0 ? value : ''}
                                                </span>
                                                {/* Bar */}
                                                <div
                                                    className={`w-full rounded-t transition-all ${isPeak ? 'ring-2 ring-orange-500' : ''} ${barColor} hover:opacity-80`}
                                                    style={{ height: `${height}%`, minHeight: value > 0 ? '8px' : '0' }}
                                                />
                                                {/* Month label */}
                                                <span className="text-[10px] text-stone-400 mt-1">{month}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {peakMonth && (
                                    <p className="text-xs text-orange-600 mt-2 font-medium text-center">
                                        📈 Peak season: {peakMonth.month} (~{peakMonth.count.toLocaleString()} slots/day)
                                    </p>
                                )}
                                <p className="text-[10px] text-stone-300 mt-1 text-center">
                                    Slots/day • Based on mid-month sample data
                                </p>
                            </div>
                        )}

                        {/* Top Routes */}
                        {flightInfo.top_routes && flightInfo.top_routes.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium text-stone-700 mb-2">Key Connections</h4>
                                <div className="flex flex-wrap gap-2">
                                    {flightInfo.top_routes.slice(0, 5).map((route, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {route}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                )}

                {/* Health Advisory Card */}
                {healthInfo && (
                    <Card className="col-span-1 bg-gradient-to-br from-white to-emerald-50/30 border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Stethoscope className="w-5 h-5 text-emerald-600" />
                                <h3 className="font-bold text-stone-900">Health Advisory</h3>
                            </div>
                            <Link
                                href={`/${citySlug}/health`}
                                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                            >
                                View Details
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {healthInfo.vaccines.length > 0 ? (
                            <>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge color={healthInfo.vaccines.length > 5 ? "amber" : "emerald"}>
                                        {healthInfo.vaccines.length} Vaccines Recommended
                                    </Badge>
                                </div>

                                <ul className="space-y-2">
                                    {healthInfo.vaccines.slice(0, 4).map((vac, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-medium text-stone-800">{vac.disease}</span>
                                                {/* <p className="text-xs text-stone-500 line-clamp-1">{vac.recommendation}</p> */}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {healthInfo.vaccines.length > 4 && (
                                    <p className="text-xs text-stone-400 mt-3">
                                        +{healthInfo.vaccines.length - 4} more recommendations
                                    </p>
                                )}

                                <Link
                                    href={`/${citySlug}/health`}
                                    className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group"
                                >
                                    <span>See complete health guide</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <p className="text-xs text-stone-500 mt-2">
                                    Source: CDC Travelers' Health. Consult a physician 4-6 weeks before travel.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 text-emerald-700 mb-4">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">No special vaccinations required</span>
                                </div>

                                <Link
                                    href={`/${citySlug}/health`}
                                    className="mt-2 pt-3 border-t border-stone-100 flex items-center justify-between text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors group"
                                >
                                    <span>View complete health information</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}
