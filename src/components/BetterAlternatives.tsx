"use client";

import { Card, Title, Text } from "@tremor/react";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AlternativeDate {
    dateSlug: string;      // MM-DD format
    dateFormatted: string; // "December 8"
    score: number;
    tempMax: number;
    precipProb: number;
    improvement: number;   // vs current date
    linkHref?: string;   // Optional override for clean URLs (e.g. /bali/july/18)
}

interface BetterAlternativesProps {
    currentDateSlug: string;
    currentScore: number;
    citySlug: string;
    alternatives: AlternativeDate[];
}

export default function BetterAlternatives({
    currentDateSlug,
    currentScore,
    citySlug,
    alternatives
}: BetterAlternativesProps) {
    // Filter to only show dates that are better than current
    const betterDates = alternatives
        .filter(alt => alt.score > currentScore && alt.dateSlug !== currentDateSlug)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    // Don't render if no better alternatives
    if (betterDates.length === 0) {
        return null;
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-emerald-100 text-emerald-700 border-emerald-200";
        if (score >= 60) return "bg-amber-100 text-amber-700 border-amber-200";
        return "bg-slate-100 text-slate-700 border-slate-200";
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 80) return "✨";
        if (score >= 60) return "👍";
        return "🌤️";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
        >
            <Card className="rounded-xl shadow-sm border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <Title className="text-lg font-bold text-gray-900">Better Alternatives Nearby</Title>
                        <Text className="text-sm text-gray-500">Consider these dates within ±7 days</Text>
                    </div>
                </div>

                <div className="space-y-3">
                    {betterDates.map((alt, index) => (
                        <Link
                            key={alt.dateSlug}
                            href={alt.linkHref || `/${citySlug}/${alt.dateSlug}`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{getScoreEmoji(alt.score)}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{alt.dateFormatted}</p>
                                        <p className="text-xs text-gray-500">
                                            {alt.tempMax}°C • {alt.precipProb}% rain
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getScoreColor(alt.score)}`}>
                                        {alt.score}
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                        <TrendingUp className="w-3 h-3" />
                                        +{alt.improvement}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                    💡 Moving your event by a few days could significantly improve weather conditions
                </p>
            </Card>
        </motion.div>
    );
}

