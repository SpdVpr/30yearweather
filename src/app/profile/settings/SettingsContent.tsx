"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, Check, Loader2, Thermometer, User, Mail, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUnit } from "@/context/UnitContext";
import { useRouter } from "next/navigation";

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

export default function SettingsContent() {
    const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
    const { unit, toggleUnit } = useUnit();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
    const [selectedCity, setSelectedCity] = useState<GeocodedCity | null>(null);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/");
        }
    }, [user, authLoading, router]);

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

    const handleSaveLocation = async () => {
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
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Profile Info */}
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="bg-orange-500 p-6">
                    <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                    <p className="text-white/80 text-sm mt-1">Manage your profile and preferences</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-orange-500" />
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-stone-900">
                                {user.displayName || "User"}
                            </h2>
                            <p className="text-sm text-stone-500 flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {user.email}
                            </p>
                            {userProfile?.createdAt && (
                                <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    Member since {new Date(userProfile.createdAt).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Home Location */}
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    Home Location
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                    Set your home location to get personalized destination recommendations.
                </p>

                {/* Current Location */}
                {userProfile?.homeLocation && typeof userProfile.homeLocation === 'object' && !selectedCity && (
                    <div className="p-4 bg-stone-50 rounded-xl mb-4 flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-stone-800">{userProfile.homeLocation.name}</p>
                            <p className="text-sm text-stone-500">{userProfile.homeLocation.country}</p>
                        </div>
                        <Check className="w-5 h-5 text-green-500" />
                    </div>
                )}

                {/* Search Input */}
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search for a new location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-stone-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                    />
                    {searching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 animate-spin" />
                    )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg mb-4">
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

                {/* Selected New City */}
                {selectedCity && (
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <MapPin className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-orange-900">{selectedCity.name}</p>
                                <p className="text-xs text-orange-700">{selectedCity.country}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button */}
                {selectedCity && (
                    <button
                        onClick={handleSaveLocation}
                        disabled={saving}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
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
                            <>
                                <MapPin className="w-4 h-4" />
                                Update Home Location
                            </>
                        )}
                    </button>
                )}
            </section>

            {/* Temperature Unit */}
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    Temperature Unit
                </h2>
                <p className="text-sm text-stone-500 mb-4">
                    Choose your preferred temperature unit for weather data.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={() => unit !== 'C' && toggleUnit()}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${unit === 'C'
                            ? 'bg-orange-500 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                    >
                        Celsius (°C)
                    </button>
                    <button
                        onClick={() => unit !== 'F' && toggleUnit()}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${unit === 'F'
                            ? 'bg-orange-500 text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                    >
                        Fahrenheit (°F)
                    </button>
                </div>
            </section>
        </div>
    );
}
