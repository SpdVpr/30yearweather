"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar, ThermometerSun, Waves, Users, DollarSign,
    ChevronRight, ChevronLeft, Search, Plane, MapPin, CloudRain,
    Filter
} from 'lucide-react';
import { useUnit } from '@/context/UnitContext';
import UnitToggle from '@/components/UnitToggle';

// Types matching our generated JSON
interface MonthStats {
    m: number;
    temp_max: number;
    temp_min: number;
    rain_days: number;
    rain_prob: number;
    wind_kmh: number;
    humidity: number;
    crowd: number;
    price: number;
    water_temp?: number;
    wave_height?: number;
}

interface CityIndex {
    slug: string;
    name: string;
    country: string;
    coords: { lat: number; lon: number };
    is_coastal: boolean;
    months: MonthStats[];
}

interface SearchCriteria {
    months: number[]; // Array of selected months
    tempRange: [number, number];
    waterTempRange: [number, number];
    waveHeightRange: [number, number];
    requiresSea: boolean;
    strictMode: boolean;
    maxRainDays: number;
    maxCrowd: number;
    maxPrice: number;
    activities: {
        surf: boolean;
    };
    originCoords?: { lat: number; lon: number };
}

// Dual Range Slider Component
function DualRangeSlider({
    min, max, value, onChange
}: {
    min: number; max: number; value: [number, number]; onChange: (val: [number, number]) => void
}) {
    const [minVal, maxVal] = value;
    const getPercent = (v: number) => Math.round(((v - min) / (max - min)) * 100);

    return (
        <div className="relative w-full h-8 flex items-center justify-center">
            {/* Visual Track (Background) */}
            <div className="absolute w-full h-1.5 bg-slate-200 rounded-full z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute h-full bg-orange-500"
                    style={{
                        left: `${getPercent(minVal)}%`,
                        width: `${getPercent(maxVal) - getPercent(minVal)}%`
                    }}
                />
            </div>

            {/* Inputs */}
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    onChange([value, maxVal]);
                }}
                className="thumb absolute inset-0 w-full h-full z-30 m-0 p-0 cursor-pointer pointer-events-none"
                style={{ zIndex: minVal > max - 10 ? 50 : 30 }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    onChange([minVal, value]);
                }}
                className="thumb absolute inset-0 w-full h-full z-40 m-0 p-0 cursor-pointer pointer-events-none"
            />
        </div>
    );
}

