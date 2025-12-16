"use client";

import { Card, Title, Text } from "@tremor/react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine, Tooltip, CartesianGrid } from 'recharts';
import SunCalc from "suncalc";
import { useMemo } from "react";
import { Sunrise, Camera } from "lucide-react";

interface AstronomyCardProps {
    date: string; // "MM-DD"
    lat: number;
    lon: number;
    timezoneOffset?: number; // Offset in hours (e.g., 9 for Tokyo, 1 for Prague)
}

export default function AstronomyCard({ date, lat, lon, timezoneOffset = 0 }: AstronomyCardProps) {
    // 1. Calculate Sun Position Data Points for the entire day (Local Time 00:00 - 23:59)
    const chartData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const [month, day] = date.split('-').map(Number);
        const data = [];

        // Generate data points for every 30 minutes for performance
        for (let h = 0; h < 24; h++) {
            for (let m = 0; m < 60; m += 30) {
                // Construct UTC date that corresponds to Local Time (h:m)
                // UTC = Local - Offset
                const utcDate = new Date(Date.UTC(currentYear, month - 1, day, h - timezoneOffset, m));

                const pos = SunCalc.getPosition(utcDate, lat, lon);
                // Convert altitude from radians to degrees
                const altitude = (pos.altitude * 180) / Math.PI;

                data.push({
                    time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
                    altitude: altitude,
                    formattedTime: `${h}:${m.toString().padStart(2, '0')}`
                });
            }
        }
        return data;
    }, [date, lat, lon, timezoneOffset]);

    // 2. Calculate Key Events (Sunrise, Sunset, Noon)
    const sunTimes = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const [month, day] = date.split('-').map(Number);
        // Calculate based on Noon UTC to avoid edge cases, then adjust
        const noonUtc = new Date(Date.UTC(currentYear, month - 1, day, 12 - timezoneOffset, 0));
        return SunCalc.getTimes(noonUtc, lat, lon);
    }, [date, lat, lon, timezoneOffset]);

    const formatTime = (dateObj: Date) => {
        // Adjust UTC date object to "Local Time" string manually based on offset
        // Because dateObj is the absolute moment in time (e.g. 21:00 UTC)
        // We want to display (21 + 9) % 24 = 06:00
        const utcHours = dateObj.getUTCHours();
        const utcMinutes = dateObj.getUTCMinutes();

        let localHours = utcHours + timezoneOffset;
        if (localHours >= 24) localHours -= 24;
        if (localHours < 0) localHours += 24;

        // Handle minutes (usually no offset, but for 30min zones...) assuming whole hour offsets for MVP
        // If offset has decimals (e.g. 5.5), logic needs update.
        // For simplicity:
        const totalMinutes = utcHours * 60 + utcMinutes + (timezoneOffset * 60);
        const normalizedMinutes = (totalMinutes + 24 * 60) % (24 * 60);
        const h = Math.floor(normalizedMinutes / 60);
        const m = Math.floor(normalizedMinutes % 60);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    // 3. Dynamic Gradient Calculation
    const gradientOffsets = useMemo(() => {
        // We need to map sunrise/sunset absolute times to the X-axis (0..24 local hours)
        const getLocalHour = (dateObj: Date) => {
            const h = dateObj.getUTCHours();
            const m = dateObj.getUTCMinutes();
            const totalHoursUtc = h + m / 60;
            let local = totalHoursUtc + timezoneOffset;
            if (local < 0) local += 24;
            if (local >= 24) local -= 24;
            return local;
        };

        const sunriseLocal = getLocalHour(sunTimes.sunrise);
        const sunsetLocal = getLocalHour(sunTimes.sunset);

        return {
            sunrise: sunriseLocal / 24,
            sunset: sunsetLocal / 24
        };
    }, [sunTimes, timezoneOffset]);

    return (
        <Card className="h-full rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <Sunrise className="w-5 h-5" />
                </div>
                <div>
                    <Title>Daylight & Sun</Title>
                    <Text className="text-xs text-gray-400">Solar Elevation Cycle</Text>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="splitColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset={Math.max(0, gradientOffsets.sunrise - 0.1)} stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset={gradientOffsets.sunrise} stopColor="#f59e0b" stopOpacity={0.6} />
                                <stop offset={gradientOffsets.sunset} stopColor="#f59e0b" stopOpacity={0.6} />
                                <stop offset={Math.min(1, gradientOffsets.sunset + 0.1)} stopColor="#6366f1" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="formattedTime"
                            interval={7}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis hide={true} domain={[-20, 90]} />
                        <ReferenceLine y={0} stroke="#e5e7eb" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ color: '#6b7280' }}
                            formatter={(value: any) => [`${Math.round(Number(value))}°`, 'Elevation']}
                        />
                        <Area
                            type="basis"
                            dataKey="altitude"
                            stroke="url(#splitColor)"
                            strokeWidth={2}
                            fill="url(#splitColor)"
                            fillOpacity={1}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-sm border-t border-gray-50 pt-4 pb-2">
                <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">🌅 Sunrise</p>
                    <p className="font-semibold text-gray-700">{formatTime(sunTimes.sunrise)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">☀️ Noon</p>
                    <p className="font-semibold text-gray-700">{formatTime(sunTimes.solarNoon)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">🌇 Sunset</p>
                    <p className="font-semibold text-gray-700">{formatTime(sunTimes.sunset)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">⏱️ Daylight</p>
                    <p className="font-semibold text-gray-700">
                        {(() => {
                            const diff = sunTimes.sunset.getTime() - sunTimes.sunrise.getTime();
                            const hours = Math.floor(diff / (1000 * 60 * 60));
                            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                            return `${hours}h ${mins}m`;
                        })()}
                    </p>
                </div>
            </div>

            {/* Golden Hour Section */}
            <div className="mt-2 pt-3 border-t border-dashed border-gray-100 bg-orange-50/30 -mx-6 px-6 pb-2">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <Camera className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-[10px] font-bold text-orange-700 uppercase tracking-widest">Golden Hour</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <div className="text-left">
                        <span className="text-gray-400 text-[10px] mr-2">Morning</span>
                        <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-orange-100">
                            {formatTime(sunTimes.sunrise)} - {formatTime(sunTimes.goldenHourEnd)}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-orange-100">
                            {formatTime(sunTimes.goldenHour)} - {formatTime(sunTimes.sunset)}
                        </span>
                        <span className="text-gray-400 text-[10px] ml-2">Evening</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
