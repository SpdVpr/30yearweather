import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Historical Weather Analysis';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export default async function Image({ params }: { params: { city: string; month: string; day: string } }) {
    const { city, month, day } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];
    const dayPad = day.padStart(2, '0');

    try {
        // Use an absolute URL for fetching data in Edge runtime
        const baseUrl = 'https://www.30yearweather.com';

        // Fetch font and data in parallel
        const [fontRes, dataRes] = await Promise.all([
            fetch('https://raw.githubusercontent.com/google/fonts/main/ofl/inter/static/Inter-Bold.ttf'),
            fetch(`${baseUrl}/data/${city}.json`)
        ]);

        if (!fontRes.ok || !dataRes.ok) {
            throw new Error(`Failed to fetch: font=${fontRes.status}, data=${dataRes.status}`);
        }

        const [fontData, data] = await Promise.all([
            fontRes.arrayBuffer(),
            dataRes.ok ? dataRes.json() : null
        ]);

        if (!data || !data.days) throw new Error('Data structure invalid or city not found');

        const dayData = data.days[`${monthNum}-${dayPad}`];
        if (!dayData) throw new Error('No data for this specific day');

        const tempMax = Math.round(dayData.stats.temp_max);
        const tempMin = Math.round(dayData.stats.temp_min);
        const precipProb = dayData.stats.precip_prob;
        const cityName = data.meta.name;
        const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`;

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    color: 'white',
                    fontFamily: 'Inter',
                    padding: '60px',
                    textAlign: 'center',
                }}>
                    <div style={{ fontSize: 32, color: '#10b981', marginBottom: 20, fontWeight: 700 }}>HISTORICAL WEATHER</div>
                    <div style={{ fontSize: 72, fontWeight: 900, marginBottom: 50 }}>{cityName} • {formattedDate}</div>
                    <div style={{ display: 'flex', gap: 100 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 10 }}>HIGH</div>
                            <div style={{ fontSize: 90, fontWeight: 900 }}>{tempMax}°</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 10 }}>LOW</div>
                            <div style={{ fontSize: 90, fontWeight: 900, color: '#3b82f6' }}>{tempMin}°</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontSize: 24, opacity: 0.6, marginBottom: 10 }}>RAIN</div>
                            <div style={{ fontSize: 90, fontWeight: 900, color: '#06b6d4' }}>{precipProb}%</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 60, fontSize: 24, opacity: 0.4 }}>30yearweather.com</div>
                </div>
            ),
            {
                ...size,
                fonts: [{
                    name: 'Inter',
                    data: fontData,
                    style: 'normal',
                    weight: 700,
                }]
            }
        );
    } catch (e) {
        console.error('OG Image Generation Error:', e);
        // Minimal fallback that doesn't need external resources
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    background: '#0f172a',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ fontSize: 80, fontWeight: 900 }}>30YearWeather</div>
                    <div style={{ fontSize: 40, marginTop: 20, opacity: 0.7 }}>{city.toUpperCase()} • {month.toUpperCase()} {day}</div>
                    <div style={{ fontSize: 20, marginTop: 40, opacity: 0.3 }}>Weather for any day, based on 30 years of data</div>
                </div>
            ),
            { ...size }
        );
    }
}
