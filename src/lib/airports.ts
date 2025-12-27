import { ALL_AIRPORTS, Airport } from "./airports_data";

// Re-export Airport interface if needed, or use from imported
export type { Airport };

// Use the full generated dataset (500+ major hubs)
export const AIRPORTS: Airport[] = ALL_AIRPORTS;

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function findNearestAirport(lat: number, lon: number): { airport: Airport; distance: number } | null {
    if (AIRPORTS.length === 0) return null;

    let nearestAny: Airport | null = null;
    let minAnyDist = Infinity;

    let nearestLarge: Airport | null = null;
    let minLargeDist = Infinity;

    for (const airport of AIRPORTS) {
        const dist = getDistance(lat, lon, airport.lat, airport.lon);

        // Update nearest airport (any type)
        if (dist < minAnyDist) {
            minAnyDist = dist;
            nearestAny = airport;
        }

        // Update nearest large airport
        if (airport.type === 'large_airport') {
            if (dist < minLargeDist) {
                minLargeDist = dist;
                nearestLarge = airport;
            }
        }
    }

    // Preference Logic:
    // If a major international hub ('large_airport') is within 100km, prefer it 
    // over a closer regional/small airport. Users typically fly from major hubs.
    if (nearestLarge && minLargeDist <= 100) {
        return { airport: nearestLarge, distance: minLargeDist };
    }

    // Otherwise, return the absolute nearest airport (likely a medium airport in a remote area)
    return nearestAny ? { airport: nearestAny, distance: minAnyDist } : null;
}

export function calculateFlightPath(homeLat: number, homeLon: number, destLat: number, destLon: number) {
    const origin = findNearestAirport(homeLat, homeLon);
    const dest = findNearestAirport(destLat, destLon);

    if (!origin || !dest) return null;

    // Distance between airports
    const flightDist = getDistance(origin.airport.lat, origin.airport.lon, dest.airport.lat, dest.airport.lon);

    // Flight time calculation (approx 800km/h + 30m overhead)
    // If distance is very short (<200km), assume ground transport is better or small plane
    // If distance > 10000km, add layover time estimate (e.g. +3h)

    let hours = (flightDist / 850) + 0.5; // Slightly faster cruise speed for international jets
    if (flightDist > 10000) hours += 2.5; // Layover factor logic for very long haul
    if (flightDist > 5000 && flightDist <= 10000) hours += 1; // Minor layover or slower path

    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);

    return {
        origin,
        dest,
        flightDist,
        flightTimeStr: `${h}h ${m}m`,
        totalDistance: origin.distance + flightDist + dest.distance // Home -> Airport -> Airport -> Hotel
    };
}
