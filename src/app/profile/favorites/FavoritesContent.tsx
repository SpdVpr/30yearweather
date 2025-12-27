"use client";

import { useState, useEffect } from "react";
import { Heart, MapPin, Loader2, Trash2, ExternalLink, Calendar, Sun, Thermometer, CloudRain, Droplets } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUnit } from "@/context/UnitContext";

type TabType = 'cities' | 'months' | 'days';

export default function FavoritesContent() {
    const { user, loading: authLoading } = useAuth();
    const { favorites, loading, remove, getCityFavorites, getMonthFavorites, getDayFavorites } = useFavorites();
    const router = useRouter();
    const { unit, convertTemp } = useUnit();
    const [removingId, setRemovingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('cities');

    const cityFavorites = getCityFavorites();
    const monthFavorites = getMonthFavorites();
    const dayFavorites = getDayFavorites();

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

    const handleRemove = async (favoriteId: string) => {
        setRemovingId(favoriteId);
        await remove(favoriteId);
        setRemovingId(null);
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: 'cities', label: 'Cities', count: cityFavorites.length },
        { key: 'months', label: 'Months', count: monthFavorites.length },
        { key: 'days', label: 'Days', count: dayFavorites.length },
    ];

    const renderEmptyState = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-orange-300" />
            </div>
            <h2 className="text-xl font-bold text-stone-700 mb-2">No {activeTab} saved yet</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-6">
                {activeTab === 'cities' && "Explore cities and click the heart icon to save them."}
                {activeTab === 'months' && "Visit monthly weather pages and save your favorite months."}
                {activeTab === 'days' && "Browse daily forecasts and save specific dates you're interested in."}
            </p>
            <Link
                href="/#cities"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
            >
                <MapPin className="w-4 h-4" />
                Explore Destinations
            </Link>
        </div>
    );

    const renderWeatherStats = (fav: any) => {
        // Check if we have any weather data
        const hasData = fav.tempMax !== undefined || fav.precipProb !== undefined;

        if (!hasData) {
            return (
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-white/70 font-medium">
                    Update to see stats
                </div>
            );
        }

        return (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 shadow-sm">
                {fav.tempMax !== undefined && (
                    <div className="flex items-center gap-1.5 text-white" title="Avg High Temperature">
                        <Thermometer className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-bold">{convertTemp(fav.tempMax)}°{unit}</span>
                    </div>
                )}
                {fav.seaTemp !== undefined && (
                    <div className="flex items-center gap-1.5 text-white" title="Sea Temperature">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-xs font-bold">{convertTemp(fav.seaTemp)}°{unit}</span>
                    </div>
                )}
                {fav.precipProb !== undefined && (
                    <div className="flex items-center gap-1.5 text-white" title="Rain Probability">
                        <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-bold">{fav.precipProb}%</span>
                    </div>
                )}
            </div>
        );
    };

    const renderCities = () => (
        cityFavorites.length === 0 ? renderEmptyState() : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cityFavorites.map((fav) => (
                    <div
                        key={fav.id}
                        className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-56 bg-stone-200">
                            <Image
                                src={`/images/${fav.citySlug}-hero.webp`}
                                alt={fav.cityName}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-4">
                                <h3 className="text-lg font-bold text-white">{fav.cityName}</h3>
                                <p className="text-sm text-white/80">{fav.country}</p>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-stone-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : 'Recently'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/${fav.citySlug}`}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View
                                </Link>
                                <button
                                    onClick={() => fav.id && handleRemove(fav.id)}
                                    disabled={removingId === fav.id}
                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {removingId === fav.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    );

    const renderMonths = () => (
        monthFavorites.length === 0 ? renderEmptyState() : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {monthFavorites.map((fav) => (
                    <div
                        key={fav.id}
                        className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-56 bg-stone-200">
                            <Image
                                src={`/images/${fav.citySlug}-hero.webp`}
                                alt={fav.cityName}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                            <div className="absolute top-3 right-3">
                                <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                                    {fav.monthName}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-4">
                                <h3 className="text-lg font-bold text-white">{fav.cityName}</h3>
                                <p className="text-sm text-white/80">{fav.country}</p>
                            </div>
                            {renderWeatherStats(fav)}
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-stone-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : 'Recently'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/${fav.citySlug}/${fav.monthSlug}`}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View
                                </Link>
                                <button
                                    onClick={() => fav.id && handleRemove(fav.id)}
                                    disabled={removingId === fav.id}
                                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {removingId === fav.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    );

    const renderDays = () => (
        dayFavorites.length === 0 ? renderEmptyState() : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dayFavorites.map((fav) => (
                    <div
                        key={fav.id}
                        className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden group hover:shadow-md transition-shadow"
                    >
                        <div className="relative h-56 bg-stone-200">
                            <Image
                                src={`/images/${fav.citySlug}-hero.webp`}
                                alt={fav.cityName}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                            <div className="absolute top-3 right-3">
                                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-center">
                                    <span className="text-lg font-bold text-stone-900">{fav.day}</span>
                                    <span className="text-xs text-stone-500 ml-1">{fav.monthName?.slice(0, 3)}</span>
                                </div>
                            </div>
                            <div className="absolute bottom-3 left-4">
                                <h3 className="font-bold text-white">{fav.cityName}</h3>
                                <p className="text-sm text-white/80">{fav.country}</p>
                            </div>
                            {renderWeatherStats(fav)}
                        </div>
                        <div className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/${fav.citySlug}/${fav.monthSlug}/${fav.day}`}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                                >
                                    <Sun className="w-4 h-4" />
                                    View Forecast
                                </Link>
                            </div>
                            <button
                                onClick={() => fav.id && handleRemove(fav.id)}
                                disabled={removingId === fav.id}
                                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {removingId === fav.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-orange-500 p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">My Favorites</h1>
                            <p className="text-white/80 text-sm">
                                {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-stone-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === tab.key
                                ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                                : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-stone-100 text-stone-500'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {activeTab === 'cities' && renderCities()}
            {activeTab === 'months' && renderMonths()}
            {activeTab === 'days' && renderDays()}

            {/* Explore More */}
            {favorites.length > 0 && (
                <div className="text-center">
                    <Link
                        href="/#cities"
                        className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-orange-500 transition-colors"
                    >
                        <MapPin className="w-4 h-4" />
                        Explore more destinations
                    </Link>
                </div>
            )}
        </div>
    );
}
