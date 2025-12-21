"use client";

import { useState } from "react";

interface MonthStat {
    monthNum: number;
    name: string;
    shortName: string;
    avgTemp: number;
    avgTempMin: number;
    avgRain: number;
    totalRainMm: number;
    status: string;
    color: string;
    emoji: string;
    link: string;
}

interface ClimateChartProps {
    monthlyStats: MonthStat[];
    cityName: string;
}

export default function ClimateChart({ monthlyStats, cityName }: ClimateChartProps) {
    const [unit, setUnit] = useState<"metric" | "imperial">("metric");

    // Find max values for scaling
    const maxTemp = Math.max(...monthlyStats.map(m => m.avgTemp));
    const maxRain = Math.max(...monthlyStats.map(m => m.totalRainMm));

    // Calculate bar heights (max 160px)
    const tempScale = maxTemp > 0 ? 140 / maxTemp : 1;
    const rainScale = maxRain > 0 ? 140 / maxRain : 1;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-stone-900">Climate Trends</h3>
                    <p className="text-sm text-stone-500">Temperature vs Rainfall averages</p>
                </div>
                <div className="flex rounded-lg overflow-hidden border border-stone-200">
                    <button
                        onClick={() => setUnit("metric")}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${unit === "metric"
                                ? "bg-stone-900 text-white"
                                : "bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                    >
                        °C / mm
                    </button>
                    <button
                        onClick={() => setUnit("imperial")}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${unit === "imperial"
                                ? "bg-stone-900 text-white"
                                : "bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                    >
                        °F / in
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="relative">
                {/* Bars Container */}
                <div className="flex items-end justify-between gap-2 h-[180px] px-2">
                    {monthlyStats.map((stat) => {
                        const tempHeight = Math.max(stat.avgTemp * tempScale, 20);
                        const rainHeight = Math.max(stat.totalRainMm * rainScale, 8);

                        const displayTemp = unit === "metric"
                            ? stat.avgTemp
                            : Math.round(stat.avgTemp * 9 / 5 + 32);

                        const displayRain = unit === "metric"
                            ? stat.totalRainMm
                            : Math.round(stat.totalRainMm / 25.4 * 10) / 10;

                        return (
                            <div key={stat.monthNum} className="flex flex-col items-center flex-1 group">
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-stone-900 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                                    {stat.name}: {displayTemp}° / {displayRain}{unit === "metric" ? "mm" : "in"}
                                </div>

                                {/* Temperature Bar */}
                                <div
                                    className="w-full max-w-[28px] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all group-hover:from-blue-600 group-hover:to-blue-500"
                                    style={{ height: `${tempHeight}px` }}
                                />

                                {/* Rain Dot */}
                                <div
                                    className="w-2.5 h-2.5 rounded-full bg-stone-300 mt-2 group-hover:bg-stone-400 transition-colors"
                                    style={{
                                        opacity: Math.min(1, 0.3 + (stat.totalRainMm / maxRain) * 0.7)
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between px-2 mt-3 border-t border-stone-100 pt-3">
                    {monthlyStats.map((stat) => (
                        <div key={stat.monthNum} className="flex-1 text-center">
                            <span className="text-[10px] font-medium text-stone-500 uppercase">
                                {stat.shortName}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm" />
                    <span className="text-xs text-stone-600">Avg Temp</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                    <span className="text-xs text-stone-600">Rainfall</span>
                </div>
            </div>
        </div>
    );
}
