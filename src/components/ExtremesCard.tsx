"use client";

import { Card, Title, Text } from "@tremor/react";
import { motion } from "framer-motion";
import { Trophy, Snowflake, Flame, Droplets } from "lucide-react";
import { HistoricalRecord } from "@/lib/data";
import { useUnit } from "@/context/UnitContext";

interface ExtremesCardProps {
    records: HistoricalRecord[];
}

export default function ExtremesCard({ records }: ExtremesCardProps) {
    const { unit, convertTemp } = useUnit();

    if (!records || records.length === 0) return null;

    // Find Extremes
    const hottest = records.reduce((prev, current) => (prev.temp_max > current.temp_max) ? prev : current);
    const coldest = records.reduce((prev, current) => (prev.temp_min < current.temp_min) ? prev : current);
    const rainiest = records.reduce((prev, current) => (prev.precip > current.precip) ? prev : current);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="h-full"
        >
            <Card className="h-full rounded-xl border-0 shadow-lg ring-1 ring-gray-100 bg-white">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                        <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                        <Title>Hall of Fame</Title>
                        <Text className="text-xs">Records from last 10 years</Text>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Hottest Record */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-100 hover:bg-orange-100 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-white rounded-md shadow-sm text-orange-500 flex-shrink-0">
                                <Flame className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 truncate">Hottest</div>
                                <div className="text-xs text-gray-500">{hottest.year}</div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-orange-600 text-lg whitespace-nowrap">{convertTemp(hottest.temp_max)}°{unit}</div>
                        </div>
                    </div>

                    {/* Coldest Record */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-white rounded-md shadow-sm text-blue-500 flex-shrink-0">
                                <Snowflake className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 truncate">Coldest</div>
                                <div className="text-xs text-gray-500">{coldest.year}</div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-blue-600 text-lg whitespace-nowrap">{convertTemp(coldest.temp_min)}°{unit}</div>
                        </div>
                    </div>

                    {/* Rainiest Record */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-1.5 bg-white rounded-md shadow-sm text-indigo-500 flex-shrink-0">
                                <Droplets className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 truncate">Rainiest</div>
                                <div className="text-xs text-gray-500">{rainiest.year}</div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                            <div className="font-bold text-indigo-600 text-lg whitespace-nowrap">{rainiest.precip.toFixed(1)}mm</div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
