"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MapPin, Loader2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";

interface FavoritesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FavoritesModal({ isOpen, onClose }: FavoritesModalProps) {
    const { favorites, loading, remove, isLoggedIn } = useFavorites();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = async (citySlug: string) => {
        setRemovingId(citySlug);
        await remove(citySlug);
        setRemovingId(null);
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-gradient-to-r from-rose-50 to-pink-50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-100 rounded-xl">
                                        <Heart className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-stone-900">My Favorites</h2>
                                        <p className="text-xs text-stone-500">
                                            {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-stone-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {loading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                                    </div>
                                ) : favorites.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                                            <Heart className="w-8 h-8 text-stone-300" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-stone-700 mb-2">No favorites yet</h3>
                                        <p className="text-sm text-stone-500 max-w-xs mx-auto">
                                            Explore cities and click the heart icon to save them to your favorites.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {favorites.map((fav) => (
                                            <div
                                                key={fav.id}
                                                className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors group"
                                            >
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <MapPin className="w-4 h-4 text-rose-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-stone-800 truncate">
                                                        {fav.cityName}
                                                    </p>
                                                    <p className="text-xs text-stone-500 truncate">
                                                        {fav.country}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Link
                                                        href={`/${fav.citySlug}`}
                                                        onClick={onClose}
                                                        className="p-2 text-stone-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                        title="View city"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleRemove(fav.citySlug)}
                                                        disabled={removingId === fav.citySlug}
                                                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Remove from favorites"
                                                    >
                                                        {removingId === fav.citySlug ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-stone-100 bg-stone-50">
                                <button
                                    onClick={onClose}
                                    className="w-full py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
