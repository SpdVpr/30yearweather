import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Types for user data
export interface UserSettings {
    temperatureUnit: 'C' | 'F';
    homeLocation?: {
        name: string;
        country: string;
        lat: number;
        lng: number;
    };
    notifications?: {
        email: boolean;
        weatherAlerts: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
}

export interface UserFavorite {
    id?: string;
    userId: string;
    type: 'city' | 'month' | 'day';
    citySlug: string;
    cityName: string;
    country: string;
    monthSlug?: string;  // e.g., "january"
    monthName?: string;  // e.g., "January"
    day?: number;        // e.g., 15
    // Weather stats
    tempMax?: number;
    tempMin?: number;
    precipProb?: number;
    seaTemp?: number;
    createdAt: Date;
}

export interface UserTrip {
    id?: string;
    userId: string;
    citySlug: string;
    cityName: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    createdAt: Date;
}

// ============================================
// USER SETTINGS
// ============================================

/**
 * Get user settings from Firestore
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                temperatureUnit: data.temperatureUnit || 'C',
                homeLocation: data.homeLocation,
                notifications: data.notifications,
                theme: data.theme,
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return null;
    }
}

/**
 * Update user settings in Firestore
 */
export async function updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
): Promise<boolean> {
    try {
        await setDoc(doc(db, 'users', userId), settings, { merge: true });
        return true;
    } catch (error) {
        console.error('Error updating user settings:', error);
        return false;
    }
}

// ============================================
// FAVORITES
// ============================================

export interface FavoriteData {
    type: 'city' | 'month' | 'day';
    citySlug: string;
    cityName: string;
    country: string;
    monthSlug?: string;
    monthName?: string;
    day?: number;
    // Weather stats
    tempMax?: number;
    tempMin?: number;
    precipProb?: number;
    seaTemp?: number;
}

/**
 * Add a favorite (city, month, or day)
 */
export async function addFavorite(
    userId: string,
    data: FavoriteData
): Promise<string | null> {
    try {
        // Create unique key for checking duplicates
        const uniqueKey = data.type === 'day'
            ? `${data.citySlug}-${data.monthSlug}-${data.day}`
            : data.type === 'month'
                ? `${data.citySlug}-${data.monthSlug}`
                : data.citySlug;

        // Check if already favorited
        const existing = await getFavoriteByKey(userId, data.type, uniqueKey);
        if (existing) {
            return existing.id || null;
        }

        const favoriteRef = doc(collection(db, 'favorites'));

        // Build favorite object, excluding undefined values
        const favorite: Record<string, unknown> = {
            userId,
            type: data.type,
            citySlug: data.citySlug,
            cityName: data.cityName,
            country: data.country,
            createdAt: new Date(),
        };

        // Only add optional fields if they are defined
        if (data.monthSlug !== undefined) favorite.monthSlug = data.monthSlug;
        if (data.monthName !== undefined) favorite.monthName = data.monthName;
        if (data.day !== undefined) favorite.day = data.day;

        // Add weather stats if available
        if (data.tempMax !== undefined) favorite.tempMax = data.tempMax;
        if (data.tempMin !== undefined) favorite.tempMin = data.tempMin;
        if (data.precipProb !== undefined) favorite.precipProb = data.precipProb;
        if (data.seaTemp !== undefined) favorite.seaTemp = data.seaTemp;

        await setDoc(favoriteRef, {
            ...favorite,
            createdAt: serverTimestamp(),
        });

        return favoriteRef.id;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return null;
    }
}

/**
 * Remove a favorite by ID
 */
export async function removeFavoriteById(favoriteId: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'favorites', favoriteId));
        return true;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
}

/**
 * Remove a city favorite (legacy support)
 */
