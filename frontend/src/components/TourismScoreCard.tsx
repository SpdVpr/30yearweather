"use client";

import { useState, useEffect } from 'react';
import { Card, Title, Text } from "@tremor/react";
import { TourismIndex } from "@/lib/tourism";
import { Sun, Users, CreditCard, TrendingUp } from "lucide-react";

interface TourismScoreCardProps {
    scores: TourismIndex;
    insights?: string;
    attribution?: string;
}

export default function TourismScoreCard({ scores, insights, attribution }: TourismScoreCardProps) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Helper function for color coding
    const getScoreColor = (score: number) => {
        if (score >= 80) return { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" };
        if (score >= 60) return { bg: "bg-yellow-50", text: "text-yellow-700", bar: "bg-yellow-500" };
        return { bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500" };
    };

    // Helper for crowd interpretation (inverted - low score = good)
    const getCrowdLabel = (score: number) => {
        if (score >= 90) return "🔴 Very Busy";
        if (score >= 70) return "🟡 Busy";
        if (score >= 40) return "🟢 Moderate";
        return "🟢 Quiet";
    };

    // Helper for price interpretation (inverted)
    const getPriceLabel = (score: number) => {
        if (score >= 80) return "💰💰💰 Expensive";
        if (score >= 50) return "💰💰 Moderate";
        return "💰 Affordable";
    };

    // Helper for weather quality
    const getWeatherLabel = (score: number) => {
        if (score >= 80) return "☀️ Excellent";
        if (score >= 60) return "⛅ Good";
        return "🌧️ Variable";
    };

    const weatherColors = getScoreColor(scores.reliability);
    const crowdColors = getScoreColor(100 - scores.crowds); // Invert for display
    const priceColors = getScoreColor(100 - scores.price); // Invert for display

    return (
        <Card className="h-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="mb-6">
                <Title className="text-xl font-bold">Travel Comfort Index</Title>
                <Text className="text-sm text-gray-500">Real-time tourism conditions</Text>
            </div>

            {/* Main Metrics Grid */}
            <div className="space-y-5">

                {/* Weather Quality */}
                <div className={`${weatherColors.bg} rounded-xl p-4 border border-gray-100`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Sun className={`w-5 h-5 ${weatherColors.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Weather Quality</p>
                                <p className="text-xs text-gray-500">{getWeatherLabel(scores.reliability)}</p>
                            </div>
                        </div>
                        <div className={`text-2xl font-bold ${weatherColors.text}`}>
                            {scores.reliability}
                            <span className="text-sm font-normal">/100</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                            className={`${weatherColors.bar} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${scores.reliability}%` }}
                        />
                    </div>
                </div>

                {/* Crowds */}
                <div className={`${crowdColors.bg} rounded-xl p-4 border border-gray-100`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Users className={`w-5 h-5 ${crowdColors.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Tourist Crowds</p>
                                <p className="text-xs text-gray-500">{getCrowdLabel(scores.crowds)}</p>
                            </div>
                        </div>
                        <div className={`text-2xl font-bold ${crowdColors.text}`}>
                            {scores.crowds}
                            <span className="text-sm font-normal">/100</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                            className={`${crowdColors.bar} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${scores.crowds}%` }}
                        />
                    </div>
                </div>

                {/* Price Level */}
                <div className={`${priceColors.bg} rounded-xl p-4 border border-gray-100`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <CreditCard className={`w-5 h-5 ${priceColors.text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Price Level</p>
                                <p className="text-xs text-gray-500">{getPriceLabel(scores.price)}</p>
                            </div>
                        </div>
                        <div className={`text-2xl font-bold ${priceColors.text}`}>
                            {scores.price}
                            <span className="text-sm font-normal">/100</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                            className={`${priceColors.bar} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${scores.price}%` }}
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Insights */}
            {isMounted && (insights || attribution) && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                    {insights && (
                        <div className="flex gap-2">
                            <span className="text-lg">💡</span>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {insights}
                            </p>
                        </div>
                    )}
                    {attribution && (
                        <p className="text-xs text-gray-400 leading-relaxed">
                            {attribution}
                        </p>
                    )}
                </div>
            )}
        </Card>
    );
}
