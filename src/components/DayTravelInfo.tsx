"use client";

import { Plane, Stethoscope, PartyPopper, CalendarX, CheckCircle, AlertCircle, Users } from "lucide-react";
import StatCard from "./StatCard";
import Link from "next/link";

interface DayTravelInfoProps {
    cityName: string;
    countryName: string;
    date: string;
    dateKey: string;
    monthNum: number;
    citySlug: string;
    holidays?: Record<string, string>;
    flightInfo?: {
        pressure_score: number;
        seasonality?: Record<number, number>;
        icao?: string;
    } | null;
    healthInfo?: {
        vaccines: Array<{ disease: string; recommendation: string }>;
    } | null;
}

export default function DayTravelInfo({
    cityName,
    countryName,
    date,
    dateKey,
    monthNum,
    citySlug,
    holidays,
    flightInfo,
    healthInfo
}: DayTravelInfoProps) {
    const todaysHoliday = holidays ? Object.entries(holidays).find(([d]) => d.endsWith(dateKey)) : null;
    const monthlyFlights = flightInfo?.seasonality?.[monthNum] || 0;

    const getPressureInfo = (score: number) => {
        if (score >= 80) return { label: "High", color: "red" as const, desc: "Peak traffic" };
        if (score >= 60) return { label: "Busy", color: "orange" as const, desc: "Active season" };
        if (score >= 40) return { label: "Moderate", color: "amber" as const, desc: "Average flows" };
        if (score >= 20) return { label: "Quiet", color: "emerald" as const, desc: "Fewer crowds" };
        return { label: "Minimal", color: "cyan" as const, desc: "Off-peak" };
    };

    // Calculate monthly pressure score (relative to peak month)
    const calculateMonthlyPressure = (): number => {
        if (!flightInfo?.seasonality) return 0;

        const seasonality = flightInfo.seasonality;
        const currentMonthFlights = seasonality[monthNum] || 0;
        const allValues = Object.values(seasonality).filter(v => v > 0);

        if (allValues.length === 0 || currentMonthFlights === 0) return 0;

        const maxFlights = Math.max(...allValues);
        // Calculate percentage of peak and scale to 0-100
        const percentOfPeak = (currentMonthFlights / maxFlights) * 100;

        return Math.round(percentOfPeak);
    };

    const monthlyPressureScore = calculateMonthlyPressure();
    const pressure = flightInfo ? getPressureInfo(monthlyPressureScore) : { label: "N/A", color: "slate" as const, desc: "No data" };

    // VACCINE FILTERING LOGIC
    // We only want to show "Required" for entry or "Recommended for MOST"
    // Filter out "not recommended" or "not required" or "some travelers" if user wants high importance
    const rawVaccines = healthInfo?.vaccines || [];

    const importantVaccines = rawVaccines.filter(v => {
        const rec = v.recommendation.toLowerCase();
        // Keep if Required for entry
        if (rec.includes("required") && !rec.includes("not required")) return true;
        // Keep if recommended for MOST
        if (rec.includes("recommended for most")) return true;
        // If it's something major like Yellow Fever or Polio and it mentions "required" anywhere
        if (rec.includes("required")) return true;
        return false;
    });

    const vaccineList = importantVaccines.length > 0
        ? importantVaccines.map(v => v.disease).join(", ")
        : "No mandatory vaccines";

    const hasRequired = rawVaccines.some(v => v.recommendation.toLowerCase().includes("required") && !v.recommendation.toLowerCase().includes("not required"));

    return (
        <section id="travel-logistics" className="py-4">
            <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                    Travel & Logistics Insights
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Card 1: Holiday / Calendar */}
                <StatCard
                    title="Local Calendar"
                    value={todaysHoliday ? "Holiday" : "Business Day"}
                    subtext={todaysHoliday ? todaysHoliday[1] : `Standard hours in ${countryName}`}
                    icon={todaysHoliday ? <PartyPopper className="w-5 h-5 text-amber-500" /> : <CalendarX className="w-5 h-5 text-slate-400" />}
                    color={todaysHoliday ? "amber" : "slate"}
                    delay={0}
                    centered={true}
                />

                {/* Card 2: Traffic Pressure */}
                <StatCard
                    title="Flight Traffic"
                    value={pressure.label}
                    subtext={`${monthlyPressureScore}/100 pressure index`}
                    icon={<Plane className="w-5 h-5 text-blue-500" />}
                    color={pressure.color}
                    delay={1}
                    centered={true}
                />

                {/* Card 3: Health Prep */}
                <Link href={`/${citySlug}/health`} className="block transition-transform hover:scale-[1.02]">
                    <StatCard
                        title="Health Advisory"
                        value={hasRequired ? "Required" : importantVaccines.length > 0 ? "Recommended" : "Healthy"}
                        subtext={
                            importantVaccines.length > 0
                                ? `${importantVaccines.length} vaccine${importantVaccines.length > 1 ? 's' : ''} • View Details →`
                                : "Routine only • View Details →"
                        }
                        icon={hasRequired ? <AlertCircle className="w-5 h-5 text-red-600" /> : importantVaccines.length > 0 ? <AlertCircle className="w-5 h-5 text-rose-500" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        color={hasRequired ? "red" : importantVaccines.length > 0 ? "rose" : "emerald"}
                        delay={2}
                        centered={true}
                    />
                </Link>

                {/* Card 4: Daily Arrivals */}
                <StatCard
                    title="Landing Slots"
                    value={monthlyFlights > 0 ? `~${monthlyFlights.toLocaleString()}` : "N/A"}
                    subtext="Daily arrival options (inc. codeshare)"
                    icon={<Users className="w-5 h-5 text-indigo-500" />}
                    color="blue"
                    delay={3}
                    centered={true}
                />

            </div>
        </section>
    );
}
