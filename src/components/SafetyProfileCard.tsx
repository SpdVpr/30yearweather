"use client";

import { Card, Title, Text } from "@tremor/react";
import { Activity, AlertTriangle, Shield, Wind, Mountain, Droplets, Leaf, CloudFog, AlertOctagon, Info, Waves } from "lucide-react";
import { SafetyProfile } from "@/lib/data";

interface SafetyProfileCardProps {
    safetyProfile?: SafetyProfile;
    cityName: string;
    currentMonth?: number; // Added month context
}

export default function SafetyProfileCard({ safetyProfile, cityName, currentMonth }: SafetyProfileCardProps) {
    if (!safetyProfile) {
        return null;
    }

    const { seismic, hurricane, volcano, flood, air_quality } = safetyProfile;

    // --- Helpers ---

    const getTrafficLightColor = (level: string) => {
        // ... (keep existing)
        switch (level?.toLowerCase()) {
            case "stable":
            case "low":
            case "good":
                return "emerald";
            case "medium":
            case "moderate":
                return "amber";
            case "high":
            case "unhealthy":
            case "poor":
                return "orange";
            case "very high":
            case "hazardous":
                return "red";
            default:
                return "slate";
        }
    };

    const getAqiColor = (aqi: number) => {
        // ... (keep existing)
        if (aqi <= 50) return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "text-emerald-500", label: "Good" };
        if (aqi <= 100) return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "text-yellow-500", label: "Moderate" };
        if (aqi <= 150) return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "text-orange-500", label: "Unhealthy for Sensitive groups" };
        if (aqi <= 200) return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "text-red-500", label: "Unhealthy" };
        return { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "text-purple-500", label: "Hazardous" };
    };

    // --- Components ---

    const RiskItem = ({
        icon: Icon,
        title,
        level,
        detail,
        subDetail,
        expandedDetail, // NEW: For extra info like "3 events in July"
        colorClass
    }: {
        icon: any,
        title: string,
        level: string,
        detail: string,
        subDetail?: string,
        expandedDetail?: React.ReactNode,
        colorClass?: string
    }) => {
        // ... (keep existing color logic)
        const semanticColor = colorClass || getTrafficLightColor(level);

        let bgStyle = "bg-slate-50 border-slate-100";
        let iconStyle = "text-slate-500 bg-slate-100";
        let textStyle = "text-slate-700";

        if (semanticColor === 'emerald') {
            bgStyle = "bg-emerald-50/50 border-emerald-100/50";
            iconStyle = "text-emerald-600 bg-emerald-100";
            textStyle = "text-emerald-900";
        } else if (semanticColor === 'amber' || semanticColor === 'yellow') {
            bgStyle = "bg-amber-50/50 border-amber-100/50";
            iconStyle = "text-amber-600 bg-amber-100";
            textStyle = "text-amber-900";
        } else if (semanticColor === 'orange') {
            bgStyle = "bg-orange-50/50 border-orange-100/50";
            iconStyle = "text-orange-600 bg-orange-100";
            textStyle = "text-orange-900";
        } else if (semanticColor === 'red') {
            bgStyle = "bg-red-50/50 border-red-100/50";
            iconStyle = "text-red-600 bg-red-100";
            textStyle = "text-red-900";
        }

        return (
            <div className={`p-4 rounded-xl border ${bgStyle} flex flex-col justify-between h-full transition-all hover:shadow-sm`}>
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg ${iconStyle}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${iconStyle.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20 text-')}`}>
                        {level}
                    </span>
                </div>
                <div>
                    <h4 className={`font-semibold text-sm mb-1 ${textStyle}`}>
                        {title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        {detail}
                    </p>

                    {/* Expanded Detail Block */}
                    {expandedDetail && (
                        <div className="mt-2 text-xs text-slate-500 bg-white/50 p-2 rounded border border-white/60">
                            {expandedDetail}
                        </div>
                    )}

                    {subDetail && !expandedDetail && (
                        <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-200/50 pt-1 uppercase tracking-wider font-medium">
                            {subDetail}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // --- Logic for Seismic Monthly Data ---

    // Get monthly data if available
    const monthlyData = (currentMonth && seismic.monthly)
        ? seismic.monthly[currentMonth.toString()]
        : null;

    const monthlyCount = monthlyData ? monthlyData.count : null;
    const monthlyLastEvent = monthlyData ? monthlyData.last_event : null;

    // Human-friendly seismic advice based on risk level
    const getSeismicAdvice = (level: string, count: number) => {
        if (level === 'Stable') return "No earthquake preparedness needed. Enjoy your stay!";
        if (level === 'Low') return "Very rare tremors. Standard travel precautions apply.";
        if (level === 'Medium') return "Occasional tremors possible. Know your hotel's evacuation route.";
        if (level === 'High') return "Earthquake risk elevated. Download a seismic alert app.";
        return "High seismic zone. Familiarize yourself with 'Drop, Cover, Hold On' procedures.";
    };

    const seismicExpanded = (
        <div className="flex flex-col gap-1.5">
            {/* Always show 30y total */}
            <div className="flex justify-between">
                <span>Total events (30y):</span>
                <span className="font-semibold">{seismic.count_30y || 0}</span>
            </div>
            {/* Show monthly if available */}
            {monthlyCount !== null && (
                <div className="flex justify-between">
                    <span>In {getMonthName(currentMonth)} (30y):</span>
                    <span className="font-semibold">{monthlyCount}</span>
                </div>
            )}
            {/* Last event in month */}
            {monthlyLastEvent ? (
                <div className="flex justify-between">
                    <span>Last in {getMonthName(currentMonth)}:</span>
                    <span className="font-semibold">{monthlyLastEvent}</span>
                </div>
            ) : (seismic.last_event && (
                <div className="flex justify-between">
                    <span>Last recorded:</span>
                    <span className="font-semibold">{seismic.last_event}</span>
                </div>
            ))}

            {/* Human advice */}
            <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 text-[11px] italic text-slate-500">
                💡 {getSeismicAdvice(seismic.risk_level, seismic.count_30y || 0)}
            </div>
        </div>
    );

    // --- Logic for Flood Risk ---
    // DISABLED: Flood risk calculation was not reliable enough based on historical data.
    // Keeping logic commented out for potential future use if better data source is found.
    /*
    const getFloodAdvice = (level: string) => {
        if (level === 'Minimal' || level === 'Low') return "Flooding is rare. No special precautions needed.";
        if (level === 'Medium') return "Flash floods possible during heavy rain. Avoid low-lying areas.";
        return "High flood risk. Check weather forecasts daily and know evacuation routes.";
    };
    
    const floodExpanded = flood && (
        <div className="flex flex-col gap-1.5">
             ... code omitted ...
        </div>
    );
    */

    // --- Main Render ---

    const hasAirQuality = !!air_quality;
    const colSpanClass = hasAirQuality ? "lg:col-span-2" : "lg:col-span-3";

    const aqiStyles = air_quality ? getAqiColor(air_quality.aqi) : null;

    return (
        <Card className="p-0 overflow-hidden ring-1 ring-slate-200 shadow-sm rounded-2xl bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[300px]">

                {/* 1. AIR QUALITY HERO SECTION (Left Panel) */}
                {hasAirQuality && air_quality && aqiStyles && (
                    <div className={`relative p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 ${aqiStyles.bg}`}>
                        {/* Decorative background vibe */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Wind className={`w-32 h-32 ${aqiStyles.icon}`} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Leaf className={`w-5 h-5 ${aqiStyles.icon}`} />
                                <span className={`text-sm font-bold uppercase tracking-wider ${aqiStyles.text}`}>
                                    Air Quality Forecast
                                </span>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-6xl font-bold ${aqiStyles.text}`}>
                                        {air_quality.aqi}
                                    </span>
                                    <span className={`text-lg font-medium text-slate-500`}>
                                        AQI
                                    </span>
                                </div>
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full border ${aqiStyles.border} bg-white/60 backdrop-blur-sm`}>
                                    <div className={`w-2 h-2 rounded-full ${aqiStyles.icon.replace('text-', 'bg-')}`} />
                                    <span className={`text-sm font-semibold ${aqiStyles.text}`}>
                                        {air_quality.category || aqiStyles.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-slate-600 font-medium">PM2.5 Concentration</span>
                                    <span className="text-sm text-slate-900 font-bold">{air_quality.pm25} µg/m³</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${aqiStyles.icon.replace('text-', 'bg-')}`}
                                        style={{ width: `${Math.min((air_quality.pm25 / 50) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <p className="text-sm text-slate-700 font-medium leading-relaxed">
                                {air_quality.health_note}
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. SAFETY & RISKS GRID (Right/Main Panel) */}
                <div className={`p-6 lg:p-8 ${colSpanClass} bg-white flex flex-col`}>
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <Title>Regional Safety Profile</Title>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                        {/* Seismic */}
                        <RiskItem
                            icon={Activity}
                            title="Seismic Activity"
                            level={seismic.risk_level}
                            detail={getSeismicMessage(seismic.risk_level)}
                            expandedDetail={seismicExpanded}
                        />

                        {/* Hurricane / Storms */}
                        {hurricane && (
                            <RiskItem
                                icon={Wind}
                                title={`${hurricane.storm_type} Risk`}
                                level={hurricane.risk_level}
                                detail={hurricane.is_year_round ? "Year-round risk present" : `Season: ${getMonthName(hurricane.season_start)} - ${getMonthName(hurricane.season_end)}`}
                                colorClass={hurricane.risk_level === 'High' ? 'red' : 'blue'}
                            />
                        )}

                        {/* Floods - REMOVED */}
                        {/* 
                        {flood && (
                            <RiskItem
                                icon={Waves}
                                title="Flood Risk"
                                level={flood.risk_level}
                                detail={getFloodAdvice(flood.risk_level)}
                                expandedDetail={floodExpanded}
                            />
                        )} 
                        */}

                        {/* Volcano */}
                        {volcano && (
                            <RiskItem
                                icon={Mountain}
                                title="Volcanic Activity"
                                level={volcano.risk_level}
                                detail={volcano.nearby_volcanoes.length > 0 ? `Nearest: ${volcano.nearby_volcanoes[0].name}` : "No active volcanoes nearby."}
                                subDetail={volcano.nearby_volcanoes.length > 0 ? `${volcano.nearby_volcanoes[0].distance_km}km away` : undefined}
                                colorClass={volcano.risk_level === 'High' || volcano.risk_level === 'Very High' ? 'orange' : 'emerald'}
                            />
                        )}

                        {/* Fallback if grid is empty? Unlikely given seismic is always present */}
                    </div>

                    {/* Safety Tips Footer for High Risk */}
                    {(seismic.risk_level.includes("High") || volcano?.risk_level?.includes("High") || hurricane?.risk_level?.includes("High")) && (
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <div className="flex items-start gap-2 text-xs text-slate-500">
                                <AlertOctagon className="w-4 h-4 text-orange-500 mt-0.5" />
                                <p>Travel Alert: This region has elevated natural risks. We recommend registering with your embassy and keeping emergency numbers handy.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}

// Helper Text Generators
function getSeismicMessage(level: string) {
    if (level === 'Stable') return "Zero seismic activity detected in 30 years.";
    if (level === 'Low') return "Rare minor tremors. Buildings are earthquake-resistant.";
    if (level === 'Medium') return "Moderate seismic activity. Occasional tremors possible.";
    if (level === 'High') return "Active seismic zone. Multiple earthquakes per year.";
    return "Very high seismic risk. Ring of Fire territory.";
}

function getFloodMessage(level: string) {
    if (level === 'Minimal') return "Minimal flood risk. Well-drained terrain.";
    if (level === 'Low') return "Low flood risk. Rare flash flood events.";
    if (level === 'Medium') return "Moderate flood risk during monsoon/rainy season.";
    return "High flood risk. Check local weather alerts.";
}

function getMonthName(month?: number): string {
    if (!month) return "";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1] || "";
}


