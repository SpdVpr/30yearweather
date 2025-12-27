/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 Latitude of point 1 (in degrees)
 * @param lng1 Longitude of point 1 (in degrees)
 * @param lat2 Latitude of point 2 (in degrees)
 * @param lng2 Longitude of point 2 (in degrees)
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Sort destinations by distance from a given location
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param destinations Array of destinations with coordinates
 * @returns Destinations sorted by distance (nearest first), with distance added
 */
export function sortByDistance<T extends { lat: number; lng: number }>(
    userLat: number,
    userLng: number,
    destinations: T[]
): (T & { distance: number })[] {
    return destinations
        .map((dest) => ({
            ...dest,
            distance: calculateDistance(userLat, userLng, dest.lat, dest.lng),
        }))
        .sort((a, b) => a.distance - b.distance);
}

/**
 * Get nearest destinations from user's home location
 * @param userLat User's latitude
 * @param userLng User's longitude
 * @param destinations Array of destinations with coordinates
 * @param limit Maximum number of destinations to return
 * @returns Nearest destinations with distance in km
 */
export function getNearestDestinations<T extends { lat: number; lng: number }>(
    userLat: number,
    userLng: number,
    destinations: T[],
    limit: number = 5
): (T & { distance: number })[] {
    return sortByDistance(userLat, userLng, destinations).slice(0, limit);
}

/**
 * Format distance for display
 * @param km Distance in kilometers
 * @returns Formatted string (e.g., "120 km" or "1,500 km")
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    if (km < 10) {
        return `${km.toFixed(1)} km`;
    }
    return `${Math.round(km).toLocaleString()} km`;
}
