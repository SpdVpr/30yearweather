import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Travel Research & Data Studies | 30YearWeather';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, #1c1917 0%, #292524 50%, #44403c 100%)',
                position: 'relative',
                fontFamily: 'system-ui, sans-serif',
            }}>
                {/* Background pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(249,115,22,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.1) 0%, transparent 50%)',
                }} />

                {/* Content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: 60,
                    position: 'relative',
                    zIndex: 10,
                }}>
                    {/* Logo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        marginBottom: 32,
                    }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>30</span>
                        </div>
                        <span style={{ fontSize: 28, color: '#a8a29e', fontWeight: 600 }}>30YearWeather</span>
                    </div>

                    {/* Main Title */}
                    <h1 style={{
                        fontSize: 64,
                        fontWeight: 900,
                        color: 'white',
                        textAlign: 'center',
                        margin: 0,
                        lineHeight: 1.1,
                    }}>
                        Travel Research
                    </h1>
                    <div style={{
                        fontSize: 64,
                        fontWeight: 900,
                        background: 'linear-gradient(90deg, #f97316, #fbbf24)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}>
                        & Data Studies
                    </div>

                    {/* Description */}
                    <p style={{
                        fontSize: 24,
                        color: '#a8a29e',
                        textAlign: 'center',
                        marginTop: 24,
                        marginBottom: 40,
                        maxWidth: 800,
                    }}>
                        Original research based on 30 years of historical weather data across 270+ destinations worldwide
                    </p>

                    {/* Feature badges */}
                    <div style={{
                        display: 'flex',
                        gap: 24,
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 9999,
                            padding: '12px 24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <span style={{ fontSize: 20 }}>📊</span>
                            <span style={{ color: '#d6d3d1', fontSize: 18 }}>Data-Driven Insights</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 9999,
                            padding: '12px 24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <span style={{ fontSize: 20 }}>🌍</span>
                            <span style={{ color: '#d6d3d1', fontSize: 18 }}>270+ Destinations</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 9999,
                            padding: '12px 24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                            <span style={{ fontSize: 20 }}>📅</span>
                            <span style={{ color: '#d6d3d1', fontSize: 18 }}>30 Years of Data</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 16, color: '#78716c' }}>
                        30YearWeather.com/research
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
