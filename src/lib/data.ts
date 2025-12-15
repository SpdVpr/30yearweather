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
    pressure_hpa?: number; // NEW: Atmospheric pressure
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

export interface DayScores {
    wedding: number;
    reliability: number;
    swim?: number;
    crowd?: number;
}

export interface HistoricalRecord {
    year: number;
    temp_max: number;
    temp_min: number;
    precip: number;
}

export interface DayData {
    stats: DayStats;
    scores: DayScores;
    pressure_stats?: PressureStats; // NEW
    health_impact?: HealthImpact; // NEW
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
    return ['prague-cz', 'berlin-de'];
}
