
"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DayVerdictProps {
    score: number; // 0-100 placeholder
    precipProb: number;
    city: string;
    month: string;
    day: number;
    tempMax: number;
    humidity: number;
    citySlug: string;
    monthSlug: string;
}

export default function DayVerdict({ precipProb, city, month, day, tempMax, citySlug, monthSlug }: DayVerdictProps) {
    let verdictTitle = "";
    let verdictDesc = "";
    let colorClass = "";
    let bgClass = ""; // tailwind bg class
    let Icon = CheckCircle;

    // Logic based on precipProb (could be more complex involving temp/wind)
    if (precipProb < 15) {
        verdictTitle = "YES, IT'S PARADISE";
        colorClass = "text-emerald-700";
        bgClass = "bg-emerald-50 border-emerald-200";
        verdictDesc = `${month} ${day} is statistically one of the best days of the year in ${city}. With minimal rain risk (${precipProb}%) and perfect highs of ${tempMax}°C, it's ideal for beach days, outdoor adventures, and exploring without getting soaked.`;
    } else if (precipProb < 40) {
        verdictTitle = "YES, GOOD CHOICE";
        colorClass = "text-blue-700";
        bgClass = "bg-blue-50 border-blue-200";
        Icon = CheckCircle;
        verdictDesc = `${month} ${day} is generally a great time to visit ${city}. While there is a slight chance of rain (${precipProb}%), showers are usually brief. You'll mostly enjoy warm ${tempMax}°C weather and clear skies.`;
    } else if (precipProb < 70) {
        verdictTitle = "IT'S A GAMBLE";
        colorClass = "text-amber-700";
        bgClass = "bg-amber-50 border-amber-200";
        Icon = AlertTriangle;
        verdictDesc = `${month} ${day} sees frequent showers in ${city}. Historical data shows a ${precipProb}% chance of rain, so plan for wet pauses. However, you'll still experience warm periods (${tempMax}°C) between the rain.`;
    } else {
        verdictTitle = "PROBABLY NOT";
        colorClass = "text-rose-700";
        bgClass = "bg-rose-50 border-rose-200";
        Icon = XCircle;
        verdictDesc = `Historical data suggests significant rain risk (${precipProb}%) on ${month} ${day}. If you are looking for pure sun, consider a different month. If you don't mind the occasional downpour, bring a rain jacket!`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-5xl mx-auto -mt-20 relative z-30 px-4 mb-12"
        >
            <div className={`p-6 md:p-8 rounded-3xl shadow-2xl border-2 ${bgClass} bg-white/95 backdrop-blur-md`}>
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full bg-white/50 border border-current shadow-sm`}>
                                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorClass}`} strokeWidth={3} />
                            </div>
                            <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tight ${colorClass}`}>
                                {verdictTitle}
                            </h2>
                        </div>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                            {verdictDesc}
                        </p>
                    </div>

                    {/* Cross-sell / Context Links */}
                    <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[240px] md:border-l md:border-gray-200 md:pl-8 pt-4 md:pt-0 border-t border-gray-100 md:border-t-0 mt-4 md:mt-0">
                        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">More Options</span>

                        <Link href={`/${citySlug}/${monthSlug}`} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-gray-200 rounded-lg text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">See All {month}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-emerald-500" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
