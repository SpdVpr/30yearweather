"use client";

import React from 'react';

interface TopDestination {
    rank: number;
    name: string;
    country: string;
    score: number;
    bestMonth: string;
    temp: number;
    rain: number;
}

const TOP_DESTINATIONS: TopDestination[] = [
    { rank: 1, name: "Las Palmas", country: "Spain", score: 88.5, bestMonth: "May", temp: 21.8, rain: 0 },
    { rank: 2, name: "Mykonos", country: "Greece", score: 88.5, bestMonth: "Oct", temp: 21.5, rain: 8.1 },
    { rank: 3, name: "Gran Canaria", country: "Spain", score: 87.0, bestMonth: "Apr", temp: 19.7, rain: 10.2 },
    { rank: 4, name: "Santorini", country: "Greece", score: 86.9, bestMonth: "Apr", temp: 18.7, rain: 4.4 },
    { rank: 5, name: "Lanzarote", country: "Spain", score: 86.8, bestMonth: "Apr", temp: 21.3, rain: 2.9 },
    { rank: 6, name: "Ibiza", country: "Spain", score: 86.5, bestMonth: "Apr", temp: 19.6, rain: 11.5 },
    { rank: 7, name: "Nafplio", country: "Greece", score: 86.3, bestMonth: "Apr", temp: 18.4, rain: 8.9 },
    { rank: 8, name: "Lisbon", country: "Portugal", score: 86.1, bestMonth: "May", temp: 21.2, rain: 8.8 },
    { rank: 9, name: "Athens", country: "Greece", score: 86.0, bestMonth: "Apr", temp: 19.9, rain: 11.7 },
    { rank: 10, name: "Antalya", country: "Turkey", score: 85.8, bestMonth: "May", temp: 24.4, rain: 7.4 },
];

function getScoreColor(score: number): string {
    if (score >= 87) return '#10b981'; // emerald
    if (score >= 85) return '#22c55e'; // green
    return '#84cc16'; // lime
}

