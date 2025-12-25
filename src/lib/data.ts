import { notFound } from 'next/navigation';

// Static list of cities for SSG - imported at build time
import citiesList from './cities-list.json';

// Blob URL mapping - maps city slugs to Vercel Blob URLs
import blobUrls from './blob-urls.json';

export interface DayStats {
    temp_max: number;
    temp_min: number;
    precip_mm: number;
    precip_prob: number;
    wind_kmh: number;
    clouds_percent: number;
    pressure_hpa?: number;
    snowfall_cm?: number;
    sunshine_hours?: number;
    humidity_percent?: number;
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
    description: string;
    icon: string;
    severity: string;
}

export interface HistoricalRecord {
    year: number;
    temp_max: number;
    temp_min: number;
    precip: number;
    snowfall?: number;
    weather_code?: number;
}

export interface MarineInfo {
    water_temp: number;
    wave_height: number;
    shiver_factor: "Polar Plunge" | "Refreshing Tonic" | "Swimming Pool" | "Tropical Bath" | "Hot Soup";
    family_safety: "Lake-like" | "Fun Waves" | "Surfers Only";
    jellyfish_warning: boolean;
}

export interface DayData {
    stats: DayStats;
    weather_condition?: WeatherCondition;
    scores: DayScores;
    pressure_stats?: PressureStats;
    health_impact?: HealthImpact;
    safety?: any;
    marine?: MarineInfo;
    clothing: string[];
    events?: { description: string }[];
    historical_records?: HistoricalRecord[];
}

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

export interface HealthInfo {
    source: string;
    vaccines: Array<{ disease: string; recommendation: string }>;
    non_vaccine_diseases?: Array<{ disease: string; advice: string }>;
    notices?: string[];
}

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
        geo_info?: GeoInfo;
        safety_profile?: SafetyProfile;
        is_coastal?: boolean;
        timezone?: string;
        timezone_offset?: number;
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
    days: Record<string, DayData>;
}

/**
 * Fetch city data from Vercel Blob Storage.
 * 
 * This approach:
 * 1. Keeps serverless functions under Vercel's 250MB limit
 * 2. Data is fetched at build time for SSG (pages are pre-rendered)
 * 3. Blob URLs are always accessible (no VERCEL_URL issues)
 * 4. Scales to 1000+ cities without any size limits
 */
export async function getCityData(slug: string): Promise<CityData | null> {
    try {
        // Get the Blob URL for this city
        const blobUrl = (blobUrls as Record<string, string>)[slug];

        if (!blobUrl) {
            console.error(`No blob URL found for city: ${slug}`);
            return null;
        }

        const response = await fetch(blobUrl, {
            // Cache for 1 hour, revalidate in background (ISR)
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.error(`City data not found in blob: ${slug}`);
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
 */
export async function getAllCities(): Promise<string[]> {
    return citiesList as string[];
}
