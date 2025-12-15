"use client";

import { HealthImpact, PressureStats } from '@/lib/data';
import { Activity, Heart, Fish, AlertTriangle } from 'lucide-react';

interface HealthImpactCardProps {
    healthImpact?: HealthImpact;
    pressureStats?: PressureStats;
}

export default function HealthImpactCard({ healthImpact, pressureStats }: HealthImpactCardProps) {
    if (!healthImpact || !pressureStats) {
        return null; // Don't render if no data
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'High': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-orange-600 bg-orange-50';
            case 'Low': return 'text-green-600 bg-green-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getFishingColor = (conditions: string) => {
        switch (conditions) {
            case 'Excellent': return 'text-green-600 bg-green-50';
            case 'Fair': return 'text-orange-600 bg-orange-50';
            case 'Poor': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Heart className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-stone-900">Health & Wellbeing</h3>
                    <p className="text-sm text-stone-500">Based on atmospheric pressure patterns</p>
                </div>
            </div>

            {/* Pressure Info */}
            <div className="mb-6 p-4 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">Atmospheric Pressure</span>
                    <span className="text-lg font-bold text-stone-900">
                        {pressureStats.mean_hpa ? `${pressureStats.mean_hpa} hPa` : 'N/A'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Volatility:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        pressureStats.volatility === 'High' ? 'bg-red-100 text-red-700' :
                        pressureStats.volatility === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {pressureStats.volatility}
                    </span>
                </div>
            </div>

            {/* Health Impacts Grid */}
            <div className="space-y-4">
                {/* Migraine Risk */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-700">Migraine Risk</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getRiskColor(healthImpact.migraine_risk)}`}>
                                {healthImpact.migraine_risk}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500">
                            {healthImpact.migraine_risk === 'High' && 
                                'Rapid pressure changes detected. Meteosensitive individuals may experience headaches.'}
                            {healthImpact.migraine_risk === 'Medium' && 
                                'Moderate pressure fluctuations. Some sensitivity possible.'}
                            {healthImpact.migraine_risk === 'Low' && 
                                'Stable atmospheric conditions. Low risk of weather-related headaches.'}
                        </p>
                    </div>
                </div>

                {/* Joint Pain Risk */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                        <Activity className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-700">Joint Pain Risk</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getRiskColor(healthImpact.joint_pain_risk)}`}>
                                {healthImpact.joint_pain_risk}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500">
                            {healthImpact.joint_pain_risk === 'High' && 
                                'Low pressure + humidity may aggravate arthritis and joint pain.'}
                            {healthImpact.joint_pain_risk === 'Medium' && 
                                'Conditions may cause mild discomfort for those with joint issues.'}
                            {healthImpact.joint_pain_risk === 'Low' && 
                                'Weather conditions unlikely to affect joint pain.'}
                        </p>
                    </div>
                </div>

                {/* Fishing Conditions */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                        <Fish className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-700">Fishing Conditions</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getFishingColor(healthImpact.fishing_conditions)}`}>
                                {healthImpact.fishing_conditions}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500">
                            {healthImpact.fishing_conditions === 'Excellent' && 
                                '🎣 Fish are active! Changing pressure triggers feeding behavior.'}
                            {healthImpact.fishing_conditions === 'Fair' && 
                                'Moderate fishing conditions. Fish may be somewhat active.'}
                            {healthImpact.fishing_conditions === 'Poor' && 
                                'High stable pressure. Fish tend to be less active.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-6 pt-4 border-t border-stone-200">
                <p className="text-xs text-stone-400 text-center">
                    Based on 30-year atmospheric pressure patterns. Individual sensitivity varies.
                </p>
            </div>
        </div>
    );
}

