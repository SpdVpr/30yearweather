import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

// Fetch city data from public JSON (edge runtime compatible)
async function getCityDataFromPublic(city: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';
        const response = await fetch(`${baseUrl}/data/${city}.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (e) {
        console.error('Error loading city data:', e);
        return null;
    }
}

export default async function Image({ params }: { params: { city: string; month: string; day: string } }) {
    const { city, month, day } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];
    const dayPad = day.toString().padStart(2, '0');

    // Load font
    const fontData = await fetch(
        'https://raw.githubusercontent.com/vercel/satori/main/playground/public/inter-latin-ext-700-normal.woff'
    ).then((res) => res.arrayBuffer()).catch(() => null);

    // Default error response style
    const errorStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        color: '#64748b',
        fontSize: 48,
        fontWeight: 'bold',
    };

    if (!monthNum) {
        return new ImageResponse(
            <div style={errorStyle}>Date not found</div>, { ...size }
        );
    }

    const data = await getCityDataFromPublic(city);
    if (!data) {
        return new ImageResponse(
            <div style={errorStyle}>City not found</div>, { ...size }
        );
    }

    const dateKey = `${monthNum}-${dayPad}`;
    const dayData = data.days[dateKey];

    if (!dayData) {
        return new ImageResponse(
            <div style={errorStyle}>Data not found</div>, { ...size }
        );
    }

    // Stats
    const tempMax = Math.round(dayData.stats.temp_max);
    const tempMin = Math.round(dayData.stats.temp_min);
    const precipProb = dayData.stats.precip_prob;
    const cityName = data.meta.name;
    const formattedDate = `${monthLower.charAt(0).toUpperCase() + monthLower.slice(1)} ${day}`;

    // Use gradient background instead of hero image (edge runtime doesn't support fs)
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                    position: 'relative',
                    fontFamily: '"Inter"',
                }}
            >
                {/* Gradient Overlay for depth */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.1), transparent 50%)',
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    color: 'white',
                    textAlign: 'center',
                    padding: '60px',
                }}>
                    <div style={{
                        fontSize: 28,
                        textTransform: 'uppercase',
                        letterSpacing: '6px',
                        marginBottom: 30,
                        color: '#6EE7B7',
                        fontWeight: 600
                    }}>
                        Historical Weather Analysis
                    </div>
                    <div style={{
                        fontSize: 68,
                        fontWeight: 900,
                        maxWidth: '1000px',
                        lineHeight: 1.1,
                        marginBottom: 40
                    }}>
                        Is {formattedDate} a Good Time to Visit {cityName}?
                    </div>

                    <div style={{ display: 'flex', gap: '100px', marginTop: 50 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 90, fontWeight: 800, color: '#10b981' }}>{tempMax}°</span>
                            <span style={{ fontSize: 30, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '3px' }}>High</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 90, fontWeight: 800, color: '#3b82f6' }}>{tempMin}°</span>
                            <span style={{ fontSize: 30, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '3px' }}>Low</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 90, fontWeight: 800, color: '#06b6d4' }}>{precipProb}%</span>
                            <span style={{ fontSize: 30, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '3px' }}>Rain</span>
                        </div>
                    </div>

                    <div style={{
                        marginTop: 60,
                        fontSize: 22,
                        opacity: 0.7,
                        letterSpacing: '2px'
                    }}>
                        30YearWeather.com • Based on 30 years of data
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: fontData ? [
                { name: 'Inter', data: fontData, style: 'normal' as const, weight: 400 as const },
                { name: 'Inter', data: fontData, style: 'normal' as const, weight: 600 as const },
                { name: 'Inter', data: fontData, style: 'normal' as const, weight: 800 as const },
                { name: 'Inter', data: fontData, style: 'normal' as const, weight: 900 as const },
            ] : [],
            emoji: 'twemoji',
        }
    );
}
