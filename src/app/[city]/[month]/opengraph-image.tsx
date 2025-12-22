import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Monthly Weather Overview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const MONTH_MAP: Record<string, string> = {
    january: '01', february: '02', march: '03', april: '04', may: '05', june: '06',
    july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
};

export default async function Image({ params }: { params: { city: string; month: string } }) {
    const { city, month } = params;
    const monthLower = month.toLowerCase();
    const monthNum = MONTH_MAP[monthLower];
    const monthDisplay = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);
    const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

        // 1. Fetch Weather Data
        const dataRes = await fetch(`${baseUrl}/data/${city}.json`, { next: { revalidate: 86400 } });

        if (!dataRes.ok) {
            throw new Error(`Failed to fetch data: ${dataRes.status}`);
        }

        const data = await dataRes.json();
        if (!data || !data.days) throw new Error('Invalid data');

        // 2. Calculate Monthly Stats
        let tempSum = 0;
        let rainSum = 0;
        let dayCount = 0;
        let bestDay = { day: 1, score: 0 };

        // Iterate through days to filter for this month
        Object.entries(data.days).forEach(([dateKey, dayData]: [string, any]) => {
            // dateKey format: "MM-DD"
            if (dateKey.startsWith(monthNum + '-')) {
                tempSum += dayData.stats.temp_max;
                rainSum += dayData.stats.precip_prob;
                dayCount++;

                // Calculate a simple score for "Best Day"
                // Higher temp (up to limit) and lower rain is better
                const temp = dayData.stats.temp_max;
                const rain = dayData.stats.precip_prob;

                // Simple scoring: start with 100
                // Penalize rain: -1 per %
                // Penalize temp distance from ideal (24C): -2 per degree diff
                let score = 100 - rain - (Math.abs(temp - 24) * 2);
                if (score < 0) score = 0;
                if (score > 100) score = 100;

                if (score > bestDay.score) {
                    bestDay = {
                        day: parseInt(dateKey.split('-')[1]),
                        score: Math.round(score)
                    };
                }
            }
        });

        const avgTemp = dayCount ? Math.round(tempSum / dayCount) : 0;
        const avgRain = dayCount ? Math.round(rainSum / dayCount) : 0;

        // 3. Determine Status
        const getStatus = () => {
            if (avgTemp >= 20 && avgTemp <= 28 && avgRain < 25) return { label: 'Perfect', color: '#22c55e', emoji: '✨' };
            if (avgTemp >= 15 && avgTemp <= 30 && avgRain < 35) return { label: 'Pleasant', color: '#84cc16', emoji: '😊' };
            if (avgTemp < 10) return { label: 'Cold', color: '#60a5fa', emoji: '❄️' };
            if (avgRain > 40) return { label: 'Rainy', color: '#64748b', emoji: '🌧️' };
            if (avgTemp > 32) return { label: 'Hot', color: '#f97316', emoji: '🔥' };
            return { label: 'Moderate', color: '#a8a29e', emoji: '⛅' };
        };
        const status = getStatus();

        // 4. Fetch Background Image (Check PNG then WebP)
        let heroImageUrl: string | null = null;
        try {
            const pngUrl = `${baseUrl}/images/${city}-hero.png`;
            const pngCheck = await fetch(pngUrl, { method: 'HEAD' });
            if (pngCheck.ok) {
                heroImageUrl = pngUrl;
            }
        } catch { }

        if (!heroImageUrl) {
            try {
                const webpUrl = `${baseUrl}/images/${city}-hero.webp`;
                const webpCheck = await fetch(webpUrl, { method: 'HEAD' });
                if (webpCheck.ok) {
                    heroImageUrl = webpUrl;
                }
            } catch { }
        }

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                    position: 'relative',
                }}>
                    {/* Background Image */}
                    {heroImageUrl && (
                        <img
                            src={heroImageUrl}
                            alt=""
                            width={1200}
                            height={630}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    )}

                    {/* Dark Overlay */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        background: heroImageUrl
                            ? 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.85) 100%)'
                            : 'transparent',
                    }} />

                    {/* Content Wrapper */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        padding: '50px',
                        position: 'relative',
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: '24px', color: 'white', fontWeight: 'bold' }}>30</span>
                                </div>
                                <span style={{ fontSize: '26px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>30YearWeather</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: `${status.color}30`,
                                border: `1px solid ${status.color}60`,
                                padding: '10px 24px',
                                borderRadius: '24px',
                                fontSize: '18px',
                                color: status.color,
                                fontWeight: '600',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            }}>
                                <span>{status.emoji}</span>
                                <span>{status.label} Month</span>
                            </div>
                        </div>

                        {/* Main content */}
                        <div style={{ display: 'flex', flex: 1, gap: '40px' }}>
                            {/* Left side */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                                <span style={{ fontSize: '72px', marginBottom: '0' }}>📅</span>
                                <h1 style={{
                                    fontSize: '64px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    margin: '10px 0 0 0',
                                    lineHeight: 1.1,
                                    textShadow: heroImageUrl ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
                                }}>
                                    {cityDisplay}
                                </h1>
                                <div style={{
                                    fontSize: '42px',
                                    color: '#f97316',
                                    fontWeight: '600',
                                    marginTop: '12px',
                                    textShadow: heroImageUrl ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
                                }}>
                                    {monthDisplay}
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    color: 'rgba(255,255,255,0.7)',
                                    marginTop: '10px',
                                }}>
                                    Monthly Weather Overview
                                </div>
                            </div>

                            {/* Right side: Stats */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '16px',
                                minWidth: '340px',
                            }}>
                                {/* Average Temperature */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: heroImageUrl ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '16px',
                                    padding: '20px 28px',
                                    gap: '20px',
                                    border: heroImageUrl ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                }}>
                                    <span style={{ fontSize: '36px' }}>🌡️</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>AVG TEMPERATURE</span>
                                        <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#fbbf24' }}>{avgTemp}°C</span>
                                    </div>
                                </div>

                                {/* Rain Probability */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: heroImageUrl ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.05)',
                                    borderRadius: '16px',
                                    padding: '20px 28px',
                                    gap: '20px',
                                    border: heroImageUrl ? '1px solid rgba(255,255,255,0.2)' : 'none',
                                }}>
                                    <span style={{ fontSize: '36px' }}>💧</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>AVG RAIN CHANCE</span>
                                        <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#60a5fa' }}>{avgRain}%</span>
                                    </div>
                                </div>

                                {/* Best Day */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: heroImageUrl ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                                    borderRadius: '16px',
                                    padding: '20px 28px',
                                    gap: '20px',
                                    border: heroImageUrl ? '1px solid rgba(34, 197, 94, 0.3)' : 'none',
                                }}>
                                    <span style={{ fontSize: '36px' }}>⭐</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>BEST DAY</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80' }}>{monthDisplay} {bestDay.day}</span>
                                            {/* <span style={{ fontSize: '14px', color: '#86efac' }}>Score {bestDay.score}</span> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: '20px',
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)' }}>
                                🌐 30yearweather.com/{city}/{monthLower}
                            </span>
                        </div>
                    </div>
                </div>
            ),
            { ...size }
        );
    } catch (e) {
        console.error('OG Image Generation Error:', e);
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    background: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '30px',
                    }}>
                        <span style={{ fontSize: '36px', color: 'white', fontWeight: 'bold' }}>30</span>
                    </div>
                    <div style={{ fontSize: '64px', fontWeight: '900' }}>30YearWeather</div>
                    <div style={{ fontSize: '36px', color: '#f97316', marginTop: '20px', display: 'flex' }}>
                        {cityDisplay} • {monthDisplay}
                    </div>
                    <div style={{ fontSize: '22px', marginTop: '20px', color: '#78716c' }}>
                        Monthly Forecast
                    </div>
                </div>
            ),
            { ...size }
        );
    }
}
