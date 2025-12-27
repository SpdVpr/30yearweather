"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Search, Check, Loader2 } from "lucide-react";
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

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { userProfile, updateUserProfile } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
    const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initialize selected city from profile
    useEffect(() => {
        if (isOpen && userProfile?.homeLocation && typeof userProfile.homeLocation === 'object') {
            const home = userProfile.homeLocation;
            setSelectedCity({
                id: 'current',
                name: home.name,
                country: home.country,
                countryCode: '',
                state: '',
                displayName: `${home.name}, ${home.country}`,
                lat: home.lat,
                lng: home.lng,
            });
        }
    }, [isOpen, userProfile?.homeLocation]);

    // Focus search input when modal opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.length < 2) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
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

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
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
                setSaved(false);
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Failed to save home location:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setSearchQuery("");
        setSearchResults([]);
        onClose();
    };

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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-stone-100">
                            <h2 className="text-lg font-bold text-stone-900">Settings</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-stone-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Home Location Section */}
                            <div className="mb-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    Home Location
                                </label>
                                <p className="text-xs text-stone-500 mb-3">
                                    Set your home city for personalized recommendations and distance calculations.
                                </p>

                                {/* Search Input */}
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search any city worldwide..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
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
                                    <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <MapPin className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs text-orange-700 font-medium">Your Home Location</p>
                                                <p className="text-sm font-semibold text-orange-900">{selectedCity.name}</p>
                                                <p className="text-xs text-orange-700">{selectedCity.country}</p>
                                                <p className="text-xs text-orange-600/70 mt-1">
                                                    {selectedCity.lat.toFixed(4)}°, {selectedCity.lng.toFixed(4)}°
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setSelectedCity(null)}
                                                className="p-1 hover:bg-orange-100 rounded-full transition-colors"
                                            >
                                                <X className="w-4 h-4 text-orange-500" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-4 border-t border-stone-100 bg-stone-50">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!selectedCity || saving || saved}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${saved
                                    ? 'bg-green-500 text-white'
                                    : 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed'
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
                                        Saved!
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
