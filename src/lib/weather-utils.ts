/**
 * Weather utility functions for calculating feels-like temperature,
 * wind descriptions, and other weather-related helpers.
 */

/**
 * Calculate "Feels Like" temperature using Wind Chill (cold) or Heat Index (hot)
 *
 * Wind Chill: Used when temp <= 15°C and wind > 4.8 km/h
 * Heat Index: Used when temp >= 20°C and humidity >= 40%
 * For middle range: combines wind and humidity effects
 *
 * @param tempC - Temperature in Celsius
 * @param windKmh - Wind speed in km/h
 * @param humidity - Relative humidity percentage (0-100)
 * @returns Feels-like temperature in Celsius
 */
export function calculateFeelsLike(tempC: number, windKmh: number, humidity: number = 50): number {
    // Wind Chill (for cold/cool weather up to 15°C)
    // Extended formula based on Environment Canada / US NWS Wind Chill
    if (tempC <= 15 && windKmh > 4.8) {
        // Standard wind chill for temp <= 10°C
        if (tempC <= 10) {
            const windChill = 13.12 + 0.6215 * tempC - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * tempC * Math.pow(windKmh, 0.16);
            return Math.round(windChill * 10) / 10;
        }
        // Gradual wind effect for 10-15°C range
        // Reduce effect as temp approaches 15°C
        const windEffect = (windKmh / 10) * ((15 - tempC) / 5);
        return Math.round((tempC - windEffect) * 10) / 10;
    }

    // Heat Index (for warm/hot weather from 20°C)
    // Simplified Rothfusz regression (NOAA)
    if (tempC >= 20 && humidity >= 40) {
        // Full heat index for >= 27°C
        if (tempC >= 27) {
            const tempF = tempC * 9 / 5 + 32;
            const heatIndexF = -42.379 + 2.04901523 * tempF + 10.14333127 * humidity
                - 0.22475541 * tempF * humidity - 6.83783e-3 * tempF * tempF
                - 5.481717e-2 * humidity * humidity + 1.22874e-3 * tempF * tempF * humidity
                + 8.5282e-4 * tempF * humidity * humidity - 1.99e-6 * tempF * tempF * humidity * humidity;
            const heatIndexC = (heatIndexF - 32) * 5 / 9;
            return Math.round(heatIndexC * 10) / 10;
        }
        // Gradual humidity effect for 20-27°C range
        const humidityEffect = ((humidity - 40) / 60) * ((tempC - 20) / 7) * 2;
        return Math.round((tempC + humidityEffect) * 10) / 10;
    }

    // No significant wind chill or heat index effect (15-20°C comfort zone)
    return Math.round(tempC * 10) / 10;
}

/**
 * Get a human-readable description of the feels-like effect
 */
export function getFeelsLikeDescription(actualTemp: number, feelsLike: number): string {
    const diff = feelsLike - actualTemp;

    if (Math.abs(diff) < 1) {
        return "Feels accurate";
    }

    if (diff < -5) {
        return "Wind chill effect";
    } else if (diff < -2) {
        return "Slightly colder";
    } else if (diff > 5) {
        return "Heat index effect";
    } else if (diff > 2) {
        return "Feels warmer";
    }

    return "Minor difference";
}

/**
 * Get color class based on temperature (text color)
 */
export function getTempColorClass(temp: number): string {
    if (temp < 0) return "text-blue-600";
    if (temp < 10) return "text-cyan-600";
    if (temp < 20) return "text-emerald-600";
    if (temp < 28) return "text-amber-600";
    return "text-red-600";
}

/**
 * Get background gradient class based on temperature
 */
export function getTempBgClass(temp: number): string {
    if (temp < 0) return "from-blue-100 to-blue-50 border-blue-200";
    if (temp < 10) return "from-cyan-100 to-cyan-50 border-cyan-200";
    if (temp < 20) return "from-emerald-100 to-emerald-50 border-emerald-200";
    if (temp < 28) return "from-amber-100 to-amber-50 border-amber-200";
    return "from-red-100 to-red-50 border-red-200";
}

/**
 * Get temperature label based on range
 */
export function getTempLabel(temp: number): string {
    if (temp < 0) return "Freezing";
    if (temp < 10) return "Cold";
    if (temp < 15) return "Cool";
    if (temp < 20) return "Mild";
    if (temp < 25) return "Warm";
    if (temp < 30) return "Hot";
    return "Very Hot";
}

/**
 * Get emoji based on temperature range
 */
export function getTempEmoji(temp: number): string {
    if (temp < 0) return "🥶";
    if (temp < 10) return "❄️";
    if (temp < 20) return "🌤️";
    if (temp < 28) return "☀️";
    return "🔥";
}

/**
 * Calculate wedding/outdoor event score based on weather conditions
 * This is a utility function for Better Alternatives feature
 */
export function calculateSimpleScore(
    tempMax: number,
    precipProb: number,
    windKmh: number
): number {
    let score = 100;

    // Temperature penalty
    if (tempMax < 15) score -= (15 - tempMax) * 3;
    if (tempMax > 30) score -= (tempMax - 30) * 3;

    // Rain penalty
    score -= precipProb * 0.5;

    // Wind penalty
    if (windKmh > 20) score -= (windKmh - 20) * 1.5;

    return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get reliability description and styling based on score
 * Considers multiple factors for a sophisticated assessment
 */
export interface ReliabilityInfo {
    score: number;
    label: string;
    description: string;
    emoji: string;
    colorClass: string;
    bgClass: string;
}

export function getReliabilityInfo(
    reliabilityScore: number,
    pressureVolatility?: string,
    pressureStdDev?: number
): ReliabilityInfo {
    // Adjust score based on pressure volatility
    let adjustedScore = reliabilityScore;

    if (pressureVolatility === "High" && pressureStdDev) {
        // High pressure volatility = less predictable weather
        const volatilityPenalty = Math.min(10, (pressureStdDev - 8) * 1.5);
        adjustedScore = Math.max(0, reliabilityScore - volatilityPenalty);
    } else if (pressureVolatility === "Low") {
        // Low volatility = bonus for stability
        adjustedScore = Math.min(100, reliabilityScore + 5);
    }

    // Determine category based on adjusted score
    if (adjustedScore >= 75) {
        return {
            score: Math.round(adjustedScore),
            label: "Very Reliable",
            description: "Weather patterns are highly consistent",
            emoji: "🎯",
            colorClass: "text-emerald-600",
            bgClass: "bg-emerald-50 border-emerald-200"
        };
    } else if (adjustedScore >= 60) {
        return {
            score: Math.round(adjustedScore),
            label: "Reliable",
            description: "Typical conditions expected",
            emoji: "✓",
            colorClass: "text-green-600",
            bgClass: "bg-green-50 border-green-200"
        };
    } else if (adjustedScore >= 45) {
        return {
            score: Math.round(adjustedScore),
            label: "Moderate",
            description: "Some year-to-year variation",
            emoji: "~",
            colorClass: "text-amber-600",
            bgClass: "bg-amber-50 border-amber-200"
        };
    } else {
        return {
            score: Math.round(adjustedScore),
            label: "Variable",
            description: "Expect unpredictable conditions",
            emoji: "?",
            colorClass: "text-orange-600",
            bgClass: "bg-orange-50 border-orange-200"
        };
    }
}

