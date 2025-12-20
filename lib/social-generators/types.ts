// lib/social-generators/types.ts

export interface CityData {
    name: string;
    slug: string;
    bestMonths: string[];
    avgTempMin: number;
    avgTempMax: number;
    rainProbability: number;
    crowds: 'Low' | 'Moderate' | 'High' | 'Very High';
    heroImagePath: string;
}

export interface PinMetadata {
    title: string;
    description: string;
    link: string;
    hashtags: string[];
    board: string;
}

export type TemplateVariant = 'A' | 'B' | 'C';
