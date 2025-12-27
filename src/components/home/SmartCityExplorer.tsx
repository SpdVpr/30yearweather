"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Thermometer, Droplets, MapPin } from "lucide-react";
import SmartCityFilter, { FilterState } from "./SmartCityFilter";
import { useUnit } from "@/context/UnitContext";

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
    isCoastal?: boolean;
    region?: string;
}

interface SmartCityExplorerProps {
    allCities: CityInfo[];
}

// Generate unique SEO text for each city based on its data
function generateSeoText(city: CityInfo): string {
    if (city.isCoastal && city.avgTemp !== undefined) {
        let bestTimePart = city.bestMonths ? `Best time: ${city.bestMonths}. ` : "";
        let climatePart = "";
        let seaPart = "";

        if (city.avgTemp >= 25) {
            climatePart = "Tropical climate with warm weather year-round";
            const phrases = ["Crystal-clear waters perfect for swimming", "Warm tropical seas with gentle waves", "Turquoise waters and sandy beaches"];
            seaPart = phrases[city.name.length % phrases.length];
        } else if (city.avgTemp >= 18) {
            climatePart = "Mediterranean climate with mild winters";
            const phrases = ["Beautiful coastline ideal for swimming", "Mediterranean waters and calm beaches", "Stunning sea views and beach access"];
            seaPart = phrases[city.name.length % phrases.length];
        } else if (city.avgTemp >= 10) {
            climatePart = "Temperate climate with distinct seasons";
            const phrases = ["Dramatic coastline with Atlantic waves", "Scenic beaches perfect for surfing", "Rugged shores with refreshing sea air"];
            seaPart = phrases[city.name.length % phrases.length];
        } else {
            climatePart = "Cool climate with snowy winters";
            const phrases = ["Arctic coastal scenery and fjords", "Northern shores with dramatic seascapes", "Wild coastline with powerful waves"];
            seaPart = phrases[city.name.length % phrases.length];
        }

        return `${bestTimePart}${climatePart}. ${seaPart}.`;
    }

    const parts: string[] = [];
    if (city.bestMonths) parts.push(`Best time: ${city.bestMonths}`);
    if (city.avgTemp !== undefined) {
        if (city.avgTemp >= 25) parts.push("Tropical climate with warm weather year-round");
        else if (city.avgTemp >= 18) parts.push("Mediterranean climate with mild winters");
        else if (city.avgTemp >= 10) parts.push("Temperate climate with distinct seasons");
        else parts.push("Cool climate with snowy winters");
    }

    return parts.slice(0, 2).join('. ') + '.';
}

// City card component
function CityCard({ city }: { city: CityInfo }) {
    const { unit, convertTemp } = useUnit();
    const cityImage = `/images/${city.slug}-hero.webp`;
    const tempDisplay = city.avgTemp !== undefined ? `${Math.round(convertTemp(city.avgTemp))}°${unit}` : "—";
    const seoText = city.desc && city.desc.length > 10 ? city.desc : generateSeoText(city);

    return (
        <Link href={`/${city.slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border border-stone-200">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={cityImage}
                        alt={`${city.name} weather forecast`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        quality={65}
                    />
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-0.5 bg-white/95 backdrop-blur-sm px-2.5 py-2 rounded-lg shadow-sm">
                        <span className="text-[10px] text-stone-500 uppercase tracking-wide font-medium">Avg/Year</span>
                        <div className="flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-stone-800 font-bold text-base">{tempDisplay}</span>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <h4 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {city.name}
                    </h4>
                    <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                        {seoText}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            <span>{city.avgRainfall ? `${city.avgRainfall} mm/yr` : '—'}</span>
                        </div>
                        <div className="text-xs text-stone-500">
                            <span className="text-blue-500 font-medium">{city.avgRainProb ? `${city.avgRainProb}%` : '—'}</span>
                            <span className="ml-1">rain</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function SmartCityExplorer({ allCities }: SmartCityExplorerProps) {
    const [filteredCities, setFilteredCities] = useState<CityInfo[]>(allCities);
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
    const [showAll, setShowAll] = useState(false);

    // Handle filter changes from SmartCityFilter
    const handleFilterChange = useCallback((cities: CityInfo[], newFilters: FilterState) => {
        setFilteredCities(cities);
        setFilters(newFilters);
        setShowAll(false); // Reset show all when filters change
    }, []);

    // Determine how many cities to show
    const hasActiveFilters = filters.search || filters.months.length > 0 || filters.dayFrom !== null || filters.dayTo !== null || filters.region || filters.tempRange !== 'all' || filters.waveRange !== 'all' || filters.weddingMin > 0 || filters.priceLevel !== 'all' || filters.minWaterTemp !== null || filters.rainProbMax !== null || filters.coastalOnly;
    const displayedCities = hasActiveFilters || showAll
        ? filteredCities
        : filteredCities.slice(0, 12); // Show 12 cities (3 rows) by default

    const hasMore = !hasActiveFilters && !showAll && filteredCities.length > 12;

    return (
        <div className="space-y-16">
            {/* Smart Filter */}
            <SmartCityFilter
                cities={allCities}
                onFilterChange={handleFilterChange}
                totalCities={allCities.length}
            />

            {/* Results */}
            {filteredCities.length > 0 ? (
                <>
                    {/* Cities Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {displayedCities.map(city => (
                            <CityCard key={city.slug} city={city} />
                        ))}
                    </div>

                    {/* Show More Button */}
                    {hasMore && (
                        <div className="text-center">
                            <button
                                onClick={() => setShowAll(true)}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 font-semibold rounded-full transition-all hover:shadow-md border border-stone-200 hover:border-orange-200"
                            >
                                Show All {filteredCities.length} Cities
                            </button>
                        </div>
                    )}
                </>
            ) : (
                /* No Results */
                <div className="text-center py-16">
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-10 h-10 text-stone-300" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-600 mb-2">No cities found</h3>
                    <p className="text-stone-500">Try adjusting your filters to see more destinations</p>
                </div>
            )
            }
        </div >
    );
}
