import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'City Weather Overview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { city: string } }) {
    const { city } = params;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';
        const dataRes = await fetch(`${baseUrl}/data/${city}.json`, { next: { revalidate: 86400 } });

        if (!dataRes.ok) {
            throw new Error(`Failed to fetch: ${dataRes.status}`);
        }

        const data = await dataRes.json();
        if (!data || !data.days) throw new Error('Invalid data');

        const cityName = data.meta.name;
        const country = data.meta.country || '';

        // Calculate monthly stats
        const monthlyStats = Array.from({ length: 12 }, (_, i) => {
            const monthKey = (i + 1).toString().padStart(2, '0');
            let tempSum = 0, rainSum = 0, count = 0;

            Object.entries(data.days).forEach(([dateKey, dayData]: [string, any]) => {
                if (dateKey.startsWith(monthKey + '-')) {
                    tempSum += dayData.stats.temp_max;
                    rainSum += dayData.stats.precip_prob;
                    count++;
                }
            });

            return {
                temp: count ? Math.round(tempSum / count) : 0,
                rain: count ? Math.round(rainSum / count) : 0,
            };
        });

        // Find best and worst months
        const tempSorted = [...monthlyStats].map((s, i) => ({ ...s, idx: i })).sort((a, b) => b.temp - a.temp);
        const hottestMonth = tempSorted[0];
        const coldestMonth = tempSorted[11];

        const rainSorted = [...monthlyStats].map((s, i) => ({ ...s, idx: i })).sort((a, b) => a.rain - b.rain);
        const driestMonth = rainSorted[0];

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Find best months (pleasant temp, low rain)
        const bestMonths = monthlyStats
            .map((s, i) => ({ ...s, idx: i }))
            .filter(m => m.temp >= 18 && m.temp <= 28 && m.rain < 30)
            .slice(0, 3)
            .map(m => monthNames[m.idx]);

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                    padding: '50px',
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
                            <span style={{ fontSize: '26px', color: '#a8a29e', fontWeight: '600' }}>30YearWeather</span>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '10px 20px',
                            borderRadius: '24px',
                            fontSize: '16px',
                            color: '#d6d3d1',
                        }}>
                            📊 30 years of climate data
                        </div>
                    </div>

                    {/* Main content */}
                    <div style={{ display: 'flex', flex: 1, gap: '40px' }}>
                        {/* Left side: City info */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                            <span style={{ fontSize: '72px', marginBottom: '0' }}>🌍</span>
                            <h1 style={{
                                fontSize: '72px',
                                fontWeight: 'bold',
                                color: 'white',
                                margin: '10px 0 0 0',
                                lineHeight: 1.1,
                            }}>
                                {cityName}
                            </h1>
                            <div style={{
                                fontSize: '28px',
                                color: '#a8a29e',
                                marginTop: '8px',
                            }}>
                                {country}
                            </div>
                            <div style={{
                                fontSize: '22px',
                                color: '#78716c',
                                marginTop: '20px',
                            }}>
                                365-Day Weather Forecast
                            </div>

                            {/* Best months badge */}
                            {bestMonths.length > 0 && (
                                <div style={{
                                    marginTop: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <span style={{ fontSize: '16px', color: '#22c55e' }}>✨ Best time to visit:</span>
                                    <span style={{
                                        fontSize: '18px',
                                        color: '#22c55e',
                                        background: 'rgba(34, 197, 94, 0.15)',
                                        padding: '6px 16px',
                                        borderRadius: '20px',
                                        fontWeight: '600',
                                    }}>
                                        {bestMonths.join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Right side: Climate overview */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '16px',
                            minWidth: '360px',
                        }}>
                            {/* Hottest month */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '20px 28px',
                                gap: '20px',
                            }}>
                                <span style={{ fontSize: '36px' }}>🔥</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', color: '#a8a29e', marginBottom: '4px' }}>HOTTEST MONTH</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316' }}>{monthNames[hottestMonth.idx]}</span>
                                        <span style={{ fontSize: '24px', color: '#fbbf24' }}>{hottestMonth.temp}°C</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coldest month */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '20px 28px',
                                gap: '20px',
                            }}>
                                <span style={{ fontSize: '36px' }}>❄️</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', color: '#a8a29e', marginBottom: '4px' }}>COLDEST MONTH</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#60a5fa' }}>{monthNames[coldestMonth.idx]}</span>
                                        <span style={{ fontSize: '24px', color: '#93c5fd' }}>{coldestMonth.temp}°C</span>
                                    </div>
                                </div>
                            </div>

                            {/* Driest month */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px',
                                padding: '20px 28px',
                                gap: '20px',
                            }}>
                                <span style={{ fontSize: '36px' }}>☀️</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', color: '#a8a29e', marginBottom: '4px' }}>DRIEST MONTH</span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#22c55e' }}>{monthNames[driestMonth.idx]}</span>
                                        <span style={{ fontSize: '24px', color: '#86efac' }}>{driestMonth.rain}% rain</span>
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
                        <span style={{ fontSize: '18px', color: '#78716c' }}>
                            🌐 30yearweather.com/{city}
                        </span>
                    </div>
                </div>
            ),
            { ...size }
        );
    } catch (e) {
        console.error('OG Image Error:', e);
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
                    <div style={{ fontSize: '36px', color: '#f97316', marginTop: '20px' }}>
                        {city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ')}
                    </div>
                    <div style={{ fontSize: '22px', marginTop: '20px', color: '#78716c' }}>
                        365-Day Weather Forecast
                    </div>
                </div>
            ),
            { ...size }
        );
    }
}
