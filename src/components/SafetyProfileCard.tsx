"use client";

import { Card, Title, Badge, Metric, Text } from "@tremor/react";
import { Activity, AlertTriangle, Shield, Info, Wind, Mountain, Droplets, CloudRain } from "lucide-react";
import { SafetyProfile } from "@/lib/data";

interface SafetyProfileCardProps {
    safetyProfile?: SafetyProfile;
    cityName: string;
}

export default function SafetyProfileCard({ safetyProfile, cityName }: SafetyProfileCardProps) {
    if (!safetyProfile) {
        return null;
    }

    const { seismic, hurricane, volcano, flood, air_quality } = safetyProfile;

    // Determine color based on risk level
    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case "Stable":
            case "Low":
                return "emerald";
            case "Medium":
                return "yellow";
            case "High":
            case "Very High":
                return "red";
            default:
                return "gray";
        }
    };

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel) {
            case "Stable":
            case "Low":
                return <Shield className="w-5 h-5 text-emerald-500" />;
            case "Medium":
                return <Info className="w-5 h-5 text-yellow-500" />;
            case "High":
            case "Very High":
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            default:
                return <Activity className="w-5 h-5 text-gray-500" />;
        }
    };

    const getRiskMessage = (riskLevel: string, count: number, avgPerYear: number) => {
        switch (riskLevel) {
            case "Stable":
                return "Zero seismic activity in 30 years. Stable ground. Sleep tight!";
            case "Low":
                return `Minor tremors possible (~${avgPerYear}/year). Buildings are earthquake-resistant.`;
            case "Medium":
                return `Moderate seismic activity (~${avgPerYear}/year). Familiarize yourself with safety procedures.`;
            case "High":
                return `High seismic risk (~${avgPerYear}/year). Download earthquake alert app and know evacuation routes.`;
            case "Very High":
                return `Very high seismic activity (~${avgPerYear}/year). This is Ring of Fire territory. Prepare accordingly.`;
            default:
                return "Seismic data unavailable.";
        }
    };

    const riskColor = getRiskColor(seismic.risk_level);
    const riskIcon = getRiskIcon(seismic.risk_level);
    const riskMessage = getRiskMessage(seismic.risk_level, seismic.count_30y, seismic.avg_per_year);

    return (
        <Card className="p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-4">
                <Title>Safety & Risk Profile</Title>
                {riskIcon}
            </div>

            {/* Seismic Stability Score */}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Text className="font-medium">Seismic Stability</Text>
                        <Badge color={riskColor} size="lg">
                            {seismic.seismic_score}/100
                        </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <Text className="text-sm text-gray-600">
                            Risk Level: <span className="font-semibold">{seismic.risk_level}</span>
                        </Text>
                    </div>

                    <Text className="text-sm text-gray-600 leading-relaxed">
                        {riskMessage}
                    </Text>
                </div>

                {/* Statistics */}
                {seismic.count_30y > 0 && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <Text className="text-xs text-gray-500 mb-1">Earthquakes (30y)</Text>
                            <Metric className="text-lg">{seismic.count_30y}</Metric>
                        </div>
                        <div>
                            <Text className="text-xs text-gray-500 mb-1">Max Magnitude</Text>
                            <Metric className="text-lg">
                                {seismic.max_magnitude ? seismic.max_magnitude.toFixed(1) : "N/A"}
                            </Metric>
                        </div>
                    </div>
                )}

                {/* Hurricane/Typhoon Risk */}
                {hurricane && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Wind className="w-4 h-4 text-blue-500" />
                            <Text className="font-medium">
                                {hurricane.storm_type} Zone
                            </Text>
                            <Badge color="blue" size="sm">
                                {hurricane.risk_level}
                            </Badge>
                        </div>
                        <Text className="text-sm text-gray-600">
                            {hurricane.is_year_round
                                ? "Year-round storm risk. Monitor weather forecasts closely."
                                : `Storm season: ${getMonthName(hurricane.season_start)} - ${getMonthName(hurricane.season_end)}`
                            }
                        </Text>
                    </div>
                )}

                {/* Volcano Proximity */}
                {volcano && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Mountain className="w-4 h-4 text-orange-500" />
                            <Text className="font-medium">
                                Active Volcanoes Nearby
                            </Text>
                            <Badge color="orange" size="sm">
                                {volcano.risk_level}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                            {volcano.nearby_volcanoes.map((v, idx) => (
                                <div key={idx} className="text-sm text-gray-600">
                                    <span className="font-medium">{v.name}</span>
                                    {" "}({v.distance_km}km) - {v.activity_level}
                                    {v.last_eruption > 0 && (
                                        <span className="text-xs text-gray-500">
                                            {" "}• Last: {v.last_eruption}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Flood Risk */}
                {flood && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="w-4 h-4 text-blue-600" />
                            <Text className="font-medium">
                                Flood Risk
                            </Text>
                            <Badge color={flood.risk_level === "High" ? "red" : flood.risk_level === "Medium" ? "yellow" : "blue"} size="sm">
                                {flood.risk_level}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            {flood.risk_factors.map((factor, idx) => (
                                <Text key={idx} className="text-xs text-gray-600">
                                    • {factor}
                                </Text>
                            ))}
                        </div>
                    </div>
                )}

                {/* Air Quality */}
                {air_quality && (
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <CloudRain className="w-4 h-4 text-purple-500" />
                            <Text className="font-medium">
                                Air Quality
                            </Text>
                            <Badge
                                color={
                                    air_quality.aqi <= 50 ? "emerald" :
                                    air_quality.aqi <= 100 ? "yellow" :
                                    air_quality.aqi <= 150 ? "orange" : "red"
                                }
                                size="sm"
                            >
                                AQI {air_quality.aqi}
                            </Badge>
                        </div>
                        <Text className="text-sm text-gray-600 mb-1">
                            PM2.5: {air_quality.pm25} µg/m³ • {air_quality.category}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {air_quality.health_note}
                        </Text>
                    </div>
                )}

                {/* Safety Tips for High Risk Areas */}
                {(seismic.risk_level === "High" || seismic.risk_level === "Very High" ||
                  volcano?.risk_level === "High" || volcano?.risk_level === "Very High") && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <Text className="text-sm font-semibold text-red-900 mb-1">
                                    Safety Tips for {cityName}
                                </Text>
                                <ul className="text-xs text-red-800 space-y-1 list-disc list-inside">
                                    {(seismic.risk_level === "High" || seismic.risk_level === "Very High") && (
                                        <>
                                            <li>Download earthquake alert apps</li>
                                            <li>Locate emergency exits and evacuation routes</li>
                                        </>
                                    )}
                                    {(volcano?.risk_level === "High" || volcano?.risk_level === "Very High") && (
                                        <>
                                            <li>Monitor volcanic activity alerts</li>
                                            <li>Know evacuation zones for volcanic eruptions</li>
                                        </>
                                    )}
                                    <li>Keep emergency supplies (water, flashlight, first aid kit)</li>
                                    <li>Ensure your travel insurance covers natural disasters</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

// Helper function to convert month number to name
function getMonthName(month: number): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[month - 1] || "";
}

