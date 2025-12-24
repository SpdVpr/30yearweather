import { notFound } from 'next/navigation';

// Static list of cities for SSG - imported at build time
// This file is small (~5KB) and can be bundled safely
import citiesList from './cities-list.json';

export interface DayStats {
    temp_max: number;
    temp_min: number;
    precip_mm: number;
    precip_prob: number;
    wind_kmh: number;
    clouds_percent: number;
    pressure_hpa?: number; // Atmospheric pressure
    // NEW: Extended weather variables
    snowfall_cm?: number; // Snowfall in centimeters
    sunshine_hours?: number; // Sunshine duration in hours
    humidity_percent?: number; // Relative humidity percentage
}

export interface PressureStats {
    mean_hpa: number | null;
    volatility: "Low" | "Medium" | "High";
    std_dev: number | null;
}

export interface HealthImpact {
    migraine_risk: "Low" | "Medium" | "High";
    joint_pain_risk: "Low" | "Medium" | "High";
    fishing_conditions: "Poor" | "Fair" | "Excellent";
}

export interface AltitudeEffects {
    uv_multiplier: number;
    alcohol_warning: boolean;
    sunburn_risk: "Normal" | "Medium" | "High";
}

export interface GeoInfo {
    elevation: number | null;
    is_high_altitude: boolean;
    altitude_effects: AltitudeEffects | null;
}

export interface SeismicRisk {
    count_30y: number;
    avg_per_year: number;
    max_magnitude: number | null;
    seismic_score: number;
    risk_level: "Stable" | "Low" | "Medium" | "High" | "Very High" | "Unknown";
    last_event?: string;
    monthly_distribution?: Record<number, number>;
}

export interface HurricaneRisk {
    zone: string;
    storm_type: string;
    season_start: number;
    season_end: number;
    is_year_round: boolean;
    risk_level: "High" | "Seasonal";
}

export interface VolcanoInfo {
    name: string;
    distance_km: number;
    last_eruption: number;
    activity_level: string;
}

export interface VolcanoRisk {
    risk_level: "Medium" | "High" | "Very High";
    nearby_volcanoes: VolcanoInfo[];
    count: number;
}

export interface FloodRisk {
    risk_level: "Minimal" | "Low" | "Medium" | "High";
    risk_score: number;
    risk_factors: string[];
    elevation: number | null;
}

export interface AirQuality {
    aqi: number;
    pm25: number;
    category: "Good" | "Moderate" | "Unhealthy for Sensitive" | "Unhealthy" | "Very Unhealthy";
    health_note: string;
}

export interface SafetyProfile {
    seismic: SeismicRisk;
    hurricane: HurricaneRisk | null;
    volcano: VolcanoRisk | null;
    flood: FloodRisk | null;
    air_quality: AirQuality | null;
}

export interface DayScores {
    wedding: number;
    reliability: number;
    swim?: number;
    crowd?: number;
}

export interface WeatherCondition {
    description: string; // e.g., "Clear sky", "Overcast", "Heavy rain"
    icon: string; // Icon suggestion (e.g., "sun", "cloud", "rain")
    severity: string; // e.g., "clear", "cloudy", "rain", "snow", "storm"
}

export interface HistoricalRecord {
    year: number;
    temp_max: number;
    temp_min: number;
    precip: number;
    snowfall?: number; // NEW: Snowfall data
    weather_code?: number; // NEW: WMO weather code
}


export interface MarineInfo {
    water_temp: number; // °C
    wave_height: number; // m
    shiver_factor: "Polar Plunge" | "Refreshing Tonic" | "Swimming Pool" | "Tropical Bath" | "Hot Soup";
    family_safety: "Lake-like" | "Fun Waves" | "Surfers Only";
    jellyfish_warning: boolean;
}

export interface DayData {
    stats: DayStats;
    weather_condition?: WeatherCondition; // NEW: Weather description & icon
    scores: DayScores;
    pressure_stats?: PressureStats;
    health_impact?: HealthImpact;
    safety?: any; // Monthly safety data (seismic, hurricane, flood, air quality, volcano)
    marine?: MarineInfo; // NEW: Marine data for coastal cities
    clothing: string[];
    events?: { description: string }[];
    historical_records?: HistoricalRecord[];
}

// NEW: Flight connectivity data
export interface FlightInfo {
    source: string;
    peak_daily_arrivals?: number;
    total_daily_arrivals?: number;
    pressure_score: number;
    seasonality?: Record<number, number>;
    top_routes?: string[];
    delays?: {
        median_delay?: string;
        delay_index?: string;
        cancelled_percent?: number;
    };
    icao?: string;
}

// NEW: Health/Vaccination advisory
export interface HealthInfo {
    source: string;
    vaccines: Array<{ disease: string; recommendation: string }>;
    non_vaccine_diseases?: Array<{ disease: string; advice: string }>;
    notices?: string[];
}

// NEW: AI-generated SEO content
export interface SeoContent {
    seo_title: string;
    meta_description: string;
    ai_overview: string;
    tags: string[];
}

export interface CityData {
    meta: {
        name: string;
        country: string;
        lat: number;
        lon: number;
        desc?: string;
        geo_info?: GeoInfo; // NEW
        safety_profile?: SafetyProfile; // NEW
        is_coastal?: boolean; // NEW
        timezone?: string; // e.g. "Asia/Makassar"
        timezone_offset?: number; // Optional numerical offset if available
        // NEW: Flight, Health, and SEO data
        flight_info?: FlightInfo;
        health_info?: HealthInfo;
        seo_content?: SeoContent;
    };
    yearly_stats?: {
        avg_temp_annual: number;
        warming_trend: number;
        coldest_month: number;
        hottest_month: number;
        wettest_month: number;
        total_days_analyzed: number;
    };
    days: Record<string, DayData>; // Key "MM-DD"
}

/**
 * Get the base URL for data fetching.
 * Uses environment variables in production, localhost in development.
 */
function getBaseUrl(): string {
    // In Vercel production/preview builds
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    // Explicit base URL from environment
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }
    // Default for local development
    return 'http://localhost:3000';
}

/**
 * Fetch city data from CDN/static files.
 * This approach keeps serverless functions under Vercel's 250MB limit
 * by loading data via HTTP instead of bundling it.
 * 
 * For SSG: Data is fetched at build time and pages are pre-rendered.
 * For ISR: Data is re-fetched on revalidation.
 */
export async function getCityData(slug: string): Promise<CityData | null> {
    try {
        const baseUrl = getBaseUrl();
        const url = `${baseUrl}/data/${slug}.json`;

        const response = await fetch(url, {
            // Cache for 1 hour, revalidate in background
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.error(`City data not found: ${slug}`);
                return null;
            }
            throw new Error(`Failed to fetch city data: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error loading data for ${slug}:`, error);
        return null;
    }
}

/**
 * Get list of all available city slugs.
 * Uses pre-generated static list for SSG compatibility.
 * This avoids filesystem access which would bundle data files.
 */
export async function getAllCities(): Promise<string[]> {
    // Return static list imported at build time
    // This is a small JSON file (~5KB) that lists all city slugs
    return citiesList as string[];
}
