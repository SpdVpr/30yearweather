"use client";

import { GeoInfo } from '@/lib/data';
import { Mountain, Sun, Beer, AlertCircle } from 'lucide-react';

interface AltitudeWarningCardProps {
    geoInfo?: GeoInfo;
}

export default function AltitudeWarningCard({ geoInfo }: AltitudeWarningCardProps) {
    if (!geoInfo || !geoInfo.elevation) {
        return null; // Don't render if no elevation data
    }

    const { elevation, is_high_altitude, altitude_effects } = geoInfo;

    // Only show if elevation is significant (> 500m) or high altitude
    if (elevation < 500 && !is_high_altitude) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Mountain className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-blue-900">Altitude Effects</h3>
                    <p className="text-sm text-blue-600">
                        {elevation}m above sea level
                        {is_high_altitude && <span className="ml-2 text-xs font-semibold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">HIGH ALTITUDE</span>}
                    </p>
                </div>
            </div>

            {altitude_effects && (
                <div className="space-y-4">
                    {/* UV Warning */}
                    {altitude_effects.sunburn_risk !== 'Normal' && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-200">
                            <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                                <Sun className="w-4 h-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-stone-900">UV Radiation</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                        altitude_effects.sunburn_risk === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                        {altitude_effects.sunburn_risk} Risk
                                    </span>
                                </div>
                                <p className="text-xs text-stone-600 mb-2">
                                    UV radiation is <strong>{altitude_effects.uv_multiplier}x stronger</strong> at this altitude compared to sea level.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-orange-700 bg-orange-50 px-3 py-2 rounded">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Use SPF 50+ sunscreen, even on cloudy days. Reapply every 2 hours.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Alcohol Warning (High Altitude Only) */}
                    {altitude_effects.alcohol_warning && (
                        <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-purple-200">
                            <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                                <Beer className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-stone-900">Alcohol Effects</span>
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 text-purple-700">
                                        Enhanced
                                    </span>
                                </div>
                                <p className="text-xs text-stone-600 mb-2">
                                    At high altitude, alcohol affects you <strong>faster and stronger</strong> due to lower oxygen levels.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-3 py-2 rounded">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>One drink may feel like two. Stay hydrated and pace yourself.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* General Altitude Tips */}
                    {is_high_altitude && (
                        <div className="p-4 bg-white rounded-lg border border-blue-200">
                            <h4 className="text-sm font-bold text-blue-900 mb-2">High Altitude Tips</h4>
                            <ul className="space-y-1 text-xs text-stone-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Drink 3-4 liters of water daily to prevent altitude sickness</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Take it easy on your first day - avoid strenuous activity</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Watch for symptoms: headache, nausea, dizziness, fatigue</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Eat light, carb-rich meals to help your body adjust</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Info Footer */}
            <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-xs text-blue-600 text-center">
                    Altitude effects vary by individual. Consult a doctor if you have health concerns.
                </p>
            </div>
        </div>
    );
}

