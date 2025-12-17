import { ImageResponse } from 'next/og';
import { getCityData } from '@/lib/data';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';

export const runtime = 'nodejs';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export default async function Image({ params }: { params: { city: string; month: string; day: string } }) {
    const { city, month, day } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];
    const dayPad = day.toString().padStart(2, '0');

    // Load fonts
    // 1. Main Text Font (Inter)
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

    const data = await getCityData(city);
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

    // Load image
    const imagePath = join(process.cwd(), 'public', 'images', `${city}-hero.webp`);
    let imageData = '';

    // Fallback to png if webp missing, or just check existence
    if (existsSync(imagePath)) {
        const file = readFileSync(imagePath);
        imageData = `data:image/webp;base64,${file.toString('base64')}`;
    } else {
        const pngPath = join(process.cwd(), 'public', 'images', `${city}-hero.png`);
        if (existsSync(pngPath)) {
            const file = readFileSync(pngPath);
            imageData = `data:image/png;base64,${file.toString('base64')}`;
        }
    }

    // Stats
    const tempMax = Math.round(dayData.stats.temp_max);
    const tempMin = Math.round(dayData.stats.temp_min);
    const precipProb = dayData.stats.precip_prob;
    const cityName = data.meta.name;
    const formattedDate = `${monthLower.charAt(0).toUpperCase() + monthLower.slice(1)} ${day}`;

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
                    backgroundColor: '#111',
                    position: 'relative',
                    fontFamily: '"Inter"',
                }}
            >
                {/* Background Image */}
                {imageData ? (
                    <img
                        src={imageData}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.5,
                        }}
                    />
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        background: 'linear-gradient(to bottom right, #1e293b, #0f172a)'
                    }} />
                )}

                {/* Dark Gradient Overlay for text readability */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
                }} />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    color: 'white',
                    textAlign: 'center',
                    textShadow: '0 2px 10px rgba(0,0,0,0.6)',
                }}>
                    <div style={{
                        fontSize: 24,
                        textTransform: 'uppercase',
                        letterSpacing: '4px',
                        marginBottom: 20,
                        color: '#6EE7B7',
                        fontWeight: 600
                    }}>
                        Historical Weather Analysis
                    </div>
                    <div style={{
                        fontSize: 64,
                        fontWeight: 900,
                        maxWidth: '900px',
                        lineHeight: 1.1,
                        marginBottom: 30
                    }}>
                        Is {formattedDate} a Good Time to Visit {cityName}?
                    </div>

                    <div style={{ display: 'flex', gap: '80px', marginTop: 40 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 80, fontWeight: 800 }}>{tempMax}°</span>
                            <span style={{ fontSize: 28, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px' }}>High</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 80, fontWeight: 800 }}>{tempMin}°</span>
                            <span style={{ fontSize: 28, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px' }}>Low</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 80, fontWeight: 800 }}>{precipProb}%</span>
                            <span style={{ fontSize: 28, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '2px' }}>Rain</span>
                        </div>
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
