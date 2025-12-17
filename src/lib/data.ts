import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

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

export async function getCityData(slug: string): Promise<CityData | null> {
    // For build-time SSG, use local JSON files
    // In production, you could switch to Firestore by uncommenting below

    // Option 1: Local JSON (current approach for MVP)
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', `${slug}.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            return null;
        }
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (e) {
        console.error(`Error loading data for ${slug}:`, e);
        return null;
    }

    /* Option 2: Firestore (for future scaling)
    try {
        const admin = require('firebase-admin');
        if (!admin.apps.length) {
            // Initialize admin SDK with service account
        }
        const db = admin.firestore();
        const docRef = db.collection('locations').doc(slug);
        const doc = await docRef.get();
        
        if (!doc.exists) {
            return null;
        }
        return doc.data() as CityData;
    } catch (e) {
        console.error(`Error fetching from Firestore for ${slug}:`, e);
        return null;
    }
    */
}

export async function getAllCities(): Promise<string[]> {
    // Return list of available city slugs
    return [
        // Europe (27 cities)
        'prague-cz', 'berlin-de', 'london-uk', 'paris-fr', 'rome-it',
        'barcelona-es', 'vienna-at', 'zurich-ch', 'athens-gr',
        'amsterdam-nl', 'madrid-es', 'brussels-be',
        'warsaw-pl', 'budapest-hu', 'lisbon-pt',
        'dublin-ie', 'stockholm-se', 'copenhagen-dk',
        'oslo-no', 'helsinki-fi', 'bratislava-sk', 'istanbul-tr',
        'edinburgh-uk', 'munich-de', 'venice-it', 'krakow-pl', 'porto-pt',

        // Asia (20 cities)
        'tokyo-jp', 'seoul-kr', 'beijing-cn', 'shanghai-cn', 'hong-kong-hk', 'taipei-tw',
        'bangkok-th', 'singapore-sg', 'kuala-lumpur-my', 'hanoi-vn', 'ho-chi-minh-vn',
        'jakarta-id', 'bali-id', 'manila-ph', 'mumbai-in', 'new-delhi-in',
        'dubai-ae', 'kyoto-jp', 'osaka-jp', 'phuket-th', 'chiang-mai-th',

        // North America (7 cities)
        'new-york-us', 'los-angeles-us', 'san-francisco-us', 'miami-us',
        'vancouver-ca', 'toronto-ca', 'mexico-city-mx',

        // South America (4 cities)
        'rio-de-janeiro-br', 'buenos-aires-ar', 'lima-pe', 'santiago-cl',

        // Oceania (3 cities)
        'sydney-au', 'melbourne-au', 'auckland-nz',

        // Africa (2 cities)
        'cape-town-za', 'marrakech-ma'
    ];
}
