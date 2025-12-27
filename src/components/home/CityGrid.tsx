"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, Thermometer, Droplets } from "lucide-react";
import { useUnit } from "@/context/UnitContext";

interface CityInfo {
    slug: string;
    name: string;
    country: string;
    desc: string;
    // Weather data
    bestMonths?: string;
    avgTemp?: number;
    avgRainfall?: number;
    avgRainProb?: number; // Average rain probability %
    isCoastal?: boolean;
}

interface CategoryInfo {
    title: string;
    description: string;
    mapRegion: string;
    cities: CityInfo[];
}

interface CityGridProps {
    categories: CategoryInfo[];
}

// Generate unique SEO text for each city based on its data
function generateSeoText(city: CityInfo): string {
    // For COASTAL cities: Best time + Climate + Sea info (3 sentences)
    if (city.isCoastal && city.avgTemp !== undefined) {
        let bestTimePart = city.bestMonths ? `Best time: ${city.bestMonths}. ` : "";
        let climatePart = "";
        let seaPart = "";

        // Climate and sea descriptions based on temperature
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

    // For NON-COASTAL cities: Best months + Climate (2 sentences)
    const parts: string[] = [];

    if (city.bestMonths) {
        parts.push(`Best time: ${city.bestMonths}`);
    }

    if (city.avgTemp !== undefined) {
        if (city.avgTemp >= 25) {
            parts.push("Tropical climate with warm weather year-round");
        } else if (city.avgTemp >= 18) {
            parts.push("Mediterranean climate with mild winters");
        } else if (city.avgTemp >= 10) {
            parts.push("Temperate climate with distinct seasons");
        } else {
            parts.push("Cool climate with snowy winters");
        }
    }

    return parts.slice(0, 2).join('. ') + '.';
}

// Individual city card - light style with unique SEO text
function CityCard({ city }: { city: CityInfo }) {
    const { unit, convertTemp } = useUnit();
    const cityImage = `/images/${city.slug}-hero.webp`;

    // Format temperature
    const tempDisplay = city.avgTemp !== undefined ? `${Math.round(convertTemp(city.avgTemp))}°${unit}` : "—";

    // Use custom desc if available, otherwise generate unique SEO text
    const seoText = city.desc && city.desc.length > 10
        ? city.desc
        : generateSeoText(city);

    return (
        <Link href={`/${city.slug}`} className="group block">
            <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 border border-stone-200">
                {/* Image container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={cityImage}
                        alt={`${city.name} weather forecast`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        quality={65}
                    />

                    {/* Temperature badge - top right with "Avg/Year" label */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-0.5 bg-white/95 backdrop-blur-sm px-2.5 py-2 rounded-lg shadow-sm">
                        <span className="text-[10px] text-stone-500 uppercase tracking-wide font-medium">Avg/Year</span>
                        <div className="flex items-center gap-1">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-stone-800 font-bold text-base">{tempDisplay}</span>
                        </div>
                    </div>
                </div>

                {/* Content below image */}
                <div className="p-4 bg-white">
                    {/* City name */}
                    <h4 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                        {city.name}
                    </h4>

                    {/* SEO description text - 2 lines */}
                    <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
                        {seoText}
                    </p>

                    {/* Bottom info bar - rainfall + rain probability */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                            <Droplets className="w-3.5 h-3.5 text-blue-400" />
                            <span>{city.avgRainfall ? `${city.avgRainfall} mm/yr` : '—'}</span>
                        </div>
                        <div className="text-xs text-stone-500">
                            <span className="text-blue-500 font-medium">{city.avgRainProb ? `${city.avgRainProb}%` : '—'}</span>
                            <span className="ml-1">rain chance</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Category section with expand/collapse
function CategorySection({ category }: { category: CategoryInfo }) {
    const [isExpanded, setIsExpanded] = useState(false); // Always start collapsed (1 row)

    // Show first 4 cities by default (one row), all when expanded
    const visibleCities = isExpanded ? category.cities : category.cities.slice(0, 4);
    const hasMore = category.cities.length > 4;
    const hiddenCount = category.cities.length - 4;

    return (
        <div className="mb-16 last:mb-0">
            {/* Category header - simple */}
            <div className="mb-6 px-6 md:px-12 max-w-[1800px] mx-auto">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">{category.title}</h3>
                <p className="text-stone-500 text-sm mt-1">
                    {category.description} • <span className="text-orange-600 font-medium">{category.cities.length} destinations</span>
                </p>
            </div>

            {/* Cities grid - FULL WIDTH */}
            <div className="px-6 md:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1800px] mx-auto">
                    {visibleCities.map((city) => (
                        <CityCard key={city.slug} city={city} />
                    ))}
                </div>
            </div>

            {/* Expand/Collapse button */}
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 font-semibold rounded-full transition-all hover:shadow-md border border-stone-200 hover:border-orange-200 group"
                    >
                        {isExpanded ? (
                            <>
                                <span>Show Less</span>
                                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                            </>
                        ) : (
                            <>
                                <span>Show {hiddenCount} More</span>
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}

export default function CityGrid({ categories }: CityGridProps) {
    return (
        <div className="space-y-12">
            {categories.map((category) => (
                <CategorySection
                    key={category.title}
                    category={category}
                />
            ))}
        </div>
    );
}
