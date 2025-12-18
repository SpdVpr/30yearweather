import { NextResponse } from 'next/server';
import { getCityData } from '@/lib/data';

export async function GET(
    request: Request,
    { params }: { params: { city: string; date: string } }
) {
    const { city, date } = params;

    const data = await getCityData(city);
    if (!data) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const dayData = data.days[date];
    if (!dayData) {
        return NextResponse.json({ error: 'Date not found in MM-DD format' }, { status: 404 });
    }

    return NextResponse.json({
        city: data.meta.name,
        date: date,
        weather: dayData.stats,
        scores: dayData.scores,
        condition: dayData.weather_condition,
        clothing: dayData.clothing,
        datasource: "NASA POWER 1991-2021"
    });
}
