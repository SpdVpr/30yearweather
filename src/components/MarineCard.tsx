
import { MarineInfo } from "@/lib/data";
import { Waves, Thermometer, Anchor, Skull, Fish } from "lucide-react";
import { useUnit } from "@/context/UnitContext";

// Helper to determine color based on Shiver Factor
const getShiverColor = (factor: string) => {
    switch (factor) {
        case "Polar Plunge": return "text-blue-600";
        case "Refreshing Tonic": return "text-cyan-600";
        case "Swimming Pool": return "text-emerald-600";
        case "Tropical Bath": return "text-orange-500";
        case "Hot Soup": return "text-red-500";
        default: return "text-slate-500";
    }
};

const getSafetyColor = (flag: string) => {
    switch (flag) {
        case "Lake-like": return "text-emerald-600";
        case "Fun Waves": return "text-blue-600";
        case "Surfers Only": return "text-amber-600";
        default: return "text-slate-500";
    }
}

const getShiverEmoji = (factor: string) => {
    switch (factor) {
        case "Polar Plunge": return "🥶"; // Cold face
        case "Refreshing Tonic": return "🥃"; // Drink
        case "Swimming Pool": return "🏊"; // Swimmer
        case "Tropical Bath": return "🛁"; // Bathtub
        case "Hot Soup": return "🔥"; // Fire
        default: return "🌡️";
    }
};

export default function MarineCard({ marine }: { marine: MarineInfo }) {
    const { unit, convertTemp } = useUnit();

    if (!marine) return null;

    const shiverColor = getShiverColor(marine.shiver_factor);
    const safetyColor = getSafetyColor(marine.family_safety);
    const displayWaterTemp = convertTemp(marine.water_temp);

    return (
        <section className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Waves className="w-6 h-6 text-blue-500" />
                Marine Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Water Temp Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 mb-4">
                            <Thermometer className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Water Temp</span>
                        </div>
                        <div className="flex items-end gap-3 mb-2">
                            <div className="text-4xl font-bold text-slate-800">
                                {displayWaterTemp}°{unit}
                            </div>
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${shiverColor}`}>
                            {getShiverEmoji(marine.shiver_factor)} <span className="ml-1">{marine.shiver_factor}</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        Avg daily surface temperature
                    </div>
                </div>

                {/* Wave Height Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="flex items-center gap-2 text-slate-500 mb-4">
                            <Waves className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Surf Conditions</span>
                        </div>
                        <div className="flex items-end gap-3 mb-2">
                            <div className="text-4xl font-bold text-slate-800">
                                {marine.wave_height}m
                            </div>
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 ${safetyColor}`}>
                            <span>🌊</span> <span className="ml-1">{marine.family_safety}</span>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        Max daily wave height
                    </div>
                </div>

                {/* Status / Warning Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-slate-500 mb-4">
                        <Anchor className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Advisories</span>
                    </div>

                    <div className="space-y-4 flex-1">
                        {marine.jellyfish_warning ? (
                            <div className="flex items-start gap-3 bg-rose-50 p-3 rounded-lg border border-rose-100">
                                <Skull className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-rose-700">Jellyfish Warning</p>
                                    <p className="text-xs text-rose-600 mt-1">High water temps may attract jellyfish swarms.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                                <Fish className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-emerald-700">Marine Life</p>
                                    <p className="text-xs text-emerald-600 mt-1">No special warnings. Enjoy the swim!</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-auto">
                            <p className="text-xs text-slate-500 font-medium mb-1">Swim Index</p>
                            {marine.water_temp > 21 && marine.wave_height < 1.0 ? (
                                <p className="text-sm text-blue-600 font-semibold">✅ Excellent Swimming Conditions</p>
                            ) : marine.water_temp < 18 ? (
                                <p className="text-sm text-slate-600 font-semibold">❄️ Cold Water Hazard</p>
                            ) : (
                                <p className="text-sm text-slate-600 font-semibold">⚠️ Mixed Conditions</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
