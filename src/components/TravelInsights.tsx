"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, TrendingUp, Calendar, Users } from "lucide-react";
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

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Animated Counter
const AnimatedNumber = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const stepTime = (duration * 1000) / end;
            const timer = setInterval(() => {
                start += 1;
                setDisplayValue(start);
                if (start >= end) clearInterval(timer);
            }, Math.max(stepTime, 20));
            return () => clearInterval(timer);
        }
    }, [isInView, value, duration]);

    return <span ref={ref}>{displayValue.toLocaleString()}</span>;
};

// Circular Gauge
const CircularGauge = ({ value, maxValue = 100, label }: { value: number; maxValue?: number; label: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const percentage = (value / maxValue) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div ref={ref} className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <motion.circle
                        cx="50" cy="50" r="45" fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={isInView ? { strokeDashoffset } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-stone-900">{value}</span>
                    <span className="text-[10px] text-stone-400">/ {maxValue}</span>
                </div>
            </div>
            <span className="mt-2 text-xs font-medium text-stone-600">{label}</span>
        </div>
    );
};

export default function TravelInsights({ cityName, citySlug, flightInfo, healthInfo }: TravelInsightsProps) {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    if (!flightInfo && !healthInfo) return null;

    const getPressureInfo = (score: number) => {
        if (score >= 80) return { label: "Major Hub", description: "Extremely busy airport" };
        if (score >= 60) return { label: "Well Connected", description: "Popular destination" };
        if (score >= 40) return { label: "Moderate", description: "Balanced traffic" };
        if (score >= 20) return { label: "Low Traffic", description: "Quieter airport" };
        return { label: "Remote", description: "Off the beaten path" };
    };

    const getSeasonalityInsights = (seasonality?: Record<number, number>) => {
        if (!seasonality) return null;
        const entries = Object.entries(seasonality).map(([k, v]) => ({ month: Number(k), value: v }));
        if (entries.length === 0) return null;
        const peak = entries.reduce((a, b) => a.value > b.value ? a : b);
        const low = entries.reduce((a, b) => a.value < b.value ? a : b);
        const maxValue = Math.max(...entries.map(e => e.value));
        return { peak, low, maxValue, entries };
    };

    const pressureInfo = flightInfo ? getPressureInfo(flightInfo.pressure_score) : null;
    const seasonalityInsights = flightInfo?.seasonality ? getSeasonalityInsights(flightInfo.seasonality) : null;

    return (
        <motion.section
            ref={sectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mt-16"
        >
            {/* Section Header - NO ICON */}
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-stone-900">Travel Intelligence</h2>
                <p className="text-stone-500 mt-1">Exclusive flight analytics & health data for {cityName}</p>
            </div>

            {/* Flight Analytics */}
            {flightInfo && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-6">
                    {/* Header - NEUTRAL */}
                    <div className="px-6 py-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Flight Connectivity Analysis</h3>
                            <p className="text-stone-500 text-xs">Airport traffic data & seasonal patterns</p>
                        </div>
                        <span className="px-3 py-1.5 bg-stone-200 rounded-full text-stone-700 text-sm font-semibold">
                            {pressureInfo?.label}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            {/* Left: Metrics */}
                            <div className="lg:col-span-3 space-y-6">
                                <div className="text-center">
                                    <CircularGauge value={flightInfo.pressure_score} label="Traffic Index" />
                                    <p className="text-xs text-stone-500 mt-2">{pressureInfo?.description}</p>
                                </div>

                                {flightInfo.peak_daily_arrivals && (
                                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Users className="w-4 h-4 text-blue-600" />
                                            <span className="text-xs font-medium text-stone-500">Peak Daily Arrivals</span>
                                        </div>
                                        <p className="text-2xl font-bold text-stone-900">
                                            <AnimatedNumber value={flightInfo.peak_daily_arrivals} />
                                        </p>
                                        <p className="text-xs text-stone-400">slots per day</p>
                                    </div>
                                )}

                                {seasonalityInsights && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                                            <TrendingUp className="w-3 h-3 text-stone-400 mb-1" />
                                            <p className="text-[10px] text-stone-400">Peak</p>
                                            <p className="font-bold text-stone-900 text-sm">{MONTH_NAMES[seasonalityInsights.peak.month - 1]}</p>
                                        </div>
                                        <div className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                                            <Calendar className="w-3 h-3 text-stone-400 mb-1" />
                                            <p className="text-[10px] text-stone-400">Low</p>
                                            <p className="font-bold text-stone-900 text-sm">{MONTH_NAMES[seasonalityInsights.low.month - 1]}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Center: BAR CHART with PIXEL heights */}
                            {seasonalityInsights && (
                                <div className="lg:col-span-6">
                                    <h4 className="text-sm font-semibold text-stone-700 mb-4">Monthly Traffic Distribution</h4>
                                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 overflow-x-auto">
                                        <div className="flex items-end justify-between gap-1 sm:gap-2 mb-4 min-w-[320px]" style={{ height: '160px' }}>
                                            {MONTH_NAMES.map((month, idx) => {
                                                const entry = seasonalityInsights.entries.find(e => e.month === idx + 1);
                                                const value = entry?.value || 0;
                                                const heightPx = seasonalityInsights.maxValue > 0
                                                    ? Math.round((value / seasonalityInsights.maxValue) * 130)
                                                    : 0;
                                                const isPeak = seasonalityInsights.peak.month === idx + 1;
                                                const isLow = seasonalityInsights.low.month === idx + 1;

                                                return (
                                                    <div key={month} className="flex flex-col items-center flex-1 justify-end h-full group">
                                                        <span className="text-[9px] text-stone-600 mb-1 font-medium">
                                                            {value}
                                                        </span>
                                                        <motion.div
                                                            className={`w-full max-w-[20px] rounded-t cursor-pointer
                                                                ${isPeak ? 'bg-blue-700' : isLow ? 'bg-blue-300' : 'bg-blue-500'}
                                                                hover:opacity-80 transition-opacity
                                                            `}
                                                            initial={{ height: 0 }}
                                                            animate={isInView ? { height: Math.max(heightPx, 6) } : {}}
                                                            transition={{ duration: 0.6, delay: idx * 0.04 }}
                                                        />
                                                        <span className={`text-[10px] mt-2 ${isPeak ? 'text-blue-700 font-bold' : 'text-stone-500'}`}>
                                                            {month}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center justify-center gap-6 pt-3 border-t border-stone-200">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded bg-blue-500" />
                                                <span className="text-xs text-stone-500">Traffic Level</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 rounded bg-blue-300" />
                                                <span className="text-xs text-stone-500">Low Season</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Right: Connections */}
                            {flightInfo.top_routes && flightInfo.top_routes.length > 0 && (
                                <div className="lg:col-span-3">
                                    <h4 className="text-sm font-semibold text-stone-700 mb-3">Key Connections</h4>
                                    <div className="space-y-2">
                                        {flightInfo.top_routes.slice(0, 6).map((route, idx) => (
                                            <motion.div
                                                key={idx}
                                                className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-100 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                                transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                                            >
                                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                                <span className="text-sm text-stone-700 font-medium flex-1">{route}</span>
                                                <ArrowRight className="w-3 h-3 text-stone-300" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Health Advisory */}
            {healthInfo && (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                    {/* Header - NEUTRAL */}
                    <div className="px-6 py-4 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-stone-900">Health & Safety Advisory</h3>
                            <p className="text-stone-500 text-xs">CDC travel health recommendations</p>
                        </div>
                        <span className="px-3 py-1.5 bg-stone-200 rounded-full text-stone-700 text-sm font-semibold">
                            {healthInfo.vaccines.length > 0 ? `${healthInfo.vaccines.length} Recommendations` : 'No Requirements'}
                        </span>
                    </div>

                    <div className="p-6">
                        {healthInfo.vaccines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {healthInfo.vaccines.slice(0, 6).map((vac, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-amber-200 transition-all"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                                    >
                                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="font-semibold text-stone-900 text-sm">{vac.disease}</h5>
                                            <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">{vac.recommendation}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                                <div>
                                    <h4 className="font-semibold text-emerald-900">No Special Vaccinations Required</h4>
                                    <p className="text-xs text-emerald-700">Standard travel precautions apply</p>
                                </div>
                            </div>
                        )}

                        {healthInfo.vaccines.length > 6 && (
                            <p className="text-xs text-stone-400 mt-3 text-center">+{healthInfo.vaccines.length - 6} more</p>
                        )}

                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-100">
                            <p className="text-xs text-stone-400">Source: CDC Travelers' Health</p>
                            <Link
                                href={`/${citySlug}/health`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
                            >
                                View Complete Health Guide
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </motion.section>
    );
}
