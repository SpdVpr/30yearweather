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
    color?: "slate" | "emerald" | "rose" | "blue" | "amber";
    delay?: number;
}

export default function StatCard({ title, value, subtext, icon, color = "slate", delay = 0 }: StatCardProps) {
    const colorMap = {
        slate: "bg-slate-50 border-slate-200 text-slate-900",
        emerald: "bg-emerald-50 border-emerald-200 text-emerald-900",
        rose: "bg-rose-50 border-rose-200 text-rose-900",
        blue: "bg-blue-50 border-blue-200 text-blue-900",
        amber: "bg-amber-50 border-amber-200 text-amber-900",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
        >
            <div className={clsx("p-6 rounded-xl border shadow-sm h-full flex flex-col justify-between transition-all hover:shadow-md", colorMap[color])}>
                <div className="flex justify-between items-start mb-4">
                    <Text className="opacity-70 font-medium uppercase tracking-wide text-xs">{title}</Text>
                    {icon && <div className={clsx("p-2 rounded-lg bg-white/50 backdrop-blur-sm")}>{icon}</div>}
                </div>

                <div>
                    <Metric className="text-3xl font-bold">{value}</Metric>
                    {subtext && <Text className="mt-1 text-sm opacity-80">{subtext}</Text>}
                </div>
            </div>
        </motion.div>
    );
}
