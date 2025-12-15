"use client";

import { Card, Title, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from "@tremor/react";
import { motion } from "framer-motion";

interface HistoricalRecord {
    year: number;
    temp_max: number;
    temp_min: number;
    precip: number;
}

export default function HistoricalRecords({ records }: { records: HistoricalRecord[] }) {
    if (!records || records.length === 0) return null;

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
                            <TableHeaderCell className="pr-6 text-right">Conditions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.year} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="pl-6 font-medium text-gray-700">{record.year}</TableCell>
                                <TableCell>
                                    <span className={record.temp_max > 25 ? "text-amber-600 font-semibold" : ""}>{record.temp_max}°C</span>
                                </TableCell>
                                <TableCell>{record.temp_min}°C</TableCell>
                                <TableCell>{record.precip} mm</TableCell>
                                <TableCell className="pr-6 text-right">
                                    {record.precip === 0 ? (
                                        <Badge color="emerald" size="xs">Sunny</Badge>
                                    ) : record.precip > 2 ? (
                                        <Badge color="blue" size="xs">Rainy</Badge>
                                    ) : (
                                        <Badge color="gray" size="xs">Cloudy</Badge>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </motion.div>
    );
}
