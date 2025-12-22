"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Calendar,
    MapPin,
    ChevronDown,
    Thermometer,
    Waves,
    X,
    Filter,
    Sun,
    Snowflake,
    CloudRain,
    Globe,
    Check,
    Heart,
    DollarSign
} from "lucide-react";

interface CityInfo {
    slug: string;
    name: string;
    country: string;
    desc: string;
    bestMonths?: string;
    avgTemp?: number;
    avgRainfall?: number;
    avgRainProb?: number;
    avgWaveHeight?: number;
    avgWaterTemp?: number;
    avgWeddingScore?: number;
    priceLevel?: number;
    isCoastal?: boolean;
    region?: string;
}

interface SmartCityFilterProps {
    cities: CityInfo[];
    onFilterChange: (filteredCities: CityInfo[], filters: FilterState) => void;
    totalCities: number;
}

export interface FilterState {
    search: string;
    months: string[]; // Multi-select months
    dayFrom: number | null; // Range start day (1-31)
    dayTo: number | null; // Range end day (1-31)
    region: string | null;
    tempRange: 'all' | 'hot' | 'warm' | 'mild' | 'cool';
    waveRange: 'all' | 'calm' | 'moderate' | 'high';
    weddingMin: number; // 0-100, minimum wedding score
    priceLevel: 'all' | 'budget' | 'moderate' | 'expensive';
    minWaterTemp: number | null; // Minimum water temperature or null
    rainProbMax: number | null; // Maximum rain probability or null
    coastalOnly: boolean;
}

const MONTHS = [
    { value: '1', label: 'January', short: 'Jan' },
    { value: '2', label: 'February', short: 'Feb' },
    { value: '3', label: 'March', short: 'Mar' },
    { value: '4', label: 'April', short: 'Apr' },
    { value: '5', label: 'May', short: 'May' },
    { value: '6', label: 'June', short: 'Jun' },
    { value: '7', label: 'July', short: 'Jul' },
    { value: '8', label: 'August', short: 'Aug' },
    { value: '9', label: 'September', short: 'Sep' },
    { value: '10', label: 'October', short: 'Oct' },
    { value: '11', label: 'November', short: 'Nov' },
    { value: '12', label: 'December', short: 'Dec' },
];

const REGIONS = [
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia & Pacific' },
    { value: 'middle-east', label: 'Middle East' },
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'africa', label: 'Africa' },
    { value: 'caribbean', label: 'Caribbean' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'mountain', label: 'Mountain' },
];

const TEMP_RANGES = [
    { value: 'all', label: 'Any Temperature', icon: Thermometer, color: 'text-stone-400' },
    { value: 'hot', label: 'Hot (25°C+)', icon: Sun, min: 25, color: 'text-red-500' },
    { value: 'warm', label: 'Warm (18-25°C)', icon: Sun, min: 18, max: 25, color: 'text-orange-500' },
    { value: 'mild', label: 'Mild (10-18°C)', icon: CloudRain, min: 10, max: 18, color: 'text-emerald-500' },
    { value: 'cool', label: 'Cool (<10°C)', icon: Snowflake, max: 10, color: 'text-blue-500' },
];

const WAVE_RANGES = [
    { value: 'all', label: 'Any Waves', icon: Waves, color: 'text-stone-400' },
    { value: 'calm', label: 'Calm (<0.5m)', icon: Waves, max: 0.5, color: 'text-teal-500' },
    { value: 'moderate', label: 'Moderate (0.5-1.5m)', icon: Waves, min: 0.5, max: 1.5, color: 'text-blue-500' },
    { value: 'high', label: 'High (1.5m+)', icon: Waves, min: 1.5, color: 'text-indigo-600' },
];

