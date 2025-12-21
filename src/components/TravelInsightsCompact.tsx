"use client";

import Link from "next/link";
import { CloudRain, Sun, Droplets, ArrowRight } from "lucide-react";

interface MonthStat {
    monthNum: number;
    name: string;
    avgTemp: number;
    avgRain: number;
    totalRainMm: number;
}

interface TravelInsightsCompactProps {
    cityName: string;
    citySlug: string;
    wettest: MonthStat;
    hottest: MonthStat;
    yearlyRainfall: number;
}

export default function TravelInsightsCompact({
    cityName,
    citySlug,
    wettest,
    hottest,
    yearlyRainfall,
}: TravelInsightsCompactProps) {
    // Generate dynamic travel tips based on climate data
    const tips = [
        {
            icon: <CloudRain className="w-5 h-5 text-blue-500" />,
            title: "Pack Light Rain Gear",
            description: `Even in dry season, brief showers can occur. ${wettest.name} sees highest rainfall.`,
        },
        {
            icon: <Sun className="w-5 h-5 text-yellow-500" />,
            title: "High UV Index",
            description: `Sunscreen is essential year-round. UV index averages 11+ in ${hottest.name}.`,
        },
        {
            icon: <Droplets className="w-5 h-5 text-cyan-500" />,
            title: yearlyRainfall > 1500 ? "Tropical Climate" : "Moderate Climate",
            description: yearlyRainfall > 1500
                ? "Expect humidity year-round. Lightweight, breathable clothing recommended."
                : "Pleasant humidity levels most of the year. Pack layers for cooler evenings.",
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-stone-100">
                <span className="text-sm font-semibold text-stone-700">Travel Insights</span>
            </div>

            <div className="divide-y divide-stone-100">
                {tips.map((tip, index) => (
                    <div key={index} className="p-4 flex gap-3">
                        <div className="shrink-0">{tip.icon}</div>
                        <div>
                            <h4 className="text-sm font-semibold text-stone-900 mb-0.5">{tip.title}</h4>
                            <p className="text-xs text-stone-500 leading-relaxed">{tip.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className="p-4 border-t border-stone-100">
                <Link
                    href={`/${citySlug}/health`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                >
                    Read Full Travel Guide
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
