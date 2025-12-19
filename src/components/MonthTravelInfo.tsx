"use client";

import { Card, Badge, ProgressBar } from "@tremor/react";
import { Plane, TrendingUp, TrendingDown, Minus, Users } from "lucide-react";

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

interface MonthTravelInfoProps {
    cityName: string;
    monthNum: number;
    flightInfo?: {
        pressure_score: number;
        seasonality?: Record<number, number>;
        peak_daily_arrivals?: number;
    } | null;
}

export default function MonthTravelInfo({ cityName, monthNum, flightInfo }: MonthTravelInfoProps) {
    if (!flightInfo?.seasonality) return null;

    const seasonality = flightInfo.seasonality;
    const currentMonthFlights = seasonality[monthNum] || 0;
    const allValues = Object.values(seasonality).filter(v => v > 0);

    if (allValues.length === 0) return null;

    const maxFlights = Math.max(...allValues);
    const minFlights = Math.min(...allValues);
    const avgFlights = allValues.reduce((a, b) => a + b, 0) / allValues.length;

    // Determine if this month is peak, low, or average
    const getMonthStatus = () => {
        const ratio = maxFlights > 0 ? currentMonthFlights / maxFlights : 0;
        if (ratio >= 0.85) return { label: "Peak Season", color: "red", icon: TrendingUp, desc: "Highest tourist activity, book early" };
        if (ratio >= 0.6) return { label: "High Season", color: "orange", icon: TrendingUp, desc: "Popular month, expect crowds" };
        if (ratio >= 0.4) return { label: "Shoulder Season", color: "yellow", icon: Minus, desc: "Moderate crowds, good value" };
        if (ratio >= 0.2) return { label: "Low Season", color: "emerald", icon: TrendingDown, desc: "Fewer tourists, better deals" };
        return { label: "Off-Peak", color: "cyan", icon: TrendingDown, desc: "Quietest time, lowest prices" };
    };

    const status = getMonthStatus();
    const Icon = status.icon;

    // Find peak month name
    const peakMonthNum = Object.entries(seasonality).reduce((a, b) =>
        Number(b[1]) > Number(a[1]) ? b : a
    )[0];
    const peakMonthName = MONTH_NAMES[Number(peakMonthNum) - 1];

    // Calculate percentage of peak
    const percentOfPeak = maxFlights > 0 ? Math.round((currentMonthFlights / maxFlights) * 100) : 0;

    return (
        <Card className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50/30 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
                <Plane className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-stone-900">Tourist Season Analysis</h3>
                <Badge color={status.color as any}>{status.label}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Current Month Status */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-${status.color}-100`}>
                            <Icon className={`w-6 h-6 text-${status.color}-600`} />
                        </div>
                        <div>
                            <p className="text-sm text-stone-500">{status.desc}</p>
                            <p className="text-xs text-orange-600 mt-2 font-medium">
                                📈 Peak season: {peakMonthName} (~{maxFlights.toLocaleString()} slots/day)
                            </p>
                            <p className="text-xs text-stone-400 mt-1">
                                {currentMonthFlights > 0
                                    ? `~${currentMonthFlights.toLocaleString()} landing slots (est. daily)`
                                    : "Limited flight data available"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-stone-600">Crowd Level</span>
                            <span className="font-medium text-stone-900">{percentOfPeak}% of peak</span>
                        </div>
                        <ProgressBar
                            value={percentOfPeak}
                            color={status.color as any}
                            className="h-2"
                        />
                    </div>

                    <p className="text-xs text-stone-400 mt-4">
                        Peak season: <strong>{peakMonthName}</strong> (~{maxFlights.toLocaleString()} slots/day)
                    </p>
                    {flightInfo.peak_daily_arrivals && (
                        <p className="text-xs text-stone-400 mt-1">
                            ~{flightInfo.peak_daily_arrivals.toLocaleString()} landing slots on peak month's typical day
                        </p>
                    )}
                    <p className="text-[10px] text-stone-300 mt-1">
                        Based on mid-month sample data
                    </p>
                </div>

                {/* Right: Mini Seasonality Chart */}
                <div>
                    <p className="text-sm font-medium text-stone-700 mb-3">Landing Slots Pattern</p>
                    <div className="flex items-end justify-between h-16 gap-0.5">
                        {MONTH_NAMES.map((name, idx) => {
                            const value = seasonality[idx + 1] || 0;
                            const height = maxFlights > 0 ? (value / maxFlights) * 100 : 0;
                            const isCurrentMonth = idx + 1 === monthNum;

                            return (
                                <div key={name} className="flex flex-col items-center flex-1" title={`${name}: ${value} flights`}>
                                    <div
                                        className={`w-full rounded-t transition-all ${isCurrentMonth
                                            ? 'bg-orange-500'
                                            : 'bg-blue-300 hover:bg-blue-400'
                                            }`}
                                        style={{ height: `${height}%`, minHeight: value > 0 ? '4px' : '0' }}
                                    />
                                    <span className={`text-[9px] mt-1 ${isCurrentMonth ? 'text-orange-600 font-bold' : 'text-stone-400'}`}>
                                        {name.slice(0, 1)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-xs text-stone-400 mt-2 text-center">
                        Based on mid-month sample • Orange = current month
                    </p>
                </div>
            </div>
        </Card>
    );
}
