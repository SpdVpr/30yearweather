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
            case 'Excellent': return 'text-emerald-600 bg-emerald-50';
            case 'Fair': return 'text-orange-600 bg-orange-50';
            case 'Poor': return 'text-red-600 bg-red-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    // Calculate Meteo-Health Score
    const calculateHealthScore = () => {
        let score = 100;
        if (healthImpact.migraine_risk === 'High') score -= 30;
        if (healthImpact.migraine_risk === 'Medium') score -= 15;
        if (healthImpact.joint_pain_risk === 'High') score -= 30;
        if (healthImpact.joint_pain_risk === 'Medium') score -= 15;
        return Math.max(0, score);
    };

    const healthScore = calculateHealthScore();
    let scoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (healthScore < 80) scoreColor = 'text-yellow-700 bg-yellow-50 border-yellow-100';
    if (healthScore < 50) scoreColor = 'text-red-700 bg-red-50 border-red-100';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 h-full">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-stone-900">Health & Wellbeing</h3>
                        <p className="text-sm text-stone-500">Meteo-Health Forecast</p>
                    </div>
                </div>

                {/* Score Badge */}
                <div className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl border ${scoreColor}`}>
                    <span className="text-2xl font-bold">{healthScore}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">Score</span>
                </div>
            </div>

            {/* Pressure Info */}
            <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700">Atmospheric Pressure</span>
                    <span className="text-lg font-bold text-stone-900">
                        {pressureStats.mean_hpa ? `${pressureStats.mean_hpa} hPa` : 'N/A'}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500">Volatility:</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${pressureStats.volatility === 'High' ? 'bg-red-100 text-red-700' :
                            pressureStats.volatility === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-emerald-100 text-emerald-700'
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
                        <p className="text-xs text-stone-500 leading-relaxed">
                            {healthImpact.migraine_risk === 'High' &&
                                'Rapid pressure changes detected. High risk for meteosensitive people.'}
                            {healthImpact.migraine_risk === 'Medium' &&
                                'Moderate fluctuations. Some sensitivity possible.'}
                            {healthImpact.migraine_risk === 'Low' &&
                                'Stable conditions. Low risk of headaches.'}
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
                        <p className="text-xs text-stone-500 leading-relaxed">
                            {healthImpact.joint_pain_risk === 'High' &&
                                'Low pressure & humidity may aggravate joints.'}
                            {healthImpact.joint_pain_risk === 'Medium' &&
                                'Mild discomfort possible for arthritic conditions.'}
                            {healthImpact.joint_pain_risk === 'Low' &&
                                'Weather unlikely to affect joint pain.'}
                        </p>
                    </div>
                </div>

                {/* Fishing Conditions */}
                <div className="flex items-start gap-3 pt-4 border-t border-dashed border-stone-200">
                    <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                        <Fish className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-stone-700">Fishing Index</span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getFishingColor(healthImpact.fishing_conditions)}`}>
                                {healthImpact.fishing_conditions}
                            </span>
                        </div>
                        <p className="text-xs text-stone-500 leading-relaxed">
                            {healthImpact.fishing_conditions === 'Excellent' &&
                                'Fish are active due to pressure changes.'}
                            {healthImpact.fishing_conditions === 'Fair' &&
                                'Moderate fish activity expected.'}
                            {healthImpact.fishing_conditions === 'Poor' &&
                                'High pressure may reduce activity.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
