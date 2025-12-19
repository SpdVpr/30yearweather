
"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, XCircle, Calendar, ArrowRight, Plane, PartyPopper } from "lucide-react";
import Link from "next/link";

interface DayVerdictProps {
    score: number;
    precipProb: number;
    city: string;
    month: string;
    day: number;
    tempMax: number;
    humidity: number;
    citySlug: string;
    monthSlug: string;
    // NEW: Tourism and holiday data
    flightPressure?: number;
    holidayName?: string | null;
    vaccineCount?: number;
}

export default function DayVerdict({
    precipProb,
    city,
    month,
    day,
    tempMax,
    citySlug,
    monthSlug,
    flightPressure,
    holidayName,
    vaccineCount
}: DayVerdictProps) {
    let verdictTitle = "";
    let verdictDesc = "";
    let colorClass = "";
    let bgClass = "";
    let Icon = CheckCircle;

    // Seed for pseudo-randomness based on date and city
    const seed = city.length + day + (month.length * 2);

    // Tourism context strings
    const getTourismContext = () => {
        if (!flightPressure) return "";

        const vIdx = seed % 3;

        if (flightPressure >= 80) {
            const v = [
                ` As it's peak season for ${city}, we recommend booking your stay well in advance to secure the best rates.`,
                ` ${city} is currently in its most popular travel window, meaning vibrant crowds and premium pricing.`,
                ` Expect a bustling atmosphere in ${city} right now—this is when the city truly comes alive with visitors.`
            ];
            return v[vIdx];
        }
        if (flightPressure >= 60) {
            const v = [
                ` ${city} is seeing high visitor numbers, so iconic spots may be busier than usual.`,
                ` You'll find plenty of company in ${city} this month as tourism activity remains quite robust.`,
                ` It's a lively time to explore ${city}, with most attractions operating at full capacity.`
            ];
            return v[vIdx];
        }
        if (flightPressure >= 40) {
            const v = [
                ` Moderate travel demand makes this an excellent time for a balanced ${city} experience.`,
                ` You'll enjoy ${city} with reasonable crowd levels and competitive accommodation options.`,
                ` It's a great middle-ground for visiting ${city}—enough activity to feel the pulse, but no overwhelming lines.`
            ];
            return v[vIdx];
        }
        if (flightPressure >= 20) {
            const v = [
                ` Lower tourist interest in ${city} right now translates to better deals and a more local feel.`,
                ` It's a quieter period for ${city}, ideal for those who prefer unhurried sightseeing.`,
                ` Take advantage of the off-peak calm in ${city} to see the sights without the usual crowds.`
            ];
            return v[vIdx];
        }
        return ` ${city} is very peaceful this time of year, perfect for a secluded and budget-friendly getaway.`;
    };

    const getHolidayContext = () => {
        if (holidayName) {
            return ` Note: ${month} ${day} is ${holidayName} in ${city}, so expect special events, closures, and festive atmosphere.`;
        }
        return "";
    };

    const getHealthContext = () => {
        if (!vaccineCount || vaccineCount <= 3) return "";

        const hIdx = (seed + 1) % 5;
        const variants = [
            ` Preparing for ${city} involves checking health recommendations; the CDC suggests reviewing vaccinations at least a month before departure.`,
            ` For your trip to ${city}, ensure your health records are up-to-date, particularly if you haven't reviewed travel-specific shots recently.`,
            ` Health planning is key for ${city}—consider consulting a travel clinic to discuss potential boosters for your specific itinerary.`,
            ` Visiting ${city} safely means staying informed on local health advisories and ensuring routine vaccinations are completed well in advance.`,
            ` Don't forget that ${city} health prep is best started several weeks before arrival to allow time for full vaccination effectiveness.`
        ];
        return variants[hIdx];
    };

    // Logic based on precipProb
    if (precipProb < 15) {
        verdictTitle = "YES, IT'S PARADISE";
        colorClass = "text-emerald-700";
        bgClass = "bg-emerald-50 border-emerald-200";
        verdictDesc = `${month} ${day} is statistically one of the best days of the year in ${city}. With minimal rain risk (${precipProb}%) and pleasant highs of ${tempMax}°C, it's ideal for outdoor adventures.${getTourismContext()}${getHolidayContext()}${getHealthContext()}`;
    } else if (precipProb < 40) {
        verdictTitle = "YES, GOOD CHOICE";
        colorClass = "text-blue-700";
        bgClass = "bg-blue-50 border-blue-200";
        Icon = CheckCircle;
        verdictDesc = `${month} ${day} is generally a great time to visit ${city}. While there is a slight chance of rain (${precipProb}%), showers are usually brief. Expect comfortable ${tempMax}°C weather.${getTourismContext()}${getHolidayContext()}${getHealthContext()}`;
    } else if (precipProb < 70) {
        verdictTitle = "IT'S A GAMBLE";
        colorClass = "text-amber-700";
        bgClass = "bg-amber-50 border-amber-200";
        Icon = AlertTriangle;
        verdictDesc = `${month} ${day} sees frequent showers in ${city}. Historical data shows a ${precipProb}% chance of rain, so pack accordingly. Temperatures average ${tempMax}°C.${getTourismContext()}${getHolidayContext()}${getHealthContext()}`;
    } else {
        verdictTitle = "PROBABLY NOT";
        colorClass = "text-rose-700";
        bgClass = "bg-rose-50 border-rose-200";
        Icon = XCircle;
        verdictDesc = `Historical data suggests significant rain risk (${precipProb}%) on ${month} ${day}. If you seek sun, consider a different date. Bring rain gear!${getTourismContext()}${getHolidayContext()}${getHealthContext()}`;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-5xl mx-auto -mt-12 md:-mt-20 relative z-30 px-4 mb-12"
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
                            {/* Holiday Badge */}
                            {holidayName && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                    <PartyPopper className="w-3 h-3" />
                                    Holiday
                                </span>
                            )}
                            {/* Tourist Badge */}
                            {flightPressure && flightPressure >= 70 && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    <Plane className="w-3 h-3" />
                                    Peak Season
                                </span>
                            )}
                        </div>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
                            {verdictDesc}
                        </p>
                    </div>

                    {/* Quick Navigation - More Prominent */}
                    <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[260px] md:border-l md:border-gray-200 md:pl-8 pt-4 md:pt-0 border-t border-gray-100 md:border-t-0 mt-4 md:mt-0">
                        <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Explore More</span>

                        {/* Primary CTA - See All Month */}
                        <Link
                            href={`/${citySlug}/${monthSlug}`}
                            className="group flex items-center justify-between p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-300 transition-all shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500 rounded-lg text-white shadow">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-orange-800">See All {month}</span>
                                    <p className="text-xs text-orange-600">View the full calendar</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 transition-transform group-hover:text-orange-600" />
                        </Link>

                        {/* Secondary Link - Full Year */}
                        <Link
                            href={`/${citySlug}`}
                            className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-gray-200 rounded-lg text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Best Time for {city}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-orange-500" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
