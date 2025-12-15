"use client";

import { Card, Title, Text } from "@tremor/react";
import { Snowflake, Sun, Droplets, CloudSun } from "lucide-react";
import { DayStats, WeatherCondition } from "@/lib/data";

interface ExtendedWeatherCardProps {
    stats: DayStats;
    weatherCondition?: WeatherCondition;
}

export default function ExtendedWeatherCard({ stats, weatherCondition }: ExtendedWeatherCardProps) {
    // Don't render if no extended data available
    const hasExtendedData = stats.snowfall_cm !== undefined || 
                           stats.sunshine_hours !== undefined || 
                           stats.humidity_percent !== undefined ||
                           weatherCondition !== undefined;

    if (!hasExtendedData) {
        return null;
    }

    const getWeatherIcon = (icon: string) => {
        switch (icon) {
            case 'sun': return '☀️';
            case 'sun-cloud': return '🌤️';
            case 'cloud-sun': return '⛅';
            case 'cloud': return '☁️';
            case 'fog': return '🌫️';
            case 'drizzle': return '🌦️';
            case 'rain': return '🌧️';
            case 'rain-heavy': return '⛈️';
            case 'sleet': return '🌨️';
            case 'snow': return '❄️';
            case 'snow-heavy': return '🌨️';
            case 'thunderstorm': return '⛈️';
            case 'thunderstorm-hail': return '⛈️';
            default: return '🌡️';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'clear': return 'text-yellow-600 bg-yellow-50';
            case 'cloudy': return 'text-gray-600 bg-gray-50';
            case 'rain': return 'text-blue-600 bg-blue-50';
            case 'snow': return 'text-cyan-600 bg-cyan-50';
            case 'storm': return 'text-red-600 bg-red-50';
            case 'fog': return 'text-gray-500 bg-gray-100';
            case 'freezing': return 'text-purple-600 bg-purple-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <Card className="p-6 rounded-xl shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <CloudSun className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <Title>Extended Weather Details</Title>
                    <Text className="text-sm text-stone-500">Additional atmospheric conditions</Text>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather Condition */}
                {weatherCondition && (
                    <div className="col-span-full p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl">{getWeatherIcon(weatherCondition.icon)}</span>
                            <div className="flex-1">
                                <Text className="text-sm text-stone-600 mb-1">Typical Conditions</Text>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-stone-900">
                                        {weatherCondition.description}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getSeverityColor(weatherCondition.severity)}`}>
                                        {weatherCondition.severity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sunshine Duration */}
                {stats.sunshine_hours !== undefined && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Sun className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <Text className="text-sm text-stone-600 mb-1">Sunshine Duration</Text>
                                <div className="text-2xl font-bold text-amber-900">
                                    {stats.sunshine_hours.toFixed(1)}h
                                </div>
                                <Text className="text-xs text-stone-500 mt-1">
                                    {stats.sunshine_hours >= 10 ? 'Excellent for outdoor activities' :
                                     stats.sunshine_hours >= 6 ? 'Good daylight hours' :
                                     stats.sunshine_hours >= 3 ? 'Limited sunshine' :
                                     'Mostly cloudy'}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                {/* Humidity */}
                {stats.humidity_percent !== undefined && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Droplets className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <Text className="text-sm text-stone-600 mb-1">Relative Humidity</Text>
                                <div className="text-2xl font-bold text-blue-900">
                                    {stats.humidity_percent}%
                                </div>
                                <Text className="text-xs text-stone-500 mt-1">
                                    {stats.humidity_percent >= 80 ? 'Very humid, may feel muggy' :
                                     stats.humidity_percent >= 60 ? 'Comfortable humidity' :
                                     stats.humidity_percent >= 40 ? 'Moderate humidity' :
                                     'Dry air'}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}

                {/* Snowfall */}
                {stats.snowfall_cm !== undefined && stats.snowfall_cm > 0 && (
                    <div className="col-span-full p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-cyan-100 rounded-lg">
                                <Snowflake className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div className="flex-1">
                                <Text className="text-sm text-stone-600 mb-1">Average Snowfall</Text>
                                <div className="text-2xl font-bold text-cyan-900">
                                    {stats.snowfall_cm.toFixed(1)} cm
                                </div>
                                <Text className="text-xs text-stone-500 mt-1">
                                    {stats.snowfall_cm >= 10 ? '❄️ Heavy snow expected - Winter sports conditions!' :
                                     stats.snowfall_cm >= 5 ? '❄️ Moderate snow - Good for skiing' :
                                     stats.snowfall_cm >= 1 ? '❄️ Light snow possible' :
                                     'Trace amounts'}
                                </Text>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}

