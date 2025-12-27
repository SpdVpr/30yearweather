"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";
import { FavoriteData } from "@/lib/user-data";

interface FavoriteButtonProps {
    type?: 'city' | 'month' | 'day';
    citySlug: string;
    cityName: string;
    country: string;
    monthSlug?: string;
    monthName?: string;
    day?: number;
    variant?: "icon" | "full";
    className?: string;
    // Weather stats
    tempMax?: number;
    tempMin?: number;
    precipProb?: number;
    seaTemp?: number;
}

export default function FavoriteButton({
    type = "city",
    citySlug,
    cityName,
    country,
    monthSlug,
    monthName,
    day,
    variant = "icon",
    className = "",
    tempMax,
    tempMin,
    precipProb,
    seaTemp
}: FavoriteButtonProps) {
    const { user } = useAuth();
    const { isFavorite, isMonthFavorite, isDayFavorite, add, favorites, remove } = useFavorites();
    const [loading, setLoading] = useState(false);

    // Check if favorited based on type
    const checkIsFavorite = (): boolean => {
        if (type === 'day' && monthSlug && day) {
            return isDayFavorite(citySlug, monthSlug, day);
        } else if (type === 'month' && monthSlug) {
            return isMonthFavorite(citySlug, monthSlug);
        }
        return isFavorite(citySlug);
    };

    const isFav = checkIsFavorite();

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            return;
        }

        setLoading(true);

        if (isFav) {
            // Find and remove the favorite
            const fav = favorites.find(f => {
                if (type === 'day') {
                    return f.type === 'day' && f.citySlug === citySlug && f.monthSlug === monthSlug && f.day === day;
                } else if (type === 'month') {
                    return f.type === 'month' && f.citySlug === citySlug && f.monthSlug === monthSlug;
                }
                return (f.type === 'city' || !f.type) && f.citySlug === citySlug;
            });
            if (fav?.id) {
                await remove(fav.id);
            }
        } else {
            // Add favorite
            const data: FavoriteData = {
                type,
                citySlug,
                cityName,
                country,
                monthSlug,
                monthName,
                day,
                tempMax,
                tempMin,
                precipProb,
                seaTemp
            };
            await add(data);
        }

        setLoading(false);
    };

    // Don't show if not logged in
    if (!user) {
        return null;
    }

    if (variant === "full") {
        return (
            <button
                onClick={handleClick}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isFav
                    ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    } ${className}`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                )}
                <span className="text-sm font-medium">
                    {isFav ? "Saved" : "Save"}
                </span>
            </button>
        );
    }

    // Icon only variant
    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`p-2.5 rounded-full transition-all ${isFav
                ? "bg-orange-100 text-orange-500 hover:bg-orange-200"
                : "bg-white/90 text-stone-400 hover:bg-white hover:text-orange-500"
                } shadow-lg backdrop-blur-sm ${className}`}
            title={isFav ? "Remove from favorites" : "Add to favorites"}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
            )}
        </button>
    );
}
