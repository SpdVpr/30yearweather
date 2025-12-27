import { NextResponse } from 'next/server';
import { getAllCities, getCityData } from '@/lib/data';

export async function GET() {
    try {
        const citySlugs = await getAllCities();

        // Fetch basic info for each city
        const cities = await Promise.all(
            citySlugs.map(async (slug) => {
                const data = await getCityData(slug);
                return {
                    slug,
                    name: data?.meta.name || slug,
                    country: data?.meta.country || "",
                };
            })
        );

        // Sort alphabetically by name
        cities.sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(cities);
    } catch (error) {
        console.error('Failed to fetch cities:', error);
        return NextResponse.json({ error: 'Failed to fetch cities' }, { status: 500 });
    }
}
