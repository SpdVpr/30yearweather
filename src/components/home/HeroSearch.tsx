"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, MapPin, ChevronDown, CalendarDays } from "lucide-react";

interface CityOption {
    slug: string;
    name: string;
    country: string;
}

interface HeroSearchProps {
    cities: CityOption[];
}

export default function HeroSearch({ cities }: HeroSearchProps) {
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

        // Format date MM-DD
        const m = month.padStart(2, '0');
        const d = day.padStart(2, '0');

        router.push(`/${selectedCity.slug}/${m}-${d}`);
    };

    const daysInMonth = 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

    return (
        <div className="w-full max-w-5xl mx-auto mt-8 relative z-20">
            <div className="bg-white/95 backdrop-blur-sm p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 flex flex-col lg:flex-row gap-2">

                {/* 1. City Input (Flex Grow) */}
                <div className="flex-[2] relative" ref={wrapperRef}>
                    <div
                        className="flex items-center h-12 sm:h-16 px-4 sm:px-5 bg-stone-50 hover:bg-white border border-transparent hover:border-orange-200 rounded-xl sm:rounded-2xl cursor-text transition-all group"
                        onClick={() => setIsOpen(true)}
                    >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 group-hover:text-orange-500 transition-colors mr-2 sm:mr-3 shrink-0" />
                        <div className="flex-1 flex flex-col justify-center overflow-hidden h-full">
                            <label className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5 cursor-pointer block leading-none">Destination</label>
                            <input
                                type="text"
                                className="w-full bg-transparent border-none outline-none text-stone-900 font-bold placeholder-stone-300 p-0 text-sm sm:text-base leading-none truncate h-5 sm:h-6"
                                placeholder="Where to?"
                                value={selectedCity ? selectedCity.name : query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedCity(null);
                                    setIsOpen(true);
                                }}
                                onFocus={() => setIsOpen(true)}
                            />
                        </div>
                        {selectedCity && (
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded ml-2 hidden sm:block whitespace-nowrap">
                                {selectedCity.country}
                            </span>
                        )}
                    </div>

                    {/* Dropdown Results */}
                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-stone-100 max-h-60 overflow-y-auto z-50 py-2">
                            {filteredCities.length > 0 ? (
                                filteredCities.map(city => (
                                    <div
                                        key={city.slug}
                                        className="px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center group transition-colors"
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setQuery("");
                                            setIsOpen(false);
                                        }}
                                    >
                                        <span className="font-medium text-stone-700 group-hover:text-orange-800">{city.name}</span>
                                        <span className="text-xs text-stone-400 group-hover:text-orange-400">{city.country}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 sm:px-5 py-2.5 sm:py-3 text-stone-400 text-sm">No cities found.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. Date Row - Month & Day side by side on mobile */}
                <div className="flex gap-2 lg:contents">
                    {/* Month Input */}
                    <div className="flex-1 lg:flex-1 lg:min-w-[160px] relative group">
                        <div className="flex items-center h-12 sm:h-16 px-3 sm:px-5 bg-stone-50 hover:bg-white border border-transparent hover:border-orange-200 rounded-xl sm:rounded-2xl transition-all cursor-pointer relative">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 group-hover:text-orange-500 transition-colors mr-2 sm:mr-3 shrink-0" />
                            <div className="flex-1 flex flex-col justify-center h-full overflow-hidden">
                                <label className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5 block leading-none">Month</label>
                                <div className="h-5 sm:h-6 flex items-center">
                                    <select
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                        className="bg-transparent font-bold text-stone-900 outline-none appearance-none cursor-pointer hover:text-orange-600 w-full p-0 text-sm sm:text-base leading-none absolute inset-0 opacity-0 z-10"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m}>{new Date(2024, m - 1, 1).toLocaleString('en-US', { month: 'long' })}</option>
                                        ))}
                                    </select>
                                    <span className="font-bold text-stone-900 truncate pointers-events-none group-hover:text-orange-600 text-sm sm:text-base">
                                        {/* Short month on mobile, full on desktop */}
                                        <span className="sm:hidden">{new Date(2024, parseInt(month) - 1, 1).toLocaleString('en-US', { month: 'short' })}</span>
                                        <span className="hidden sm:inline">{new Date(2024, parseInt(month) - 1, 1).toLocaleString('en-US', { month: 'long' })}</span>
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-stone-300 group-hover:text-orange-400 ml-1 sm:ml-2 shrink-0" />
                        </div>
                    </div>

                    {/* Day Input */}
                    <div className="w-24 sm:w-auto lg:flex-1 lg:min-w-[120px] relative group">
                        <div className="flex items-center h-12 sm:h-16 px-3 sm:px-5 bg-stone-50 hover:bg-white border border-transparent hover:border-orange-200 rounded-xl sm:rounded-2xl transition-all cursor-pointer relative">
                            <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 group-hover:text-orange-500 transition-colors mr-2 sm:mr-3 shrink-0" />
                            <div className="flex-1 flex flex-col justify-center h-full">
                                <label className="text-[9px] sm:text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-0.5 block leading-none">Day</label>
                                <div className="h-5 sm:h-6 flex items-center">
                                    <select
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        className="bg-transparent font-bold text-stone-900 outline-none appearance-none cursor-pointer hover:text-orange-600 w-full p-0 text-sm sm:text-base leading-none absolute inset-0 opacity-0 z-10"
                                    >
                                        {days.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    <span className="font-bold text-stone-900 truncate pointers-events-none group-hover:text-orange-600 text-sm sm:text-base">
                                        {day}
                                    </span>
                                </div>
                            </div>
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-stone-300 group-hover:text-orange-400 ml-1 sm:ml-2 shrink-0" />
                        </div>
                    </div>
                </div>

                {/* 4. Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={!selectedCity}
                    className="h-12 sm:h-16 px-6 sm:px-8 bg-orange-600 hover:bg-orange-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group whitespace-nowrap lg:min-w-[160px]"
                >
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                    <span>Search</span>
                </button>

            </div>
        </div>
    );
}
