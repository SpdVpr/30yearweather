import { DayData } from "./data";

export interface TourismIndex {
    walkability: number; // 0-100 (Comfort for walking)
    beerGarden: number; // 0-100 (Outdoor dining potential)
    crowds: number;     // 0-100 (Estimated tourist saturation) - NOW FROM REAL DATA
    price: number;      // 0-100 (Estimated hotel/flight price) - NOW FROM REAL DATA
    reliability: number; // 0-100 (How stable the weather is historically)
}

export interface MonthlyTourismData {
    month: number;
    month_name: string;
    crowd_score: number;
    price_score: number;
    avg_weather_quality: number;
    is_peak_season: boolean;
    is_low_season: boolean;
}

export interface TourismDataset {
    meta: {
        location_slug: string;
        location_name: string;
        country_code: string;
        last_updated: string;
        data_sources: string[];
    };
    annual_stats: {
        tourist_arrivals: number | null;
        tourist_arrivals_year: number | null;
        total_attractions: number | null;
        attraction_density: number | null;
    };
    monthly_scores: Record<number, MonthlyTourismData>;
    algorithm_version: string;
    methodology: {
        crowd_calculation: string;
        price_calculation: string;
        uniqueness: string;
    };
}

// Fallback data pokud API selže (původní statická data)
const FALLBACK_SEASONALITY = [
    { crowd: 40, price: 50 }, // Jan
    { crowd: 35, price: 45 }, // Feb
    { crowd: 50, price: 60 }, // Mar
    { crowd: 70, price: 75 }, // Apr
    { crowd: 85, price: 85 }, // May
    { crowd: 90, price: 90 }, // Jun
    { crowd: 95, price: 95 }, // Jul
    { crowd: 100, price: 100 }, // Aug
    { crowd: 85, price: 90 }, // Sep
    { crowd: 70, price: 75 }, // Oct
    { crowd: 50, price: 60 }, // Nov
    { crowd: 80, price: 95 }, // Dec
];

/**
 * Fetch pre-computed tourism data from Firestore
 * Cached on client-side for 24 hours
 *
 * NOTE: Tourism data is pre-computed during ETL and embedded in city JSON files.
 * This function is kept for backward compatibility but returns null to avoid 404 errors.
 * Real tourism data should be passed from server components via city data.
 */
export async function fetchTourismData(locationSlug: string): Promise<TourismDataset | null> {
    // Tourism data is now embedded in city JSON files during ETL
    // No need to fetch from API - just return null and use fallback scores
    console.log('ℹ️ Tourism data is embedded in city JSON, skipping API fetch for', locationSlug);
    return null;
}

/**
 * Get tourism scores for a specific month
 * IMPORTANT: Normalizes crowd_score to match flight_pressure_score logic
 * Both should use the same scale (percentage of peak month)
 */
export function getMonthlyTourismScores(
    tourismData: TourismDataset | null,
    month: number
): { crowd_score: number; price_score: number } {

    if (tourismData && tourismData.monthly_scores[month]) {
        // Get all monthly crowd scores to find the peak
        const allMonthlyScores = Object.values(tourismData.monthly_scores);
        const maxCrowdScore = Math.max(...allMonthlyScores.map(m => m.crowd_score));

        const monthData = tourismData.monthly_scores[month];

        // Normalize crowd_score as percentage of peak (same as flight_pressure_score)
        const normalizedCrowdScore = maxCrowdScore > 0
            ? Math.round((monthData.crowd_score / maxCrowdScore) * 100)
            : monthData.crowd_score;

        return {
            crowd_score: normalizedCrowdScore,  // Now matches flight traffic logic
            price_score: monthData.price_score
        };
    }

    // Fallback to static data (already normalized to 0-100)
    const fallback = FALLBACK_SEASONALITY[month - 1] || { crowd: 50, price: 50 };
    return {
        crowd_score: fallback.crowd,
        price_score: fallback.price
    };
}

/**
 * Enhanced tourism scores calculation with real data integration
 */
export function calculateTourismScores(
    dayData: DayData,
    date: string,
    tourismData: TourismDataset | null = null
): TourismIndex {
    const { temp_max, precip_prob, wind_kmh, precip_mm } = dayData.stats;
    const [monthStr] = date.split('-');
    const month = parseInt(monthStr); // 1-indexed (1-12)

    // 1. Walkability Algorithm (unchanged - based on weather)
    let walkScore = 100;

    // Temp penalty
    if (temp_max < 10) walkScore -= (10 - temp_max) * 4; // Cold penalty
    else if (temp_max > 28) walkScore -= (temp_max - 28) * 5; // Heat penalty
    else if (temp_max > 32) walkScore -= 30; // Extreme heat

    // Rain penalty
    walkScore -= precip_prob * 0.5; // If 50% rain prob, -25 points
    if (precip_mm > 2) walkScore -= 20;

    // Wind penalty
    if (wind_kmh > 20) walkScore -= (wind_kmh - 20);

    // 2. Beer Garden / Outdoor Dining Index (unchanged - based on weather)
    let beerScore = 0;
    if (temp_max > 16) {
        beerScore = 100;
        if (temp_max < 20) beerScore -= (20 - temp_max) * 5; // A bit chilly
        if (temp_max > 30) beerScore -= 10; // Too hot

        beerScore -= precip_prob * 0.8; // Rain kills outdoor dining
        if (wind_kmh > 15) beerScore -= 15;
    }

    // 3. Reliability Index (unchanged - based on weather)
    let reliabilityScore = 100 - (precip_prob * 0.8);

    // 4. Crowds & Price - NOW FROM REAL DATA! 🎉
    const { crowd_score, price_score } = getMonthlyTourismScores(tourismData, month);

    return {
        walkability: Math.max(0, Math.min(100, Math.round(walkScore))),
        beerGarden: Math.max(0, Math.min(100, Math.round(beerScore))),
        crowds: crowd_score,  // ✨ Real data combining World Bank + OpenTripMap + our algorithms
        price: price_score,   // ✨ Real data based on crowds + seasonality
        reliability: Math.max(0, Math.min(100, Math.round(reliabilityScore))),
    };
}

/**
 * Get insights text for tourism data
 */
export function getTourismInsights(tourismData: TourismDataset | null, month: number): string {
    if (!tourismData) {
        return "Tourism data based on seasonal patterns";
    }

    const monthData = tourismData.monthly_scores[month];
    if (!monthData) {
        return "Tourism data based on seasonal patterns";
    }

    const insights: string[] = [];

    // Peak/Low season
    if (monthData.is_peak_season) {
        insights.push("⚠️ Peak tourist season");
    } else if (monthData.is_low_season) {
        insights.push("✅ Low season - fewer crowds");
    }

    // Annual stats
    if (tourismData.annual_stats.tourist_arrivals) {
        const arrivals = (tourismData.annual_stats.tourist_arrivals / 1_000_000).toFixed(1);
        insights.push(`${arrivals}M annual visitors (${tourismData.annual_stats.tourist_arrivals_year})`);
    }

    // Attractions
    if (tourismData.annual_stats.total_attractions) {
        insights.push(`${tourismData.annual_stats.total_attractions} attractions nearby`);
    }

    return insights.join(' • ');
}

/**
 * Get data attribution text
 */
export function getTourismAttribution(tourismData: TourismDataset | null): string {
    if (!tourismData || !tourismData.meta.data_sources.length) {
        return "Seasonal estimates";
    }

    return `Data: ${tourismData.meta.data_sources.join(', ')}`;
}
