import { NextResponse } from 'next/server';

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
    address: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
    };
    type: string;
    class: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        return NextResponse.json([]);
    }

    try {
        // Use OpenStreetMap Nominatim for geocoding (free, no API key needed)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=10&featuretype=city`,
            {
                headers: {
                    'User-Agent': '30YearWeather/1.0 (weather forecast application)',
                    'Accept-Language': 'en',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Nominatim API error');
        }

        const data: NominatimResult[] = await response.json();

        // Filter and transform results to only include cities/towns
        const cities = data
            .filter(item =>
                ['city', 'town', 'village', 'municipality', 'administrative'].includes(item.type) ||
                item.class === 'place' ||
                item.class === 'boundary'
            )
            .map(item => {
                // Get the best name for the city
                const cityName = item.address.city ||
                    item.address.town ||
                    item.address.village ||
                    item.address.municipality ||
                    item.display_name.split(',')[0];

                return {
                    id: item.place_id.toString(),
                    name: cityName,
                    country: item.address.country || '',
                    countryCode: item.address.country_code?.toUpperCase() || '',
                    state: item.address.state || '',
                    displayName: item.display_name,
                    lat: parseFloat(item.lat),
                    lng: parseFloat(item.lon),
                };
            })
            // Remove duplicates by name + country
            .filter((city, index, self) =>
                index === self.findIndex(c => c.name === city.name && c.country === city.country)
            );

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Geocoding error:', error);
        return NextResponse.json({ error: 'Failed to search cities' }, { status: 500 });
    }
}
