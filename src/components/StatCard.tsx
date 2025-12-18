"use client";

import { Card, Metric, Text, Flex } from "@tremor/react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon?: ReactNode;
    color?: "slate" | "emerald" | "rose" | "blue" | "amber" | "cyan" | "red" | "orange";
    delay?: number;
    tempValue?: number; // For dynamic temperature-based coloring
}

// Helper to get color based on temperature
function getTempColor(temp: number): string {
    if (temp < 0) return "bg-blue-100 border-blue-300 text-blue-900";
    if (temp < 10) return "bg-cyan-50 border-cyan-200 text-cyan-900";
    if (temp < 20) return "bg-emerald-50 border-emerald-200 text-emerald-900";
    if (temp < 28) return "bg-amber-50 border-amber-200 text-amber-900";
    return "bg-red-50 border-red-200 text-red-900";
}

export default function StatCard({ title, value, subtext, icon, color = "slate", delay = 0, tempValue }: StatCardProps) {
    const colorMap: Record<string, string> = {
        slate: "bg-slate-50 border-slate-200 text-slate-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
        rose: "bg-rose-50 border-rose-200 text-rose-900",
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        amber: "bg-amber-50 border-amber-200 text-amber-900",
        cyan: "bg-cyan-50 border-cyan-200 text-cyan-900",
        red: "bg-red-50 border-red-200 text-red-900",
        orange: "bg-orange-50 border-orange-200 text-orange-900",
    };

    // Use temperature-based color if tempValue is provided
    const cardColor = tempValue !== undefined ? getTempColor(tempValue) : colorMap[color];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
        >
            <div className={clsx("p-4 md:p-6 rounded-xl border shadow-sm h-full flex flex-col justify-between transition-all hover:shadow-md", cardColor)}>
                <div className="flex justify-between items-start mb-4">
                    <Text className="opacity-70 font-medium uppercase tracking-wide text-[10px] md:text-xs truncate">{title}</Text>
                    {icon && <div className={clsx("p-1.5 md:p-2 rounded-lg bg-white/50 backdrop-blur-sm shrink-0")}>{icon}</div>}
                </div>

                <div>
                    <Metric className="text-2xl md:text-3xl font-bold">{value}</Metric>
                    {subtext && <Text className="mt-1 text-[11px] md:text-sm opacity-80 line-clamp-2">{subtext}</Text>}
                </div>
            </div>
        </motion.div>
    );
}
