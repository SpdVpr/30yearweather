"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Check, Loader2, Sparkles, X } from "lucide-react";
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
    const [isDismissed, setIsDismissed] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
    const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // CRITICAL: Robust logic to determine if we should show the onboarding modal.
    useEffect(() => {
        // 1. If manually dismissed in this session, don't reopen
        if (isDismissed) return;

        // 2. Default to closed if not initialized, no user, or no profile data yet.
        if (initializing || !user || !userProfile) {
            setIsOpen(false);
            return;
        }

        // 3. Check if the user already has a home location in their profile.
        const homeLoc = userProfile.homeLocation;
        const HasValidLocation = !!(
            homeLoc &&
            (typeof homeLoc === 'string' || (typeof homeLoc === 'object' && (homeLoc as any).name))
        );

        // 4. If they have a location, ensure the modal is closed and STAY closed.
        if (HasValidLocation) {
            setIsOpen(false);
            return;
        }

        // 5. If they DON'T have a location, we show the modal.
        setIsOpen(true);
    }, [initializing, user, userProfile, userProfile?.homeLocation, isDismissed]);

    // Debounced search logic for city selection
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

    const handleClose = () => {
        setIsOpen(false);
        setIsDismissed(true);
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
            }, 1000);
        } catch (error) {
            console.error("Failed to save home location:", error);
        } finally {
            setSaving(false);
        }
    };

    // Do not render anything if the modal is closed.
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold">Welcome to 30YearWeather!</h2>
                                </div>
                                <p className="text-white/90 text-sm pr-8">
                                    Set your home location to get personalized weather recommendations and find destinations near you.
                                </p>
                            </div>

                            {/* City Search & Selection */}
                            <div className="p-5">
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-3">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    Where do you live?
                                </label>

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

                                {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                                    <div className="p-4 text-center text-sm text-stone-500 bg-stone-50 rounded-xl mb-3">
                                        No cities found. Try a different search.
                                    </div>
                                )}

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

                            {/* Action Button */}
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
