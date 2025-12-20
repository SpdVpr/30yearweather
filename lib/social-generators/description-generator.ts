// lib/social-generators/description-generator.ts

import { CityData, PinMetadata } from './types';

export function generatePinterestDescription(
    cityData: CityData,
    variant: 'general' | 'monthly' | 'wedding'
): PinMetadata {

    const tempRange = `${cityData.avgTempMin}-${cityData.avgTempMax}°C`;
    const months = cityData.bestMonths.join(' & ');

    if (variant === 'general') {
        return {
            title: `Best Time to Visit ${cityData.name} - 30 Year Weather Analysis`,
            description: `Planning a ${cityData.name} trip? Our 30-year weather analysis shows:
✨ Best months: ${months} (perfect temperatures!)
🌧️ Rain risk: Only ${cityData.rainProbability}% historically
🌡️ Ideal temps: ${tempRange} for comfortable sightseeing

Based on actual NASA satellite data, not guesses. Plan your perfect trip with confidence.

Explore day-by-day weather → 30yearweather.com/${cityData.slug}

#${cityData.slug} #besttimetovisit #travelplanning #weatherdata #traveltips #travelguide`,
            link: `https://30yearweather.com/${cityData.slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=best-time`,
            hashtags: [
                cityData.slug,
                'besttimetovisit',
                'travelplanning',
                'weatherdata',
                'traveltips',
                `${cityData.slug}travel`,
                'travelguide'
            ],
            board: 'Best Time to Visit - Travel Planning'
        };
    }

    if (variant === 'wedding') {
        return {
            title: `Perfect Wedding Weather in ${cityData.name}`,
            description: `Planning a destination wedding in ${cityData.name}?

💍 Best wedding months: ${months}
☀️ Rain probability: ${cityData.rainProbability}% (low risk!)
🌡️ Perfect temps: ${tempRange}
👰 Outdoor ceremony friendly

Based on 30 years of historical data. Plan your dream day with confidence.

→ 30yearweather.com/${cityData.slug}

#destinationwedding #weddingweather #outdoorwedding #${cityData.slug}wedding #weddingplanning #bridetobe`,
            link: `https://30yearweather.com/${cityData.slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=wedding`,
            hashtags: [
                'destinationwedding',
                'weddingweather',
                'outdoorwedding',
                `${cityData.slug}wedding`,
                'weddingplanning',
                'bridetobe'
            ],
            board: 'Destination Wedding Planning'
        };
    }

    // Monthly variant (can be extended)
    return {
        title: `${cityData.name} Weather Guide - Month by Month`,
        description: `Complete weather guide for ${cityData.name}. Best months: ${months}. Avg temps: ${tempRange}. Rain probability: ${cityData.rainProbability}%. Plan your perfect trip!`,
        link: `https://30yearweather.com/${cityData.slug}?utm_source=pinterest&utm_medium=pin&utm_campaign=monthly`,
        hashtags: ['weatherguide', cityData.slug, 'travelplanning'],
        board: 'Travel Weather Guides'
    };
}
