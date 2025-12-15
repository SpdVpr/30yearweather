"use client";

import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from "@tremor/react";
import { motion } from "framer-motion";

interface HistoricalRecord {
    year: number;
    temp_max: number;
    temp_min: number;
    precip: number;
    snowfall?: number; // NEW
    weather_code?: number; // NEW
}

export default function HistoricalRecords({ records }: { records: HistoricalRecord[] }) {
    if (!records || records.length === 0) return null;

    // Helper function to interpret weather code
    const getWeatherEmoji = (code?: number, precip?: number, snowfall?: number) => {
        if (!code) {
            // Fallback to old logic
            if (snowfall && snowfall > 0) return '❄️';
            if (precip === 0) return '☀️';
            if (precip && precip > 2) return '🌧️';
            return '☁️';
        }

        // WMO Weather Code interpretation
        if (code === 0) return '☀️'; // Clear
        if (code <= 3) return '⛅'; // Partly cloudy
        if (code === 45 || code === 48) return '🌫️'; // Fog
        if (code >= 51 && code <= 57) return '🌦️'; // Drizzle
        if (code >= 61 && code <= 67) return '🌧️'; // Rain
        if (code >= 71 && code <= 77) return '❄️'; // Snow
        if (code >= 80 && code <= 82) return '🌧️'; // Rain showers
        if (code >= 85 && code <= 86) return '🌨️'; // Snow showers
        if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
        return '🌡️';
    };

    const getConditionBadge = (code?: number, precip?: number, snowfall?: number) => {
        if (snowfall && snowfall > 0) {
            return <Badge color="cyan" size="xs">❄️ Snowy</Badge>;
        }
        if (!code) {
            // Fallback
            if (precip === 0) return <Badge color="emerald" size="xs">Sunny</Badge>;
            if (precip && precip > 2) return <Badge color="blue" size="xs">Rainy</Badge>;
            return <Badge color="gray" size="xs">Cloudy</Badge>;
        }

        if (code === 0) return <Badge color="emerald" size="xs">Clear</Badge>;
        if (code <= 3) return <Badge color="gray" size="xs">Cloudy</Badge>;
        if (code === 45 || code === 48) return <Badge color="slate" size="xs">Foggy</Badge>;
        if (code >= 51 && code <= 57) return <Badge color="blue" size="xs">Drizzle</Badge>;
        if (code >= 61 && code <= 67) return <Badge color="blue" size="xs">Rainy</Badge>;
        if (code >= 71 && code <= 77) return <Badge color="cyan" size="xs">Snowy</Badge>;
        if (code >= 80 && code <= 82) return <Badge color="blue" size="xs">Showers</Badge>;
        if (code >= 85 && code <= 86) return <Badge color="cyan" size="xs">Snow Showers</Badge>;
        if (code >= 95 && code <= 99) return <Badge color="red" size="xs">Stormy</Badge>;
        return <Badge color="gray" size="xs">Unknown</Badge>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
        >
            <Card className="rounded-xl shadow-lg border-0 bg-white ring-1 ring-gray-200">
                <div className="px-6 py-4 border-b border-gray-100">
                    <Title className="text-xl font-bold text-gray-900">Historical Records (Last 10 Years)</Title>
                    <p className="text-gray-500 text-sm mt-1">See the actual weather data for this day from 2015 to 2024.</p>
                </div>

                <Table className="mt-0">
                    <TableHead>
                        <TableRow className="bg-gray-50/50">
                            <TableHeaderCell className="pl-6">Year</TableHeaderCell>
                            <TableHeaderCell>Day Temp</TableHeaderCell>
                            <TableHeaderCell>Night Temp</TableHeaderCell>
                            <TableHeaderCell>Rain</TableHeaderCell>
                            <TableHeaderCell>Snow</TableHeaderCell>
                            <TableHeaderCell className="pr-6 text-right">Conditions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.year} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="pl-6 font-medium text-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span>{record.year}</span>
                                        <span className="text-lg">{getWeatherEmoji(record.weather_code, record.precip, record.snowfall)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={record.temp_max > 25 ? "text-amber-600 font-semibold" : ""}>{record.temp_max}°C</span>
                                </TableCell>
                                <TableCell>{record.temp_min}°C</TableCell>
                                <TableCell>{record.precip} mm</TableCell>
                                <TableCell>
                                    {record.snowfall !== undefined ? (
                                        <span className={record.snowfall > 0 ? "text-cyan-600 font-semibold" : "text-gray-400"}>
                                            {record.snowfall} cm
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="pr-6 text-right">
                                    {getConditionBadge(record.weather_code, record.precip, record.snowfall)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </motion.div>
    );
}
