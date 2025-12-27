"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    getUserFavorites,
    addFavorite,
    removeFavoriteById,
    UserFavorite,
    FavoriteData
} from '@/lib/user-data';

/**
 * Hook for managing user favorites
 */
export function useFavorites() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<UserFavorite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load favorites when user changes
    useEffect(() => {
        if (!user) {
            setFavorites([]);
            setLoading(false);
            return;
        }

        const loadFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                const userFavorites = await getUserFavorites(user.uid);
                setFavorites(userFavorites);
            } catch (err) {
                console.error('Failed to load favorites:', err);
                setError('Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, [user]);

    // Get favorites by type
    const getCityFavorites = useCallback(() => {
        return favorites.filter(f => f.type === 'city' || !f.type);
    }, [favorites]);

    const getMonthFavorites = useCallback(() => {
        return favorites.filter(f => f.type === 'month');
    }, [favorites]);

    const getDayFavorites = useCallback(() => {
        return favorites.filter(f => f.type === 'day');
    }, [favorites]);

    // Add a favorite (any type)
    const add = useCallback(async (data: FavoriteData): Promise<boolean> => {
        if (!user) return false;

        try {
            const id = await addFavorite(user.uid, data);
            if (id) {
                const newFav: UserFavorite = {
                    id,
                    userId: user.uid,
                    ...data,
                    createdAt: new Date()
                };
                setFavorites(prev => [newFav, ...prev]);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to add favorite:', err);
            return false;
        }
    }, [user]);

    // Legacy: Add city favorite
    const addCity = useCallback(async (
        citySlug: string,
        cityName: string,
        country: string
    ): Promise<boolean> => {
        return add({ type: 'city', citySlug, cityName, country });
    }, [add]);

    // Remove a favorite by ID
    const remove = useCallback(async (favoriteId: string): Promise<boolean> => {
        if (!user) return false;

        try {
            const success = await removeFavoriteById(favoriteId);
            if (success) {
                setFavorites(prev => prev.filter(f => f.id !== favoriteId));
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to remove favorite:', err);
            return false;
        }
    }, [user]);

    // Remove city by slug (legacy support)
    const removeBySlug = useCallback(async (citySlug: string): Promise<boolean> => {
        const fav = favorites.find(f => f.citySlug === citySlug && (f.type === 'city' || !f.type));
        if (fav?.id) {
            return remove(fav.id);
        }
        return false;
    }, [favorites, remove]);

    // Toggle city favorite status
    const toggle = useCallback(async (
        citySlug: string,
        cityName: string,
        country: string
    ): Promise<boolean> => {
        const fav = favorites.find(f => f.citySlug === citySlug && (f.type === 'city' || !f.type));
        if (fav?.id) {
            return remove(fav.id);
        } else {
            return addCity(citySlug, cityName, country);
        }
    }, [favorites, addCity, remove]);

    // Check if a city is favorited
    const isFavorite = useCallback((citySlug: string): boolean => {
        return favorites.some(f => f.citySlug === citySlug && (f.type === 'city' || !f.type));
    }, [favorites]);

    // Check if a month is favorited
    const isMonthFavorite = useCallback((citySlug: string, monthSlug: string): boolean => {
        return favorites.some(f =>
            f.type === 'month' && f.citySlug === citySlug && f.monthSlug === monthSlug
        );
    }, [favorites]);

    // Check if a day is favorited
    const isDayFavorite = useCallback((citySlug: string, monthSlug: string, day: number): boolean => {
        return favorites.some(f =>
            f.type === 'day' && f.citySlug === citySlug && f.monthSlug === monthSlug && f.day === day
        );
    }, [favorites]);

    return {
        favorites,
        loading,
        error,
        add,
        addCity,
        remove,
        removeBySlug,
        toggle,
        isFavorite,
        isMonthFavorite,
        isDayFavorite,
        getCityFavorites,
        getMonthFavorites,
        getDayFavorites,
        isLoggedIn: !!user,
    };
}
