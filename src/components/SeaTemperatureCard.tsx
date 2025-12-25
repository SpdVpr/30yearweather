'use client';

import { Waves, Thermometer, MapPin } from "lucide-react";
import { useUnit } from "@/context/UnitContext";

interface SeaTemperatureCardProps {
    waterTemp: number;
    seaName: string;
    seaNameLocal?: string;
    monthName?: string; // If provided, shows "in [month]" context
    cityName: string;
    variant?: 'compact' | 'full';
}

// Helper to determine shiver factor based on temperature
const getShiverFactor = (temp: number): { label: string; emoji: string; color: string } => {
    if (temp < 15) return { label: "Polar Plunge", emoji: "🥶", color: "text-blue-600" };
    if (temp < 18) return { label: "Refreshing", emoji: "💧", color: "text-cyan-600" };
    if (temp < 22) return { label: "Pleasant", emoji: "🏊", color: "text-emerald-600" };
    if (temp < 26) return { label: "Warm", emoji: "☀️", color: "text-orange-500" };
    return { label: "Tropical", emoji: "🌴", color: "text-red-500" };
};

// Helper for swim condition
const getSwimCondition = (temp: number): { label: string; icon: string; bgColor: string; textColor: string } => {
    if (temp >= 22) return {
        label: "Excellent for swimming",
        icon: "✅",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700"
    };
    if (temp >= 18) return {
        label: "Good for swimming",
        icon: "👍",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
    };
    if (temp >= 15) return {
        label: "Cool, wetsuits recommended",
        icon: "🏄",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700"
    };
    return {
        label: "Cold water hazard",
        icon: "❄️",
        bgColor: "bg-slate-50",
        textColor: "text-slate-700"
    };
};

export default function SeaTemperatureCard({
    waterTemp,
    seaName,
    seaNameLocal,
    monthName,
    cityName,
    variant = 'full'
}: SeaTemperatureCardProps) {
    const { unit, convertTemp } = useUnit();

    const displayTemp = convertTemp(waterTemp);
    const shiverFactor = getShiverFactor(waterTemp);
    const swimCondition = getSwimCondition(waterTemp);

    if (variant === 'compact') {
        return (
            <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                        Sea Temp
                    </span>
                    <Waves className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-stone-900">
                        {displayTemp}°{unit}
                    </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                    <span className={`text-sm font-medium ${shiverFactor.color}`}>
                        {shiverFactor.emoji} {shiverFactor.label}
                    </span>
                </div>
                <p className="text-xs text-stone-400 mt-2">
                    {seaName}
                </p>
            </div>
        );
    }

    return (
        <section className="mb-8">
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border border-blue-100 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-blue-100/50 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Waves className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-stone-900">
                                Sea Temperature {monthName ? `in ${monthName}` : ''}
                            </h2>
                            <p className="text-stone-600 text-xs flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {seaName}
                                {seaNameLocal && seaNameLocal !== seaName && (
                                    <span className="text-stone-400">({seaNameLocal})</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-blue-600">
                            {displayTemp}°{unit}
                        </span>
                        <p className="text-xs text-stone-500">
                            {monthName ? 'Monthly Average' : 'Annual Average'}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Temperature Feel */}
                        <div className="bg-white/80 rounded-xl p-4 border border-white">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <Thermometer className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Water Feel</span>
                            </div>
                            <div className={`text-2xl font-bold ${shiverFactor.color} flex items-center gap-2`}>
                                <span>{shiverFactor.emoji}</span>
                                <span>{shiverFactor.label}</span>
                            </div>
                            <p className="text-xs text-stone-500 mt-2">
                                {waterTemp < 18
                                    ? "Consider a wetsuit for extended swimming"
                                    : waterTemp < 22
                                        ? "Comfortable for most swimmers"
                                        : "Perfect for swimming and water sports"
                                }
                            </p>
                        </div>

                        {/* Swim Conditions */}
                        <div className="bg-white/80 rounded-xl p-4 border border-white">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider">Swim Rating</span>
                            </div>
                            <div className={`${swimCondition.bgColor} ${swimCondition.textColor} rounded-lg p-3 flex items-center gap-2`}>
                                <span className="text-xl">{swimCondition.icon}</span>
                                <span className="font-semibold text-sm">{swimCondition.label}</span>
                            </div>
                            <p className="text-xs text-stone-500 mt-2">
                                Based on average sea surface temperature
                            </p>
                        </div>

                        {/* Sea Info */}
                        <div className="bg-white/80 rounded-xl p-4 border border-white">
                            <div className="flex items-center gap-2 text-stone-500 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Body of Water</span>
                            </div>
                            <div className="text-lg font-bold text-stone-800">
                                {seaName}
                            </div>
                            {seaNameLocal && seaNameLocal !== seaName && (
                                <p className="text-sm text-stone-500 mt-1">
                                    {seaNameLocal}
                                </p>
                            )}
                            <p className="text-xs text-stone-500 mt-2">
                                {cityName} coastline
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
