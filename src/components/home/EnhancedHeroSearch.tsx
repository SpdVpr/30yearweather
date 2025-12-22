"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Calendar, MapPin, ChevronDown, CalendarDays, Sparkles, ArrowRight, Globe, Sun, Umbrella, Users } from "lucide-react";

interface CityOption {
    slug: string;
    name: string;
    country: string;
}

interface EnhancedHeroSearchProps {
    cities: CityOption[];
    totalCities: number;
}

export default function EnhancedHeroSearch({ cities, totalCities }: EnhancedHeroSearchProps) {
    const router = useRouter();

    // State
    const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
    const [day, setDay] = useState<string>(new Date().getDate().toString());

    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCities = (query === ""
        ? cities
        : cities.filter((city) =>
            city.name.toLowerCase().includes(query.toLowerCase()) ||
            city.country.toLowerCase().includes(query.toLowerCase())
        )
    ).sort((a, b) => a.name.localeCompare(b.name));

    const handleSearch = () => {
        if (!selectedCity) return;

        // Get month name (lowercase)
        const monthIndex = parseInt(month) - 1;
        const date = new Date(2024, monthIndex, 1);
        const monthName = date.toLocaleString('en-US', { month: 'long' }).toLowerCase();

        // Navigate to /city/month/day (e.g. /bali/december/17)
        router.push(`/${selectedCity.slug}/${monthName}/${day}`);
    };

    const daysInMonth = 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 relative z-20">
            {/* Main Search Container - Larger and more prominent */}
            <div className="bg-white/98 backdrop-blur-lg p-3 sm:p-4 rounded-3xl sm:rounded-[2rem] shadow-2xl shadow-black/20 border border-white/30 flex flex-col lg:flex-row gap-3 relative z-30">

                {/* 1. City Input (Flex Grow) - Enhanced */}
                <div className="flex-[2.5] relative" ref={wrapperRef}>
                    <div
                        className="flex items-center h-14 sm:h-20 px-5 sm:px-6 bg-gradient-to-r from-stone-50 to-orange-50/30 hover:from-white hover:to-orange-50/50 border-2 border-transparent hover:border-orange-300 focus-within:border-orange-400 rounded-2xl sm:rounded-2xl cursor-text transition-all group"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:bg-orange-200 transition-colors shrink-0">
                            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center overflow-hidden h-full">
                            <label htmlFor="city-input" className="text-[10px] sm:text-xs text-stone-500 font-bold uppercase tracking-widest mb-0.5 cursor-pointer block leading-none">Where are you going?</label>
                            <input
                                id="city-input"
                                type="text"
                                className="w-full bg-transparent border-none outline-none text-stone-900 font-bold placeholder-stone-400 p-0 text-base sm:text-xl leading-none truncate h-6 sm:h-8"
                                placeholder="Search destinations..."
                                value={selectedCity ? selectedCity.name : query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedCity(null);
                                    setIsOpen(true);
                                }}
                                onFocus={() => setIsOpen(true)}
                                aria-label="Search for destination city"
                                autoComplete="off"
                                name="destination"
                            />
                        </div>
                        {selectedCity && (
                            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-lg ml-2 hidden sm:flex items-center gap-1.5 whitespace-nowrap">
                                <Globe className="w-3.5 h-3.5" />
                                {selectedCity.country}
                            </span>
                        )}
                    </div>

                    {/* Dropdown Results - Enhanced */}
                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-stone-100 max-h-72 overflow-y-auto z-50 py-2">
                            <div className="px-4 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                                {filteredCities.length} destinations available
                            </div>
                            {filteredCities.length > 0 ? (
                                filteredCities.map(city => (
                                    <div
                                        key={city.slug}
                                        className="px-5 py-3.5 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent cursor-pointer flex justify-between items-center group transition-all"
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setQuery("");
                                            setIsOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                                <MapPin className="w-4 h-4 text-stone-400 group-hover:text-orange-500" />
                                            </div>
                                            <span className="font-semibold text-stone-700 group-hover:text-orange-800">{city.name}</span>
                                        </div>
                                        <span className="text-xs text-stone-400 group-hover:text-orange-500 bg-stone-50 group-hover:bg-orange-50 px-2 py-1 rounded">{city.country}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-4 text-stone-400 text-sm flex items-center gap-2">
                                    <Search className="w-4 h-4" />
                                    No cities found. Try another search.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Date Row - Month & Day side by side on mobile */}
                <div className="flex gap-2 lg:contents">
                    {/* Month Input - Enhanced */}
                    <div className="flex-1 lg:flex-1 lg:min-w-[170px] relative group">
                        <div className="flex items-center h-14 sm:h-20 px-4 sm:px-5 bg-gradient-to-r from-stone-50 to-blue-50/30 hover:from-white hover:to-blue-50/50 border-2 border-transparent hover:border-blue-200 rounded-2xl transition-all cursor-pointer relative">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shrink-0 group-hover:bg-blue-200 transition-colors">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center h-full overflow-hidden">
                                <label htmlFor="month-select" className="text-[9px] sm:text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5 block leading-none">Month</label>
                                <div className="h-5 sm:h-7 flex items-center">
                                    <select
                                        id="month-select"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="bg-transparent font-bold text-stone-900 outline-none appearance-none cursor-pointer hover:text-blue-600 w-full p-0 text-sm sm:text-lg leading-none absolute inset-0 opacity-0 z-10"
                                        aria-label="Select month"
                                        autoComplete="off"
                                        name="travel-month"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(2024, m - 1, 1).toLocaleString('en-US', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                    <span className="font-bold text-stone-900 truncate pointers-events-none group-hover:text-blue-600 text-sm sm:text-lg">
                                        {/* Short month on mobile, full on desktop */}
                                        <span className="sm:hidden">{new Date(2024, parseInt(month) - 1, 1).toLocaleString('en-US', { month: 'short' })}</span>
                                        <span className="hidden sm:inline">{new Date(2024, parseInt(month) - 1, 1).toLocaleString('en-US', { month: 'long' })}</span>
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-stone-300 group-hover:text-blue-400 ml-1 sm:ml-2 shrink-0" />
                        </div>
                    </div>

                    {/* Day Input - Enhanced */}
                    <div className="w-28 sm:w-auto lg:flex-1 lg:min-w-[130px] relative group">
                        <div className="flex items-center h-14 sm:h-20 px-4 sm:px-5 bg-gradient-to-r from-stone-50 to-purple-50/30 hover:from-white hover:to-purple-50/50 border-2 border-transparent hover:border-purple-200 rounded-2xl transition-all cursor-pointer relative">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shrink-0 group-hover:bg-purple-200 transition-colors">
                                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center h-full">
                                <label htmlFor="day-select" className="text-[9px] sm:text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-0.5 block leading-none">Day</label>
                                <div className="h-5 sm:h-7 flex items-center">
                                    <select
                                        id="day-select"
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        className="bg-transparent font-bold text-stone-900 outline-none appearance-none cursor-pointer hover:text-purple-600 w-full p-0 text-sm sm:text-lg leading-none absolute inset-0 opacity-0 z-10"
                                        aria-label="Select day"
                                        autoComplete="off"
                                        name="travel-day"
                                    >
                                        {days.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className="font-bold text-stone-900 truncate pointers-events-none group-hover:text-purple-600 text-sm sm:text-lg">
                                        {day}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-stone-300 group-hover:text-purple-400 ml-1 sm:ml-2 shrink-0" />
                        </div>
                    </div>
                </div>

                {/* 4. Search Button - Much more prominent CTA */}
                <button
                    onClick={handleSearch}
                    disabled={!selectedCity}
                    className="h-14 sm:h-20 px-8 sm:px-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-3 group whitespace-nowrap lg:min-w-[200px]"
                >
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                    <span>Find Weather</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </button>

            </div>

            {/* Quick stats and Smart Finder CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                {/* Quick stats badges */}
                <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Globe className="w-4 h-4" />
                        <span className="font-semibold">{totalCities}+</span> cities
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Sun className="w-4 h-4" />
                        <span className="font-semibold">365</span> days
                    </span>
                    <span className="hidden sm:flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <Umbrella className="w-4 h-4" />
                        <span className="font-semibold">30</span> years data
                    </span>
                </div>

                {/* Smart Finder link */}
                <Link
                    href="/finder"
                    className="group flex items-center gap-3 px-5 py-2.5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
                >
                    <div className="bg-orange-500/20 p-1.5 rounded-full group-hover:bg-orange-500/30 transition-colors">
                        <Sparkles className="w-4 h-4 text-orange-400 group-hover:text-orange-300 animate-pulse" />
                    </div>
                    <span className="text-white text-sm font-medium">
                        Not sure where to go? <span className="text-orange-300 font-bold group-hover:text-orange-200 ml-1">Try Smart Finder</span>
                    </span>
                </Link>
            </div>
        </div>
    );
}