// Haversine distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function IntelligentSearch() {
    const router = useRouter();
    const { unit, convertTemp } = useUnit();

    // Helper to convert F back to C for logic (since our data is C)
    const toCelsius = (val: number) => unit === 'F' ? Math.round((val - 32) * 5 / 9) : val;
    // Helper to convert C to F for display (if needed for raw numbers not using convertTemp helper string)
    const toDisplay = (c: number) => unit === 'F' ? Math.round(c * 9 / 5 + 32) : c;

    // Data
    const [index, setIndex] = useState<CityIndex[]>([]);
    const [loading, setLoading] = useState(true);

    // UI Steps
    const [step, setStep] = useState(1);

    // Criteria State
    const [criteria, setCriteria] = useState<SearchCriteria>({
        months: [new Date().getMonth() + 1],
        tempRange: [20, 30],
        waterTempRange: [18, 30],
        waveHeightRange: [0.5, 3],
        requiresSea: false,
        strictMode: false,
        maxRainDays: 10,
        maxCrowd: 100, // 100 = don't care
        maxPrice: 100,
        activities: { surf: false },
        originCoords: { lat: 50.0755, lon: 14.4378 } // Default Prague
    });

    // Load Index
    useEffect(() => {
        fetch('/search-index.json')
            .then(res => res.json())
            .then(data => {
                setIndex(data);
                setLoading(false);
            })
            .catch(err => console.error("Failed to load search index", err));
    }, []);

    // Scoring Logic
    const results = useMemo(() => {
        if (!index.length) return [];

        return index.map(city => {
            // Filter months based on selection
            const relevantMonths = city.months.filter(m => criteria.months.includes(m.m));

            if (relevantMonths.length === 0) return { score: 0, monthStats: city.months[0], city };

            const scoredMonths = relevantMonths.map(m => {
                if (!m) return { score: 0, m };

                let score = 100;
                let penalties = 0;

                // 1. Temp (Bell curve-ish)
                const avgTemp = m.temp_max;
                if (avgTemp < criteria.tempRange[0] || avgTemp > criteria.tempRange[1]) {
                    if (criteria.strictMode) return { score: 0, m };
                    // Distance from range
                    const dist = Math.min(
                        Math.abs(avgTemp - criteria.tempRange[0]),
                        Math.abs(avgTemp - criteria.tempRange[1])
                    );
                    penalties += dist * 5; // -5 points per degree off
                }

                // 2. Rain
                if (m.rain_days > criteria.maxRainDays) {
                    if (criteria.strictMode) return { score: 0, m };
                    penalties += (m.rain_days - criteria.maxRainDays) * 3;
                }

                // 3. Sea Requirement & Water Temp
                if (criteria.requiresSea && !city.is_coastal) {
                    return { score: 0, m }; // Always kill
                }

                // Water Temp Logic
                if (city.is_coastal && m.water_temp !== undefined) {
                    if (m.water_temp < criteria.waterTempRange[0] || m.water_temp > criteria.waterTempRange[1]) {
                        if (criteria.strictMode) return { score: 0, m };
                        const dist = Math.min(
                            Math.abs(m.water_temp - criteria.waterTempRange[0]),
                            Math.abs(m.water_temp - criteria.waterTempRange[1])
                        );
                        penalties += dist * 3;
                    }
                } else if (!city.is_coastal && (criteria.requiresSea || criteria.waterTempRange[0] > 10)) {
                    if (criteria.strictMode) return { score: 0, m }; // strict about sea temp if implicit
                    // ... existing soft penalty
                    if (criteria.waterTempRange[0] > 15) penalties += 50;
                }

                // 4. Crowds (if user cares)
                if (criteria.maxCrowd < 100 && m.crowd > criteria.maxCrowd) {
                    if (criteria.strictMode) return { score: 0, m };
                    penalties += (m.crowd - criteria.maxCrowd) * 1;
                }

                // 5. Price
                if (criteria.maxPrice < 100 && m.price > criteria.maxPrice) {
                    if (criteria.strictMode) return { score: 0, m };
                    penalties += (m.price - criteria.maxPrice) * 1;
                }

                // 6. Surf
                if (criteria.activities.surf) {
                    if (!city.is_coastal) return { score: 0, m };
                    else {
                        // Wave Height Logic
                        if (m.wave_height !== undefined) {
                            if (m.wave_height < criteria.waveHeightRange[0] || m.wave_height > criteria.waveHeightRange[1]) {
                                if (criteria.strictMode) return { score: 0, m };
                                const dist = Math.min(
                                    Math.abs(m.wave_height - criteria.waveHeightRange[0]),
                                    Math.abs(m.wave_height - criteria.waveHeightRange[1])
                                );
                                penalties += dist * 20; // Steep penalty for wave height miss
                            }
                        } else {
                            // If data missing and strict?
                            if (criteria.strictMode) return { score: 0, m };

                            // Wind proxy soft penalty
                            if (m.wind_kmh < 15) {
                                penalties += 15;
                            }
                        }
                    }
                }

                // 7. Additional Strict Check for missing Water Temp if Sea is required
                if (criteria.requiresSea && city.is_coastal && m.water_temp === undefined && criteria.strictMode) {
                    return { score: 0, m };
                }

                return {
                    score: Math.max(0, 100 - penalties),
                    monthStats: m,
                    city
                };
            });

            // Return best month
            return scoredMonths.reduce((prev, current) => (prev.score > current.score) ? prev : current);

        }).filter((r): r is { score: number; monthStats: MonthStats; city: CityIndex } => r.score > 0 && !!r.monthStats).sort((a, b) => b.score - a.score);

    }, [index, criteria]);

    // Formatters
    const getMonthName = (m: number) => new Date(2024, m - 1, 1).toLocaleString('en-US', { month: 'long' });

    if (loading) return <div className="text-center p-12">Loading travel intelligence...</div>;

    // --- WIZARD UI ---

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col md:flex-row min-h-[600px]">

                {/* SIDEBAR / CONTROLS */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 md:p-8 border-r border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Find Your Trip</h2>
                        <div className="relative w-12 h-6">
                            <UnitToggle variant="light" />
                        </div>
                    </div>

                    <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">

                        {/* STRICT MODE TOGGLE */}
                        <button
                            onClick={() => setCriteria(c => ({ ...c, strictMode: !c.strictMode }))}
                            className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl transition-all font-bold text-sm ${criteria.strictMode
                                ? "bg-slate-900 text-white shadow-md"
                                : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            <Filter className="w-4 h-4" />
                            {criteria.strictMode ? "Strict Match Forcing On" : "Enable Strict Matching"}
                        </button>

                        {/* 1. TIMING */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block text-center">When? (Select one or more months)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => {
                                    const isSelected = criteria.months.includes(m);
                                    return (
                                        <button
                                            key={m}
                                            onClick={() => {
                                                setCriteria(c => {
                                                    if (isSelected) {
                                                        // Don't deselect if it's the last one
                                                        if (c.months.length <= 1) return c;
                                                        return { ...c, months: c.months.filter(month => month !== m) };
                                                    } else {
                                                        return { ...c, months: [...c.months, m] };
                                                    }
                                                });
                                            }}
                                            className={`py-2 px-1 text-sm font-semibold rounded-lg border transition-all ${isSelected
                                                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {new Date(2024, m - 1, 1).toLocaleString('en-US', { month: 'short' })}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-2 flex justify-center">
                                <button
                                    onClick={() => setCriteria(c => ({ ...c, months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }))}
                                    className="text-[10px] font-bold text-orange-600 uppercase hover:underline"
                                >
                                    Select All Months
                                </button>
                            </div>
                        </div>

                        {/* 2. PREFERENCES */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 block">Preferences</label>
                            <div className="space-y-3">
                                {/* SEA TOGGLE & SLIDER */}
                                <div className={`border rounded-xl transition-all duration-300 overflow-hidden ${criteria.requiresSea ? "border-blue-500 bg-blue-50/50" : "border-slate-200 bg-white"}`}>
                                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${criteria.requiresSea ? "bg-blue-500 border-blue-500" : "border-slate-300 bg-white"}`}>
                                            {criteria.requiresSea && <Waves className="w-3 h-3 text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={criteria.requiresSea} onChange={() => setCriteria(c => ({ ...c, requiresSea: !c.requiresSea }))} />
                                        <span className={`font-medium ${criteria.requiresSea ? "text-blue-800" : "text-slate-700"}`}>Must be by the sea</span>
                                    </label>

                                    {criteria.requiresSea && (
                                        <div className="px-3 pb-4 pt-1 border-t border-blue-100 animate-in slide-in-from-top-2 fade-in">
                                            <div className="flex justify-between text-xs text-blue-800 font-bold mb-2">
                                                <span>Sea Temperature</span>
                                                <span>{toDisplay(criteria.waterTempRange[0])}° - {toDisplay(criteria.waterTempRange[1])}°{unit}</span>
                                            </div>
                                            <DualRangeSlider
                                                min={toDisplay(10)}
                                                max={toDisplay(35)}
                                                value={[toDisplay(criteria.waterTempRange[0]), toDisplay(criteria.waterTempRange[1])]}
                                                onChange={(val) => setCriteria(c => ({
                                                    ...c,
                                                    waterTempRange: [toCelsius(val[0]), toCelsius(val[1])]
                                                }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* SURF TOGGLE & SLIDER */}
                                <div className={`border rounded-xl transition-all duration-300 overflow-hidden ${criteria.activities.surf ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 bg-white"}`}>
                                    <label className="flex items-center gap-3 p-3 cursor-pointer">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${criteria.activities.surf ? "bg-emerald-500 border-emerald-500" : "border-slate-300 bg-white"}`}>
                                            {criteria.activities.surf && <Waves className="w-3 h-3 text-white" />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={criteria.activities.surf} onChange={() => setCriteria(c => ({ ...c, activities: { ...c.activities, surf: !c.activities.surf } }))} />
                                        <span className={`font-medium ${criteria.activities.surf ? "text-emerald-800" : "text-slate-700"}`}>Surf Conditions</span>
                                    </label>

                                    {criteria.activities.surf && (
                                        <div className="px-3 pb-4 pt-1 border-t border-emerald-100 animate-in slide-in-from-top-2 fade-in">
                                            <div className="flex justify-between text-xs text-emerald-800 font-bold mb-2">
                                                <span>Wave Height</span>
                                                <span>{criteria.waveHeightRange[0]}m - {criteria.waveHeightRange[1]}m</span>
                                            </div>
                                            <DualRangeSlider
                                                min={0}
                                                max={6}
                                                value={criteria.waveHeightRange}
                                                onChange={(val) => setCriteria(c => ({
                                                    ...c,
                                                    waveHeightRange: val
                                                }))}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-200">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-600 flex gap-2 items-center"><Users className="w-4 h-4" /> Max Crowds</span>
                                            <span className="font-bold">{criteria.maxCrowd === 100 ? "Any" : criteria.maxCrowd + "%"}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="10"
                                            value={criteria.maxCrowd}
                                            onChange={(e) => setCriteria(c => ({ ...c, maxCrowd: Number(e.target.value) }))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-600 flex gap-2 items-center"><DollarSign className="w-4 h-4" /> Max Price</span>
                                            <span className="font-bold">{criteria.maxPrice === 100 ? "Any" : criteria.maxPrice + "%"}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="100" step="10"
                                            value={criteria.maxPrice}
                                            onChange={(e) => setCriteria(c => ({ ...c, maxPrice: Number(e.target.value) }))}
                                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. TEMPERATURE */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex justify-between">
                                Air Temp ({toDisplay(criteria.tempRange[0])}° - {toDisplay(criteria.tempRange[1])}°{unit})
                                <ThermometerSun className="w-4 h-4" />
                            </label>
                            <div className="px-1 py-2">
                                <DualRangeSlider
                                    min={toDisplay(-10)}
                                    max={toDisplay(40)}
                                    value={[toDisplay(criteria.tempRange[0]), toDisplay(criteria.tempRange[1])]}
                                    onChange={(val) => setCriteria(c => ({
                                        ...c,
                                        tempRange: [toCelsius(val[0]), toCelsius(val[1])]
                                    }))}
                                />
                            </div>
                        </div>

                        {/* 4. RAIN */}
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex justify-between">
                                Max Rainy Days ({criteria.maxRainDays})
                                <CloudRain className="w-4 h-4" />
                            </label>
                            <div className="px-1 py-2">
                                <input
                                    type="range" min="0" max="30" step="1"
                                    value={criteria.maxRainDays}
                                    onChange={(e) => setCriteria(c => ({ ...c, maxRainDays: Number(e.target.value) }))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* MAIN CONTENT / RESULTS */}
                <div className="flex-1 bg-white p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Top Matches</h3>
                            <p className="text-slate-500 text-sm">Based on {results.length} locations analysed</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar content-start">
                        {results.slice(0, 10).map((res, i) => {
                            return (
                                <div key={res.city.slug} className="group relative bg-white border border-slate-100 hover:border-orange-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                                            {/* Ideally use Next Image here, but for now simple img with valid path */}
                                            <img
                                                src={`/images/${res.city.slug}-hero.webp`}
                                                alt={res.city.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => (e.currentTarget.src = '/images/placeholder.jpg')}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-lg font-bold text-slate-800 truncate">{res.city.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-slate-500">{res.city.country}</span>
                                                <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                    {Math.round(res.score)}% Match
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-600 flex-wrap">
                                                <span className="flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded">
                                                    <ThermometerSun className="w-3 h-3" />
                                                    {toDisplay(res.monthStats.temp_max)}°{unit}
                                                </span>
                                                {res.monthStats.rain_days < 5 && (
                                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Dry</span>
                                                )}
                                                {res.monthStats.crowd < 40 && (
                                                    <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded">Quiet</span>
                                                )}
                                                {res.monthStats.water_temp !== undefined && (
                                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                                        <Waves className="w-3 h-3" />
                                                        {toDisplay(res.monthStats.water_temp)}°{unit}
                                                    </span>
                                                )}
                                                {res.monthStats.wave_height !== undefined && (
                                                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
                                                        <Waves className="w-3 h-3" />
                                                        {res.monthStats.wave_height}m
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/${res.city.slug}/${getMonthName(res.monthStats.m).toLowerCase()}`)}
                                        className="mt-4 w-full py-2.5 bg-slate-50 group-hover:bg-orange-600 group-hover:text-white text-slate-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        View in {getMonthName(res.monthStats.m)} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}

                        {results.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-400">
                                <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No destinations match your strict criteria.</p>
                                <button onClick={() => setCriteria(c => ({ ...c, tempRange: [-10, 40], requiresSea: false }))} className="text-orange-600 font-bold mt-2 hover:underline">Reset Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add simple scrollbar styles
const styles = `
  /* Reset */
  .thumb {
    -webkit-appearance: none;
    appearance: none;
    pointer-events: none; /* Let clicks pass through track */
    background: transparent;
  }
  
  /* Webkit Thumb */
  .thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    pointer-events: auto; /* Capture clicks on thumb */
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f97316;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: grab;
    z-index: 50;
    position: relative;
  }
  
  /* Firefox Thumb */
  .thumb::-moz-range-thumb {
    pointer-events: auto;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f97316;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: grab;
    z-index: 50;
    border: none;
  }

  .thumb:active::-webkit-slider-thumb {
    cursor: grabbing;
    transform: scale(1.1);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 20px;
  }
`;
