import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Historical Weather Forecast';
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

    // Base URL for images
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://30yearweather.com';

    try {
        // Fetch weather data
        const dataRes = await fetch(`${baseUrl}/data/${city}.json`, { next: { revalidate: 86400 } });

        if (!dataRes.ok) {
            throw new Error(`Failed to fetch data: ${dataRes.status}`);
        }

        const data = await dataRes.json();

        if (!data || !data.days) throw new Error('Data structure invalid');

        const dayData = data.days[`${monthNum}-${dayPad}`];
        if (!dayData) throw new Error('No data for this day');

        const tempMax = Math.round(dayData.stats.temp_max);
        const tempMin = Math.round(dayData.stats.temp_min);
        const precipProb = dayData.stats.precip_prob;
        const cityName = data.meta.name;
        const formattedDate = `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`;

        // Tourist Crowds - fallback seasonality data by month
        const CROWD_SEASONALITY = [
            40, 35, 50, 70, 85, 90, 95, 100, 85, 70, 50, 80 // Jan-Dec
        ];
        const monthIndex = parseInt(monthNum) - 1;
        const crowdScore = CROWD_SEASONALITY[monthIndex] || 50;

        // Crowd level info
        const getCrowdInfo = () => {
            if (crowdScore >= 90) return { color: '#ef4444', label: 'VERY BUSY', emoji: '🔴' };
            if (crowdScore >= 70) return { color: '#eab308', label: 'BUSY', emoji: '🟡' };
            if (crowdScore >= 40) return { color: '#84cc16', label: 'MODERATE', emoji: '🟢' };
            return { color: '#22c55e', label: 'QUIET', emoji: '🟢' };
        };

        const crowdInfo = getCrowdInfo();

        // Check if PNG hero image exists (try HEAD request)
        let heroImageUrl: string | null = null;
        try {
            const pngUrl = `${baseUrl}/images/${city}-hero.png`;
            const pngCheck = await fetch(pngUrl, { method: 'HEAD' });
            if (pngCheck.ok) {
                heroImageUrl = pngUrl;
            }
        } catch {
            // PNG doesn't exist, try webp
        }

        // If no PNG, try WebP
        if (!heroImageUrl) {
            try {
                const webpUrl = `${baseUrl}/images/${city}-hero.webp`;
                const webpCheck = await fetch(webpUrl, { method: 'HEAD' });
                if (webpCheck.ok) {
                    heroImageUrl = webpUrl;
                }
            } catch {
                // WebP doesn't exist either
            }
        }

        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                }}>
                    {/* Background Image - only if URL is available */}
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

                    {/* Dark overlay for readability */}
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

                    {/* Content */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        padding: '50px',
                        position: 'relative',
                    }}>
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{
                                    width: '52px',
                                    height: '52px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 20px rgba(234, 88, 12, 0.4)',
                                }}>
                                    <span style={{ fontSize: '24px', color: 'white', fontWeight: 'bold' }}>30</span>
                                </div>
                                <span style={{ fontSize: '26px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>30YearWeather</span>
                            </div>
                            <div style={{
                                background: 'rgba(255,255,255,0.15)',
                                padding: '10px 20px',
                                borderRadius: '24px',
                                fontSize: '16px',
                                color: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                            }}>
                                📊 30 Years of NASA Data
                            </div>
                        </div>

                        {/* Main content */}
                        <div style={{ display: 'flex', flex: 1, gap: '40px' }}>
                            {/* Left side */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                                <div style={{
                                    fontSize: '72px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    lineHeight: 1.1,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                }}>
                                    {cityName}
                                </div>
                                <div style={{
                                    fontSize: '42px',
                                    color: '#f97316',
                                    fontWeight: '600',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                    marginTop: '8px',
                                }}>
                                    {formattedDate}
                                </div>
                                <div style={{
                                    fontSize: '20px',
                                    color: 'rgba(255,255,255,0.7)',
                                    marginTop: '12px',
                                }}>
                                    Historical Weather Forecast
                                </div>
                            </div>

                            {/* Right side: Stats */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '14px',
                                minWidth: '320px',
                            }}>
                                {/* Temperature */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderRadius: '16px',
                                    padding: '18px 24px',
                                    gap: '18px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}>
                                    <span style={{ fontSize: '32px' }}>🌡️</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>TEMPERATURE</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                            <span style={{ fontSize: '38px', fontWeight: 'bold', color: '#fbbf24' }}>{tempMax}°</span>
                                            <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)' }}>/ {tempMin}°C</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rain */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderRadius: '16px',
                                    padding: '18px 24px',
                                    gap: '18px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}>
                                    <span style={{ fontSize: '32px' }}>💧</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>RAIN PROBABILITY</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <span style={{ fontSize: '38px', fontWeight: 'bold', color: '#60a5fa' }}>{precipProb}%</span>
                                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)' }}>chance</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tourist Crowds */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(0,0,0,0.4)',
                                    borderRadius: '16px',
                                    padding: '18px 24px',
                                    gap: '18px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                }}>
                                    <span style={{ fontSize: '32px' }}>👥</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>TOURIST CROWDS</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '38px', fontWeight: 'bold', color: crowdInfo.color }}>{crowdScore}%</span>
                                            <span style={{
                                                fontSize: '14px',
                                                color: crowdInfo.color,
                                                background: `${crowdInfo.color}25`,
                                                padding: '4px 12px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                display: 'flex',
                                            }}>{crowdInfo.label}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.15)',
                            paddingTop: '16px',
                            marginTop: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)' }}>
                                🌐 30yearweather.com/{city}/{monthLower}/{day}
                            </span>
                        </div>
                    </div>
                </div>
            ),
            { ...size }
        );
    } catch (e) {
        console.error('OG Image Generation Error:', e);
        // Fallback without hero image
        return new ImageResponse(
            (
                <div style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)',
                    padding: '60px',
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
                    <div style={{ fontSize: '64px', fontWeight: '900', color: 'white' }}>30YearWeather</div>
                    <div style={{ fontSize: '36px', color: '#f97316', marginTop: '20px', fontWeight: '600', display: 'flex' }}>
                        {city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ')} • {month.charAt(0).toUpperCase() + month.slice(1)} {day}
                    </div>
                    <div style={{ fontSize: '22px', color: '#78716c', marginTop: '20px' }}>
                        Weather forecast based on 30 years of NASA data
                    </div>
                </div>
            ),
            { ...size }
        );
    }
}
