"use client";

import { Card, Title, Text } from "@tremor/react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Sun, CloudRain, Thermometer } from "lucide-react";
import Link from "next/link";
import { useUnit } from "@/context/UnitContext";

interface CityComparison {
    citySlug: string;
    cityName: string;
    country: string;
    tempMax: number;
    precipProb: number;
    score: number;
    linkHref?: string;
}

interface CompareCitiesProps {
    currentCity: string;
    dateSlug: string;
    dateFormatted: string;
    comparisons: CityComparison[];
}

export default function CompareCities({
    currentCity,
    dateSlug,
    dateFormatted,
    comparisons
}: CompareCitiesProps) {
    const { unit, convertTemp } = useUnit();
    // Filter out current city and sort by score
    const otherCities = comparisons
        .filter(c => c.citySlug !== currentCity)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

    if (otherCities.length === 0) return null;

    const getScoreBadge = (score: number) => {
        if (score >= 80) return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Excellent" };
        if (score >= 60) return { bg: "bg-amber-100", text: "text-amber-700", label: "Good" };
        if (score >= 40) return { bg: "bg-orange-100", text: "text-orange-700", label: "Fair" };
        return { bg: "bg-red-100", text: "text-red-700", label: "Poor" };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
        >
            <Card className="rounded-xl shadow-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div>
                        <Title className="text-lg font-bold text-gray-900">Compare Other Cities</Title>
                        <Text className="text-sm text-gray-500">Same date ({dateFormatted}) in other destinations</Text>
                    </div>
                </div>

                <div className="space-y-2">
                    {otherCities.map((city, index) => {
                        const badge = getScoreBadge(city.score);
                        return (
                            <Link
                                key={city.citySlug}
                                href={city.linkHref || `/${city.citySlug}/${dateSlug}`}
                                className="block"
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{city.cityName}</p>
                                            <p className="text-xs text-gray-500 truncate">{city.country}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Thermometer className="w-3 h-3 text-rose-400" />
                                            <span>{Math.round(convertTemp(city.tempMax))}°{unit}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 hidden sm:flex">
                                            {city.precipProb > 30 ? (
                                                <CloudRain className="w-3 h-3 text-blue-400" />
                                            ) : (
                                                <Sun className="w-3 h-3 text-amber-400" />
                                            )}
                                            <span>{city.precipProb}%</span>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                <p className="mt-4 text-xs text-gray-500 text-center">
                    🌍 Explore the same date in different destinations around the world
                </p>
            </Card>
        </motion.div>
    );
}