export default function SmartCityFilter({ cities, onFilterChange, totalCities }: SmartCityFilterProps) {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);

    // Filter state
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        months: [],
        dayFrom: null,
        dayTo: null,
        region: null,
        tempRange: 'all',
        waveRange: 'all',
        weddingMin: 0,
        priceLevel: 'all',
        minWaterTemp: null,
        rainProbMax: null,
        coastalOnly: false,
    });

    // Dropdown states
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const [showRegionDropdown, setShowRegionDropdown] = useState(false);
    const [showTempDropdown, setShowTempDropdown] = useState(false);
    const [showWaveDropdown, setShowWaveDropdown] = useState(false);
    const [showBeachDropdown, setShowBeachDropdown] = useState(false);
    const [showRainDropdown, setShowRainDropdown] = useState(false);
    const [showWeddingDropdown, setShowWeddingDropdown] = useState(false);
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowCityDropdown(false);
                setShowMonthDropdown(false);
                setShowRegionDropdown(false);
                setShowTempDropdown(false);
                setShowWaveDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter cities based on all criteria
    const filteredCities = useMemo(() => {
        return cities.filter(city => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchesSearch =
                    city.name.toLowerCase().includes(searchLower) ||
                    city.country.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Region filter
            if (filters.region && city.region !== filters.region) return false;

            // Temperature filter
            if (filters.tempRange !== 'all' && city.avgTemp !== undefined) {
                const range = TEMP_RANGES.find(r => r.value === filters.tempRange);
                if (range) {
                    if (range.min !== undefined && city.avgTemp < range.min) return false;
                    if (range.max !== undefined && city.avgTemp >= range.max) return false;
                }
            }

            // Wave height filter (only for coastal cities with wave data)
            if (filters.waveRange !== 'all') {
                if (!city.isCoastal || city.avgWaveHeight === undefined) return false;
                const range = WAVE_RANGES.find(r => r.value === filters.waveRange);
                if (range) {
                    if (range.min !== undefined && city.avgWaveHeight < range.min) return false;
                    if (range.max !== undefined && city.avgWaveHeight >= range.max) return false;
                }
            }

            // Coastal filter & Water Temp
            if (filters.coastalOnly && !city.isCoastal) return false;
            if (filters.minWaterTemp !== null) {
                if (!city.isCoastal) return false;
                if (city.avgWaterTemp === undefined || city.avgWaterTemp < filters.minWaterTemp) return false;
            }

            // Rain Probability filter
            if (filters.rainProbMax !== null) {
                if (city.avgRainProb === undefined || city.avgRainProb > filters.rainProbMax) return false;
            }

            // Wedding score filter
            if (filters.weddingMin > 0 && (city.avgWeddingScore === undefined || city.avgWeddingScore < filters.weddingMin)) return false;

            // Price level filter
            if (filters.priceLevel !== 'all') {
                const priceLevelMap = { 'budget': 1, 'moderate': 2, 'expensive': 3 };
                const targetLevel = priceLevelMap[filters.priceLevel];
                if (city.priceLevel !== targetLevel) return false;
            }

            return true;
        });
    }, [cities, filters]);

    // Notify parent of filter changes
    useEffect(() => {
        onFilterChange(filteredCities, filters);
    }, [filteredCities, filters, onFilterChange]);

    // Count active filters
    const activeFilterCount = [
        filters.months.length > 0,
        filters.dayFrom !== null || filters.dayTo !== null,
        filters.region !== null,
        filters.tempRange !== 'all',
        filters.waveRange !== 'all',
        filters.weddingMin > 0,
        filters.priceLevel !== 'all',
        filters.minWaterTemp !== null,
        filters.rainProbMax !== null,
        filters.coastalOnly,
    ].filter(Boolean).length;

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            search: '',
            months: [],
            dayFrom: null,
            dayTo: null,
            region: null,
            tempRange: 'all',
            waveRange: 'all',
            weddingMin: 0,
            priceLevel: 'all',
            minWaterTemp: null,
            rainProbMax: null,
            coastalOnly: false,
        });
    };

    // Close all dropdowns
    const closeAllDropdowns = () => {
        setShowMonthDropdown(false);
        setShowDayDropdown(false);
        setShowRegionDropdown(false);
        setShowTempDropdown(false);
        setShowWaveDropdown(false);
        setShowBeachDropdown(false);
        setShowRainDropdown(false);
        setShowWeddingDropdown(false);
        setShowPriceDropdown(false);
    };

    // Toggle month selection
    const toggleMonth = (monthValue: string) => {
        setFilters(prev => ({
            ...prev,
            months: prev.months.includes(monthValue)
                ? prev.months.filter(m => m !== monthValue)
                : [...prev.months, monthValue]
        }));
    };

    // Navigate to specific city
    const handleGoToCity = (city: CityInfo) => {
        if (filters.months.length > 0) {
            const monthName = MONTHS.find(m => m.value === filters.months[0])?.label.toLowerCase() || 'january';
            const day = filters.dayFrom || 15;
            router.push(`/${city.slug}/${monthName}/${day}`);
        } else if (filters.dayFrom) {
            // If only day selected, use current month
            router.push(`/${city.slug}/january/${filters.dayFrom}`);
        } else {
            router.push(`/${city.slug}`);
        }
    };

    // Get display text for selected day range
    const getDaysDisplayText = () => {
        if (filters.dayFrom === null && filters.dayTo === null) return 'Days';
        if (filters.dayFrom !== null && filters.dayTo !== null) {
            if (filters.dayFrom === filters.dayTo) return `Day ${filters.dayFrom}`;
            return `${filters.dayFrom} - ${filters.dayTo}`;
        }
        if (filters.dayFrom !== null) return `From ${filters.dayFrom}`;
        if (filters.dayTo !== null) return `To ${filters.dayTo}`;
        return 'Days';
    };

    // Get display text for selected months
    const getMonthsDisplayText = () => {
        if (filters.months.length === 0) return 'Month';
        if (filters.months.length === 1) {
            return MONTHS.find(m => m.value === filters.months[0])?.short || 'Month';
        }
        if (filters.months.length <= 3) {
            return filters.months.map(m => MONTHS.find(mo => mo.value === m)?.short).join(', ');
        }
        return `${filters.months.length} months`;
    };

    // Cities matching current search for dropdown
    const searchResults = filters.search.length > 0
        ? cities.filter(c =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.country.toLowerCase().includes(filters.search.toLowerCase())
        ).slice(0, 8)
        : [];

    return (
        <div className="w-full max-w-6xl mx-auto" ref={wrapperRef}>
            {/* Main Search Bar */}
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-3">
                {/* First Row: Search + Region */}
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <div className="flex items-center h-12 px-4 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors">
                            <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search cities..."
                                value={filters.search}
                                onChange={(e) => {
                                    setFilters(prev => ({ ...prev, search: e.target.value }));
                                    setShowCityDropdown(e.target.value.length > 0);
                                }}
                                onFocus={() => setShowCityDropdown(filters.search.length > 0)}
                                className="flex-1 bg-transparent outline-none text-stone-900 font-medium placeholder-stone-400"
                            />
                            {filters.search && (
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                    className="p-1 hover:bg-stone-200 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-stone-400" />
                                </button>
                            )}
                        </div>

                        {/* City Dropdown */}
                        {showCityDropdown && searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50">
                                {searchResults.map(city => (
                                    <button
                                        key={city.slug}
                                        onClick={() => handleGoToCity(city)}
                                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors text-left"
                                    >
                                        <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-stone-800 truncate">{city.name}</div>
                                            <div className="text-xs text-stone-500">{city.country}</div>
                                        </div>
                                        {city.avgTemp && (
                                            <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                                {Math.round(city.avgTemp)}°C
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Region Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowRegionDropdown(!showRegionDropdown);
                            }}
                            className={`h-12 px-4 rounded-xl flex items-center gap-2 transition-all w-full md:w-auto justify-between ${filters.region
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
                                }`}
                        >
                            <Globe className="w-5 h-5 shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.region
                                    ? REGIONS.find(r => r.value === filters.region)?.label
                                    : 'Region'}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {showRegionDropdown && (
                            <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-full md:w-56 max-h-80 overflow-y-auto">
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, region: null }));
                                        setShowRegionDropdown(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors ${!filters.region ? 'bg-stone-100 font-semibold' : ''
                                        }`}
                                >
                                    All Regions
                                </button>
                                {REGIONS.map(region => (
                                    <button
                                        key={region.value}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, region: region.value }));
                                            setShowRegionDropdown(false);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left hover:bg-purple-50 transition-colors ${filters.region === region.value ? 'bg-purple-100 text-purple-700 font-semibold' : ''
                                            }`}
                                    >
                                        {region.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Second Row: Other Filters */}
                <div className="flex flex-wrap gap-2">
                    {/* Month Filter - Multi-select */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowMonthDropdown(!showMonthDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.months.length > 0
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                                {getMonthsDisplayText()}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showMonthDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-56 max-h-80 overflow-y-auto">
                                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-stone-500 uppercase">Select months</span>
                                    {filters.months.length > 0 && (
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, months: [] }))}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                {MONTHS.map(month => (
                                    <button
                                        key={month.value}
                                        onClick={() => toggleMonth(month.value)}
                                        className={`w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors text-sm flex items-center justify-between ${filters.months.includes(month.value) ? 'bg-blue-100 text-blue-700' : ''
                                            }`}
                                    >
                                        <span>{month.label}</span>
                                        {filters.months.includes(month.value) && (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Day Range Filter - Single row, first click = from, second click = to */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowDayDropdown(!showDayDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.dayFrom !== null || filters.dayTo !== null
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <span className="font-medium whitespace-nowrap">
                                {getDaysDisplayText()}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showDayDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-64">
                                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                                    <span className="text-xs text-stone-500">
                                        {filters.dayFrom === null
                                            ? "Click to set start day"
                                            : filters.dayTo === null
                                                ? "Click to set end day"
                                                : `${filters.dayFrom} - ${filters.dayTo}`}
                                    </span>
                                    {(filters.dayFrom !== null || filters.dayTo !== null) && (
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, dayFrom: null, dayTo: null }))}
                                            className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {/* Single row of days */}
                                <div className="p-3">
                                    <div className="grid grid-cols-7 gap-1.5">
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                                            const isFrom = filters.dayFrom === d;
                                            const isTo = filters.dayTo === d;
                                            const isInRange = filters.dayFrom !== null && filters.dayTo !== null && d > filters.dayFrom && d < filters.dayTo;

                                            return (
                                                <button
                                                    key={d}
                                                    onClick={() => {
                                                        setFilters(prev => {
                                                            // If no from set, or both are set (start new selection)
                                                            if (prev.dayFrom === null || (prev.dayFrom !== null && prev.dayTo !== null)) {
                                                                return { ...prev, dayFrom: d, dayTo: null };
                                                            }
                                                            // If from is set but to is not, set to
                                                            if (prev.dayFrom !== null && prev.dayTo === null) {
                                                                // If clicking before from, swap
                                                                if (d < prev.dayFrom) {
                                                                    return { ...prev, dayFrom: d, dayTo: prev.dayFrom };
                                                                }
                                                                return { ...prev, dayTo: d };
                                                            }
                                                            return prev;
                                                        });
                                                    }}
                                                    className={`w-7 h-7 rounded-md text-xs font-medium flex items-center justify-center transition-all ${isFrom || isTo
                                                        ? 'bg-blue-600 text-white shadow-sm'
                                                        : isInRange
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'hover:bg-blue-50 text-stone-700'
                                                        }`}
                                                >
                                                    {d}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quick presets */}
                                <div className="px-3 pb-3 pt-1 border-t border-stone-100 flex flex-wrap gap-1.5">
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 1, dayTo: 7 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">Week 1</button>
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 8, dayTo: 14 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">Week 2</button>
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 15, dayTo: 21 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">Week 3</button>
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 22, dayTo: 28 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">Week 4</button>
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 1, dayTo: 15 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">1st Half</button>
                                    <button onClick={() => { setFilters(prev => ({ ...prev, dayFrom: 16, dayTo: 31 })); }} className="px-2 py-1 text-[10px] bg-stone-100 hover:bg-blue-100 rounded font-medium text-stone-600">2nd Half</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Temperature Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowTempDropdown(!showTempDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.tempRange !== 'all'
                                ? 'bg-orange-100 text-orange-700 border border-orange-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <Thermometer className="w-4 h-4 shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.tempRange === 'all' ? 'Temp' : TEMP_RANGES.find(t => t.value === filters.tempRange)?.label.split(' ')[0]}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showTempDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-48">
                                {TEMP_RANGES.map(temp => (
                                    <button
                                        key={temp.value}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, tempRange: temp.value as FilterState['tempRange'] }));
                                            setShowTempDropdown(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-sm ${filters.tempRange === temp.value ? 'bg-orange-100 text-orange-700 font-semibold' : ''
                                            }`}
                                    >
                                        <temp.icon className={`w-4 h-4 ${(temp as any).color}`} />
                                        {temp.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Wave Height Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowWaveDropdown(!showWaveDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.waveRange !== 'all'
                                ? 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <Waves className="w-4 h-4 shrink-0" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.waveRange === 'all' ? 'Waves' : WAVE_RANGES.find(w => w.value === filters.waveRange)?.label.split(' ')[0]}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showWaveDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-52">
                                {WAVE_RANGES.map(wave => (
                                    <button
                                        key={wave.value}
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, waveRange: wave.value as FilterState['waveRange'] }));
                                            setShowWaveDropdown(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left hover:bg-cyan-50 transition-colors flex items-center gap-3 text-sm ${filters.waveRange === wave.value ? 'bg-cyan-100 text-cyan-700 font-semibold' : ''
                                            }`}
                                    >
                                        <wave.icon className={`w-4 h-4 ${(wave as any).color}`} />
                                        {wave.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Beach/Coastal Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowBeachDropdown(!showBeachDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.coastalOnly
                                ? 'bg-teal-100 text-teal-700 border border-teal-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <Waves className="w-4 h-4" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.minWaterTemp
                                    ? `> ${filters.minWaterTemp}°C`
                                    : filters.coastalOnly
                                        ? 'Beach Only'
                                        : 'Beach'}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showBeachDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-56">
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, coastalOnly: false, minWaterTemp: null })); setShowBeachDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors flex items-center gap-3 text-sm ${!filters.coastalOnly ? 'bg-stone-100 font-semibold' : ''}`}
                                >
                                    <Globe className="w-4 h-4 text-stone-400" />
                                    All Cities
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, coastalOnly: true, minWaterTemp: null })); setShowBeachDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-teal-50 transition-colors flex items-center gap-3 text-sm ${filters.coastalOnly && filters.minWaterTemp === null ? 'bg-teal-100 text-teal-700 font-semibold' : ''}`}
                                >
                                    <Waves className="w-4 h-4 text-teal-500" />
                                    Beach Only (Any Temp)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, coastalOnly: true, minWaterTemp: 20 })); setShowBeachDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-teal-50 transition-colors flex items-center gap-3 text-sm ${filters.minWaterTemp === 20 ? 'bg-teal-100 text-teal-700 font-semibold' : ''}`}
                                >
                                    <Thermometer className="w-4 h-4 text-cyan-600" />
                                    {'>'} 20°C (Pleasant)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, coastalOnly: true, minWaterTemp: 24 })); setShowBeachDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-teal-50 transition-colors flex items-center gap-3 text-sm ${filters.minWaterTemp === 24 ? 'bg-teal-100 text-teal-700 font-semibold' : ''}`}
                                >
                                    <Thermometer className="w-4 h-4 text-emerald-500" />
                                    {'>'} 24°C (Warm)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, coastalOnly: true, minWaterTemp: 27 })); setShowBeachDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-teal-50 transition-colors flex items-center gap-3 text-sm ${filters.minWaterTemp === 27 ? 'bg-teal-100 text-teal-700 font-semibold' : ''}`}
                                >
                                    <Thermometer className="w-4 h-4 text-orange-500" />

                                    {'>'} 27°C (Tropical)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rain Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowRainDropdown(!showRainDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.rainProbMax !== null
                                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <CloudRain className="w-4 h-4" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.rainProbMax !== null ? `< ${filters.rainProbMax}% Chance` : 'Rain'}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showRainDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-64">
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, rainProbMax: null })); setShowRainDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors flex items-center gap-3 text-sm ${filters.rainProbMax === null ? 'bg-stone-100 font-semibold' : ''}`}
                                >
                                    <CloudRain className="w-4 h-4 text-stone-400" />
                                    Any Weather
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, rainProbMax: 10 })); setShowRainDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3 text-sm ${filters.rainProbMax === 10 ? 'bg-yellow-100 text-yellow-700 font-semibold' : ''}`}
                                >
                                    <Sun className="w-4 h-4 text-yellow-500" />
                                    {'<'} 10% Chance (Very Dry)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, rainProbMax: 20 })); setShowRainDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3 text-sm ${filters.rainProbMax === 20 ? 'bg-yellow-100 text-yellow-700 font-semibold' : ''}`}
                                >
                                    <Sun className="w-4 h-4 text-yellow-500" />
                                    {'<'} 20% Chance (Mostly Dry)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, rainProbMax: 30 })); setShowRainDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3 text-sm ${filters.rainProbMax === 30 ? 'bg-yellow-100 text-yellow-700 font-semibold' : ''}`}
                                >
                                    <Sun className="w-4 h-4 text-yellow-500" />
                                    {'<'} 30% Chance (Low Risk)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, rainProbMax: 50 })); setShowRainDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center gap-3 text-sm ${filters.rainProbMax === 50 ? 'bg-yellow-100 text-yellow-700 font-semibold' : ''}`}
                                >
                                    <CloudRain className="w-4 h-4 text-yellow-600" />
                                    {'<'} 50% Chance (Variable)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Price Level Filter */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowPriceDropdown(!showPriceDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.priceLevel !== 'all'
                                ? filters.priceLevel === 'budget'
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : filters.priceLevel === 'expensive'
                                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <DollarSign className="w-4 h-4" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.priceLevel === 'all' ? 'Price'
                                    : filters.priceLevel === 'budget' ? 'Budget'
                                        : filters.priceLevel === 'moderate' ? 'Mid-Range'
                                            : 'Luxury'}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showPriceDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-48">
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, priceLevel: 'all' })); setShowPriceDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors flex items-center gap-3 text-sm ${filters.priceLevel === 'all' ? 'bg-stone-100 font-semibold' : ''}`}
                                >
                                    <DollarSign className="w-4 h-4 text-stone-400" />
                                    All Prices
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, priceLevel: 'budget' })); setShowPriceDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center gap-3 text-sm ${filters.priceLevel === 'budget' ? 'bg-green-100 text-green-700 font-semibold' : ''}`}
                                >
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    Budget Friendly
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, priceLevel: 'moderate' })); setShowPriceDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 text-sm ${filters.priceLevel === 'moderate' ? 'bg-blue-100 text-blue-700 font-semibold' : ''}`}
                                >
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    Mid-Range
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, priceLevel: 'expensive' })); setShowPriceDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-amber-50 transition-colors flex items-center gap-3 text-sm ${filters.priceLevel === 'expensive' ? 'bg-amber-100 text-amber-700 font-semibold' : ''}`}
                                >
                                    <DollarSign className="w-4 h-4 text-amber-600" />
                                    Luxury
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Wedding/Event Score Filter - Last */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                closeAllDropdowns();
                                setShowWeddingDropdown(!showWeddingDropdown);
                            }}
                            className={`h-10 px-3 rounded-lg flex items-center gap-2 transition-all text-sm ${filters.weddingMin > 0
                                ? 'bg-pink-100 text-pink-700 border border-pink-300'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                                }`}
                        >
                            <Heart className="w-4 h-4" />
                            <span className="font-medium whitespace-nowrap">
                                {filters.weddingMin === 0 ? 'Wedding' : filters.weddingMin >= 85 ? 'Perfect' : 'Good'}
                            </span>
                            <ChevronDown className="w-3 h-3" />
                        </button>

                        {showWeddingDropdown && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-50 w-52">
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, weddingMin: 0 })); setShowWeddingDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-stone-50 transition-colors flex items-center gap-3 text-sm ${filters.weddingMin === 0 ? 'bg-stone-100 font-semibold' : ''}`}
                                >
                                    <Heart className="w-4 h-4 text-stone-400" />
                                    All (Any Score)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, weddingMin: 70 })); setShowWeddingDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-pink-50 transition-colors flex items-center gap-3 text-sm ${filters.weddingMin === 70 ? 'bg-pink-100 text-pink-700 font-semibold' : ''}`}
                                >
                                    <Heart className="w-4 h-4 text-pink-500" />
                                    Good (70%+)
                                </button>
                                <button
                                    onClick={() => { setFilters(prev => ({ ...prev, weddingMin: 85 })); setShowWeddingDropdown(false); }}
                                    className={`w-full px-4 py-2.5 text-left hover:bg-pink-50 transition-colors flex items-center gap-3 text-sm ${filters.weddingMin === 85 ? 'bg-pink-100 text-pink-700 font-semibold' : ''}`}
                                >
                                    <Heart className="w-4 h-4 text-pink-600 fill-current" />
                                    Perfect (85%+)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Clear Filters - shows when filters active */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="h-10 px-3 rounded-lg flex items-center gap-2 text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all ml-auto"
                        >
                            <X className="w-4 h-4" />
                            <span className="font-medium">Clear ({activeFilterCount})</span>
                        </button>
                    )}
                </div>

                {/* Active Filters Summary */}
                {activeFilterCount > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2 text-sm text-stone-600">
                        <Filter className="w-4 h-4" />
                        <span>
                            Showing <strong className="text-orange-600">{filteredCities.length}</strong> of {totalCities} cities
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
