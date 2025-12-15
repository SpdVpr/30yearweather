"use client";

import { Card, Title, Text } from "@tremor/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TourismIndex } from "@/lib/tourism";
import { Map, Users, Beer, CreditCard, ShieldCheck } from "lucide-react";

interface TourismScoreCardProps {
    scores: TourismIndex;
}

export default function TourismScoreCard({ scores }: TourismScoreCardProps) {

    const data = [
        { subject: 'Walkability', A: scores.walkability, fullMark: 100 },
        { subject: 'Outdoor/Beer', A: scores.beerGarden, fullMark: 100 },
        { subject: 'Reliability', A: scores.reliability, fullMark: 100 },
        { subject: 'Cost (Low)', A: 100 - scores.price, fullMark: 100 }, // Invert price (High score = Cheap)
        { subject: 'Peace (No Crowds)', A: 100 - scores.crowds, fullMark: 100 }, // Invert crowds (High score = Empty)
    ];

    const getRatingColor = (val: number) => {
        if (val >= 80) return "text-emerald-500";
        if (val >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <Card className="h-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <Map className="w-5 h-5" />
                </div>
                <div>
                    <Title>Travel Comfort Index</Title>
                    <Text className="text-xs">AI-Calculated Lifestyle Metrics</Text>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="h-64 w-full relative -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Score"
                            dataKey="A"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="#818cf8"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value}/100`, 'Score']}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Detailed Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Crowds</p>
                        <p className="text-sm font-semibold">{scores.crowds > 80 ? "Very High" : scores.crowds > 50 ? "Moderate" : "Low"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Avg. Prices</p>
                        <p className="text-sm font-semibold">{scores.price > 80 ? "$$$ Expensive" : scores.price > 50 ? "$$ Standard" : "$ Cheap"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Beer className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Outdoor Life</p>
                        <p className={`text-sm font-semibold ${getRatingColor(scores.beerGarden)}`}>{scores.beerGarden}/100</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Weather Risk</p>
                        <p className={`text-sm font-semibold ${getRatingColor(scores.reliability)}`}>{scores.reliability > 80 ? "Low Risk" : "Variable"}</p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
