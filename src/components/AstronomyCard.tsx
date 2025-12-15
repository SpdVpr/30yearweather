"use client";

import { Card, Title, Text } from "@tremor/react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, CartesianGrid } from 'recharts';
import SunCalc from "suncalc";
import { useMemo } from "react";
import { Sunrise } from "lucide-react";

interface AstronomyCardProps {
    date: string; // "MM-DD"
    lat: number;
    lon: number;
}

export default function AstronomyCard({ date, lat, lon }: AstronomyCardProps) {
    // 1. Calculate Sun Position Data Points for the entire day (00:00 - 23:59)
    const chartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const [month, day] = date.split('-').map(Number);
        const data = [];

        // Generate data points for every 15 minutes for smoother curve
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 15) {
                const timeDate = new Date(currentYear, month - 1, day, h, m, 0);
                const pos = SunCalc.getPosition(timeDate, lat, lon);
                // Convert altitude from radians to degrees
                const altitude = (pos.altitude * 180) / Math.PI;

                data.push({
                    time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
                    altitude: altitude,
                    originalDate: timeDate.getTime() // store timestamp for easier x-axis calc if needed
                });
            }
        }
        return data;
    }, [date, lat, lon]);

    // 2. Calculate Key Events (Sunrise, Sunset, Noon)
    const sunTimes = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const [month, day] = date.split('-').map(Number);
        const targetDate = new Date(currentYear, month - 1, day, 12, 0, 0);
        return SunCalc.getTimes(targetDate, lat, lon);
    }, [date, lat, lon]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // 3. Dynamic Gradient Calculation
    // We need to find at what % of the X-axis (00:00 to 24:00) the sunrise and sunset happen.
    const gradientOffsets = useMemo(() => {
        const startOfDay = new Date(sunTimes.sunrise).setHours(0, 0, 0, 0);
        const endOfDay = new Date(sunTimes.sunrise).setHours(23, 59, 59, 999);
        const dayLengthTotal = endOfDay - startOfDay;

        // Ensure we use the same day for calc
        const sunriseTime = sunTimes.sunrise.getTime() - startOfDay;
        const sunsetTime = sunTimes.sunset.getTime() - startOfDay;

        const sunrisePercent = sunriseTime / dayLengthTotal;
        const sunsetPercent = sunsetTime / dayLengthTotal;

        return {
            sunrise: sunrisePercent,
            sunset: sunsetPercent
        };
    }, [sunTimes]);

    return (
        <Card className="h-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Sunrise className="w-5 h-5" />
                </div>
                <div>
                    <Title>Sun Elevation</Title>
                    <Text className="text-xs">Day & Night Cycle</Text>
                </div>
            </div>

            <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="1" y2="0">
                                {/* Night before sunrise */}
                                <stop offset={gradientOffsets.sunrise - 0.05} stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset={gradientOffsets.sunrise} stopColor="#f59e0b" stopOpacity={0.8} />

                                {/* Day */}
                                <stop offset={gradientOffsets.sunset} stopColor="#f59e0b" stopOpacity={0.8} />

                                {/* Night after sunset */}
                                <stop offset={gradientOffsets.sunset + 0.05} stopColor="#6366f1" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

                        <XAxis
                            dataKey="time"
                            interval={15} // approx every 4 hours
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            hide={false}
                            width={40}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            domain={[-60, 80]} // Visual optimization
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Elevation (°)', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af', fontSize: '10px' } }}
                        />

                        {/* Horizon Line (0 degrees) */}
                        <ReferenceLine y={0} stroke="#374151" strokeWidth={1} />

                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#6b7280', marginBottom: '0.25rem' }}
                            formatter={(value: number | undefined) => value !== undefined ? [`${Math.round(value)}°`, 'Elevation'] : ['N/A', 'Elevation']}
                        />

                        <Area
                            type="monotone"
                            dataKey="altitude"
                            stroke="url(#splitColor)"
                            strokeWidth={3}
                            fill="url(#splitColor)"
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm border-t border-gray-100 pt-4">
                <div>
                    <p className="text-gray-400 text-xs">Sunrise</p>
                    <p className="font-medium text-gray-900">{formatTime(sunTimes.sunrise)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Solar Noon</p>
                    <p className="font-medium text-gray-900">{formatTime(sunTimes.solarNoon)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Sunset</p>
                    <p className="font-medium text-gray-900">{formatTime(sunTimes.sunset)}</p>
                </div>
            </div>
        </Card>
    );
}
