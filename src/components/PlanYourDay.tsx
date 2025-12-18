"use client";

import { motion } from "framer-motion";
import { Sun, Sunrise, Sunset, Moon, Coffee, Camera, Utensils, Wine, Bike, TreePine, Building, Umbrella } from "lucide-react";
import { getTempEmoji } from "@/lib/weather-utils";
import { useUnit } from "@/context/UnitContext";

interface PlanYourDayProps {
    tempMax: number;
    tempMin: number;
    precipProb: number;
    sunriseTime?: string;
    sunsetTime?: string;
    isRainy: boolean;
}

interface TimeSlot {
    time: string;
    label: string;
    icon: React.ReactNode;
    temp: number;
    activities: { name: string; icon: React.ReactNode; suitable: boolean }[];
    bgClass: string;
}

export default function PlanYourDay({ tempMax, tempMin, precipProb, sunriseTime = "06:30", sunsetTime = "20:00", isRainy }: PlanYourDayProps) {
    const { unit, convertTemp } = useUnit();

    // Estimate temperatures throughout the day
    const tempRange = tempMax - tempMin;
    const morningTempRaw = Math.round(tempMin + tempRange * 0.3);
    const noonTempRaw = Math.round(tempMax);
    const afternoonTempRaw = Math.round(tempMax - tempRange * 0.1);
    const eveningTempRaw = Math.round(tempMin + tempRange * 0.4);

    // Activity suitability based on conditions
    const goodForOutdoor = !isRainy && tempMax >= 10 && tempMax <= 32;
    const goodForPhotos = !isRainy && precipProb < 40;
    const goodForDining = true; // Always can dine
    const goodForBiking = !isRainy && tempMax >= 12 && tempMax <= 28;
    const goodForParks = !isRainy && tempMax >= 15;
    const goodForSightseeing = !isRainy || precipProb < 50;

    const timeSlots: TimeSlot[] = [
        {
            time: sunriseTime,
            label: "Morning",
            icon: <Sunrise className="w-6 h-6 text-amber-500" />,
            temp: morningTempRaw,
            bgClass: "from-amber-100 to-orange-50",
            activities: [
                { name: "Sunrise photos", icon: <Camera className="w-4 h-4" />, suitable: goodForPhotos },
                { name: "Coffee & bakery", icon: <Coffee className="w-4 h-4" />, suitable: true },
                { name: "Morning jog", icon: <Bike className="w-4 h-4" />, suitable: goodForOutdoor },
            ]
        },
        {
            time: "12:00",
            label: "Midday",
            icon: <Sun className="w-6 h-6 text-yellow-500" />,
            temp: noonTempRaw,
            bgClass: "from-yellow-100 to-amber-50",
            activities: [
                { name: "Sightseeing", icon: <Building className="w-4 h-4" />, suitable: goodForSightseeing },
                { name: "Lunch out", icon: <Utensils className="w-4 h-4" />, suitable: true },
                { name: "Park visit", icon: <TreePine className="w-4 h-4" />, suitable: goodForParks },
            ]
        },
        {
            time: "15:00",
            label: "Afternoon",
            icon: <Sun className="w-6 h-6 text-orange-400" />,
            temp: afternoonTempRaw,
            bgClass: "from-orange-100 to-rose-50",
            activities: [
                { name: "Bike tour", icon: <Bike className="w-4 h-4" />, suitable: goodForBiking },
                { name: "Golden hour photos", icon: <Camera className="w-4 h-4" />, suitable: goodForPhotos },
                { name: "Museums (if rain)", icon: <Building className="w-4 h-4" />, suitable: !goodForOutdoor },
            ]
        },
        {
            time: sunsetTime,
            label: "Evening",
            icon: <Sunset className="w-6 h-6 text-rose-500" />,
            temp: eveningTempRaw,
            bgClass: "from-rose-100 to-purple-50",
            activities: [
                { name: "Sunset views", icon: <Camera className="w-4 h-4" />, suitable: goodForPhotos },
                { name: "Dinner", icon: <Wine className="w-4 h-4" />, suitable: true },
                { name: "Evening walk", icon: <TreePine className="w-4 h-4" />, suitable: !isRainy },
            ]
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Plan Your Day</h3>
                {isRainy && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                        <Umbrella className="w-3 h-3" /> Rain likely
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {timeSlots.map((slot, index) => (
                    <motion.div
                        key={slot.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${slot.bgClass} border border-white/50 shadow-sm`}
                    >
                        <div className="flex items-center justify-between mb-3 underline-offset-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="shrink-0">{slot.icon}</div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm md:text-base truncate">{slot.label}</p>
                                    <p className="text-[10px] md:text-xs text-slate-500">{slot.time}</p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-base md:text-lg font-bold text-slate-800">{convertTemp(slot.temp)}°{unit}</p>
                                <p className="text-xs">{getTempEmoji(slot.temp)}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {slot.activities.map((activity) => (
                                <div
                                    key={activity.name}
                                    className={`flex items-center gap-2 text-sm ${activity.suitable ? 'text-slate-700' : 'text-slate-400 line-through'
                                        }`}
                                >
                                    {activity.icon}
                                    <span>{activity.name}</span>
                                    {activity.suitable && <span className="text-emerald-500">✓</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