export async function removeFavorite(userId: string, citySlug: string): Promise<boolean> {
    try {
        const favorite = await getFavorite(userId, citySlug);
        if (favorite?.id) {
            await deleteDoc(doc(db, 'favorites', favorite.id));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error removing favorite:', error);
        return false;
    }
}

/**
 * Get a specific favorite by unique key
 */
export async function getFavoriteByKey(
    userId: string,
    type: 'city' | 'month' | 'day',
    uniqueKey: string
): Promise<UserFavorite | null> {
    try {
        const q = query(
            collection(db, 'favorites'),
            where('userId', '==', userId),
            where('type', '==', type)
        );

        const snapshot = await getDocs(q);
        for (const docRef of snapshot.docs) {
            const data = docRef.data();
            let key: string;
            if (type === 'day') {
                key = `${data.citySlug}-${data.monthSlug}-${data.day}`;
            } else if (type === 'month') {
                key = `${data.citySlug}-${data.monthSlug}`;
            } else {
                key = data.citySlug;
            }

            if (key === uniqueKey) {
                return {
                    id: docRef.id,
                    userId: data.userId,
                    type: data.type || 'city',
                    citySlug: data.citySlug,
                    cityName: data.cityName,
                    country: data.country,
                    monthSlug: data.monthSlug,
                    monthName: data.monthName,
                    day: data.day,
                    // Weather stats
                    tempMax: data.tempMax,
                    tempMin: data.tempMin,
                    precipProb: data.precipProb,
                    seaTemp: data.seaTemp,
                    createdAt: data.createdAt instanceof Timestamp
                        ? data.createdAt.toDate()
                        : new Date(data.createdAt),
                };
            }
        }
        return null;
    } catch (error) {
        console.error('Error getting favorite by key:', error);
        return null;
    }
}

/**
 * Get a city favorite (legacy support)
 */
export async function getFavorite(
    userId: string,
    citySlug: string
): Promise<UserFavorite | null> {
    return getFavoriteByKey(userId, 'city', citySlug);
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(userId: string): Promise<UserFavorite[]> {
    try {
        const q = query(
            collection(db, 'favorites'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(docRef => {
            const data = docRef.data();
            return {
                id: docRef.id,
                userId: data.userId,
                type: data.type || 'city',
                citySlug: data.citySlug,
                cityName: data.cityName,
                country: data.country,
                monthSlug: data.monthSlug,
                monthName: data.monthName,
                day: data.day,
                // Weather stats
                tempMax: data.tempMax,
                tempMin: data.tempMin,
                precipProb: data.precipProb,
                seaTemp: data.seaTemp,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
            };
        });
    } catch (error) {
        console.error('Error getting user favorites:', error);
        return [];
    }
}

/**
 * Check if a city is in user's favorites
 */
export async function isFavorite(userId: string, citySlug: string): Promise<boolean> {
    const favorite = await getFavorite(userId, citySlug);
    return favorite !== null;
}

// ============================================
// SAVED TRIPS (Future feature)
// ============================================

/**
 * Save a trip for a user
 */
export async function saveTrip(
    userId: string,
    trip: Omit<UserTrip, 'id' | 'userId' | 'createdAt'>
): Promise<string | null> {
    try {
        const tripRef = doc(collection(db, 'users', userId, 'trips'));
        await setDoc(tripRef, {
            ...trip,
            userId,
            createdAt: serverTimestamp(),
        });
        return tripRef.id;
    } catch (error) {
        console.error('Error saving trip:', error);
        return null;
    }
}

/**
 * Get all trips for a user
 */
export async function getUserTrips(userId: string): Promise<UserTrip[]> {
    try {
        const q = query(
            collection(db, 'users', userId, 'trips'),
            orderBy('startDate', 'asc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                citySlug: data.citySlug,
                cityName: data.cityName,
                startDate: data.startDate instanceof Timestamp
                    ? data.startDate.toDate()
                    : new Date(data.startDate),
                endDate: data.endDate instanceof Timestamp
                    ? data.endDate.toDate()
                    : new Date(data.endDate),
                notes: data.notes,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
            };
        });
    } catch (error) {
        console.error('Error getting user trips:', error);
        return [];
    }
}

/**
 * Delete a saved trip
 */
export async function deleteTrip(userId: string, tripId: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'users', userId, 'trips', tripId));
        return true;
    } catch (error) {
        console.error('Error deleting trip:', error);
        return false;
    }
}