export function Top10BarChart() {
    const maxScore = 100;

    return (
        <div className="w-full bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-6 md:p-8 border border-stone-700/50">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🏆</span>
                <div>
                    <h3 className="text-xl font-bold text-white">Top 10 Shoulder Season Destinations</h3>
                    <p className="text-stone-400 text-sm">Ranked by weather score | April–October</p>
                </div>
            </div>

            <div className="space-y-3">
                {TOP_DESTINATIONS.map((dest, index) => (
                    <div key={dest.rank} className="flex items-center gap-3">
                        {/* Rank */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${index < 3
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                                : 'bg-stone-700 text-stone-300'
                            }`}>
                            {dest.rank}
                        </div>

                        {/* Name and country */}
                        <div className="w-36 flex-shrink-0">
                            <div className="text-white font-medium text-sm truncate">{dest.name}</div>
                            <div className="text-stone-500 text-xs">{dest.country}</div>
                        </div>

                        {/* Bar */}
                        <div className="flex-1 h-8 bg-stone-700/50 rounded-lg overflow-hidden relative">
                            <div
                                className="h-full rounded-lg transition-all duration-500"
                                style={{
                                    width: `${(dest.score / maxScore) * 100}%`,
                                    background: `linear-gradient(90deg, ${getScoreColor(dest.score)}, ${getScoreColor(dest.score)}cc)`
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                                <div className="flex items-center gap-2 text-xs">
                                    <span className="text-stone-300">{dest.bestMonth}</span>
                                    <span className="text-orange-400">🌡️ {dest.temp}°</span>
                                    <span className="text-blue-400">💧 {dest.rain}%</span>
                                </div>
                                <span className="text-white font-bold text-sm">{dest.score}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-700/50 flex justify-between items-center text-xs text-stone-500">
                <span>Based on 30 years of weather data</span>
                <span>30YearWeather.com</span>
            </div>
        </div>
    );
}

export function SpringVsFallComparison() {
    return (
        <div className="w-full grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-stone-700/50">
            {/* Spring Side */}
            <div className="bg-gradient-to-br from-pink-900/30 to-pink-950/40 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-8xl opacity-10">🌸</div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-2xl">
                            🌸
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Spring</h3>
                            <p className="text-pink-300 text-sm">April – May</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-stone-400 text-sm mb-1">Best for</div>
                        <div className="text-white font-medium">Mediterranean Coast</div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-pink-400">✓</span>
                            <span className="text-stone-300">Blooming gardens & festivals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-pink-400">✓</span>
                            <span className="text-stone-300">Easter celebrations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-pink-400">✓</span>
                            <span className="text-stone-300">Warming seas (17-20°C)</span>
                        </div>
                    </div>

                    <div className="text-stone-400 text-sm mb-2">Top destinations:</div>
                    <div className="flex flex-wrap gap-2">
                        {['Ibiza', 'Nafplio', 'Athens', 'Gran Canaria'].map(city => (
                            <span key={city} className="px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs border border-pink-500/30">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fall Side */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-950/40 p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 text-8xl opacity-10">🍂</div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                            🍂
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Fall</h3>
                            <p className="text-amber-300 text-sm">September – October</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-stone-400 text-sm mb-1">Best for</div>
                        <div className="text-white font-medium">Greek Islands</div>
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-400">✓</span>
                            <span className="text-stone-300">Warmest sea temperatures</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-400">✓</span>
                            <span className="text-stone-300">Wine harvest season</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-amber-400">✓</span>
                            <span className="text-stone-300">-35% fewer crowds</span>
                        </div>
                    </div>

                    <div className="text-stone-400 text-sm mb-2">Top destinations:</div>
                    <div className="flex flex-wrap gap-2">
                        {['Mykonos', 'Santorini', 'Nice', 'Yerevan'].map(city => (
                            <span key={city} className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
                                {city}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function KeyFindingsGrid() {
    const findings = [
        {
            icon: "🏆",
            title: "Best Overall",
            value: "Las Palmas & Mykonos",
            subtitle: "Score: 88.5/100",
            color: "orange"
        },
        {
            icon: "👥",
            title: "Crowd Reduction",
            value: "-35%",
            subtitle: "vs. peak summer months",
            color: "green"
        },
        {
            icon: "🌸",
            title: "Best Spring Month",
            value: "May",
            subtitle: "Warmest before crowds",
            color: "pink"
        },
        {
            icon: "🍂",
            title: "Best Fall Month",
            value: "October",
            subtitle: "Warm seas, clear skies",
            color: "amber"
        }
    ];

    const colorClasses: Record<string, string> = {
        orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
        green: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
        pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400",
        amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400"
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {findings.map((finding, i) => (
                <div
                    key={i}
                    className={`rounded-xl p-5 bg-gradient-to-br border ${colorClasses[finding.color]}`}
                >
                    <div className="text-3xl mb-3">{finding.icon}</div>
                    <div className="text-stone-400 text-sm mb-1">{finding.title}</div>
                    <div className="text-white text-xl font-bold mb-1">{finding.value}</div>
                    <div className="text-stone-500 text-xs">{finding.subtitle}</div>
                </div>
            ))}
        </div>
    );
}

export function MethodologyDiagram() {
    const factors = [
        { name: "Temperature", weight: 40, color: "#f97316", icon: "🌡️", detail: "18-26°C ideal" },
        { name: "Rain Probability", weight: 25, color: "#3b82f6", icon: "🌧️", detail: "<15% excellent" },
        { name: "Tourist Crowds", weight: 20, color: "#a855f7", icon: "👥", detail: "Flight data" },
        { name: "Sunshine Hours", weight: 15, color: "#eab308", icon: "☀️", detail: "6+ hours daily" },
    ];

    return (
        <div className="bg-stone-800/50 rounded-2xl p-6 md:p-8 border border-stone-700/50">
            <h3 className="text-xl font-bold text-white mb-6">📐 Scoring Methodology</h3>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Pie chart visualization */}
                <div className="flex-shrink-0 flex justify-center">
                    <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Temperature - 40% */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="20"
                                strokeDasharray={`${40 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset="0"
                            />
                            {/* Rain - 25% */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="20"
                                strokeDasharray={`${25 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset={`${-40 * 2.51}`}
                            />
                            {/* Crowds - 20% */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#a855f7"
                                strokeWidth="20"
                                strokeDasharray={`${20 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset={`${-65 * 2.51}`}
                            />
                            {/* Sunshine - 15% */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="#eab308"
                                strokeWidth="20"
                                strokeDasharray={`${15 * 2.51} ${100 * 2.51}`}
                                strokeDashoffset={`${-85 * 2.51}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">100</div>
                                <div className="text-xs text-stone-500">POINTS</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-3">
                    {factors.map((factor) => (
                        <div key={factor.name} className="flex items-center gap-3">
                            <div
                                className="w-4 h-4 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: factor.color }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{factor.icon}</span>
                                    <span className="text-white font-medium">{factor.name}</span>
                                    <span className="text-stone-500 text-sm">({factor.weight} pts)</span>
                                </div>
                                <div className="text-stone-400 text-xs">{factor.detail}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
