"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Check, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface GeocodedCity {
    id: string;
    name: string;
    country: string;
    countryCode: string;
    state: string;
    displayName: string;
    lat: number;
    lng: number;
}

export default function HomeLocationOnboarding() {
    const { user, userProfile, updateUserProfile, initializing } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
    const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Check if user needs to set home location
    // Check if user needs to set home location
    // Check if user needs to set home location
    useEffect(() => {
        if (initializing || !user || !userProfile) return;

        // If user has home location (string or object), ensure modal is closed
        if (userProfile.homeLocation) {
            setIsOpen(false);
            return;
        }

        // Only show if user exists, profile is loaded, but homeLocation is missing
        const timer = setTimeout(() => {
            if (!userProfile.homeLocation) {
                setIsOpen(true);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [initializing, user, userProfile, userProfile?.homeLocation]);

    // Debounced search
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Failed to search cities:", error);
            } finally {
                setSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectCity = (city: GeocodedCity) => {
        setSelectedCity(city);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSave = async () => {
        if (!selectedCity) return;

        setSaving(true);
        try {
            await updateUserProfile({
                homeLocation: {
                    name: selectedCity.name,
                    country: selectedCity.country,
                    lat: selectedCity.lat,
                    lng: selectedCity.lng,
                }
            });
            setSaved(true);
            setTimeout(() => {
                setIsOpen(false);
            }, 1500);
        } catch (error) {
            console.error("Failed to save home location:", error);
        } finally {
            setSaving(false);
        }
    };

    // Don't render anything if conditions aren't met
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - no close on click, user must complete */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container - centered with flexbox */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header with gradient */}
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold">Welcome to 30YearWeather!</h2>
                                </div>
                                <p className="text-white/90 text-sm">
                                    Set your home location to get personalized weather recommendations and find destinations near you.
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    Where do you live?
                                </label>

                                {/* Search Input */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        type="text"
                                        placeholder="Search any city worldwide..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                        autoFocus
                                    />
                                    {searching && (
                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 animate-spin" />
                                    )}
                                </div>

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg mb-3">
                                        {searchResults.map((city) => (
                                            <button
                                                key={city.id}
                                                onClick={() => handleSelectCity(city)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-orange-50 transition-colors border-b border-stone-100 last:border-b-0"
                                            >
                                                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-stone-800 truncate">{city.name}</p>
                                                    <p className="text-xs text-stone-500 truncate">
                                                        {city.state ? `${city.state}, ` : ''}{city.country}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* No Results */}
                                {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                                    <div className="p-4 text-center text-sm text-stone-500 bg-stone-50 rounded-xl mb-3">
                                        No cities found. Try a different search.
                                    </div>
                                )}

                                {/* Currently Selected */}
                                {selectedCity && (
                                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <MapPin className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-orange-900">{selectedCity.name}</p>
                                                <p className="text-xs text-orange-700">{selectedCity.country}</p>
                                            </div>
                                            <Check className="w-5 h-5 text-green-500" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-stone-100 bg-stone-50">
                                <button
                                    onClick={handleSave}
                                    disabled={!selectedCity || saving || saved}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${saved
                                        ? 'bg-green-500 text-white'
                                        : selectedCity
                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                                        }`}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : saved ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Welcome aboard! 🎉
                                        </>
                                    ) : (
                                        <>
                                            <MapPin className="w-4 h-4" />
                                            Set as My Home Location
                                        </>
                                    )}
                                </button>
                                <p className="text-xs text-stone-400 text-center mt-2">
                                    You can change this later in Settings
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
